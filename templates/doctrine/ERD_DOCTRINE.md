# ERD Doctrine

**Status**: LOCKED
**Authority**: CONSTITUTIONAL (Derived from CONSTITUTION.md)
**Version**: 1.0.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## Derivation

This document is a **derived structural doctrine** from the supreme Transformation Law declared in `CONSTITUTION.md`:

> Nothing may exist unless it transforms declared constants into declared variables.

The ERD is the **structural proof** — it proves WHAT artifacts are allowed to exist to support the declared transformation.

---

## Core Principle

**ERDs are structural proof, not design artifacts.**

An ERD does not describe what you want to build. It proves what is allowed to exist based on a constitutionally approved transformation.

| ERD Is | ERD Is NOT |
|--------|------------|
| Structural proof | Design document |
| Validation mechanism | Planning tool |
| Existence justification | Implementation guide |
| Transformation evidence | Database schema |

---

## ERD Validity Principle

An ERD table is valid if and only if:

1. It serves a declared transformation (from PRD)
2. It passes the **Pressure Test** (static validation)
3. It passes the **Upstream Flow Test** (simulated lineage)

A table that fails any condition is **illegal** and must be removed or justified via ADR.

---

## Mandatory Validation Phases

Every ERD must pass two validation phases. Detailed protocols are defined in `ERD_CONSTITUTION.md`.

### PHASE 1 — Pressure Test (Static)

The Pressure Test is a static validation that every table must pass.

For every table in the ERD, answer these four questions:

| # | Question | Failure Condition |
|---|----------|-------------------|
| 1 | What constant(s) does this table depend on? | No constant dependency = ILLEGAL |
| 2 | What variable does this table represent? | No variable output = ILLEGAL |
| 3 | Which pass produced this table? | No pass ownership = ILLEGAL |
| 4 | How is lineage enforced? | No lineage mechanism = ILLEGAL |

**All four questions must pass. Partial pass = FAIL.**

### PHASE 2 — Upstream Flow Test (Simulated)

The Upstream Flow Test proves that data can reach the table through declared passes.

| Principle | Rule |
|-----------|------|
| Start point | Flow tests MUST begin at the nearest upstream constant |
| Direction | Never start testing at the table itself |
| Traversal | Declared passes are traversed sequentially |
| Data | Minimal synthetic data is used |
| Lineage | Must survive end-to-end |

**The goal is to prove reachability, not runtime correctness.**

See `ERD_CONSTITUTION.md` for complete validation protocols and output formats.

---

## Pass-to-Table Mapping

Every table MUST be owned by exactly one pass:

| Pass | IMO Layer | Table Role |
|------|-----------|------------|
| **CAPTURE** | I (Ingress) | Raw ingested data |
| **COMPUTE** | M (Middle) | Transformed/enriched data |
| **GOVERN** | O (Egress) | Governed output data |

### Ownership Rules

- A table belongs to exactly one pass
- A pass may own multiple tables
- Tables without pass ownership are ILLEGAL
- Pass ownership is declared in the PRD, validated in the ERD

---

## ERD Hierarchy

```
CONSTITUTION
    │
    ▼
PRD (Behavioral Proof)
    │ Declares: WHAT constants, WHAT variables, WHAT passes
    ▼
ERD (Structural Proof)
    │ Proves: WHAT tables may exist
    │ Validates: Pressure Test + Upstream Flow Test
    │
    ▼
PROCESS (Execution Declaration)
    │ Executes: Transformation via declared tables
```

**ERD cannot exist without PRD. PRD defines; ERD proves.**

**A PRD is considered valid only if its HSS (Hub-and-Spoke Set Up) section is present and complete.** ERD validation fails if the governing PRD lacks a completed HSS section.

---

## What This Doctrine Does NOT Govern

This doctrine governs structural proof only. The following are explicitly out of scope:

| Out of Scope | Governance |
|--------------|------------|
| Runtime behavior | Local policy |
| Data accuracy | Local policy |
| Performance | Local policy |
| Error handling | Local policy |
| Database implementation | Local policy |
| Index strategy | Local policy |
| Query optimization | Local policy |
| Replication | Local policy |

**ERD Doctrine proves structural validity. It does not govern runtime correctness.**

---

## Relationship to Other Doctrine

| Document | Role | Relationship |
|----------|------|--------------|
| `PRD_CONSTITUTION.md` | Behavioral proof | ERD must trace to PRD declarations |
| `ERD_CONSTITUTION.md` | Validation protocols | Detailed Pressure Test and Upstream Flow Test |
| `PROCESS_DOCTRINE.md` | Execution declaration | Processes execute against ERD-approved structures |
| `DOCUMENTATION_ERD_DOCTRINE.md` | Format standards | Mermaid compliance, column dictionaries |

---

## OSAM Alignment (MANDATORY)

**ERDs exist to IMPLEMENT OSAM, not extend it.**

Every ERD must align with its governing OSAM:

| Requirement | Enforcement |
|-------------|-------------|
| Every relationship in ERD is declared in OSAM | CRITICAL — ERD fails if join not in OSAM |
| No exploratory or undocumented joins | CRITICAL — Discovery is not permitted |
| ERD table classifications match OSAM | CRITICAL — QUERY/SOURCE/ENRICHMENT must align |
| Universal join key is consistent | CRITICAL — Must match OSAM declaration |

### OSAM Alignment Validation

```
For each join in ERD:
  IF join NOT declared in OSAM → ERD INVALID
  IF join targets SOURCE table as query surface → ERD INVALID
  IF join targets ENRICHMENT table as query surface → ERD INVALID
```

**ERDs may only contain joins declared in OSAM. No exceptions.**

---

## Validation Criteria

Before an ERD is approved, verify:

| # | Check | Pass Condition |
|---|-------|----------------|
| 1 | PRD reference exists | Governing PRD is approved |
| 2 | OSAM reference exists | Governing OSAM is approved |
| 3 | Every table traces to constant | Pressure Test Q1 passes |
| 4 | Every table produces variable | Pressure Test Q2 passes |
| 5 | Every table has pass ownership | Pressure Test Q3 passes |
| 6 | Every table has lineage mechanism | Pressure Test Q4 passes |
| 7 | Upstream flow is provable | Upstream Flow Test passes |
| 8 | All joins declared in OSAM | OSAM Alignment passes |
| 9 | Format compliance | Per DOCUMENTATION_ERD_DOCTRINE.md |

**Any failure = ERD INVALID = Tables may not be instantiated**

---

## Violation Categories

| Category | Definition | Severity |
|----------|------------|----------|
| `ERD_NO_PRD` | ERD has no governing PRD | CRITICAL |
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
| Extends | ERD_CONSTITUTION.md (Validation Protocols) |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
