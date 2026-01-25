# DBA Enforcement Doctrine

**Status**: LOCKED
**Authority**: CONSTITUTIONAL
**Version**: 1.0.0
**Change Protocol**: HUMAN APPROVAL REQUIRED — NO EXCEPTIONS

---

## Purpose

This doctrine governs all database and structural changes across systems derived from IMO-Creator.

**You are an operator, not a legislator.**
**If doctrine is violated, you halt. You do not adapt.**

---

## STEP 0 — Change Classification (MANDATORY)

Before any work, classify the requested change:

### Type A — Non-Structural

- No tables created
- No tables dropped
- No columns added
- No columns removed
- No schema modifications

**If Type A**: Execute Gate A only.

### Type B — Structural

- Creates table(s)
- Drops table(s)
- Adds column(s)
- Removes column(s)
- Modifies schema

**If Type B**: Execute Gate A + Gate B.

---

## STEP 1 — Gate A: Non-Structural Verification

Execute for ALL changes (Type A and Type B):

| # | Check | Pass Criteria |
|---|-------|---------------|
| 1 | Table Bloat | Justification documented if structure changed |
| 2 | ADR Present | ADR exists if structure changed |
| 3 | Deprecation | Deprecation over mutation (no destructive changes) |
| 4 | Audit Logging | Audit logging in place for all mutations |

**ANY failure → REFUSE TO PROCEED.**

---

## STEP 2 — Gate B: Structural Verification

Execute ONLY for Type B changes:

| # | Check | Pass Criteria |
|---|-------|---------------|
| 1 | Table Unique ID | Every table has `table_unique_id` |
| 2 | Owning Hub | Every table declares `owning_hub_unique_id` |
| 3 | Owning Sub-Hub | Every table declares `owning_subhub_unique_id` |
| 4 | Table Description | Plain English description exists |
| 5 | Source of Truth | `source_of_truth` declared |
| 6 | Row Identity | `row_identity_strategy` defined |
| 7 | Column Unique ID | Every column has `column_unique_id` |
| 8 | Column Description | Every column has plain English description |
| 9 | Data Type | Every column declares `data_type` |
| 10 | Format | Every column declares `format` |
| 11 | Nullable | Every column declares `nullable` (true/false) |
| 12 | Semantic Role | Every column declares `semantic_role` |
| 13 | Relationships | All relationships explicitly declared |
| 14 | ERD Updated | ERD reflects current schema |
| 15 | Migration Script | Forward migration exists |
| 16 | Rollback Script | Rollback migration exists |

**ANY failure → REFUSE TO PROCEED.**

---

## STEP 3 — Template Immutability Verification

Execute for ALL changes:

| # | Check | Pass Criteria |
|---|-------|---------------|
| 1 | Doctrine Untouched | No modification to doctrine files |
| 2 | No Reinterpretation | Rules applied as written |
| 3 | AI Non-Modification | AI has not altered doctrine |
| 4 | AI Non-Reordering | AI has not reordered rules |
| 5 | Human Approval | Human approval obtained for doctrine changes |

**ANY failure → REFUSE TO PROCEED.**

---

## STEP 4 — Required Output (NO EXCEPTIONS)

You MUST output:

```
DBA ENFORCEMENT CHECK
═════════════════════

Change Type: [A | B]
Gates Executed: [A only | A + B]

GATE A RESULTS:
├─ Table Bloat: [PASS | FAIL]
├─ ADR Present: [PASS | FAIL | N/A]
├─ Deprecation: [PASS | FAIL]
└─ Audit Logging: [PASS | FAIL]

GATE B RESULTS: [EXECUTED | SKIPPED]
├─ Table Metadata: [PASS | FAIL]
├─ Column Metadata: [PASS | FAIL]
├─ Relationships: [PASS | FAIL]
├─ ERD Updated: [PASS | FAIL]
└─ Migrations: [PASS | FAIL]

TEMPLATE IMMUTABILITY:
├─ Doctrine Untouched: [PASS | FAIL]
├─ AI Non-Modification: [PASS | FAIL]
└─ Human Approval: [PASS | FAIL | N/A]

FINAL RESULT: [PROCEED | BLOCKED]
Reason: [if blocked, exact reason]
```

---

## Semantic Role Definitions

| Role | Definition |
|------|------------|
| `identifier` | Uniquely identifies a row (PK, UUID) |
| `foreign_key` | References another table |
| `attribute` | Describes an entity property |
| `metric` | Quantitative measurement |

---

## Format Definitions

| Format | Description |
|--------|-------------|
| `UUID` | Universally unique identifier |
| `ISO-8601` | Date/time format |
| `USD_CENTS` | Currency in cents (integer) |
| `EMAIL` | Email address |
| `ENUM` | Enumerated value |
| `JSON` | JSON object |
| `BOOLEAN` | True/false |

---

## Violation Categories

| Category | Definition |
|----------|------------|
| `SCHEMA_VIOLATION` | Missing required metadata |
| `AUDIT_VIOLATION` | Missing audit logging |
| `MIGRATION_VIOLATION` | Missing or invalid migration |
| `DOCTRINE_VIOLATION` | Attempted doctrine modification |
| `APPROVAL_VIOLATION` | Missing human approval |

---

## Deprecation Over Mutation Rule

**NEVER** delete or rename columns directly.

**ALWAYS** use deprecation:

1. Mark column as deprecated in metadata
2. Add new column if replacement needed
3. Migrate data in application layer
4. After grace period, remove deprecated column via ADR

---

## Master Error Log Integration

All DBA violations MUST be logged:

```json
{
  "timestamp": "ISO-8601",
  "violation_type": "SCHEMA_VIOLATION | AUDIT_VIOLATION | ...",
  "table": "table_name",
  "column": "column_name (if applicable)",
  "rule_violated": "specific rule",
  "action_taken": "BLOCKED"
}
```

---

## Authority Rule

> You are an operator, not a legislator.
> If doctrine is violated, you halt, you do not adapt.
> No commentary. No suggestions unless explicitly asked.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-11 |
| Last Modified | 2026-01-11 |
| Version | 1.0.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
| Change Protocol | HUMAN APPROVAL REQUIRED |
