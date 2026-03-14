# templates/migrations/

**Authority**: imo-creator (Constitutional)
**Purpose**: PostgreSQL migration templates for CTB database governance

---

## Overview

These migrations establish the CTB database governance layer. They create the `ctb` schema with enforcement infrastructure that blocks unregistered DDL and DML at the PostgreSQL level.

**Principle**: Register FIRST, create table SECOND. The database rejects anything not pre-registered.

---

## Migration Order

Migrations MUST be applied in order. Each builds on the previous.

| # | File | Purpose | Depends On |
|---|------|---------|------------|
| 1 | `001_ctb_table_registry.sql` | `ctb` schema + `table_registry` + audit log | Nothing |
| 2 | `002_ctb_event_trigger.sql` | DDL gate — blocks CREATE/ALTER/DROP on unregistered tables | 001 |
| 3 | `003_ctb_write_guards.sql` | DML gate — blocks INSERT/UPDATE/DELETE on unregistered tables | 001 |
| 4 | `004_ctb_promotion_enforcement.sql` | Promotion paths — controls SUPPORTING→CANONICAL data flow | 001 |

---

## Design Principles

1. **Fail-closed**: Unregistered operations are blocked, not warned
2. **SECURITY DEFINER**: Enforcement functions run as the definer, not the caller
3. **Explicit search_path**: All functions set `search_path = ctb, pg_catalog` to prevent search path injection
4. **Idempotent**: All migrations use `IF NOT EXISTS` / `CREATE OR REPLACE` for safe re-runs
5. **Rollback-ready**: Each migration has a corresponding rollback section (commented)

---

## Usage in Child Repos

Child repos copy these templates during bootstrap:

```bash
# During initial setup
cp templates/migrations/*.sql migrations/

# Apply in order
psql -f migrations/001_ctb_table_registry.sql
psql -f migrations/002_ctb_event_trigger.sql
psql -f migrations/003_ctb_write_guards.sql
psql -f migrations/004_ctb_promotion_enforcement.sql
```

After applying, ALL table creation must be pre-registered in `ctb.table_registry` or the DDL will be rejected.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Authority | IMO-Creator (CC-01) |
| Doctrine | CTB_REGISTRY_ENFORCEMENT.md, DBA_ENFORCEMENT_DOCTRINE.md |
