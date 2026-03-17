# CLAUDE.md — svg-brain

## IDENTITY

**svg-brain** is the CF-native knowledge layer for the SVG fleet. Any LLM session can query this Worker via REST API to retrieve doctrine, ADRs, glossary terms, and relationships.

**Authority**: CC-02 (Hub)
**Parent**: imo-creator
**BAR**: BAR-147

## ARCHITECTURE

| Component | Technology |
|-----------|-----------|
| Runtime | Cloudflare Workers (Hono) |
| Database | Cloudflare D1 (SQLite) |
| Vector Search | Cloudflare Vectorize (1024-dim, cosine) |
| Embeddings | Workers AI (`@cf/baai/bge-large-en-v1.5`) |
| Search | Hybrid: FTS5 BM25 + Vectorize cosine + RRF (k=60) |

## CTB STRUCTURE

4 sub-hubs, each with 1 CANONICAL + 1 ERROR:

| Sub-hub | CANONICAL | ERROR | STAGING | MV |
|---------|-----------|-------|---------|-----|
| documents | `documents` | `documents_error` | `chunks` | `chunks_fts` |
| glossary | `glossary` | `glossary_error` | — | — |
| decisions | `decisions` | `decisions_error` | — | — |
| graph | `relationships` | `relationships_error` | — | — |

## IMO FLOW

- **Ingress**: Schema validation only (no decisions)
- **Middle**: Hash → dedup → chunk → embed → store → search
- **Egress**: JSON response (read-only view)

## API ROUTES

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check + document count |
| POST | `/ingest` | Ingest document → chunk → embed |
| POST | `/query` | Hybrid search (FTS5 + Vectorize + RRF) |
| GET | `/lookup?term=X` | Glossary lookup |
| POST | `/glossary` | Upsert glossary term |
| GET | `/documents` | List documents |
| GET | `/documents/:id` | Get document |
| GET | `/decisions` | List decisions |
| GET | `/decisions/:adr` | Get decision by ADR number |
| POST | `/decisions` | Upsert decision |
| POST | `/relationships` | Insert relationship |
| GET | `/relationships/:type/:id` | Get related entities |

## CANONICAL REFERENCE

| Template | imo-creator Path | Version |
|----------|------------------|---------|
| Architecture | law/doctrine/ARCHITECTURE.md | 2.1.0 |
| Tools | law/integrations/TOOLS.md | 1.1.0 |

## GOVERNANCE

- ADR-035: Vectorize registration (TOOL-019)
- ADR-036: Workers AI registration (TOOL-020)
- Snap-On entries: `docs/SNAP_ON_ENTRIES_DRAFT.yaml` (pending human approval)

## DEPLOYMENT

```bash
# Create D1 database
wrangler d1 create svg-brain

# Create Vectorize index
wrangler vectorize create svg-brain --dimensions=1024 --metric=cosine

# Update wrangler.toml with database_id from D1 create output

# Apply migrations
npm run d1:migrate:local   # local dev
npm run d1:migrate:remote  # production

# Dev
npm run dev

# Seed with imo-creator doctrine
BRAIN_API_URL=http://localhost:8787 IMO_ROOT=../imo-creator npm run seed

# Deploy
npm run deploy
```
