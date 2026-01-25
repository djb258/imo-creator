# Altitude Descent Model

**Governs WHEN and HOW artifacts become legal within the Canonical Chain (CC).**

> Also known as: CC Descent Protocol

---

## What "Altitude" and "Descent" Mean

| Term | Definition |
|------|------------|
| **Altitude** | Position in the CC hierarchy. Higher altitude = higher authority. CC-01 (Sovereign) is the highest; CC-04 (Process) is the lowest. |
| **Descent** | The mandatory sequence of moving from higher to lower CC layers. You must complete each layer before creating artifacts at the next. |

**Metaphor**: Think of building a house. You cannot install plumbing (CC-04) before the walls exist (CC-03), and walls cannot exist before the foundation (CC-02), which cannot exist before the land is surveyed (CC-01). Descent enforces this order.

---

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 1.1.0 |
| **Authority** | Canonical Architecture Doctrine |
| **Status** | LOCKED |

---

## Overview

This protocol defines the mandatory descent sequence through Canonical Chain (CC) layers. Artifacts are created in strict order. No layer may be skipped. No artifact may be created out of sequence.

> **CC is authoritative. This protocol operationalizes CC.**

---

## CC Layer to Artifact Mapping

| CC Layer | Name | Artifacts Legal | Gate Before Descent |
|----------|------|-----------------|---------------------|
| **CC-01** | Sovereign | Sovereign declaration, boundary definition | External authorization |
| **CC-02** | Hub | Hub identity, PRD, CTB placement, IMO definition | CC-01 complete |
| **CC-03** | Context | ADR, process flows, state diagrams, spoke definitions | CC-02 complete |
| **CC-04** | Process | PIDs, execution code, tests, configuration | CC-03 complete |

Descent is **one-way** and **irreversible** within a design cycle.

---

## CC-01 — Sovereign Layer

### Purpose

Establish sovereign identity and declare system boundaries.

### Artifacts Legal

- Sovereign declaration (identity, boundary, authority)
- Downstream hub manifest

### Gate Condition (Before Descending)

- [ ] Sovereign identity assigned (unique, immutable)
- [ ] Sovereign boundary declared
- [ ] External authorization obtained
- [ ] Doctrine version declared

### Forbidden

- Hub definitions
- CTB placement
- Any internal structure
- Any code or configuration

---

## CC-02 — Hub Layer

### Purpose

Define hub identity, structure, and placement within CTB.

### Artifacts Legal

- Hub identity declaration (Hub ID, name, purpose)
- CTB placement (trunk/branch/leaf)
- IMO layer definitions
- Spoke manifest (I/O attachments)
- Hub PRD

### Gate Condition (Before Descending)

- [ ] CC-01 complete (Sovereign declared)
- [ ] Hub ID assigned (unique within sovereign)
- [ ] CTB placement declared
- [ ] IMO layers defined (I/M/O)
- [ ] All spokes declared and typed (I or O)
- [ ] PRD written and approved

### Forbidden

- Process logic
- ADRs (not yet legal)
- Code
- Configuration
- PIDs

---

## CC-03 — Context Layer

### Purpose

Define bounded contexts, decisions, and process architecture.

### Artifacts Legal

- ADR (one per architectural decision)
- Process flow documentation
- State transition definitions
- Interface contracts
- Spoke implementation details

### Gate Condition (Before Descending)

- [ ] CC-02 complete (Hub defined, PRD approved)
- [ ] Key decisions recorded as ADRs
- [ ] Process flows documented
- [ ] Constants vs variables declared

### Forbidden

- Code implementation
- PIDs
- Tests
- Configuration files

---

## CC-04 — Process Layer

### Purpose

Execute approved structure in code.

### Artifacts Legal

- PIDs (minted per execution)
- Code
- Tests
- Configuration files
- Execution logs

### Gate Condition (Before Execution)

- [ ] CC-03 complete (ADRs approved, flows documented)
- [ ] PRD exists and is current
- [ ] All ADRs recorded
- [ ] Compliance checklist passed

### Forbidden

- Structural changes (return to CC-02)
- New spokes (return to CC-02)
- IMO redefinition (return to CC-02)
- CTB reassignment (return to CC-02)
- New ADRs (return to CC-03)

---

## Descent Violations

| Violation | Consequence |
|-----------|-------------|
| Hub defined before sovereign | STOP — return to CC-01 |
| ADR created before PRD | STOP — return to CC-02 |
| Code written before ADR | STOP — return to CC-03 |
| PID minted before code review | REJECT — return to CC-03 |
| Structural change at CC-04 | INVALID — escalate to CC-02 |

---

## Artifact Legality by CC Layer

| Artifact | CC-01 | CC-02 | CC-03 | CC-04 |
|----------|-------|-------|-------|-------|
| Sovereign Declaration | LEGAL | — | — | — |
| Hub Identity | — | LEGAL | — | — |
| CTB Placement | — | LEGAL | — | — |
| PRD | — | LEGAL | — | — |
| IMO Definition | — | LEGAL | — | — |
| Spoke Manifest | — | LEGAL | — | — |
| ADR | — | — | LEGAL | — |
| Process Flow | — | — | LEGAL | — |
| State Diagram | — | — | LEGAL | — |
| PID | — | — | — | LEGAL |
| Code | — | — | — | LEGAL |
| Tests | — | — | — | LEGAL |
| Configuration | — | — | — | LEGAL |

---

## Restart Protocol

If a descent violation is detected:

1. Identify the lowest CC layer that was correctly completed.
2. Delete all artifacts created at or below the violated layer.
3. Resume descent from the last valid gate.
4. Do not preserve "good parts" of invalid work.

> **There is no partial credit.**
> **Structure is either correct or it is not.**

---

## Enforcement

- These rules are **mechanical**, not discretionary.
- Agents must refuse to generate out-of-sequence artifacts.
- Reviewers must reject work that violates descent order.
- Violations must be logged to the Master Error Log.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| Hub/Spoke Geometry | CANONICAL_ARCHITECTURE_DOCTRINE.md §3 |
| CC Layers | CANONICAL_ARCHITECTURE_DOCTRINE.md §2 |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-11 |
| Last Modified | 2026-01-25 |
| Version | 1.2.0 |
| Status | LOCKED |
| Authority | CANONICAL_ARCHITECTURE_DOCTRINE.md |
