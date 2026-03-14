# ADR: Workers Runtime Selection for Orchestrator

## Conformance

| Field | Value |
|-------|-------|
| Doctrine | 2.1.0 |
| CC Layer | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-019 |
| Status | [x] PROPOSED [ ] ACCEPTED [ ] DEPRECATED [ ] SUPERSEDED |
| Date | 2026-03-08 |

---

## Owning Hub

| Field | Value |
|-------|-------|
| Sovereign | imo-creator |
| Hub | UT |
| Hub ID | ut |

---

## CC Layer Scope

| Layer | In Scope |
|-------|----------|
| CC-01 | [ ] |
| CC-02 | [x] |
| CC-03 | [x] |
| CC-04 | [ ] |

---

## IMO Layer Scope

| Layer | In Scope |
|-------|----------|
| I (Ingress) | [ ] |
| M (Middle) | [x] |
| O (Egress) | [ ] |

---

## Context

Sub-hub 19 (orchestrator) owns the 7-gate funnel that governs the UT monitoring workflow. Gates: (1) Fetch, (2) Parse, (3) Validate, (4) Diff, (5) Classify, (6) Route, (7) Store. Each gate is pass/fail — failure at any gate halts the pipeline for that item. The orchestrator must coordinate service bindings across UT sub-hubs 16-19 within the CF Native execution surface.

---

## Decision

Workers Runtime chosen for native CF orchestration. Temporal rejected — external, massive overhead. Step Functions rejected — AWS. Custom queue-based considered but Workers Runtime provides direct service bindings for gate coordination.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Temporal | External dependency — massive overhead for CF-native workflow |
| Step Functions | AWS — wrong platform, violates CF Native constraint |
| Custom queue-based | Workers Runtime provides direct service bindings for gate coordination — queue indirection adds unnecessary complexity |

---

## Consequences

**Enables:**
- Native CF orchestration with direct service bindings to UT sub-hubs 16-19
- Sequential 7-gate funnel with clear pass/fail semantics per gate
- Per-domain gate result tracking for cycle completion reports
- Error event emission for failed gates with gate-specific context

**Prevents:**
- Long-running orchestration beyond Workers CPU limits (must be event-driven)
- Cross-request state without external storage (Workers are stateless)
- Gate parallelism (gates are strictly sequential by design)

---

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Gate execution is strictly sequential — no gate skipping | Runtime assertion |
| Gate failure halts pipeline for that item | Code path enforcement |
| Cycle completion report emitted for every cycle | Egress contract |
| Per-domain gate results recorded with pass/fail status | Structured logging |

---

## Rollback

No direct alternative exists for CF-native orchestration. If Workers Runtime proves insufficient (e.g., CPU limits exceeded), the orchestrator would need to be decomposed into per-gate Workers with Queues providing the coordination layer. This preserves CF Native status but adds queue-based indirection between gates.

---

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 19-orchestrator |
| Driver | Workers Runtime |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
