# ADR: Workers Runtime Selection for Runtime

## Conformance

| Field | Value |
|-------|-------|
| Doctrine | 2.1.0 |
| CC Layer | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-010 |
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

The UT hub requires a core execution runtime to manage Worker lifecycle, environment bindings, and service-to-service communication within Cloudflare. This sub-hub is the execution surface for all CF-native sub-hubs.

---

## Decision

Workers Runtime chosen as native CF compute layer. AWS Lambda rejected — external, cold starts. Deno Deploy considered but lacks CF service bindings.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| AWS Lambda | External platform, cold starts |
| Deno Deploy | No CF service bindings |

---

## Consequences

**Enables:**
- Unified compute execution for all CF-native sub-hubs
- Environment bindings for configuration and secrets
- Service bindings for inter-sub-hub communication
- Worker lifecycle management and performance metrics

**Prevents:**
- External compute dependencies
- Cold start latency (Workers run on V8 isolates)
- Unmanaged service-to-service communication

---

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Worker invocation rate bounded by CF plan limits | CC-03 |
| 30s per Worker invocation (CF default) | CC-03 |
| Disable non-critical Workers on CPU time threshold breach | CC-03 |

---

## Rollback

No rollback path — Workers Runtime is the foundational compute layer for all CF-native sub-hubs. Removing it would require migrating the entire platform off Cloudflare, which constitutes a full architecture change requiring a separate ADR.

---

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 10-runtime |
| Driver | Workers Runtime |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
