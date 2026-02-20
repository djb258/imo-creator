# CTB Registry Enforcement

**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: LOCKED
**Version**: 1.0.0
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

### 6.6 Relationship to Fail-Closed Model

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
└─────────────────┴───────────────────────────────────────────┘
```

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Status | LOCKED |
| Version | 1.1.0 |
| Change Protocol | ADR + Human Approval Required |
| Related | ADR-001, ARCHITECTURE.md Part X, DBA_ENFORCEMENT_DOCTRINE.md |
