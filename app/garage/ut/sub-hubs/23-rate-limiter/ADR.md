# ADR: Workers KV + Durable Objects Selection for Rate Limiter

## Conformance

| Field | Value |
|-------|-------|
| Doctrine | 2.1.0 |
| CC Layer | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-023 |
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

Sub-hub 23 (rate-limiter) provides centralized rate limiting across all UT outbound requests. It prevents UT from hammering target domains by enforcing per-domain, per-endpoint, and global request budgets using sliding window counters with configurable thresholds. The rate limiter must operate entirely within the CF Native execution surface with strong consistency for counter increments and fast reads at edge.

---

## Decision

Workers KV + Durable Objects chosen. KV for distributed counter reads at edge, Durable Objects for atomic counter increments with strong consistency. Pure KV rejected — eventual consistency causes budget overruns under concurrent load. External rate limiter (e.g., Upstash Ratelimit) considered but adds dependency. In-memory counters rejected — no persistence across Worker instances.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Upstash Ratelimit | External dependency — adds latency, violates CF Native constraint |
| KV-only | Eventual consistency causes budget overruns under concurrent load |
| In-memory counters | No persistence across Worker instances — counters reset on eviction |
| D1 | Too slow for hot-path rate checks — SQL overhead unacceptable |

---

## Consequences

**Enables:**
- Atomic counter increments with strong consistency via Durable Objects
- Fast distributed counter reads at edge via KV
- Per-domain, per-endpoint, and global request budget enforcement
- Sliding window counters with configurable thresholds

**Prevents:**
- Pure edge-only operation (Durable Objects have single-point coordination)
- Sub-millisecond writes (Durable Object coordination adds latency)
- Unlimited concurrent domains (each domain requires a Durable Object instance)

---

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Default per-domain limit 60 req/min | Runtime validation |
| Global limit 600 req/min | Runtime validation |
| Sliding window size 60s | Configuration enforcement |
| Rate limit configs stored in D1, cached in KV | Storage layer enforcement |
| No rate limiting on internal sub-hub-to-sub-hub calls | Code path enforcement |

---

## Rollback

Revert to unthrottled outbound requests. Remove rate limiter checks from browser-control (01), crawl-orchestration (02), fetcher (16), and fallback-scraping (05). Target domains may receive uncontrolled request volume, risking IP blocks and rate limit responses from upstream services.

---

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 23-rate-limiter |
| Driver | Workers KV + Durable Objects |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
