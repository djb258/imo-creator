# ADR-036: Cloudflare Workers AI Tool Registration

| Field | Value |
|-------|-------|
| **Status** | DRAFT |
| **Date** | 2026-03-15 |
| **Deciders** | Dave Barton |
| **BAR** | BAR-147 |

## Context

svg-brain requires text embedding generation for both document ingestion and query-time vector search. The embedding model must produce 1024-dimensional vectors compatible with the Vectorize index.

## Decision

Register **Cloudflare Workers AI** as TOOL-020 in the Snap-On Toolbox. Specifically, the `@cf/baai/bge-large-en-v1.5` model for embeddings.

| Field | Value |
|-------|-------|
| **Tool Name** | Cloudflare Workers AI |
| **Tool ID** | TOOL-020 |
| **Solution Type** | Deterministic (embedding model — same input always produces same vector) |
| **CC Layer** | CC-02 |
| **IMO Layer** | M (Middle) |
| **Owner Hub** | svg-brain |
| **Tier** | TIER 0 (FREE — 10,000 neurons/day on free tier) |

## Model Selection

| Model | Dimensions | Speed | Cost | Chosen |
|-------|-----------|-------|------|--------|
| `@cf/baai/bge-large-en-v1.5` | 1024 | Fast | Free tier | **YES** |
| `@cf/baai/bge-base-en-v1.5` | 768 | Faster | Free tier | No — lower quality |
| OpenAI `text-embedding-3-small` | 1536 | Medium | $0.02/1M tokens | No — external vendor, cost |
| Cohere embed-v3 | 1024 | Medium | $0.10/1M tokens | No — external vendor, cost |

## Usage Pattern

Workers AI is used as a **deterministic tool** (not LLM-as-spine):
1. Input text → embedding model → fixed 1024-dim vector
2. Same input always produces same output (deterministic)
3. No generation, no completion, no reasoning — pure mathematical transform
4. Used in M layer only: during ingestion (batch) and query (single)

## Consequences

- Zero-cost embedding generation on CF free tier
- Co-located with Workers runtime — no network latency
- Model is deterministic: same text → same vector (satisfies determinism-first doctrine)
- Batch processing: 10 texts per call (model limit)

## Compliance

- [x] Workers AI used as deterministic tool (embedding), NOT as LLM spine
- [x] No generation/completion/reasoning — mathematical transform only
- [x] Tool scoped to hub M layer
- [x] SNAP_ON_TOOLBOX.yaml entry required
