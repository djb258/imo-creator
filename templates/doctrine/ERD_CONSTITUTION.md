# ERD Constitution

**Status**: LOCKED
**Authority**: CONSTITUTIONAL (Derived from CONSTITUTION.md)
**Version**: 1.0.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## Derivation

This document is a **derived proof** from the supreme Transformation Law declared in `CONSTITUTION.md`:

> Nothing may exist unless it transforms declared constants into declared variables.

The ERD is the **structural proof** — it proves WHAT artifacts are allowed to exist to support the declared transformation.

---

## The ERD Validity Principle

An ERD table is valid if and only if:

1. It serves a declared transformation (from PRD)
2. It passes the **Pressure Test** (static validation)
3. It passes the **Upstream Flow Test** (simulated lineage)

A table that fails any condition is **illegal** and must be removed or justified via ADR.

---

## PHASE 1 — Pressure Test (Static)

The Pressure Test is a static validation that every table must pass.

### Required Answers

For every table in the ERD, answer these four questions:

| # | Question | Failure Condition |
|---|----------|-------------------|
| 1 | What constant(s) does this table depend on? | No constant dependency = ILLEGAL |
| 2 | What variable does this table represent? | No variable output = ILLEGAL |
| 3 | Which pass produced this table? | No pass ownership = ILLEGAL |
| 4 | How is lineage enforced? | No lineage mechanism = ILLEGAL |

### Pressure Test Matrix

```
TABLE: [TABLE_NAME]
═══════════════════════════════════════════════════════════════

Q1: CONSTANT DEPENDENCY
    └─ What constants feed this table?
    └─ Source: [Constant name(s) from PRD]
    └─ Status: [DECLARED | MISSING]

Q2: VARIABLE OUTPUT
    └─ What variable does this table represent?
    └─ Variable: [Variable name from PRD]
    └─ Status: [DECLARED | MISSING]

Q3: PASS OWNERSHIP
    └─ Which pass created/populates this table?
    └─ Pass: [CAPTURE | COMPUTE | GOVERN]
    └─ Status: [DECLARED | MISSING]

Q4: LINEAGE ENFORCEMENT
    └─ How is data lineage tracked?
    └─ Mechanism: [FK constraint | unique_id chain | process_id | audit column]
    └─ Status: [ENFORCED | MISSING]

PRESSURE TEST RESULT: [PASS | FAIL]
```

### Failure Handling

| Failure | Required Action |
|---------|-----------------|
| Q1 fails (no constant) | Table has no input — delete or justify via ADR |
| Q2 fails (no variable) | Table produces nothing — delete or justify via ADR |
| Q3 fails (no pass) | Table has no owner — assign to pass or delete |
| Q4 fails (no lineage) | Table has no traceability — add lineage mechanism |

**All four questions must pass. Partial pass = FAIL.**

---

## PHASE 2 — Upstream Flow Test (Simulated)

The Upstream Flow Test proves that data can actually reach the table through declared passes.

### Core Principle

> Flow tests MUST begin at the nearest upstream constant.
> Never start testing at the table itself.

### Test Protocol

```
UPSTREAM FLOW TEST: [TABLE_NAME]
═══════════════════════════════════════════════════════════════

STEP 1: IDENTIFY UPSTREAM CONSTANT
        └─ Constant: [Name from PRD]
        └─ Source: [External system / API / User input]

STEP 2: INJECT SYNTHETIC DATA
        └─ Injection Point: [Constant source]
        └─ Test Payload: [Minimal valid data structure]

STEP 3: TRAVERSE DECLARED PASSES
        └─ Pass 1 (CAPTURE): [Ingress point] → [Status]
        └─ Pass 2 (COMPUTE): [Middle logic] → [Status]
        └─ Pass 3 (GOVERN): [Egress rules] → [Status]

STEP 4: VERIFY ARRIVAL
        └─ Target Table: [TABLE_NAME]
        └─ Data Arrived: [YES | NO]
        └─ Lineage Intact: [YES | NO]

UPSTREAM FLOW TEST RESULT: [PASS | FAIL]
```

### What the Test Proves

| Outcome | Meaning |
|---------|---------|
| PASS | Data can reach this table via declared transformation |
| FAIL | Table is unreachable or lineage breaks — structural violation |

### What the Test Does NOT Prove

- Runtime correctness (behavior)
- Data accuracy (content)
- Performance (speed)
- Error handling (resilience)

**The goal is to prove reachability, not runtime correctness.**

---

## Pass-to-Table Mapping

Every table MUST be owned by exactly one pass:

| Pass | Table Role | Example Tables |
|------|------------|----------------|
| **CAPTURE** | Raw ingested data | `raw_contacts`, `api_responses`, `file_imports` |
| **COMPUTE** | Transformed/enriched data | `enriched_contacts`, `calculated_scores`, `validated_records` |
| **GOVERN** | Governed output data | `approved_contacts`, `rate_limited_queue`, `audit_log` |

### Ownership Rules

- A table belongs to exactly one pass
- A pass may own multiple tables
- Tables without pass ownership are ILLEGAL
- Pass ownership is declared in the PRD, validated in the ERD

---

## ERD Structural Requirements

Every ERD must satisfy:

| # | Requirement | Validation |
|---|-------------|------------|
| 1 | Every table traces to a PRD constant | Pressure Test Q1 |
| 2 | Every table produces a PRD variable | Pressure Test Q2 |
| 3 | Every table has pass ownership | Pressure Test Q3 |
| 4 | Every table has lineage mechanism | Pressure Test Q4 |
| 5 | Upstream flow is provable | Upstream Flow Test |
| 6 | Mermaid format compliance | Per DOCUMENTATION_ERD_DOCTRINE.md |

---

## Relationship to PRD

| Document | Role |
|----------|------|
| PRD | Declares WHAT constants exist, WHAT variables are produced, WHAT passes transform them |
| ERD | Proves WHICH tables implement the transformation, validates via Pressure + Flow tests |

**ERD cannot exist without PRD. PRD defines; ERD proves.**

---

## Combined Validation Flow

```
PRD CONSTITUTION                    ERD CONSTITUTION
═══════════════                    ═══════════════

1. Declare Constants        →      1. Tables trace to constants
2. Declare Variables        →      2. Tables produce variables
3. Declare Passes           →      3. Tables owned by passes
        │                                  │
        │                                  ▼
        │                          PRESSURE TEST
        │                          (Static validation)
        │                                  │
        │                                  ▼
        │                          UPSTREAM FLOW TEST
        │                          (Simulated lineage)
        │                                  │
        ▼                                  ▼
   PRD VALID                         ERD VALID
        │                                  │
        └──────────────┬───────────────────┘
                       ▼
              SYSTEM MAY BE INSTANTIATED
```

---

## Enforcement Output Format

```
ERD CONSTITUTION VALIDATION
═══════════════════════════════════════════════════════════════

PRD Reference: [PRD document path]
ERD Location: [ERD file path]

PRESSURE TEST RESULTS:
┌─────────────────────┬──────┬──────┬──────┬──────┬────────┐
│ Table               │ Q1   │ Q2   │ Q3   │ Q4   │ Result │
├─────────────────────┼──────┼──────┼──────┼──────┼────────┤
│ [TABLE_NAME]        │ PASS │ PASS │ PASS │ PASS │ PASS   │
│ [TABLE_NAME]        │ PASS │ PASS │ FAIL │ PASS │ FAIL   │
└─────────────────────┴──────┴──────┴──────┴──────┴────────┘

UPSTREAM FLOW TEST RESULTS:
┌─────────────────────┬────────────────┬─────────┬────────┐
│ Table               │ Start Constant │ Arrived │ Result │
├─────────────────────┼────────────────┼─────────┼────────┤
│ [TABLE_NAME]        │ [CONST_NAME]   │ YES     │ PASS   │
│ [TABLE_NAME]        │ [CONST_NAME]   │ NO      │ FAIL   │
└─────────────────────┴────────────────┴─────────┴────────┘

ILLEGAL TABLES (must be removed or justified via ADR):
- [TABLE_NAME]: [Reason]

FINAL RESULT: [VALID | INVALID]
```

---

## Violation Categories

| Category | Definition | Severity |
|----------|------------|----------|
| `ERD_NO_CONSTANT` | Table has no constant dependency | CRITICAL |
| `ERD_NO_VARIABLE` | Table produces no variable | CRITICAL |
| `ERD_NO_PASS` | Table has no pass owner | CRITICAL |
| `ERD_NO_LINEAGE` | Table has no lineage mechanism | CRITICAL |
| `ERD_UNREACHABLE` | Upstream flow test failed | CRITICAL |
| `ERD_ORPHAN` | Table not referenced in PRD | CRITICAL |

**All violations are CRITICAL. There are no warnings.**

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-29 |
| Last Modified | 2026-01-29 |
| Version | 1.0.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
| Derives From | CONSTITUTION.md (Transformation Law) |
| Extends | DOCUMENTATION_ERD_DOCTRINE.md |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
