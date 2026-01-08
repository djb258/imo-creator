# Hub & Spoke Architecture Doctrine

**Defines the geometry of authority and interface contracts.**

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 1.2.0 |
| **Authority** | Canonical Architecture Doctrine |
| **CC Layers** | CC-02 (Hub), CC-03 (Context/Spoke) |
| **Last Modified** | 2026-01-08 |

---

## Overview

This document defines the **Hub & Spoke geometry** for all systems derived from this doctrine.

> **If any instruction conflicts with the Canonical Architecture Doctrine, the Canonical Doctrine wins.**

---

## 1. Core Definitions

### Hub (CC-02)

A **Hub is an application** that owns authority within its declared boundary.

- A hub owns:
  - Logic
  - Decisions
  - State
  - CTB placement
  - Full IMO flow
- A hub operates at **CC-02** in the Canonical Chain.
- A bounded context MUST contain **exactly one hub**.
- Hubs mint identities; spokes do not.

### Spoke (CC-03 Interface)

A **Spoke is an interface** that carries data between boundaries.

- A spoke is typed as:
  - **I (Ingress)** — data entering a hub
  - **O (Egress)** — data leaving a hub
- A spoke:
  - Owns NO logic
  - Owns NO state
  - Owns NO tools
- Spokes operate as **CC-03 interfaces**.
- There is **no such thing as a Middle spoke**.

### Golden Rule

> **Logic lives only inside hubs.**
> **Spokes only carry data.**

---

## 2. CC Layer Mapping

| Component | CC Layer | Role |
|-----------|----------|------|
| Hub | CC-02 | Domain ownership, logic, state, decisions |
| Spoke (I) | CC-03 | Ingress interface, data entry |
| Spoke (O) | CC-03 | Egress interface, data exit |
| Nested Hub | CC-03 | Context within parent hub |
| Process | CC-04 | Execution instance within hub |

---

## 3. IMO Model (Inside Hubs Only)

IMO layers exist **only inside hubs**. Spokes are external interfaces.

### I — Ingress

- Data entry point
- May validate schema and shape
- MUST NOT make decisions
- MUST NOT mutate business state

### M — Middle

- All logic
- All decisions
- All transformations
- All state ownership
- All tool invocations

### O — Egress

- Outputs and exports
- Read-only views
- Downstream signals
- MUST NOT contain logic

---

## 4. CTB — Christmas Tree Backbone

CTB defines **where things live** (placement), not how they execute.

Every hub MUST declare:

- **Trunk** (system category)
- **Branch** (domain)
- **Leaf** (capability)

CTB is **structural** and maps to CC-02 boundaries.

### CTB Branch Reference

**Canonical CTB branches are defined in CANONICAL_ARCHITECTURE_DOCTRINE.md section 1.3.**

This document does not redefine them. The canonical branches are:
- `sys/` — System infrastructure
- `data/` — Data layer
- `app/` — Application logic
- `ai/` — AI components
- `ui/` — User interface

Note: `docs/`, `ops/`, `config/`, `scripts/` are **support folders**, not CTB branches.

---

## 5. Required Identifiers

Every hub MUST have:

| Identifier | CC Layer | Description |
|------------|----------|-------------|
| **Sovereign ID** | CC-01 | Reference to governing sovereign |
| **Hub ID** | CC-02 | Unique, immutable hub identifier |
| **Process ID** | CC-04 | Execution/trace ID (minted per run) |

These identifiers:

- Are assigned at creation
- Never change
- Are referenced in all PRDs, ADRs, and PRs
- Enable traceability across the system

---

## 6. Hub Creation Protocol

1. Declare sovereign reference (CC-01)
2. Define the hub identity (CC-02)
3. Assign Hub ID
4. Write Hub PRD
5. Define CTB placement
6. Define full IMO internally
7. Define I/O spokes
8. Create ADRs for decisions (CC-03)
9. Implement code (CC-04)
10. Validate with compliance checklist

---

## 7. Hard Violations

If ANY of the following occur, STOP and flag the issue:

| Violation | Type |
|-----------|------|
| Logic exists in a spoke | HUB_SPOKE_VIOLATION |
| Cross-hub state sharing | CC_VIOLATION |
| Spoke making decisions | HUB_SPOKE_VIOLATION |
| Tools spanning hubs | CC_VIOLATION |
| Missing Hub ID or Sovereign reference | CTB_VIOLATION |
| Bounded context with multiple hubs | CC_VIOLATION |
| Architecture introduced in a PR | CC_VIOLATION |

These are **doctrine violations**, not preferences.

---

## 8. Nested Hub-and-Spoke

Nested hub-and-spoke is permitted within a parent hub's boundary.

- Nested hubs operate at **CC-03** relative to their parent.
- Nested hubs are contexts, not peer sovereigns.
- The parent hub retains ultimate authority.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| CC Descent Protocol | ALTITUDE_DESCENT_MODEL.md |
