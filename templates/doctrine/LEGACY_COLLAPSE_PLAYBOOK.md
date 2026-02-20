# Legacy Collapse Playbook

**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: LOCKED
**Version**: 1.0.0
**Scope**: All child repositories migrating from ungoverned to CTB-governed structure

---

## Purpose

This playbook defines the five-phase process for collapsing legacy systems into CTB-governed structure. Legacy code and tables are not deleted — they are inventoried, mapped, migrated, verified, and only dropped after human sign-off.

---

## Phase 1: Inventory

**Goal**: Produce a complete inventory of everything that exists.

### 1.1 What to Inventory

| Category | What to Find | How |
|----------|-------------|-----|
| Tables | All database tables, views, materialized views | Query `information_schema.tables` |
| Scripts | All executable files outside CTB branches | `find . -type f -perm -u+x` or by extension |
| Execution surfaces | All directories containing runnable code | Directory listing + shebang detection |
| Direct DB access | All files importing banned DB clients | `detect-banned-db-clients.sh` |
| Migrations | All SQL files that create/alter schema | Grep for DDL patterns |

### 1.2 Inventory Output

Produce two artifacts:

| Artifact | Format | Location |
|----------|--------|----------|
| `legacy-inventory.json` | Machine-readable | repo root |
| `legacy-inventory.md` | Human-readable | `docs/migration/` |

### 1.3 Inventory Schema

```json
{
  "timestamp": "ISO-8601",
  "repo": "repo-name",
  "tables": [
    {
      "schema": "public",
      "name": "old_contacts",
      "row_count": 12345,
      "has_ctb_registration": false,
      "has_migration": false
    }
  ],
  "execution_surfaces": [
    {
      "path": "scripts/old_sync.sh",
      "type": "shell_script",
      "in_ctb": false
    }
  ],
  "banned_db_clients": [
    {
      "file": "src/app/services/db.ts",
      "pattern": "new Pool(",
      "line": 42
    }
  ]
}
```

---

## Phase 2: Map

**Goal**: Map every legacy artifact to its CTB destination.

### 2.1 Table Mapping

For each table in the inventory:

| Field | Required |
|-------|----------|
| Source table (legacy name) | YES |
| Target schema | YES |
| Target table name | YES |
| Owning hub_id | YES |
| Owning subhub_id | YES |
| Leaf type (CANONICAL, ERROR, STAGING, MV, REGISTRY) | YES |
| Disposition (MIGRATE, MERGE, DROP) | YES |
| ADR reference (if SUPPORTING type or DROP) | YES for SUPPORTING/DROP |

### 2.2 Code Mapping

For each execution surface outside CTB:

| Field | Required |
|-------|----------|
| Source path | YES |
| Target CTB branch | YES (`src/sys/`, `src/data/`, `src/app/`, `src/ai/`, `src/ui/`) |
| Target path | YES |
| Disposition (MOVE, REWRITE, DROP) | YES |

### 2.3 Mapping Output

| Artifact | Format | Location |
|----------|--------|----------|
| `legacy-mapping.json` | Machine-readable | repo root |
| `legacy-mapping.md` | Human-readable | `docs/migration/` |

---

## Phase 3: Migrate

**Goal**: Execute the mapping — register tables, move code, replace direct DB access.

### 3.1 Table Migration Sequence

```
1. Register table in column_registry.yml
2. Register table in ctb.table_registry (database)
3. Create migration SQL in migrations/
4. If SUPPORTING: register promotion path in ctb.promotion_paths
5. Run ctb-registry-gate.sh — MUST pass
```

### 3.2 Code Migration Sequence

```
1. Move file to target CTB branch path
2. Update all imports/references
3. Replace direct DB access with Gatekeeper
4. Run detect-banned-db-clients.sh — MUST pass
```

### 3.3 Migration Rules

| Rule | Enforcement |
|------|-------------|
| Register BEFORE create | ctb.table_registry event trigger |
| One table at a time | Atomic migrations only |
| Forward + rollback migration | DBA_ENFORCEMENT_DOCTRINE.md Gate B #15-16 |
| No logic changes during migration | Structure only — logic changes are separate PRs |

---

## Phase 4: Parity

**Goal**: Verify that the migrated system passes all fail-closed gates.

### 4.1 Parity Checklist

| Check | Tool | Must Pass |
|-------|------|-----------|
| Fail-closed CI gate (all 4 gates) | `reusable-fail-closed-gate.yml` | YES |
| CTB registry gate (cardinality) | `ctb-registry-gate.sh` | YES |
| Banned DB client detection | `detect-banned-db-clients.sh` | YES |
| Schema completeness | `validate-schema-completeness.sh` | YES |
| Doctrine compliance | `apply_doctrine_audit.sh` | YES |
| Pre-commit hook (all 14 checks) | `pre-commit` | YES |

### 4.2 Parity Output

| Artifact | Format | Location |
|----------|--------|----------|
| `legacy-parity-report.json` | Machine-readable | repo root |
| `legacy-parity-report.md` | Human-readable | `docs/migration/` |

**Parity is achieved when ALL checks pass with ZERO violations.**

---

## Phase 5: Rename + Drop

**Goal**: Remove legacy artifacts safely with human sign-off.

### 5.1 Rename Phase

```
1. Rename legacy path to _legacy suffix
   Example: scripts/old_sync.sh → scripts/old_sync_legacy.sh
   Example: public.old_contacts → public.old_contacts_legacy

2. Keep _legacy artifacts for ONE release cycle (grace period)

3. Monitor for references to _legacy paths
   - Grep codebase for _legacy references
   - Check query logs for _legacy table access
```

### 5.2 Drop Phase

**Drops require ALL of the following:**

| Requirement | Mandatory |
|-------------|-----------|
| One release cycle elapsed since rename | YES |
| No references to `_legacy` path in codebase | YES |
| No queries to `_legacy` table in logs (7+ days) | YES |
| ADR documenting the drop | YES |
| Human sign-off on ADR | YES |
| Rollback migration exists | YES |

### 5.3 Drop Sequence

```
1. Create ADR: "Drop [artifact]_legacy — no references in [N] days"
2. Human approves ADR
3. Create DROP migration with rollback
4. Execute drop
5. Update column_registry.yml (remove entry)
6. Update ctb.table_registry (remove entry)
7. Run ctb-registry-gate.sh — MUST pass
```

### 5.4 What MUST NOT Happen

| Anti-Pattern | Why It Is Wrong |
|--------------|-----------------|
| Drop without rename phase | No grace period for discovery |
| Drop without ADR | No decision record |
| Drop without human sign-off | Violates approval gate |
| Drop without rollback migration | No recovery path |
| Silent drop (no logging) | Untraceable data loss |
| "We'll fix it later" | Fix it now or ADR the exception |
| Copying legacy patterns to new code | Doctrine violation — use CTB patterns |
| Renaming without remapping | Cosmetic, not structural |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Status | LOCKED |
| Version | 1.0.0 |
| Change Protocol | ADR + Human Approval Required |
| Related | CTB_REGISTRY_ENFORCEMENT.md, REPO_REFACTOR_PROTOCOL.md, DBA_ENFORCEMENT_DOCTRINE.md |
