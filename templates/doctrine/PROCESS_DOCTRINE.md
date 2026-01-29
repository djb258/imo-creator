# Process Doctrine

**Status**: LOCKED
**Authority**: CONSTITUTIONAL (Derived from CONSTITUTION.md)
**Version**: 1.0.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## Derivation

This document is a **derived execution layer** from the supreme Transformation Law declared in `CONSTITUTION.md`:

> Nothing may exist unless it transforms declared constants into declared variables.

A Process is the **execution declaration** — it describes HOW a constitutionally approved transformation is carried out.

---

## The Process Validity Principle

A Process is valid if and only if it can be summarized as:

> **"This process executes the transformation of X constants into Y variables."**

If a Process cannot be reduced to this statement, it is invalid.

---

## What a Process Is

A Process is a declared execution of a CONST → VAR transformation that has already been approved via PRD and ERD.

| Attribute | Definition |
|-----------|------------|
| **Identity** | Named execution of a specific transformation |
| **Inputs** | Constants declared in the governing PRD |
| **Outputs** | Variables declared in the governing PRD |
| **Sequence** | Ordered passes (CAPTURE → COMPUTE → GOVERN) |
| **Scope** | Bounded by PRD scope declaration |

---

## What a Process Is NOT

Processes have strict boundaries. They do not:

| Boundary | Explanation |
|----------|-------------|
| **Define legitimacy** | Legitimacy is established by PRD + ERD approval |
| **Introduce new constants** | All constants must be declared in the PRD |
| **Introduce new variables** | All variables must be declared in the PRD |
| **Depend on specific tools** | Tools implement processes; they do not define them |
| **Create structural artifacts** | Structural artifacts are governed by ERD |
| **Bypass ERD validation** | No table may exist without ERD approval |

**A Process executes. It does not authorize.**

---

## Mandatory Process Declaration

Every Process MUST declare:

### 1. Constants (Inputs)

| Field | Required | Description |
|-------|----------|-------------|
| **Constant Name** | YES | Identifier matching PRD declaration |
| **Source** | YES | Where the constant originates |
| **Type** | YES | Data type or structure |

### 2. Variables (Outputs)

| Field | Required | Description |
|-------|----------|-------------|
| **Variable Name** | YES | Identifier matching PRD declaration |
| **Destination** | YES | Where the variable is emitted |
| **Type** | YES | Data type or structure |

### 3. Pass Sequence

Every Process must declare its pass sequence in order:

| Pass | IMO Layer | Role |
|------|-----------|------|
| **CAPTURE** | I (Ingress) | Receive constants from external sources |
| **COMPUTE** | M (Middle) | Transform constants into variables |
| **GOVERN** | O (Egress) | Emit governed variables |

Pass sequence is fixed: CAPTURE → COMPUTE → GOVERN. A Process may omit passes only if the PRD explicitly declares them out of scope.

---

## Process-to-Tool Relationship

Tools implement processes. Tools do not define processes.

| Statement | Validity |
|-----------|----------|
| "This tool executes Process X" | VALID — Tool serves Process |
| "This process uses Tool Y" | VALID — Process declares tool dependency |
| "This tool defines Process X" | INVALID — Tools do not define |
| "This process requires Tool Y" | INVALID — Processes must be tool-agnostic |

**Tools are explicitly downstream and replaceable.** A Process must remain valid regardless of which tool implements it.

---

## Process Hierarchy

```
CONSTITUTION
    │
    ▼
PRD (Behavioral Proof)
    │ Declares: WHY, WHAT constants, WHAT variables, WHAT passes
    ▼
ERD (Structural Proof)
    │ Proves: WHAT tables may exist, validates via Pressure + Flow tests
    ▼
PROCESS (Execution Declaration)
    │ Declares: HOW transformation executes, pass sequence, I/O binding
    ▼
TOOL (Implementation)
    │ Implements: Process execution via specific technology
    │ NOTE: Tools are downstream, replaceable, not authoritative
```

**No layer may bypass its upstream. Process cannot exist without ERD approval. ERD cannot exist without PRD approval.**

---

## Process Declaration Template

```
PROCESS: [PROCESS_NAME]
═══════════════════════════════════════════════════════════════

GOVERNING PRD: [PRD reference]
GOVERNING ERD: [ERD reference]

TRANSFORMATION SUMMARY:
"This process executes the transformation of [CONSTANTS] into [VARIABLES]."

CONSTANTS (INPUTS):
┌─────────────────┬─────────────────┬─────────────────┐
│ Constant        │ Source          │ Type            │
├─────────────────┼─────────────────┼─────────────────┤
│ [NAME]          │ [SOURCE]        │ [TYPE]          │
└─────────────────┴─────────────────┴─────────────────┘

VARIABLES (OUTPUTS):
┌─────────────────┬─────────────────┬─────────────────┐
│ Variable        │ Destination     │ Type            │
├─────────────────┼─────────────────┼─────────────────┤
│ [NAME]          │ [DESTINATION]   │ [TYPE]          │
└─────────────────┴─────────────────┴─────────────────┘

PASS SEQUENCE:
1. CAPTURE (I): [Description of ingress]
2. COMPUTE (M): [Description of transformation]
3. GOVERN (O): [Description of egress rules]

TOOL BINDING (OPTIONAL):
- [Tool name]: [Which pass it implements]

PROCESS VALIDITY: [VALID | INVALID]
```

---

## What This Doctrine Does NOT Govern

This doctrine governs process declaration only. The following are explicitly out of scope:

| Out of Scope | Governance |
|--------------|------------|
| Runtime behavior | Local policy |
| Error handling | Local policy |
| Retry logic | Local policy |
| Performance | Local policy |
| Tool selection | Local policy |
| Tool configuration | Local policy |
| Logging | Local policy |
| Monitoring | Local policy |

**Process Doctrine defines WHAT is executed. Local policy defines HOW it behaves at runtime.**

---

## Validation Criteria

Before a Process is approved, verify:

| # | Check | Pass Condition |
|---|-------|----------------|
| 1 | Transformation statement exists | Can summarize as "executes transformation of X into Y" |
| 2 | PRD reference valid | Governing PRD exists and is approved |
| 3 | ERD reference valid | Governing ERD exists and is approved |
| 4 | Constants match PRD | All inputs declared in PRD |
| 5 | Variables match PRD | All outputs declared in PRD |
| 6 | Pass sequence declared | CAPTURE/COMPUTE/GOVERN order explicit |
| 7 | Tool-agnostic | Process remains valid without specific tool |

**Any failure = Process INVALID**

---

## Violation Categories

| Category | Definition | Severity |
|----------|------------|----------|
| `PROCESS_NO_PRD` | Process has no governing PRD | CRITICAL |
| `PROCESS_NO_ERD` | Process has no governing ERD | CRITICAL |
| `PROCESS_UNDECLARED_CONST` | Process uses constant not in PRD | CRITICAL |
| `PROCESS_UNDECLARED_VAR` | Process produces variable not in PRD | CRITICAL |
| `PROCESS_NO_SEQUENCE` | Process has no declared pass sequence | CRITICAL |
| `PROCESS_TOOL_DEPENDENT` | Process requires specific tool to be valid | CRITICAL |

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
| Upstream | PRD_CONSTITUTION.md, ERD_CONSTITUTION.md |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
