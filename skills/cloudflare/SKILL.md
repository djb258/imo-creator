---
name: cloudflare
description: >
  Platform capabilities, hard limits, pricing gates, and integration patterns for
  Cloudflare Workers, Hono, KV, D1, R2, Durable Objects, Queues, and Workflows.
  Use this skill whenever building, deploying, debugging, or making architecture
  decisions involving Cloudflare. Trigger on any mention of: Worker, Wrangler, D1,
  R2, KV, Durable Objects, Hono, Cloudflare, edge function, wrangler.toml,
  wrangler.jsonc, Hyperdrive, or any CF service name. Also trigger when the task
  involves the I/O boundary layer (Rim) in hub-spoke architecture — Cloudflare IS
  the Rim. If the code touches the outside world, consult this skill. Even partial
  mentions like "deploy to the edge" or "serverless function" should trigger this
  if Cloudflare is in the stack.
---

# Cloudflare — Platform Skill

Cloudflare is the Rim in hub-spoke doctrine — the only layer that touches the outside
world. Every build decision on this platform is constrained by the limits below. Violate
them and your Worker dies with a 1102 error, your D1 chokes on "overloaded", or your
bill surprises you. Read the constraints first, then build.

## Quick Decision Matrix

Before writing code, answer these:

| Question | Answer determines |
|----------|------------------|
| How much CPU per request? | Whether 30s default is enough or you need to set `cpu_ms` |
| How many subrequests? | Whether you'll hit the 1,000/invocation cap |
| Is the data relational? | D1 (edge SQLite) vs KV (key-value) vs Neon (full Postgres) |
| Does it need strong consistency? | KV is eventually consistent (up to 60s). D1 is consistent. Neon is consistent |
| How big is the dataset? | D1 caps at 10GB/database. Beyond that → Neon |
| Is it read-heavy or write-heavy? | KV for reads, D1 for balanced, Neon for write-heavy |
| Do you need zero egress cost on files? | R2 is the answer |
| Need single-writer coordination? | Durable Objects |

## Workers — The Compute Layer

V8 isolates (not containers). Hono is our routing framework. Workers are stateless —
all state lives in bindings (KV, D1, R2, DO).

**The limits that matter most:**
- CPU time: 30s default. Set `cpu_ms` up to 300,000 (5 min) in wrangler config for heavy work. Average Worker uses 2.2ms. If you're over 10-20ms you're in SSR/parsing territory
- Memory: 128MB per isolate
- Subrequests: 1,000 per invocation across ALL external services (KV + R2 + fetch all share this pool)
- Script size: 10MB compressed including dependencies
- Request body: plan-dependent. Responses unlimited

**Cost model:** $5/mo base. 10M requests + 30M CPU-ms included. Then $0.30/M requests, $0.02/M CPU-ms. No egress ever. Set `cpu_ms` limits to prevent runaway bills — this is your cost firewall.

For full limits table and pricing details, read `references/workers-limits.md`.

## KV — Read-Optimized Key-Value

Globally distributed, eventually consistent. Think of it as a CDN for data, not a database.

**Critical constraint:** Writes propagate in up to 60 seconds globally. If you need
read-after-write consistency, KV is the wrong tool. Use D1 or Neon.

- Keys: 512 bytes max. Values: 25MB max. Metadata: 1KB/key
- Shares the 1,000-operation-per-invocation cap with all other external services
- Use for: config, feature flags, cached API responses, session tokens
- Never use for: transactional data, anything needing strong consistency, high-write workloads

## D1 — Edge SQLite

Managed SQLite. Single-threaded per database. Designed for many small databases (per-tenant,
per-user), not one big database.

**The limits that kill you if you don't know them:**
- 10GB max per database. Cannot be increased. Period
- Single-threaded: throughput = 1 / query_duration. A 1ms query = ~1,000 QPS. A 100ms query = 10 QPS
- Large mutations must be batched at ~1,000 rows. A single UPDATE touching 100K+ rows exceeds execution limits
- 6 simultaneous connections per Worker invocation
- Runs within Workers CPU/memory limits — large result serialization can hit the CPU cap

**Index everything you filter on.** Unindexed scans bill for every row touched, and
an unindexed SELECT on 5,000 rows = 5,000 rows_read billed even if you only return 10.

Time Travel gives you point-in-time recovery to any minute in the last 30 days.

For full D1 limits, pricing, and performance rules, read `references/d1-r2-limits.md`.

## R2 — Object Storage (Zero Egress)

S3-compatible. The reason to use R2 over S3/GCS is one thing: **$0 egress**.

- 10GB free storage, 1M writes, 10M reads/month
- Standard storage: $0.015/GB-month
- Max object: 5TB (multipart), 5GB (single PUT)
- Super Slurper for bulk migration from S3/GCS. Sippy for incremental

Use for files, PDFs, images, backups, anything served to users. Never as a database.

## Durable Objects — Stateful Singletons

Each DO has a unique ID and runs in one location. Single-writer semantics.
SQLite backend on free plan, KV backend on paid.

- Billed for wall-clock time while active (not just CPU)
- Hibernation stops billing on idle objects
- Each D1 database is backed by a Durable Object
- Use for: coordination, counters, rate limiting, WebSocket management

## Queues & Workflows

**Queues:** $0.40/M operations. Each 64KB chunk = 1 operation.
**Workflows:** 100 instances/second creation rate. 10,000 concurrent instances/account.

## API Rate Limit

1,200 requests per 5 minutes per user across all API access methods. Exceed = HTTP 429 for 5 minutes.

## Connecting to Neon from Workers

Two documented paths:
1. **Hyperdrive** (recommended): CF's global connection pooler. Use `node-postgres` (pg) or Postgres.js — do NOT use the Neon serverless driver with Hyperdrive. Create a dedicated Neon role, use direct (non-pooled) connection string
2. **Neon serverless driver**: Direct HTTP/WebSocket queries. Good for simple one-shot queries from edge functions

See the Neon skill for Neon-side configuration details.

## Fleet Reference — Ultimate Tool (UT)

The **Ultimate Tool** (`templates/snap-on/ultimate-tool/`) is the fleet's heaviest Cloudflare
consumer. UT is a sovereign AI platform (TOOL-012, pending ADR-026) built entirely on Cloudflare,
with 14 of its 20 sub-hubs running as Cloudflare-native services:

| Sub-Hub | CF Service | Role |
|---------|-----------|------|
| SH-06 (API Layer / Rim) | Workers + Hono | The single entry point — all child repos call UT through this Worker |
| SH-07 (Vector Brain) | Vectorize | Semantic search across ingested documents |
| SH-08 (Doc Storage) | R2 | Zero-egress object storage for crawled/ingested content |
| SH-09 (LLM Router) | AI Gateway | Routes to multiple LLM providers with cost tracking |
| SH-10 (Runtime) | Workers Runtime | General compute for sub-hub orchestration |
| SH-11 (Structured Data) | D1 | Edge SQLite for metadata, parser configs, URL registry |
| SH-12 (Embedding) | Workers AI | Generates embeddings for vector storage |
| SH-13 (Error Queue) | Queues | Dead-letter and retry queue for failed operations |
| SH-14 (Observability) | Workers Analytics | Telemetry and cost tracking per sub-hub |
| SH-15 (Scheduling) | Workers Cron | Periodic tasks (movement detection sweeps, cache refresh) |
| SH-16 (Fetcher) | Workers + ScraperAPI | URL retrieval with proxy fallback |
| SH-17 (Parser Registry) | D1 + KV | Field extraction rules per domain |
| SH-18 (Proxy Router) | Workers + Hono | Mode selection for fetch strategy |
| SH-19 (Orchestrator) | Workers Runtime | Movement detection pipeline coordination |

**When building or debugging any Cloudflare component**, check whether it's part of UT.
UT's full spec lives at `templates/snap-on/ultimate-tool/README.md`. The field-monitor
implementation lives at `templates/snap-on/ultimate-tool/field-monitor/`.

Child repos never import UT code — they call UT via HTTP through SH-06 (the Rim).

## Dave's Operational Notes
<!-- Feed raw notes here: patterns that work, things that broke, cost surprises -->

## Known Failure Modes
<!-- Document actual production failures and their root causes -->
