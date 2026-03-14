# ADR: Workers KV Selection for Cache Layer

## Conformance

| Field | Value |
|-------|-------|
| Doctrine | 2.1.0 |
| CC Layer | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-020 |
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

Sub-hub 20 (cache-layer) provides hot-path caching between consumers and storage services (D1, R2, Vectorize). It handles frequently accessed query results, embeddings, and document metadata with TTL-based expiration using a cache-aside pattern. The cache layer must operate entirely within the CF Native execution surface with sub-millisecond read latency at edge.

---

## Decision

Workers KV chosen for globally distributed key-value storage with sub-millisecond reads at edge. Redis (Upstash) considered but adds external dependency. Durable Objects considered but optimized for coordination not caching. D1 rejected — too slow for hot-path reads.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Upstash Redis | External dependency — added latency, violates CF Native constraint |
| Durable Objects | Coordination-optimized not cache-optimized — wrong access pattern |
| D1 | SQL overhead for simple key lookups — too slow for hot-path reads |

---

## Consequences

**Enables:**
- Globally distributed caching with sub-millisecond edge reads
- TTL-based expiration with cache-aside pattern for all storage backends
- Cache invalidation events on content updates
- Hit/miss metadata for observability and cache tuning

**Prevents:**
- Complex query caching (KV is key-value only, no query semantics)
- Atomic multi-key operations (KV is eventually consistent)
- Cache entries larger than KV value size limit (25 MiB)

---

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Max TTL 3600s for query results, 86400s for metadata | Runtime validation |
| Cache size bounded by KV namespace limits | KV platform enforcement |
| No caching of auth tokens or credentials | Code path enforcement |
| Cache invalidation on content updates | Event-driven enforcement |

---

## Rollback

Revert to direct storage reads (D1, R2, Vectorize) without caching layer. All sub-hubs that currently read through cache would read directly from origin stores. Performance degrades but correctness is preserved since cache-aside pattern means origin is always authoritative.

---

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 20-cache-layer |
| Driver | Workers KV |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
