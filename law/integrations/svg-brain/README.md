# svg-brain — Knowledge Layer Integration

## Identity

| Field | Value |
|-------|-------|
| Tool ID | TOOL-021 |
| BAR | BAR-147 |
| Hub | svg-brain |
| CC Layer | CC-02 (Hub) |
| ADR | ADR-035 (Vectorize), ADR-036 (Workers AI) |

## What It Is

CF-native knowledge layer that stores and searches doctrine, glossary terms,
ADR decisions, and entity relationships. Hybrid search combines FTS5 BM25
(full-text) with Vectorize cosine similarity (semantic) via Reciprocal Rank
Fusion.

## Endpoints

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/health` | GET | No | Service health + document count |
| `/query` | POST | Yes | Hybrid semantic + full-text search |
| `/ingest` | POST | Yes | Ingest document (chunk + embed + store) |
| `/lookup` | GET | Yes | Glossary term lookup |
| `/glossary` | POST | Yes | Upsert glossary term |
| `/documents` | GET | Yes | List documents |
| `/documents/:id` | GET | Yes | Get document by ID |
| `/decisions` | GET | Yes | List ADR decisions |
| `/decisions/:adr` | GET | Yes | Get decision by ADR number |
| `/decisions` | POST | Yes | Upsert decision |
| `/relationships` | POST | Yes | Create relationship |
| `/relationships/:type/:id` | GET | Yes | Get entity relationships |

## Auth

API key via `X-API-Key` header or `Authorization: Bearer <key>`.
Key is stored as CF Worker secret `SVG_BRAIN_API_KEY`.

## Composio Registration

The `integrations.yaml` in this directory defines the Composio custom tool
spec. Upload the OpenAPI spec (`svg-brain/docs/openapi.yaml`) to the Composio
dashboard to register as a custom tool.

## Stack

- **Runtime**: Cloudflare Workers (Hono)
- **Storage**: D1 (SQLite) — 4 sub-hubs, CTB-compliant
- **Vectors**: Vectorize (1024-dim, cosine)
- **Embeddings**: Workers AI (`@cf/baai/bge-large-en-v1.5`)
- **Search**: Hybrid RRF (FTS5 BM25 + Vectorize cosine, k=60)
