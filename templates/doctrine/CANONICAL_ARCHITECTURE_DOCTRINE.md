# Canonical Architecture Doctrine (CTB + CC)

**Doctrine Version**: 1.1.0
**Status**: LOCKED
**Authority**: IMO-Creator
**Change Protocol**: ADR approval required for any modification

---

This doctrine defines the operating physics of all derived systems. All downstream artifacts must derive from and comply with this doctrine. No downstream artifact may introduce concepts not defined herein.

---

## 1. Christmas Tree Backbone (CTB)

CTB is the static structural spine. It defines where components are placed.

### 1.1 Definition

- CTB is a hierarchical node structure representing physical placement of all components.
- All components map to exactly one CTB node.
- CTB nodes are immutable once assigned.

### 1.2 Constraints

- A component exists at one and only one CTB location.
- CTB placement is determined at design time, not runtime.
- CTB restructuring requires explicit ADR approval.

### 1.3 Versioning

- CTB structure is version-locked.
- Version changes require explicit ADR approval and version increment.
- All downstream artifacts must declare which CTB version they conform to.

---

## 2. Canonical Chain (CC)

CC defines positional authority. It is hierarchy, not cardinality.

### 2.1 Locked Layers

| Layer | Name | Definition |
|-------|------|------------|
| CC-01 | Sovereign | Authority anchor. Root of all identity and permission. External to any single bounded context. |
| CC-02 | Hub | Domain ownership. Owns logic, state, and decisions within its declared boundary. |
| CC-03 | Context | Scoped operational slice. Represents a bounded execution context within a hub. |
| CC-04 | Process | Execution instance. Runtime operations within a context. |

### 2.2 Movement Rules

- No lateral movement between CC layers.
- Authority flows downward only: CC-01 → CC-02 → CC-03 → CC-04.
- Data may flow upward for reads; writes require explicit authorization.

### 2.3 Debugging Rule

- Debugging always traverses upward through the CC.
- Begin at CC-04, trace through CC-03, CC-02, to CC-01.
- Root cause analysis terminates at the highest CC layer where the fault originated.

---

## 3. Hub-and-Spoke Geometry

Hub-and-spoke defines authority boundaries and interface contracts.

### 3.1 Hub Rules

- Hubs own authority within their declared boundary.
- Hubs own all logic, state, and decisions.
- Identity mints only at hubs.
- One hub per declared bounded context.

### 3.2 Spoke Rules

- Spokes are interfaces only.
- Spokes are typed as Ingress or Egress.
- Spokes carry data; they contain no logic.
- Spokes do not own state.

### 3.3 Interaction Rules

- No spoke-to-spoke interaction.
- All spoke communication routes through the owning hub.
- Nested hub-and-spoke is permitted within a parent hub's declared boundary.
- Nested hubs operate at CC-03 relative to their parent; they are contexts, not peer sovereigns.

### 3.4 Violation Rule

- Any hub-and-spoke violation is a CC violation.
- CC violations are doctrine violations.
- Doctrine violations halt promotion.

---

## 4. Constants vs Variables

Constants and variables are categorically distinct.

### 4.1 Constants

- Constants define meaning and structure.
- Constants are ADR-gated to change.
- Constants are immutable at runtime.
- CC-01 and CC-02 artifacts are constants unless explicitly declared otherwise.

### 4.2 Variables

- Variables tune behavior.
- Variables are changed via configuration or process-scoped execution.
- Variables are mutable at runtime within authorized bounds.
- CC-04 artifacts are variables unless explicitly declared otherwise.

### 4.3 Inversion Rule

- Variables may never redefine constants.
- A variable cannot alter the meaning or structure defined by a constant.
- Attempted inversion is a doctrine violation.

---

## 5. Process ID (PID) Doctrine

PID represents an execution instance. Nothing more.

### 5.1 Definition

- A PID is a unique identifier for a single execution instance.
- PIDs operate exclusively at CC-04.
- PIDs are minted per execution.

### 5.2 PID Contents

A PID must carry:

- Executor identity (abstract reference to the executing agent)
- Version identifier
- Timestamp of mint

### 5.3 PID Rules

- PIDs are never reused.
- PIDs are never promoted to higher CC layers.
- Retries require a new PID.
- Recovery operations require a new PID.
- PID reuse is a doctrine violation.

### 5.4 PID Permissions

- A PID may read any CC layer.
- A PID may write only where explicitly authorized by the Authorization Matrix.

---

## 6. Authorization Matrix

The Authorization Matrix defines which CC layers may write to others.

### 6.1 Write Permissions

| Source | Target | Permission |
|--------|--------|------------|
| CC-01 | CC-01 | Permitted (authorized sovereign-level process only) |
| CC-01 | CC-02 | Permitted |
| CC-01 | CC-03 | Permitted |
| CC-01 | CC-04 | Permitted |
| CC-02 | CC-01 | Denied |
| CC-02 | CC-02 | Permitted (within same declared boundary) |
| CC-02 | CC-03 | Permitted (within owned contexts) |
| CC-02 | CC-04 | Permitted (within owned contexts) |
| CC-03 | CC-01 | Denied |
| CC-03 | CC-02 | Denied |
| CC-03 | CC-03 | Permitted (within same context) |
| CC-03 | CC-04 | Permitted (within same context) |
| CC-04 | CC-01 | Denied |
| CC-04 | CC-02 | Denied |
| CC-04 | CC-03 | Denied (read-only) |
| CC-04 | CC-04 | Permitted (within same PID scope) |

### 6.2 Sovereign Mutation Rule

Only an authorized sovereign-level process may mutate CC-01. Authorization must be declared externally to the system being mutated.

### 6.3 Enforcement

- Unauthorized writes are invalid by doctrine.
- Invalid writes must be rejected at the boundary.
- Rejected writes must be logged to the Master Error Log.

---

## 7. Context Promotion Rules

Promotion changes context. It does not change sovereign identity.

### 7.1 Definition

- Promotion is the elevation of an artifact or state from one context to another.
- Promotion moves through CC-03 boundaries.

### 7.2 Promotion Constraints

- No PID reuse across promotions.
- Promoted artifacts receive a new PID in the target context.
- No new sovereigns may be created during promotion.
- Sovereign identity (CC-01) is immutable during promotion.

### 7.3 Promotion Validity

- Promotion is valid only if:
  - Source context authorizes egress.
  - Target context authorizes ingress.
  - No CC violations occur during transfer.

---

## 8. Lifecycle States

Lifecycle states define the minimal allowed states per CC-03 context.

### 8.1 Canonical States

| State | Definition |
|-------|------------|
| DRAFT | Initial state. Not yet validated. |
| ACTIVE | Validated and operational. |
| SUSPENDED | Temporarily halted. May resume. |
| TERMINATED | Permanently ended. Immutable. |

### 8.2 Allowed Transitions

| From | To | Trigger Authority |
|------|----|-------------------|
| DRAFT | ACTIVE | CC-02 (Hub) |
| DRAFT | TERMINATED | CC-02 (Hub) |
| ACTIVE | SUSPENDED | CC-02 (Hub) or CC-01 (Sovereign) |
| ACTIVE | TERMINATED | CC-02 (Hub) or CC-01 (Sovereign) |
| SUSPENDED | ACTIVE | CC-02 (Hub) or CC-01 (Sovereign) |
| SUSPENDED | TERMINATED | CC-02 (Hub) or CC-01 (Sovereign) |
| TERMINATED | (none) | Transition prohibited |

### 8.3 Transition Rules

- Only explicitly defined transitions are permitted.
- Transitions require authorization from the specified trigger authority.
- Unauthorized transitions are doctrine violations.

---

## 9. Master Error Log

The Master Error Log is the single authoritative record of doctrine violations.

### 9.1 Definition

- One Master Error Log exists per sovereign (CC-01).
- All doctrine violations within the sovereign's domain must be recorded.

### 9.2 Required Fields

Each error entry must contain:

- Timestamp
- PID (if applicable)
- CC layer where violation occurred
- Violation type
- Source component (CTB node)
- Description

### 9.3 Error Categories

| Category | Definition |
|----------|------------|
| CC_VIOLATION | Unauthorized CC layer interaction |
| CTB_VIOLATION | Invalid CTB placement or movement |
| HUB_SPOKE_VIOLATION | Logic in spoke or spoke-to-spoke communication |
| PID_VIOLATION | PID reuse or invalid PID operation |
| AUTH_VIOLATION | Unauthorized write attempt |
| STATE_VIOLATION | Invalid lifecycle state transition |
| CONSTANT_VIOLATION | Variable attempted to redefine constant |

### 9.4 Immutability

- Error log entries are append-only.
- Entries may not be modified or deleted.
- Log integrity must be verifiable.

---

## 10. Sovereign Creation

Sovereigns (CC-01 entities) are created outside normal system operation.

### 10.1 Creation Rules

- Sovereign creation requires explicit external authorization.
- Sovereign creation is not a runtime operation.
- Each sovereign must have a unique, immutable identity.
- Sovereign identity must be declared before any derived artifacts exist.

### 10.2 Sovereign Scope

- A sovereign may govern one or more hubs.
- A hub belongs to exactly one sovereign.
- Sovereign boundaries must be explicitly declared and immutable.

---

## 11. Boundary Declaration

All boundaries must be explicitly declared.

### 11.1 Required Declarations

Every derived system must declare:

- Its governing sovereign (CC-01 reference)
- Its hub identity (CC-02 reference)
- Its CTB placement
- Doctrine version conformance
- CTB version conformance

### 11.2 Boundary Enforcement

- Undeclared boundaries default to denied.
- Cross-boundary operations require explicit authorization from both boundaries.
- Boundary declarations are constants; they require ADR approval to change.

---

## Global Rules

### Doctrine Authority

1. This doctrine is version-locked.
2. Downstream artifacts reference this doctrine; they may not redefine it.
3. Any doctrine change requires ADR approval and a version increment.
4. No downstream artifact may introduce concepts not defined in this doctrine.

### Violation Handling

1. Doctrine violations halt promotion.
2. Violations must be logged to the Master Error Log.
3. Violations must be resolved before the system may proceed.

### Conformance Declaration

All derived systems must declare:

- Doctrine version they conform to
- CTB version they conform to
- CC layer at which they operate
- Governing sovereign identity

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2025-01-05 |
| Last Modified | 2025-01-05 |
| Doctrine Version | 1.1.0 |
| CTB Version | 1.0.0 |
| Status | LOCKED |
| Change Protocol | ADR-triggered only |
