# ADR: Workers AI Selection for Embedding

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-012 |
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

Sub-hub 12 (embedding) requires a model runtime capable of generating vector embeddings from text content. Chunked knowledge must be converted into dense vector representations for downstream semantic search. The solution must run natively on the Cloudflare edge with zero external API dependencies.

## Decision

Use Workers AI as the embedding model runtime. Workers AI provides native embedding models on the CF edge with zero cold starts, direct Worker bindings, and no external API keys or network egress required.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| OpenAI Embeddings | Adds external API dependency and latency — violates CF Native constraint |
| Self-hosted models | Operational burden — no CF integration, requires separate infrastructure |

## Consequences

**Enables:**
- Native embedding generation at CF edge with zero cold starts
- Direct Worker bindings — no API keys or external credentials
- Consistent latency profile within CF network
- Access to multiple embedding model variants as CF releases them

**Prevents:**
- Use of specific OpenAI or Cohere embedding models
- Fine-tuned embedding models (Workers AI uses pre-trained models)
- Vendor portability without embedding regeneration

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Embedding dimension validated before storage | Runtime assertion |
| Input text size validated against model limits | Ingress validation |
| Model version pinned in configuration | wrangler.toml binding |
| Output vectors validated for NaN/Inf values | Post-inference check |

## Rollback

Revert to external embedding API if Workers AI model quality proves insufficient. Update Worker bindings to call external API, regenerate affected embeddings with new model. Vector storage format remains compatible regardless of embedding source.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 12-embedding |
| Driver | Workers AI |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
