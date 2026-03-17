# ADR: Cloudflare Vectorize for Vector Brain Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-07 |
| **Status** | [x] Proposed / [ ] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-03-08 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | CC-01 |
| **Hub Name** | UT (Universal Toolkit) |
| **Hub ID** | ut |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [ ] | |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [x] | Sub-hub driver selection for vector storage and search |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [x] |
| O — Egress | [x] |

---

## Context

The UT hub requires vector embedding storage and semantic search capabilities to power knowledge retrieval across ingested content. This sub-hub manages vector indexes, stores embeddings with metadata, and performs similarity queries. A vector database with native Cloudflare integration and zero cold starts is required.

---

## Decision

Cloudflare Vectorize chosen for native CF integration with zero cold starts. It provides a purpose-built vector database running entirely within the Cloudflare network, offering low-latency similarity search with direct Worker bindings and no external dependencies.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Pinecone | Adds external dependency; violates CF Native zero-external-dependency rule |
| pgvector | Requires managed Postgres outside Cloudflare; adds operational burden |
| Do Nothing | Semantic search is a core requirement for UT knowledge retrieval; no alternative path exists |

---

## Consequences

### Enables

- Vector embedding storage with metadata
- Semantic similarity search across ingested knowledge
- Native Worker bindings with zero cold starts
- Index management and similarity threshold configuration

### Prevents

- External vector database dependencies
- Cross-network latency for similarity queries

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Vectorize query rate bounded by CF plan limits | CC-03 |
| Timeout | 10s per similarity query | CC-03 |
| Kill Switch | Disable vector queries on error threshold breach, fall back to keyword search | CC-03 |

---

## Rollback

Revert to keyword-based search without vector similarity. Downstream sub-hubs consuming ranked results would receive keyword-matched results instead. No data loss — vectors can be regenerated from source documents.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md |
| PRD | |
| Work Items | |
| PR(s) | |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | | |
| Reviewer | | |
