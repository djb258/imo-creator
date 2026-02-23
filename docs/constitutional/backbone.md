# CTB Backbone Authority — Parent Governance

**Authority**: IMO-Creator (Sovereign)
**Scope**: All child repos in the fleet
**Status**: CONSTITUTIONAL

---

## 1. Repo-of-Repos Authority

IMO-Creator is the governing parent repository. All structural law originates here.

| Rule | Enforcement |
|------|-------------|
| IMO-Creator governs structure of all child repos | ABSOLUTE |
| Child repos may not redefine CTB backbone | PROHIBITED |
| Child repos inherit altitude hierarchy | MANDATORY |
| Child repos inherit isolation doctrine | MANDATORY |

Child repos CONFORM to this repository. They do not contribute to it. Any structural change to parent governance requires ADR submission and human approval within this repository.

---

## 2. CTB Backbone Authority (Global)

The following are ecosystem-level structural primitives. They are defined here and inherited by all child repos. No child repo may redefine, extend, or override these primitives.

| Primitive | Definition |
|-----------|------------|
| Cantonal pattern | Each sub-hub owns exactly 1 CANONICAL + 1 ERROR table (ADR-001) |
| ERROR pattern | Structured error capture per sub-hub, co-located with CANONICAL table |
| Sovereign ID minting doctrine | Identity minting occurs at hub level only, governed by registry |
| Registry-first enforcement | All tables must exist in `ctb.table_registry` before creation (event trigger enforced) |
| No sideways hub-to-hub relationships | Hubs are isolated. No direct hub ↔ hub data flow. All cross-hub communication routes through spokes |
| Subhive isolation | Sub-hubs within a hub are isolated units. No direct sub-hub ↔ sub-hub data sharing without explicit spoke wiring |

### Redefinition Prohibition

These primitives are constitutional. Child repos:

- MUST apply them as written
- MUST NOT reinterpret their meaning
- MUST NOT extend them with local exceptions
- MUST NOT create alternative patterns that circumvent them

Violation of any backbone primitive is a constitutional violation requiring immediate remediation.

---

## 3. Altitude Hierarchy (Immutable Across Ecosystem)

The altitude hierarchy defines the descent model for all structural decisions. It is immutable and applies identically to every repo in the fleet.

| Altitude | Name | Governs |
|----------|------|---------|
| 50k | Identity | What exists — hub boundaries, sovereign identity, fleet membership |
| 40k | Topology | How things connect — hub-spoke geometry, spoke typing, cross-hub routing |
| 30k | Responsibility | Who owns what — sub-hub boundaries, table ownership, CTB branch placement |
| 20k | IMO containment | How data flows — ingress/middle/egress within hubs, transformation paths |
| 10k | Interfaces | What is exposed — API contracts, spoke interfaces, schema surfaces |
| 5k | Execution | How it runs — implementation code, runtime config, deployment mechanics |

### Descent Rule

No artifact at altitude N may be created until all artifacts at altitude N+10k are resolved. This is the CC descent gate model applied to altitude.

### Child Repo Obligation

Child repos must operate within this hierarchy. Local policy decisions (language, framework, test strategy) exist at 5k only. All structural decisions at 10k and above are governed by parent doctrine.

---

## 4. Architectural Elevation Trigger (Global)

Any child repo change affecting the following requires architectural elevation to parent level:

| Trigger | Scope |
|---------|-------|
| Backbone structure | CTB branch additions, removals, or redefinitions |
| Cantonal schema pattern | Table cardinality changes, CANONICAL/ERROR pattern modifications |
| Sovereign ID minting pattern | Identity minting logic, registry key generation |
| ERROR enforcement model | Error table structure, error capture flow |
| Altitude model | Descent gate modifications, altitude reassignment |
| Cross-subhive relationships | New data paths between isolated sub-hubs |

### Elevation Protocol

When a trigger is hit:

```
architectural_flag = true
manual_approval  = required
approval_level   = parent_repo (imo-creator)
```

### Required Actions

| Step | Action | Authority |
|------|--------|-----------|
| 1 | Child repo identifies trigger | Child repo team |
| 2 | ADR drafted in child repo | Child repo team |
| 3 | ADR submitted to imo-creator for review | Human |
| 4 | Parent reviews and approves/rejects | Human (parent level) |
| 5 | If approved, parent doctrine updated first | Human (parent level) |
| 6 | Child repo conforms to updated doctrine | Child repo team |

Execution MUST halt at the trigger point until elevation is resolved. No autonomous architecture modification is permitted.

---

## 5. Feature vs Architectural Classification

To eliminate interpretation drift, the following classification rule is constitutional.

### Architectural Change

A change is classified as **Architectural** if it:

- Modifies any protected model
- Alters CTB backbone primitives
- Changes altitude hierarchy
- Modifies Cantonal or ERROR structural pattern
- Alters Sovereign ID minting doctrine
- Introduces cross-subhive relationships
- Changes registry enforcement model

Architectural changes require:

```
architectural_flag = true
parent_approval    = required
execution          = HALTED
```

### Feature Change

A change is classified as **Feature** if it:

- Operates strictly within existing CTB backbone
- Does not modify protected models
- Does not alter altitude hierarchy
- Does not introduce cross-subhive relationships
- Exists at 10k (Interface) or 5k (Execution) altitude only

Feature changes may proceed through normal WORK_PACKET → CHANGESET → AUDIT flow without architectural elevation.

Reclassification of an architectural change as a feature is prohibited.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-02-23 |
| Authority | IMO-Creator (Sovereign) |
| Status | CONSTITUTIONAL |
| Phase | V1 Control Plane — Phase 1 Constitutional Freeze |
