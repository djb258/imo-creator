# TAS — Degraded Mode Behavior

**Generated**: 2026-01-28
**Authority**: IMO-Creator (CC-01 Sovereign)
**Status**: AUTHORITATIVE

---

## Purpose

This document defines **what happens when required inputs are missing**. Instead of silent failures or partial execution, the system parks in defined states with explicit reasons.

**Rule**: Never proceed with partial data. Park, report, wait.

---

## 1. Degraded Mode States

| State | Code | Description | Exit Condition |
|-------|------|-------------|----------------|
| PARKED_MISSING_GATE | DMG-01 | CC gate prerequisite missing | Gate artifact provided |
| PARKED_MISSING_SPEC | DMG-02 | REPO_DOMAIN_SPEC.md missing (child repo) | Spec file created |
| PARKED_MISSING_ID | DMG-03 | Required identifier not minted | ID minted |
| PARKED_INCOMPLETE_DATA | DMG-04 | Required fields missing in payload | Fields populated |
| PARKED_VALIDATION_FAIL | DMG-05 | Data fails schema validation | Data corrected |
| HALTED_DOCTRINE_VIOLATION | DMH-01 | Doctrine rule violated | Human intervention |
| HALTED_IMMUTABILITY | DMH-02 | Attempt to modify locked artifact | Human intervention |

---

## 2. CC Gate Degraded Behavior

### 2.1 Missing CC-01 (Sovereignty)

```
STATE: PARKED_MISSING_GATE (DMG-01)

Symptoms:
- No CONSTITUTION.md reference
- No sovereignty declaration
- Hub identity cannot be established

Behavior:
- HALT all descent
- Report: "CC-01 gate not passed. Sovereignty must be declared."
- Park state: WAITING_FOR_SOVEREIGNTY

Exit:
- Create sovereignty declaration
- Reference CONSTITUTION.md
- Re-run admission
```

### 2.2 Missing CC-02 (PRD)

```
STATE: PARKED_MISSING_GATE (DMG-01)

Symptoms:
- No PRD exists
- Hub identity declared but no requirements

Behavior:
- HALT descent to CC-03
- Report: "CC-02 gate not passed. PRD required before ADR."
- Park state: WAITING_FOR_PRD

Exit:
- Create PRD using templates/prd/PRD_HUB.md
- Get PRD approved
- Re-run descent
```

### 2.3 Missing CC-03 (ADR)

```
STATE: PARKED_MISSING_GATE (DMG-01)

Symptoms:
- PRD exists but no ADR for requested work
- Attempting to write code without architectural decision

Behavior:
- HALT descent to CC-04
- Report: "CC-03 gate not passed. ADR required before code."
- Park state: WAITING_FOR_ADR

Exit:
- Create ADR using templates/adr/ADR.md
- Get ADR approved
- Re-run descent
```

---

## 3. Child Repo Degraded Behavior

### 3.1 Missing REPO_DOMAIN_SPEC.md

```
STATE: PARKED_MISSING_SPEC (DMG-02)

Symptoms:
- Child repo detected (not imo-creator)
- doctrine/REPO_DOMAIN_SPEC.md does not exist

Behavior:
- HALT all operations
- Report: "REPO_DOMAIN_SPEC.md is MANDATORY for child repos."
- Park state: WAITING_FOR_DOMAIN_SPEC

Why This Matters:
- Domain meaning cannot be inferred
- Schema interpretations would be guesses
- Tool configurations would be wrong

Exit:
- Create doctrine/REPO_DOMAIN_SPEC.md
- Define domain vocabulary
- Define schema semantics
- Re-run from Phase 1
```

### 3.2 Missing IMO_CONTROL.json

```
STATE: PARKED_MISSING_SPEC (DMG-02)

Symptoms:
- Repository has no IMO_CONTROL.json at root

Behavior:
- HALT all operations
- Report: "IMO_CONTROL.json not found. Cannot determine governance."
- Park state: WAITING_FOR_CONTROL

Exit:
- Copy IMO_CONTROL.json from imo-creator
- Customize for this repo
- Re-run admission
```

---

## 4. Data Degraded Behavior

### 4.1 Missing Unique ID

```
STATE: PARKED_MISSING_ID (DMG-03)

Symptoms:
- Attempting write operation
- unique_id not minted

Behavior:
- REFUSE write
- Report: "Cannot write without unique_id. Spine must exist first."
- Park state: WAITING_FOR_ID

Exit:
- Mint unique_id first
- Attach to payload
- Retry write
```

### 4.2 Missing Process ID

```
STATE: PARKED_MISSING_ID (DMG-03)

Symptoms:
- Execution started
- process_id not assigned

Behavior:
- REFUSE execution
- Report: "Cannot execute without process_id. Each execution needs fresh PID."
- Park state: WAITING_FOR_PID

Exit:
- Generate new process_id
- Attach to execution context
- Retry execution
```

### 4.3 Incomplete Required Fields

```
STATE: PARKED_INCOMPLETE_DATA (DMG-04)

Symptoms:
- Payload missing required fields
- Schema validation would fail

Behavior:
- REFUSE processing
- Report: "Missing required fields: [list fields]"
- Park state: WAITING_FOR_DATA

Exit:
- Populate missing fields
- Re-submit payload
```

---

## 5. Validation Degraded Behavior

### 5.1 Schema Validation Failure

```
STATE: PARKED_VALIDATION_FAIL (DMG-05)

Symptoms:
- Data does not match expected schema
- Types mismatch, constraints violated

Behavior:
- REFUSE processing
- Report: "Schema validation failed: [specific errors]"
- Park state: WAITING_FOR_VALID_DATA

Exit:
- Correct data to match schema
- Re-submit
```

### 5.2 CTB Structure Validation Failure

```
STATE: PARKED_VALIDATION_FAIL (DMG-05)

Symptoms:
- Forbidden folders detected
- Files in wrong CTB branches

Behavior:
- REFUSE commit/merge
- Report: "CTB validation failed: [specific violations]"
- Park state: WAITING_FOR_STRUCTURE_FIX

Exit:
- Move/delete offending files
- Re-run validation
```

---

## 6. HALT States (Human Required)

### 6.1 Doctrine Violation

```
STATE: HALTED_DOCTRINE_VIOLATION (DMH-01)

Symptoms:
- Action would violate doctrine
- No automated resolution possible

Behavior:
- FULL HALT
- Report: "Doctrine violation detected. Human intervention required."
- Park state: HALTED

Exit:
- Human reviews violation
- Human decides resolution
- Human approves continuation
```

### 6.2 Immutability Violation Attempt

```
STATE: HALTED_IMMUTABILITY (DMH-02)

Symptoms:
- Attempt to modify locked file
- Attempt to reorder doctrine

Behavior:
- FULL HALT
- REFUSE modification
- Report: "Immutability violation. Cannot modify locked artifact."
- Park state: HALTED

Exit:
- ADR created for proposed change
- Human approval obtained
- Human makes modification
```

---

## 7. Degraded Mode Response Matrix

| Missing Input | Park State | Action | Exit Condition |
|---------------|------------|--------|----------------|
| Sovereignty | DMG-01 | HALT descent | Declare sovereignty |
| PRD | DMG-01 | HALT at CC-02 | Create PRD |
| ADR | DMG-01 | HALT at CC-03 | Create ADR |
| REPO_DOMAIN_SPEC.md | DMG-02 | HALT all | Create spec |
| IMO_CONTROL.json | DMG-02 | HALT all | Copy from parent |
| unique_id | DMG-03 | REFUSE write | Mint ID |
| process_id | DMG-03 | REFUSE execute | Generate PID |
| Required fields | DMG-04 | REFUSE process | Populate fields |
| Valid data | DMG-05 | REFUSE process | Fix data |
| Doctrine compliance | DMH-01 | FULL HALT | Human decision |
| Locked file | DMH-02 | FULL HALT | Human + ADR |

---

## 8. Why No Silent Partials

**Problem with silent partials:**
- Data appears complete but isn't
- Downstream processes assume success
- Errors cascade invisibly
- Debugging becomes impossible

**Solution:**
- Explicit park states
- Clear error messages
- Known exit conditions
- No ambiguity

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-28 |
| Authority | IMO-Creator (Sovereign) |
| Status | AUTHORITATIVE |
| Change Protocol | ADR + Human Approval |
