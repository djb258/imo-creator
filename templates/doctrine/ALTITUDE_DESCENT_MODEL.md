# Altitude Descent Model

**Governs WHEN and HOW templates become legal.**

This document defines the mandatory descent sequence through altitude levels.
No level may be skipped. No artifact may be created out of sequence.

This file MUST be read and followed by:
- Humans designing hubs
- LLMs generating structure or artifacts
- Any agent proposing architectural change

If any instruction conflicts with other guidance, **this file wins**.

---

## Altitude Levels (Mandatory Order)

| Altitude | Name | Scope |
|----------|------|-------|
| **50k** | Shell | Hub identity + attachment topology |
| **40k** | Decomposition | Hub-as-application breakdown |
| **30k** | CTB Placement | Structural positioning per hub |
| **20k** | IMO Definition | Flow definition per hub |
| **10k** | Process Logic | Internal decisions and state |
| **5k** | Execution | Linear issues, PRs, code |

Descent is **one-way** and **irreversible** within a design cycle.
You may not ascend to fix structural problems — you must restart.

---

## 50k — Shell

### Purpose
Establish hub identity and declare all attachments (spokes, dependencies, boundaries).

### Allowed
- Declare Hub ID
- Declare hub name and purpose (one sentence)
- List all I-type attachments (ingress spokes)
- List all O-type attachments (egress spokes)
- Identify upstream/downstream hub dependencies (if any)

### Forbidden
- CTB placement
- IMO layer definitions
- Any internal structure
- Any code or configuration
- Any diagrams

### Artifacts Legal at This Altitude
- Hub identity declaration (name, ID, one-line purpose)
- Attachment manifest (typed I/O spoke list)

### Gate Condition (Before Descending)
- [ ] Hub ID assigned
- [ ] Hub purpose declared (one sentence, no implementation detail)
- [ ] All I-type attachments listed
- [ ] All O-type attachments listed
- [ ] No orphan attachments (every spoke connects to exactly one hub)

---

## 40k — Hub-as-Application Decomposition

### Purpose
Break down the hub into its application-level components without structural placement.

### Allowed
- Describe what the hub does (application behavior)
- Identify major functional areas (not folders, not code)
- Define boundaries between hub responsibility and spoke responsibility
- Confirm hub owns all logic, spokes own none

### Forbidden
- CTB branch assignment
- IMO layer assignment
- Folder structure
- File names
- Code
- Diagrams

### Artifacts Legal at This Altitude
- Application description (what the hub does, not how)
- Functional area list (logical groupings, not structure)

### Gate Condition (Before Descending)
- [ ] 50k complete (Hub ID, attachments declared)
- [ ] Application behavior described
- [ ] Functional areas identified
- [ ] No logic assigned to spokes
- [ ] No structural decisions made

---

## 30k — CTB Placement

### Purpose
Assign the hub to its CTB position (trunk/branch/leaf).

### Allowed
- Declare CTB trunk (sys, ui, ai, data, ops, docs)
- Declare CTB branch (domain)
- Declare CTB leaf (capability)
- Define folder structure per CTB assignment

### Forbidden
- IMO layer definitions
- Process logic
- Code
- PRDs (not yet legal)
- ADRs (not yet legal)

### Artifacts Legal at This Altitude
- CTB declaration (trunk/branch/leaf)
- Folder structure specification

### Gate Condition (Before Descending)
- [ ] 40k complete (application decomposed)
- [ ] CTB trunk assigned
- [ ] CTB branch assigned
- [ ] CTB leaf assigned
- [ ] Folder structure defined

---

## 20k — IMO Definition

### Purpose
Define the Ingress / Middle / Egress flow for the hub.

### Allowed
- Define I layer (inputs, validation, no logic)
- Define M layer (all logic, all state, all decisions)
- Define O layer (outputs, exports, read-only)
- Map spokes to I or O layers
- Write System PRD (if multi-hub)
- Write Hub Sub-PRD

### Forbidden
- Internal process logic (that's 10k)
- Code
- PRs
- Linear issues

### Artifacts Legal at This Altitude
- PRD (System or Hub Sub-PRD)
- IMO layer specification
- Spoke-to-layer mapping

### Gate Condition (Before Descending)
- [ ] 30k complete (CTB placed)
- [ ] I layer defined
- [ ] M layer defined
- [ ] O layer defined
- [ ] All spokes mapped to I or O
- [ ] PRD written and approved

---

## 10k — Process Logic

### Purpose
Define internal process flows, decision trees, and state management.

### Allowed
- Define process flows within M layer
- Define decision logic
- Define state transitions
- Write ADRs for architectural decisions
- Create architecture diagrams

### Forbidden
- Code implementation
- PRs
- Linear issues
- Test files

### Artifacts Legal at This Altitude
- ADR (one per decision)
- Process flow documentation
- State transition diagrams
- Architecture diagrams

### Gate Condition (Before Descending)
- [ ] 20k complete (IMO defined, PRD approved)
- [ ] Process flows documented
- [ ] Key decisions recorded as ADRs
- [ ] Diagrams created (if needed)

---

## 5k — Execution

### Purpose
Implement the approved structure in code.

### Allowed
- Create Linear issues
- Write PRs
- Write code
- Write tests
- Write configuration
- Complete compliance checklist

### Forbidden
- Structural changes (go back to 30k+)
- New spokes (go back to 50k)
- IMO redefinition (go back to 20k)
- CTB reassignment (go back to 30k)

### Artifacts Legal at This Altitude
- Linear issues
- PRs
- Code
- Tests
- Configuration files
- Compliance checklist (completed)

### Gate Condition (Before Shipping)
- [ ] All higher altitudes complete
- [ ] PRD exists and is approved
- [ ] All ADRs recorded
- [ ] All Linear issues closed
- [ ] All PRs merged
- [ ] Compliance checklist passed

---

## Hard Rules (Non-Negotiable)

### Descent Violations
| Violation | Consequence |
|-----------|-------------|
| Hub descends without declared attachments | STOP — return to 50k |
| IMO defined before CTB | STOP — return to 30k |
| PR created before PRD + ADR | REJECT PR |
| Diagram created before 50k–40k complete | DELETE diagram |
| Code written above 5k | DELETE code |

### Enforcement
- These rules are **mechanical**, not discretionary
- LLMs must refuse to generate out-of-sequence artifacts
- Humans must not approve out-of-sequence work
- Reviewers must reject PRs that violate descent order

---

## Altitude Violation Detection

When reviewing any artifact, check:

| Artifact | Legal At | If Found Earlier |
|----------|----------|------------------|
| Hub ID | 50k+ | N/A (always first) |
| Attachment list | 50k+ | N/A (always first) |
| CTB declaration | 30k+ | Violation if before 50k–40k |
| PRD | 20k+ | Violation if before 30k |
| IMO specification | 20k+ | Violation if before 30k |
| ADR | 10k+ | Violation if before 20k |
| Diagram | 10k+ | Violation if before 40k |
| Linear issue | 5k only | Violation if before 10k |
| PR | 5k only | Violation if before PRD + ADR |
| Code | 5k only | Violation if before 10k |

---

## Restart Protocol

If a violation is detected:

1. Identify the lowest altitude that was correctly completed
2. Delete all artifacts created at or below the violated altitude
3. Resume descent from the last valid gate
4. Do not preserve "good parts" of invalid work

> **There is no partial credit.**
> **Structure is either correct or it is not.**

---

## Final Rule

> **Altitude descent is the law of construction.**
> **Artifacts exist only when earned.**
> **Skipping altitude is not innovation — it is violation.**
