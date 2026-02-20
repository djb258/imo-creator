# CTB Registry Enforcement

**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: LOCKED
**Version**: 1.5.0
**Scope**: All child repositories

---

## Purpose

All tables MUST be registered before they can exist. This document defines registry-first enforcement at three layers: build-time, database, and application. The default posture is **deny** — unregistered tables are blocked at every layer.

---

## 1. Registry-First Principle

```
Register FIRST → Create table → Write data

NEVER:
Create table → hope to register later
```

The `column_registry.yml` file (derived from `templates/child/column_registry.yml.template`) is the canonical schema spine. The `ctb.table_registry` database table is its runtime mirror. Both must agree.

---

## 2. Cardinality Rules (ADR-001)

Each sub-hub MUST have exactly:

| Type | Count | Leaf Types | Requirement |
|------|-------|------------|-------------|
| **CANONICAL** | Exactly 1 | `CANONICAL` | Mandatory — primary data table |
| **ERROR** | Exactly 1 | `ERROR` | Mandatory — error/rejection tracking |
| **SUPPORTING** | 0 to 2 | `STAGING`, `MV`, `REGISTRY` | Optional — requires ADR justification |

**SUPPORTING is a grouping term**, not a leaf_type value. It refers to any table whose leaf_type is not CANONICAL or ERROR.

**RAW** is a naming convention for a SUPPORTING table used for raw ingestion (e.g., `raw_companies`). It uses leaf_type `STAGING`, not a new type.

**Source**: ARCHITECTURE.md Part X §3 (OWN-10a, OWN-10b, OWN-10c)

---

## 3. Build-Time Gate

**Script**: `scripts/ctb-registry-gate.sh`

| Check | Pass | Fail |
|-------|------|------|
| Every table in `migrations/*.sql` exists in `column_registry.yml` | Registered | VIOLATION — orphaned table |
| Every table in `column_registry.yml` has a migration | Present | WARNING — phantom table |
| Each sub-hub has exactly 1 CANONICAL | Count = 1 | VIOLATION |
| Each sub-hub has exactly 1 ERROR | Count = 1 | VIOLATION |
| Each sub-hub has at most 2 SUPPORTING | Count <= 2 | VIOLATION |

**Output**: Machine-readable JSON report + human-readable Markdown report.

**Enforcement**: Pre-commit CHECK 13, CI pipeline.

---

## 4. Database Gate

**Migrations**: `templates/migrations/001-004`

### 4.1 Table Registration (`ctb.table_registry`)

Every table that may exist in the database MUST have a row in `ctb.table_registry` with:

| Field | Required | Purpose |
|-------|----------|---------|
| `table_schema` | YES | PostgreSQL schema name |
| `table_name` | YES | Table name |
| `hub_id` | YES | Owning hub (CC-02) |
| `subhub_id` | YES | Owning sub-hub (CC-03) |
| `leaf_type` | YES | CANONICAL, ERROR, STAGING, MV, or REGISTRY |
| `is_frozen` | YES | Whether table structure is locked |
| `blueprint_version_hash` | NO | Hash of the column_registry.yml version |

### 4.2 DDL Gate (Event Trigger)

A PostgreSQL event trigger fires on `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`. If the table is not pre-registered in `ctb.table_registry`, the DDL statement is **rejected** with `RAISE EXCEPTION`.

### 4.3 Write Guards (Row-Level Triggers)

Row-level BEFORE triggers on protected tables check `ctb.table_registry` before allowing INSERT, UPDATE, or DELETE. Writes to unregistered tables are **rejected**.

### 4.4 Promotion Enforcement

Writes to CANONICAL tables require a registered promotion path in `ctb.promotion_paths`. Direct writes to CANONICAL without setting the `ctb.promotion_source` session variable are **rejected**. This enforces that data flows from SUPPORTING tables to CANONICAL tables through declared paths.

---

## 5. Application Gate

**Module**: `templates/modules/gatekeeper/`

### 5.1 Gatekeeper Client

All database writes MUST go through the Gatekeeper module. The Gatekeeper:

| Action | Behavior |
|--------|----------|
| Write to registered table | ALLOWED — logged with audit trail |
| Write to unregistered table | REJECTED — error returned |
| Write to frozen table | REJECTED — error returned |
| Read from any table | ALLOWED — logged |
| Promote from SUPPORTING to CANONICAL | ALLOWED if promotion path registered |
| Direct DB access (bypass Gatekeeper) | BANNED — detected by CI |

### 5.2 Audit Trail

Every write is logged with:

| Field | Source |
|-------|--------|
| `process_id` | CC-04 PID |
| `hub_id` | From Gatekeeper config |
| `subhub_id` | From Gatekeeper config |
| `blueprint_version_hash` | From Gatekeeper config |
| `table` | Target table |
| `operation` | INSERT, UPDATE, DELETE |
| `row_count` | Number of affected rows |
| `timestamp` | ISO-8601 |

### 5.3 Banned Client Detection

**Script**: `scripts/detect-banned-db-clients.sh`

Scans `src/` for direct database client imports that bypass the Gatekeeper. Banned patterns include: `pg`, `mysql2`, `psycopg2`, `asyncpg`, `sqlalchemy`, `new Pool(`, `new Client(`, connection string literals.

**Enforcement**: Pre-commit CHECK 14, CI pipeline.

---

## 6. Live Drift Audit Enforcement Layer

**Script**: `scripts/ctb-drift-audit.sh`
**Workflow**: `reusable-ctb-drift-audit.yml`

### 6.1 Purpose

Detect drift between three surfaces that must agree:

| Surface | Source | Authority |
|---------|--------|-----------|
| A | Live database (`information_schema.tables` + `columns`) | Runtime truth |
| B | `ctb.table_registry` (runtime registry in DB) | Database gate |
| C | `column_registry.yml` (build-time YAML registry) | Build-time gate |

### 6.2 Drift Classes

| Class | Comparison | Severity | Meaning |
|-------|-----------|----------|---------|
| `ROGUE_TABLE` | A vs B | **VIOLATION** | Table exists in DB but NOT in `ctb.table_registry` |
| `PHANTOM_TABLE` | B vs A | WARNING | Registered in `ctb.table_registry` but NOT in DB |
| `ORPHAN_TABLE` | A vs C | WARNING | In DB but NOT in `column_registry.yml` |
| `GHOST_TABLE` | C vs A | WARNING | In `column_registry.yml` but NOT in DB |
| `COLUMN_DRIFT` | A vs C (columns) | WARNING | Column mismatch between DB and `column_registry.yml` |
| `REGISTRY_DESYNC` | B vs C | WARNING | `ctb.table_registry` disagrees with `column_registry.yml` |

Only `ROGUE_TABLE` is a violation (fail-closed: unregistered tables in the live database are never acceptable). All other classes are warnings — they indicate configuration lag, not security holes.

### 6.3 Trigger Conditions

| Trigger | When | How |
|---------|------|-----|
| **PR gate** | Pull request to `master` | `reusable-ctb-drift-audit.yml` via `workflow_call` |
| **Nightly** | Scheduled (cron) | Child repo calls reusable workflow on schedule |
| **Manual** | On demand | `workflow_dispatch` or local `DATABASE_URL=... scripts/ctb-drift-audit.sh` |

### 6.4 Failure Conditions

- **ROGUE tables detected** (exit 1): Build is BLOCKED. Tables must be registered in `ctb.table_registry` or dropped.
- **Warnings only** (exit 0): Build passes. Warnings should be addressed but do not block.
- **Connection failure** (exit 2): Script cannot connect to database. Does NOT block build (dependency unavailable ≠ violation).

### 6.5 Artifact Outputs

| Artifact | Format | Contents |
|----------|--------|----------|
| `.ctb-drift-audit-report.json` | JSON | Machine-readable: surfaces, counts, status |
| `.ctb-drift-audit-report.md` | Markdown | Human-readable: tables, results, doctrine reference |

### 6.6 Enforcement Modes

| Mode | Flag | Failure Condition | Use Case |
|------|------|-------------------|----------|
| **strict** | `--mode=strict` (default) | ANY rogue table is a VIOLATION | Greenfield repos, post-migration repos |
| **baseline** | `--mode=baseline` | Only NEW rogue tables (not in baseline) and NEW undocumented columns on CANONICAL tables are VIOLATIONS. Known legacy drift from baseline is a WARNING. | Repos with existing legacy tables being migrated |

#### Baseline Storage

- **File**: `docs/CTB_DRIFT_BASELINE.json` (repo-level, NOT a template)
- **Create**: `DATABASE_URL=... scripts/ctb-drift-audit.sh --write-baseline`
- **Contents**: Snapshot of known rogue tables and CANONICAL column state at capture time
- **Rule**: Baseline captures the current state. New entropy after baseline = VIOLATION. Legacy entropy in baseline = WARNING.
- **Expiry**: Baselines should be refreshed after each migration cycle. Stale baselines mask new drift.

### 6.7 Relationship to Fail-Closed Model

The drift audit is the **runtime verification layer** of the fail-closed model:

- **Build-time gate** (§3) prevents new tables from being created without registry entries
- **Database gate** (§4) prevents DDL/DML on unregistered tables at runtime
- **Application gate** (§5) prevents application code from bypassing the Gatekeeper
- **Drift audit** (§6) detects tables that entered the database through other means (manual SQL, migrations applied without registry update, superuser bypass)

The drift audit does not replace the other gates — it catches what they cannot. Together they form the complete defense-in-depth chain.

---

## 7. Enforcement Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    DEFENSE IN DEPTH                          │
├─────────────────┬───────────────────────────────────────────┤
│ BUILD-TIME      │ ctb-registry-gate.sh                      │
│                 │ Validates migrations vs column_registry    │
│                 │ Checks sub-hub cardinality                 │
├─────────────────┼───────────────────────────────────────────┤
│ DATABASE        │ Event trigger (DDL gate)                   │
│                 │ Write guards (DML gate)                    │
│                 │ Promotion enforcement                      │
│                 │ RAW immutability triggers (§8)             │
│                 │ Batch registry (§8.3)                      │
│                 │ Frozen bridge functions (§9.2)             │
│                 │ Role separation (§9, migration 010)        │
├─────────────────┼───────────────────────────────────────────┤
│ APPLICATION     │ Gatekeeper module (write wrapper)          │
│                 │ Banned client detection                    │
├─────────────────┼───────────────────────────────────────────┤
│ CI              │ reusable-fail-closed-gate.yml Gate C       │
│                 │ (DDL outside /migrations/)                 │
├─────────────────┼───────────────────────────────────────────┤
│ DRIFT AUDIT     │ ctb-drift-audit.sh                         │
│                 │ DB vs ctb.table_registry vs YAML           │
│                 │ ROGUE = violation, others = warning         │
│                 │ Immutability drift (§8 violations)         │
│                 │ JSON containment (§9 violations)           │
│                 │ Application role check (§10)               │
├─────────────────┼───────────────────────────────────────────┤
│ BOOTSTRAP       │ bootstrap-audit.sh                         │
│                 │ Day 0 structural validation                │
│                 │ Non-superuser enforcement (§10.1)          │
│                 │ Governance CI verification (§10.2)         │
│                 │ Attestation: BOOTSTRAP_AUDIT.md            │
└─────────────────┴───────────────────────────────────────────┘
```

---

## 8. Batch-Level RAW Lockdown

**Added**: v1.3.0
**Scope**: All STAGING (RAW), SUPPORTING, and CANONICAL tables
**Principle**: Append-only data flow — no UPDATE, no DELETE, corrections via batch supersede

This section defines immutability enforcement for the data pipeline. Once a row lands in any governed table, it is permanent. Corrections are made by inserting a new batch that supersedes the old one.

### 8.1 Vendor Layer (Bridge Registration)

External data enters the CTB through **registered vendor bridges**. A bridge is a declared integration point between a vendor system and a RAW table.

Every vendor bridge MUST be registered in `ctb.vendor_bridges` before it can write to any RAW table:

| Field | Required | Purpose |
|-------|----------|---------|
| `bridge_id` | YES | Unique identifier for the bridge (e.g., `stripe-invoices-v2`) |
| `vendor_source` | YES | External system name (e.g., `stripe`, `hubspot`, `manual_csv`) |
| `bridge_version` | YES | Semantic version of the bridge logic |
| `target_schema` | YES | Schema of the RAW table this bridge writes to |
| `target_table` | YES | RAW table name |
| `hub_id` | YES | Owning hub (CC-02) |
| `subhub_id` | YES | Owning sub-hub (CC-03) |
| `is_active` | YES | Whether the bridge is currently allowed to write |
| `registered_at` | AUTO | Timestamp of registration |
| `registered_by` | AUTO | User who registered the bridge |

**Rule**: Writes to RAW tables from unregistered bridges are **REJECTED**.

### 8.2 RAW Intake Layer (INSERT-Only Immutability)

All tables with leaf_type `STAGING` (RAW tables), plus all SUPPORTING and CANONICAL tables, are **INSERT-only**. UPDATE and DELETE are rejected at the database trigger level.

**Required columns on every RAW table**:

| Column | Type | Purpose |
|--------|------|---------|
| `ingestion_batch_id` | UUID | Unique identifier for this ingestion batch |
| `vendor_source` | TEXT | Must match a registered `ctb.vendor_bridges.vendor_source` |
| `bridge_version` | TEXT | Version of the bridge that produced this batch |
| `supersedes_batch_id` | UUID NULL | If this batch corrects a previous batch, reference it here |
| `created_at` | TIMESTAMPTZ | Immutable insertion timestamp (DEFAULT now()) |

**Immutability rules**:

| Table Type | INSERT | UPDATE | DELETE |
|------------|--------|--------|--------|
| STAGING (RAW) | ALLOWED (via registered bridge) | **REJECTED** | **REJECTED** |
| SUPPORTING (MV, REGISTRY) | ALLOWED (via Gatekeeper) | **REJECTED** | **REJECTED** |
| CANONICAL | ALLOWED (via promotion path) | **REJECTED** | **REJECTED** |
| ERROR | ALLOWED | ALLOWED | **REJECTED** |

**Exception**: ERROR tables allow UPDATE (to mark errors as resolved) but not DELETE. All other table types are strictly append-only.

**Correction model**: To correct data in a RAW table, insert a new batch with `supersedes_batch_id` referencing the old batch. The `raw_active` view (§8.4) resolves which batch is current.

### 8.3 RAW Batch Registry

Every ingestion batch is tracked in `ctb.raw_batch_registry`:

| Field | Type | Purpose |
|-------|------|---------|
| `batch_id` | UUID PK | Matches `ingestion_batch_id` on the RAW rows |
| `bridge_id` | TEXT FK | References `ctb.vendor_bridges.bridge_id` |
| `vendor_source` | TEXT | Vendor system that produced this batch |
| `bridge_version` | TEXT | Bridge version at ingestion time |
| `target_schema` | TEXT | Schema of the target RAW table |
| `target_table` | TEXT | Name of the target RAW table |
| `row_count` | INTEGER | Number of rows in this batch |
| `supersedes_batch_id` | UUID NULL | Previous batch this one replaces |
| `status` | TEXT | `ACTIVE`, `SUPERSEDED`, or `FAILED` |
| `ingested_at` | TIMESTAMPTZ | When the batch landed |
| `ingested_by` | TEXT | Process or user that ran the ingestion |

**Status transitions**: `ACTIVE` → `SUPERSEDED` (when a newer batch references it via `supersedes_batch_id`). Status updates on the batch registry itself are the **only** allowed UPDATE in the RAW pipeline — and only to mark a batch as `SUPERSEDED`.

**Rule**: The batch registry is itself INSERT-only for new batches. The only UPDATE allowed is `status` changing from `ACTIVE` to `SUPERSEDED`.

### 8.4 RAW_ACTIVE View Requirement

Every RAW table MUST have a companion view named `{table_name}_active` (e.g., `raw_companies_active`). This view:

1. Joins on `ctb.raw_batch_registry` to filter only `status = 'ACTIVE'` batches
2. Excludes rows from superseded batches
3. Is the **only** surface downstream processes should query

**Template**:
```sql
CREATE OR REPLACE VIEW {schema}.{table_name}_active AS
SELECT r.*
FROM {schema}.{table_name} r
INNER JOIN ctb.raw_batch_registry b
    ON b.batch_id = r.ingestion_batch_id
WHERE b.status = 'ACTIVE';
```

**Rule**: Downstream SUPPORTING or CANONICAL tables MUST read from `_active` views, never from raw tables directly. The Gatekeeper module enforces this at the application layer.

### 8.5 Promotion Enforcement (INSERT-Only Chain)

The full data flow is INSERT-only at every stage:

```
Vendor → Bridge → RAW (INSERT only)
                    ↓
              _active view (filters superseded)
                    ↓
            SUPPORTING (INSERT only, via promotion path)
                    ↓
            CANONICAL (INSERT only, via promotion path)
```

**Enforcement**:

| Stage | Gate | Mechanism |
|-------|------|-----------|
| Vendor → RAW | Bridge registration | `ctb.vendor_bridges` + immutability trigger |
| RAW → SUPPORTING | Promotion path | `ctb.promotion_paths` + immutability trigger |
| SUPPORTING → CANONICAL | Promotion path | `ctb.promotion_paths` + immutability trigger |
| Any → ERROR | Direct write | Immutability trigger (INSERT + UPDATE only) |

**Session variable**: All writes through the promotion chain must set `ctb.promotion_source` (as defined in §4.4). The immutability triggers (§8.2) run **in addition to** the promotion triggers (§4.4) — both must pass.

**Non-negotiable**: No UPDATE or DELETE on STAGING, MV, REGISTRY, or CANONICAL tables. Period. Corrections flow through batch supersede only.

---

## 9. Vendor JSON Intake Model (Frozen Bridge Architecture)

**Added**: v1.4.0
**Scope**: All sub-hubs with external data sources
**Principle**: JSON is contained at the vendor layer. Bridges are frozen, versioned, migration-controlled SQL functions. RAW and all downstream tables contain structured columns only.

This section defines how external tool output enters the CTB. JSON is a transport format, not a storage format. It is permitted at exactly one layer (vendor) and must be fully decomposed before reaching RAW.

### 9.1 Vendor Layer (JSON Sandbox)

Each sub-hub that receives external data MAY have a **vendor table** named `vendor_claude_<subhub>` (e.g., `vendor_claude_companies`). This table is the JSON landing zone.

**Required structure**:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID PK | Row identifier (DEFAULT gen_random_uuid()) |
| `ingestion_batch_id` | UUID | Links to `ctb.raw_batch_registry` |
| `tool_name` | TEXT | Name of the tool that produced this payload (e.g., `composio-hubspot`, `manual-csv-import`) |
| `payload_json` | JSONB | Raw JSON payload from the external tool |
| `created_at` | TIMESTAMPTZ | Immutable insertion timestamp (DEFAULT now()) |

**Rules**:

| Rule | Enforcement |
|------|-------------|
| INSERT only — no UPDATE, no DELETE | Immutability trigger (§8.2) |
| JSON columns (`JSONB`) allowed ONLY in vendor tables | Drift audit check (§9, strict mode) |
| No promotion without bridge | Bridge enforcement trigger |
| No direct RAW insert by `claude_role` | Role separation (migration 010) |
| Vendor tables use leaf_type `STAGING` | Standard CTB registration |
| Vendor table counts toward 0-2 SUPPORTING limit | ADR-001 cardinality unchanged |

**Naming convention**: Vendor tables MUST be prefixed with `vendor_claude_`. This prefix is used by the drift audit to identify the JSON sandbox boundary.

### 9.2 Bridge Enforcement Law

A **bridge** is a versioned, migration-controlled SQL function that transforms vendor JSON into structured RAW columns. Bridges are the **only** path from vendor tables to RAW tables.

**Bridge requirements**:

| Requirement | Detail |
|-------------|--------|
| Versioned | Every bridge function declares a `bridge_version` constant |
| Migration-controlled | Bridge functions live in `migrations/` as SQL files |
| Explicit extraction | Each JSON key is extracted with explicit `payload_json->>'key'` |
| Explicit casting | Every extracted value is cast to the target column type |
| Strict validation | Missing required keys → `RAISE EXCEPTION` |
| Type mismatch → reject | Invalid casts → `RAISE EXCEPTION` |
| Unmapped fields → log or reject | Fields not in the bridge mapping are either ignored or rejected (per bridge config) |
| Audit trail | Bridge logs: `ingestion_batch_id`, `bridge_version`, `vendor_source` |

**Bridge prohibitions**:

| Prohibition | Reason |
|-------------|--------|
| Dynamic JSON key iteration (`jsonb_each`, `jsonb_object_keys` in mapping) | Prevents schema drift — every field must be explicitly mapped |
| Silent NULL coercion (using `->>'key'` without validation) | Missing keys must fail, not silently become NULL |
| Mutating RAW rows (UPDATE/DELETE) | RAW is INSERT-only (§8.2) |
| Updating previous batches | Corrections flow through batch supersede only (§8.3) |

**Version discipline**: Any change to a bridge function requires a version bump. The old version function remains in the migration history. The new version is a new migration file.

**Template**: See migration `009_bridge_template.sql` for the reference implementation.

### 9.3 RAW Layer Discipline

RAW tables (named `raw_<entity>`, leaf_type `STAGING`) sit downstream of the bridge function. They contain the **structured** output of JSON decomposition.

**RAW column rules**:

| Rule | Enforcement |
|------|-------------|
| No `JSONB` columns | Drift audit strict mode → VIOLATION |
| No `JSON` columns | Drift audit strict mode → VIOLATION |
| All columns must be typed (`TEXT`, `INTEGER`, `TIMESTAMPTZ`, `UUID`, `BOOLEAN`, `NUMERIC`) | Build-time gate + drift audit |
| INSERT only | Immutability trigger (§8.2) |
| Batch-level supersede only | Batch registry (§8.3) |
| Must have `_active` companion view | View requirement (§8.4) |

**The JSON boundary**: JSON enters at the vendor table. The bridge decomposes it. RAW stores the structured result. From this point forward, JSON does not exist in the data pipeline.

### 9.4 Downstream Access Law

SUPPORTING and CANONICAL tables operate under the same rules as §8, with additional JSON containment:

| Rule | Scope | Enforcement |
|------|-------|-------------|
| No `JSONB` or `JSON` columns | SUPPORTING + CANONICAL | Drift audit strict mode → VIOLATION |
| Must not reference vendor tables directly | SUPPORTING + CANONICAL | Drift audit → VIOLATION |
| Must read from `_active` views only | SUPPORTING (from RAW) | Application gate (Gatekeeper) |
| INSERT only | SUPPORTING + CANONICAL | Immutability trigger (§8.2) |

**Referencing vendor tables**: If a SUPPORTING or CANONICAL table's promotion path references a vendor table (instead of a RAW `_active` view), the drift audit reports a VIOLATION in strict mode and a WARNING in baseline mode. Data must flow: Vendor → Bridge → RAW → `_active` → SUPPORTING → CANONICAL.

---

## 10. Bootstrap Enforcement Layer

**Added**: v1.5.0
**Scope**: All child repositories at creation and ongoing
**Principle**: No repo is structurally valid until governance is proven active at every layer

This section defines the requirements for a child repo to be considered structurally valid. All prior sections (§1-§9) define enforcement mechanisms. This section defines the **verification** that those mechanisms are actually working.

### 10.1 Non-Superuser Requirement

Application code MUST connect to the database as a non-superuser role. The recommended role is `ctb_app_role` (created by migration 011).

**Why**: PostgreSQL event triggers (`CREATE TABLE` gate, §4.2), write guards (§4.3), immutability triggers (§8.2), and promotion enforcement (§4.4) **do not fire for superusers**. If the application connects as `postgres`, all database-level governance is silently inert — tables can be created without registration, rows can be updated on INSERT-only tables, and promotion paths can be bypassed.

**Migration**: `011_enforce_application_role.sql`

| Role | Permissions |
|------|-------------|
| `ctb_app_role` | NOSUPERUSER, NOCREATEDB, NOCREATEROLE, NOBYPASSRLS |
| Grants | EXECUTE on bridge functions, SELECT on `_active` views, INSERT on `vendor_claude_*` tables |
| Revokes | INSERT/UPDATE/DELETE on RAW tables, UPDATE/DELETE on SUPPORTING, UPDATE/DELETE on CANONICAL |

**Validation**: `ctb.validate_application_role()` returns 7 checks:

| Check | Validates |
|-------|-----------|
| `app_role_exists` | `ctb_app_role` role exists |
| `not_postgres_user` | Current connection is not `postgres` |
| `not_superuser` | Current user has no superuser privileges |
| `app_role_not_superuser` | `ctb_app_role` is NOSUPERUSER |
| `app_role_no_createdb` | `ctb_app_role` is NOCREATEDB |
| `app_role_no_createrole` | `ctb_app_role` is NOCREATEROLE |
| `app_role_no_bypassrls` | `ctb_app_role` is NOBYPASSRLS |

**Drift check**: Check 14 (`SUPERUSER_CONNECTION`) in `ctb-drift-audit.sh`.

### 10.2 Governance CI Requirement

Every child repo MUST wire governance CI before it is considered valid.

**Script**: `verify-governance-ci.sh`

| Check | Validates |
|-------|-----------|
| Workflow directory exists | `.github/workflows/` present |
| Required workflow references | At least one workflow calls `reusable-fail-closed-gate.yml` |
| No continue-on-error | No `continue-on-error: true` on active workflows |
| Enforcement workflow exists | Workflow file that calls the fail-closed gate exists |
| Required scripts present | `ctb-drift-audit.sh`, `ctb-registry-gate.sh`, `detect-banned-db-clients.sh` present |
| Pre-commit hook | `.git/hooks/pre-commit` installed and executable |

**CI Gate**: Gate E in `reusable-fail-closed-gate.yml`.

### 10.3 Bootstrap Audit Requirement

After initial setup, every child repo MUST run `bootstrap-audit.sh`. This produces `docs/BOOTSTRAP_AUDIT.md` — a machine-generated attestation proving Day 0 structural integrity.

**Script**: `bootstrap-audit.sh`

| Check | Validates |
|-------|-----------|
| Required governance files | IMO_CONTROL.json, DOCTRINE.md, CC_OPERATIONAL_DIGEST.md, STARTUP_PROTOCOL.md, column_registry.yml |
| CTB folder structure | src/sys/, src/data/, src/app/, src/ai/, src/ui/ |
| Governance CI | verify-governance-ci.sh passes |
| Governance scripts | All required scripts present |
| Migrations | migrations/ has at least 11 SQL files |
| Pre-commit hook | Installed and executable |
| Application role | `ctb.validate_application_role()` passes (requires DATABASE_URL) |
| Drift audit | `ctb-drift-audit.sh --mode=strict` passes (requires DATABASE_URL) |
| No continue-on-error | No `continue-on-error: true` in active workflows |

**Output**: `docs/BOOTSTRAP_AUDIT.md` with PASS/FAIL status and full check results.

**Rule**: A repo without a passing `BOOTSTRAP_AUDIT.md` is NOT structurally valid. It may contain code, but governance cannot guarantee its integrity.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Status | LOCKED |
| Version | 1.5.0 |
| Change Protocol | ADR + Human Approval Required |
| Related | ADR-001, ARCHITECTURE.md Part X, DBA_ENFORCEMENT_DOCTRINE.md |
