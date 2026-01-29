# PRD Constitution

**Status**: LOCKED
**Authority**: CONSTITUTIONAL (Derived from CONSTITUTION.md)
**Version**: 1.0.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## Derivation

This document is a **derived proof** from the supreme Transformation Law declared in `CONSTITUTION.md`:

> Nothing may exist unless it transforms declared constants into declared variables.

The PRD is the **behavioral proof** — it explains WHY and HOW the transformation occurs.

---

## The PRD Validity Test

A PRD is valid if and only if it can be summarized as:

> **"This system transforms X constants into Y variables."**

If a PRD cannot be reduced to this statement, it is invalid and the system it describes may not exist.

---

## Mandatory Declarations

Every PRD MUST explicitly declare:

### 1. Transformation Purpose

| Field | Required | Description |
|-------|----------|-------------|
| **Why this system exists** | YES | The problem being solved by transformation |
| **What constants are assumed** | YES | Inputs that are immutable within this system's scope |
| **What variables are produced** | YES | Outputs that this system generates/mutates |

### 2. Pass Structure

Every transformation occurs through **passes**. Each pass MUST be declared:

| Pass Type | Definition | Example |
|-----------|------------|---------|
| **Capture** | Ingesting constants from external sources | API fetch, file read, user input |
| **Compute** | Transforming constants into variables | Calculation, enrichment, validation |
| **Govern** | Enforcing rules on variable output | Authorization, rate limiting, formatting |

A PRD MUST declare which passes exist and in what order.

### 3. Scope Boundary

| Field | Required | Description |
|-------|----------|-------------|
| **What is IN scope** | YES | Explicit list of transformations owned |
| **What is OUT of scope** | YES | Explicit list of what this system does NOT do |

**Ambiguous scope = Invalid PRD**

---

## PRD Structural Requirements

Every PRD MUST contain these sections (aligned with `templates/prd/PRD_HUB.md`):

| Section | Constitutional Purpose |
|---------|----------------------|
| Sovereign Reference (CC-01) | Declares authority constant |
| Hub Identity (CC-02) | Declares identity constant |
| Purpose | States transformation goal |
| Constants vs Variables | Explicit declaration of CONST → VAR |
| IMO Structure | Declares pass sequence (Ingress=Capture, Middle=Compute, Egress=Govern) |
| Spokes | Declares interface constants |
| Tools | Declares transformation mechanisms |

---

## Pass-to-IMO Mapping

The three pass types map directly to IMO layers:

| Pass | IMO Layer | Role |
|------|-----------|------|
| Capture | **I** (Ingress) | Receive constants |
| Compute | **M** (Middle) | Transform constants → variables |
| Govern | **O** (Egress) | Emit governed variables |

This mapping is mandatory. A PRD that does not follow this mapping is invalid.

---

## Validation Criteria

Before a PRD is approved, verify:

| # | Check | Pass Condition |
|---|-------|----------------|
| 1 | Transformation statement exists | Can summarize as "transforms X into Y" |
| 2 | Constants declared | At least one input constant listed |
| 3 | Variables declared | At least one output variable listed |
| 4 | Passes defined | Capture/Compute/Govern sequence clear |
| 5 | Scope explicit | IN scope and OUT of scope both stated |
| 6 | IMO alignment | Passes map to I/M/O layers |

**Any failure = PRD INVALID = System may not be instantiated**

---

## Relationship to ERD

The PRD declares **what transformation occurs**.
The ERD proves **what structures are allowed to exist** to support that transformation.

| Proof | Question Answered |
|-------|-------------------|
| PRD | WHY does this exist? HOW does transformation occur? |
| ERD | WHAT structural artifacts may exist? |

Both proofs are required. Neither is sufficient alone.

---

## Anti-Patterns (Invalid PRDs)

| Pattern | Why Invalid |
|---------|-------------|
| "This system manages X" | No transformation declared |
| "This system stores X" | Storage is not transformation |
| "This system displays X" | Display without compute is not transformation |
| "This system handles X" | Vague; no CONST → VAR |
| PRD without Constants section | Cannot prove transformation without inputs |
| PRD without Variables section | Cannot prove transformation without outputs |

---

## Example: Valid Transformation Statement

**Invalid**: "This system manages customer contacts."

**Valid**: "This system transforms raw contact data (constants: name, email, phone from intake form) into enriched contact records (variables: validated email, normalized phone, lead score) through capture (form submission), compute (validation + enrichment), and govern (deduplication + rate limiting)."

---

## Enforcement

| Violation | Response |
|-----------|----------|
| PRD missing transformation statement | HALT — PRD invalid |
| PRD missing constants declaration | HALT — PRD invalid |
| PRD missing variables declaration | HALT — PRD invalid |
| PRD missing pass structure | HALT — PRD invalid |
| PRD with ambiguous scope | HALT — PRD invalid |
| System instantiated without valid PRD | DOCTRINE VIOLATION |

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
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
