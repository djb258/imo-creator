# ADR: Workers + Hono Selection for Webhook Gateway

## Conformance

| Field | Value |
|-------|-------|
| Doctrine | 2.1.0 |
| CC Layer | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-022 |
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

Sub-hub 22 (webhook-gateway) provides an outbound notification surface for the UT hub. It pushes alerts when monitored content changes, crawls complete, or errors exceed thresholds. The gateway manages webhook subscriptions, payload formatting, delivery retries with exponential backoff, and delivery receipts. It must handle outbound HTTP with retry middleware entirely within the CF Native execution surface.

---

## Decision

Workers + Hono chosen for lightweight outbound HTTP with retry middleware. Dedicated webhook service (e.g., Svix) considered but adds external dependency and cost. Direct HTTP from each sub-hub rejected — violates sub-hub sovereignty (each would need webhook logic). Workers Queues for delivery considered but doesn't handle HTTP callbacks natively.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Svix | External dependency — added cost, violates CF Native constraint |
| Per-sub-hub webhooks | Sovereignty violation — duplicated webhook logic across sub-hubs |
| Workers Queues only | No HTTP callback handling — cannot deliver outbound POST requests natively |

---

## Consequences

**Enables:**
- Centralized outbound notification with signed payloads (HMAC-SHA256)
- Delivery retries with exponential backoff (1s, 5s, 30s)
- Dead-letter events for exhausted retries
- Delivery receipt tracking (success/failure/retry)

**Prevents:**
- Long-running delivery chains beyond Workers CPU limits
- Guaranteed delivery without external durable queue (best-effort with retries)
- Webhook payload sizes exceeding 256KB

---

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Max 3 retry attempts with exponential backoff (1s, 5s, 30s) | Runtime enforcement |
| Webhook payloads signed with HMAC-SHA256 | Code path enforcement |
| Max payload size 256KB | Runtime validation |
| No PII in webhook payloads | Code path enforcement |

---

## Rollback

Revert to no outbound notifications. Remove webhook gateway and subscription management. Consumers would need to poll for changes instead of receiving push notifications. This degrades responsiveness but preserves correctness — all data remains accessible through standard API queries.

---

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 22-webhook-gateway |
| Driver | Workers + Hono |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
