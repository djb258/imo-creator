# ADR: D1 + KV Selection for Parser Registry

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-017 |
| Status | [x] PROPOSED [ ] ACCEPTED [ ] DEPRECATED [ ] SUPERSEDED |
| Date | 2026-03-08 |

## Owning Hub

| Field | Value |
|-------|-------|
| Sovereign ID | imo-creator |
| Hub Name | UT |
| Hub ID | ut |

## CC Layer Scope

| Layer | In Scope |
|-------|----------|
| CC-01 | [ ] |
| CC-02 | [x] |
| CC-03 | [x] |
| CC-04 | [ ] |

## IMO Layer Scope

| Layer | In Scope |
|-------|----------|
| I (Ingress) | [ ] |
| M (Middle) | [x] |
| O (Egress) | [ ] |

## Context

Sub-hub 17 (parser-registry) stores per-domain parser rules including CSS selectors, extraction patterns, and field mappings. The UT monitoring workflow requires fast parser config lookup on the hot path (every fetch triggers a parser lookup) while also supporting versioned registry management for admin updates. The solution must be CF Native.

## Decision

Use D1 + KV as the parser registry backend. D1 provides the structured relational store for versioned parser configurations with full query support. KV provides edge-cached fast lookup for hot-path parser resolution during fetch processing.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| D1 only | Too slow for hot-path parser lookups — every fetch requires parser config resolution |
| KV only | No relational queries for parser version management — cannot track version history or run admin queries |
| External DB | Adds external dependency — violates CF Native constraint |

## Consequences

**Enables:**
- Structured parser rule storage with version history in D1
- Edge-cached fast parser lookup via KV for hot-path resolution
- Admin management of parser configs through D1 relational queries
- Parser version pinning and rollback through D1 version tracking

**Prevents:**
- Complex parser rule queries at edge speed (KV is key-based only)
- Atomic cross-domain parser updates (KV propagation is eventually consistent)
- Single-store simplicity (two stores require sync discipline)

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| KV cache invalidated on D1 parser update | Write-through enforcement |
| Parser config schema validated before storage | Ingress validation |
| Parser version monotonically increasing | D1 constraint |
| KV TTL set to prevent stale parser configs | Configuration constant |

## Rollback

Revert to D1-only if KV cache consistency proves problematic. Remove KV lookup layer, query D1 directly for parser configs. Accept increased latency on parser resolution. KV entries can be purged without data loss since D1 is the source of truth.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 17-parser-registry |
| Driver | D1 + KV |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
