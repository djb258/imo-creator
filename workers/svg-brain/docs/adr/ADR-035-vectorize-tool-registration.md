# ADR-035: Cloudflare Vectorize Tool Registration

| Field | Value |
|-------|-------|
| **Status** | DRAFT |
| **Date** | 2026-03-15 |
| **Deciders** | Dave Barton |
| **BAR** | BAR-147 |

## Context

svg-brain requires vector similarity search for semantic retrieval. The hybrid search architecture (FTS5 + vector) demands a vector database that is co-located with the D1 database and Workers runtime to minimize latency.

## Decision

Register **Cloudflare Vectorize** as TOOL-019 in the Snap-On Toolbox.

| Field | Value |
|-------|-------|
| **Tool Name** | Cloudflare Vectorize |
| **Tool ID** | TOOL-019 |
| **Solution Type** | Deterministic |
| **CC Layer** | CC-02 |
| **IMO Layer** | M (Middle) |
| **Owner Hub** | svg-brain |
| **Tier** | TIER 1 (included in Workers paid plan) |

## Alternatives Evaluated

| Alternative | Reason Rejected |
|-------------|-----------------|
| Pinecone | External vendor, additional cost, latency penalty from cross-network calls |
| Chroma | Requires separate hosting, not CF-native |
| pgvector (Neon) | Viable but adds Hyperdrive dependency; D1+Vectorize is simpler for this use case |
| In-memory | Not persistent, lost on Worker restart |

## Configuration

- **Index name**: `svg-brain`
- **Dimensions**: 1024 (matches `bge-large-en-v1.5` output)
- **Metric**: cosine
- **Metadata fields**: `document_id` (TEXT), `domain` (TEXT)

## Consequences

- Vector search is co-located with compute — sub-millisecond binding calls
- No external vendor dependency
- Included in CF Workers paid plan ($5/mo)
- Index size limited by Vectorize quotas (currently 5M vectors on paid plan)

## Compliance

- [x] Deterministic alternative evaluated (FTS5 handles keyword — Vectorize adds semantic)
- [x] Tool scoped to hub M layer
- [x] No LLM in search path (embeddings are deterministic given input)
- [x] SNAP_ON_TOOLBOX.yaml entry required
