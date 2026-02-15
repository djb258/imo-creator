# ADR: Sub-Hub Table Cardinality Constraint

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | ARCHITECTURE.md v2.0.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-001 |
| **Status** | [ ] Proposed / [x] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-02-15 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | imo-creator |
| **Hub Name** | IMO-Creator (Sovereign) |
| **Hub ID** | CC-01 |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | Adds constitutional invariant to ARCHITECTURE.md |
| CC-02 (Hub) | [x] | All hubs must conform to new cardinality rule |
| CC-03 (Context) | [x] | Sub-hub data ownership now has structural bound |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [ ] |
| M — Middle | [x] |
| O — Egress | [ ] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Constant (structure/meaning) |
| **Mutability** | [x] Immutable |

---

## Context

ARCHITECTURE.md Part X §3 defines data ownership rules:

- **OWN-09**: Tables owned by exactly one hub
- **OWN-10**: Tables owned by exactly one sub-hub (CC-03)
- **OWN-11**: Cross-lane joins forbidden unless declared

CTB_GOVERNANCE.md §2 defines leaf types (CANONICAL, ERROR, STAGING, MV, REGISTRY, etc.) and states error tables have mandatory discriminator columns.

**The gap**: Doctrine defines *what types* of tables exist and *that* each table belongs to one sub-hub, but never defines *how many* tables a sub-hub gets. There is no cardinality constraint binding leaf types to sub-hub geometry.

**How this was discovered**: A child repo's AI agent was instructed to research this rule in doctrine. It searched every doctrine file, template, config, and archive — and correctly found nothing. The rule was being applied as convention but had no constitutional basis.

A rule that is enforced but not written down is not a rule. It's a liability.

---

## Decision

Add a sub-hub table cardinality constraint to ARCHITECTURE.md Part X §3 — Data Ownership.

Each sub-hub receives exactly **two** tables at the leaf level:

| Table | Leaf Type | Purpose |
|-------|-----------|---------|
| Canonical table | CANONICAL | Primary data for the sub-hub's domain |
| Error table | ERROR | Error/rejection tracking for the sub-hub's domain |

New OWN rules to add after OWN-10:

| ID | Constraint |
|----|------------|
| OWN-10a | Each sub-hub has exactly one CANONICAL table |
| OWN-10b | Each sub-hub has exactly one ERROR table |
| OWN-10c | Additional table types (STAGING, MV, REGISTRY) require ADR justification |

**Why**: Sub-hub geometry without table cardinality is incomplete. If OWN-10 says a table belongs to exactly one sub-hub, the inverse must also be declared — what tables a sub-hub is entitled to. Without this, child repos either guess or invent local conventions that drift across the fleet.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Unlimited tables per sub-hub | Allows table sprawl, violates structural minimalism, makes drift detection harder |
| One table per sub-hub (canonical only) | Error tracking is a universal concern — forcing it into the canonical table pollutes the primary domain |
| Do Nothing | Convention without doctrine is a liability. Child repos cannot look up a rule that doesn't exist. |

---

## Consequences

### Enables

- Child repo AI agents can find and enforce the rule from doctrine
- Drift detection can flag sub-hubs with missing error tables or excess tables
- Consistent table geometry across all derived systems
- DBA enforcement (Gate B) can validate cardinality, not just ownership

### Prevents

- Table sprawl at sub-hub level without ADR justification
- Invisible conventions that only exist in human memory
- Child repos inventing incompatible local cardinality rules

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [ ] Yes / [x] No |
| **PID pattern change** | [ ] Yes / [x] No |
| **Audit trail impact** | None — structural constraint, not execution change |

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Cardinality | Exactly 1 CANONICAL + 1 ERROR per sub-hub | CC-03 |
| Escape hatch | Additional table types require ADR | CC-03 |
| Enforcement | DBA Gate B checks table count per sub-hub | CC-04 |

---

## Rollback

Remove OWN-10a, OWN-10b, OWN-10c from ARCHITECTURE.md Part X §3. Revert version. No downstream data impact — this is a structural constraint, not a schema migration.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md Part X §3 — Data Ownership |
| Supporting Doctrine | CTB_GOVERNANCE.md §2 — Leaf Type Classification |
| Supporting Doctrine | DBA_ENFORCEMENT_DOCTRINE.md — Gate B |
| PRD | N/A — Constitutional amendment |
| Work Items | Downstream version sync required after acceptance |
| PR(s) | Pending |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | | |
| Reviewer | | |
