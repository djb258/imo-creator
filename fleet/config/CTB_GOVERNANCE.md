# CTB Governance Document Template

**Version**: 1.0.0
**Status**: TEMPLATE
**Authority**: Derived from `doctrine/ARCHITECTURE.md`
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## Purpose

This template defines the CTB (Christmas Tree Backbone) governance structure for a repository. It tracks:

- **Table Classification**: Every table has a designated leaf type
- **Governance Enforcement**: Frozen tables cannot be modified without formal change request
- **Drift Detection**: Automated identification of schema inconsistencies
- **Audit Trail**: Complete history of table modifications and violations

---

## 1. Overview

### 1.1 CTB Registry Location

```
Schema: ctb
Tables:
  - ctb.table_registry - Master table classification
  - ctb.violation_log - Schema violation tracking
```

### 1.2 Quick Reference

| Metric | Value |
|--------|-------|
| Total Tables Registered | `<COUNT>` |
| Frozen Core Tables | `<COUNT>` |
| Current Violations | `<COUNT>` |
| Join Key Integrity | `<ALIGNED / NOT_ALIGNED>` |

---

## 2. Leaf Type Classification

Every table in the database is assigned exactly one leaf type:

| Leaf Type | Count | Description | Modification Rules |
|-----------|-------|-------------|-------------------|
| **CANONICAL** | | Primary data tables | Normal write access |
| **ARCHIVE** | | CTB archive tables | Append-only |
| **SYSTEM** | | System/metadata tables | Admin only |
| **DEPRECATED** | | Legacy tables | Read-only |
| **ERROR** | | Error tracking tables | Append-only |
| **STAGING** | | Intake/staging tables | Temporary data |
| **MV** | | Materialized view candidates | Refresh-only |
| **REGISTRY** | | Lookup/reference tables | Admin only |

### 2.1 Leaf Type Query

```sql
-- Get leaf type for any table
SELECT table_schema, table_name, leaf_type, is_frozen, notes
FROM ctb.table_registry
WHERE table_name = 'your_table_name';

-- Count by leaf type
SELECT leaf_type, COUNT(*) as table_count
FROM ctb.table_registry
GROUP BY leaf_type
ORDER BY table_count DESC;
```

---

## 3. Frozen Core Tables

The following tables are **FROZEN** and require formal change request before modification:

| Schema | Table | Purpose |
|--------|-------|---------|
| | | |

### 3.1 Frozen Table Query

```sql
-- List all frozen tables
SELECT table_schema, table_name, notes
FROM ctb.table_registry
WHERE is_frozen = TRUE
ORDER BY table_schema, table_name;
```

### 3.2 Change Request Process

To modify a frozen table:

1. Create ADR documenting the change rationale
2. Update `doctrine/DO_NOT_MODIFY_REGISTRY.md`
3. Get approval from system owner
4. Execute change with audit trail
5. Update CTB registry if needed

---

## 4. Column Contracts

### 4.1 NOT NULL Constraints

Error tables have mandatory discriminator columns:

| Table | Column | Constraint |
|-------|--------|------------|
| | | |

### 4.2 CTB_CONTRACT Comments

Key columns should have `CTB_CONTRACT` comments documenting their purpose:

```sql
COMMENT ON COLUMN schema.table.column IS
  'CTB_CONTRACT: Description of column contract';
```

---

## 5. Drift Detection

### 5.1 Drift Types

| Type | Description | Action |
|------|-------------|--------|
| `DEPRECATED_WITH_DATA` | Legacy tables with data | Archive or delete |
| `MISSING_CONTRACT` | Key columns without documentation | Add CTB_CONTRACT comment |
| `UNREGISTERED_TABLE` | Tables not in CTB registry | Register or drop |

### 5.2 Current Drift Status

| Type | Count | Notes |
|------|-------|-------|
| DEPRECATED_WITH_DATA | | |
| MISSING_CONTRACT | | |
| UNREGISTERED_TABLE | | |

---

## 6. CTB Phase History

Document the CTB phases executed for this repository:

| Phase | Tag | Date | Scope |
|-------|-----|------|-------|
| | | | |

---

## 7. Governance Rules

### 7.1 Table Creation

New tables must be registered in CTB before use:

```sql
INSERT INTO ctb.table_registry (table_schema, table_name, leaf_type, notes)
VALUES ('your_schema', 'your_table', 'CANONICAL', 'Purpose description');
```

### 7.2 Table Modification

- **CANONICAL**: Normal DDL allowed
- **FROZEN**: Requires formal change request
- **DEPRECATED**: Read-only, no modifications
- **ARCHIVE**: Append-only, no updates/deletes

### 7.3 Table Deletion

Tables should be marked DEPRECATED before deletion:

```sql
UPDATE ctb.table_registry
SET leaf_type = 'DEPRECATED', notes = 'Scheduled for removal: YYYY-MM-DD'
WHERE table_schema = 'schema' AND table_name = 'table';
```

---

## 8. Useful Queries

### 8.1 Registry Overview

```sql
-- Full registry with counts
SELECT
    leaf_type,
    COUNT(*) as tables,
    SUM(CASE WHEN is_frozen THEN 1 ELSE 0 END) as frozen
FROM ctb.table_registry
GROUP BY leaf_type
ORDER BY tables DESC;
```

### 8.2 Schema Summary

```sql
-- Tables by schema
SELECT
    table_schema,
    COUNT(*) as tables,
    string_agg(DISTINCT leaf_type, ', ') as leaf_types
FROM ctb.table_registry
GROUP BY table_schema
ORDER BY tables DESC;
```

### 8.3 Violation Check

```sql
-- Recent violations
SELECT *
FROM ctb.violation_log
ORDER BY created_at DESC
LIMIT 20;
```

### 8.4 Frozen Table Check

```sql
-- Check if a table is frozen before modifying
SELECT is_frozen, notes
FROM ctb.table_registry
WHERE table_schema = 'your_schema'
  AND table_name = 'your_table';
```

---

## 9. Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Architecture Doctrine | `templates/doctrine/ARCHITECTURE.md` | CTB constitutional law |
| CTB Doctrine | `templates/config/CTB_DOCTRINE.md` | CTB quick reference |
| DO NOT MODIFY | `doctrine/DO_NOT_MODIFY_REGISTRY.md` | Frozen components |

---

## 10. Event Trigger (Optional)

To enforce table registration at creation time:

```sql
CREATE EVENT TRIGGER ctb_table_creation_check
    ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE')
    EXECUTE FUNCTION ctb.check_table_creation();
```

**Note**: Event trigger is available but not enabled by default.

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Created | `<DATE>` |
| Author | `<AUTHOR>` |
| Status | ACTIVE |
| Review Cycle | Quarterly |
| Change Protocol | ADR REQUIRED |
