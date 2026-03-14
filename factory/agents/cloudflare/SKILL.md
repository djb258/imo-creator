---
name: cloudflare
metadata:
  version: 1.1.0
  tier: master
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

## Tier 0 Doctrine

This skill is governed by the five elements defined in OPERATOR_PROFILE.md:

| Element | Application to this skill |
|---------|--------------------------|
| C&V | Platform limits are constants. Vendor choice (Cloudflare itself) is a variable |
| IMO | Request enters rim (I) -> Workers process (M) -> response exits rim (O) |
| CTB | Workers = trunk compute. Storage services = branches. Config details = leaves |
| Hub-and-Spoke | Cloudflare IS the rim. Workers are the physical I/O boundary |
| Circle | Production failures feed back into this skill as Known Failure Modes |

---

### BLOCK 1: Platform Decision Matrix
**Governed by: C&V**

**Constants:**
- Cloudflare is the Rim in hub-spoke doctrine — the I/O boundary
- Every build decision is constrained by hard platform limits (not soft guidelines)
- Working data lives at the edge (D1/KV). Vault data lives in Neon. These are separate concerns
- Zero egress cost is a structural advantage across all CF services
- V8 isolates (not containers) — this constrains the programming model

**Variables:**

| Question | Answer determines |
|----------|------------------|
| How much CPU per request? | Whether 30s default is enough or you need to set `cpu_ms` |
| How many subrequests? | Whether you'll hit the 1,000/invocation cap |
| Is the data relational? | D1 (edge SQLite, working layer) vs KV (key-value, hot reads) — Neon is vault only (BAR-100) |
| Does it need strong consistency? | KV is eventually consistent (up to 60s). D1 is consistent. Use D1 for working data |
| How big is the dataset? | D1 caps at 10GB/database. Split across multiple D1 databases if needed |
| Is it read-heavy or write-heavy? | KV for reads, D1 for balanced read/write. Neon is vault-sync only (BAR-102) |
| Do you need zero egress cost on files? | R2 is the answer |
| Need single-writer coordination? | Durable Objects |

**IMO:**
- Input: A build decision or architecture question involving Cloudflare services
- Middle: Walk the decision matrix above. Each question eliminates wrong choices. The matrix is designed so that answering all questions leaves exactly one viable path
- Output: A clear service selection with the constraint that justified it

**CTB:**
- Trunk: "What CF service fits this workload?" — the single routing question
- Branches: Compute (Workers), Storage (KV/D1/R2), Stateful (DO/Queues/Workflows)
- Leaves: Specific limits, pricing tiers, and config per service (detailed in Blocks 2-5)

**Hub-and-Spoke:**
- Rim: Cloudflare itself — the entire platform IS the rim
- Spokes: HTTP requests in/out, binding calls to KV/D1/R2/DO
- Hub: The M-layer logic lives in Workers code (Hono routes, business logic)

**Circle:**
- Validation: Did the selected service survive contact with its hard limits? If a Worker hits 1102 or D1 returns "overloaded", the decision matrix was applied wrong
- Feedback: Every production limit hit gets added to Dave's Operational Notes (end of this skill)

**Go/No-Go:** Decision matrix consulted before any CF service selection. No service chosen by habit or default — chosen by constraint elimination. Proceed.

---

### BLOCK 2: Workers Compute
**Governed by: Hub-and-Spoke**

Workers ARE the rim. V8 isolates, not containers. Hono is our routing framework.
Workers are stateless — all state lives in bindings (KV, D1, R2, DO).

**Constants (hard limits — these do not bend):**
- CPU time: 30s default. Set `cpu_ms` up to 300,000 (5 min) in wrangler config for heavy work. Average Worker uses 2.2ms. If you're over 10-20ms you're in SSR/parsing territory
- Memory: 128MB per isolate
- Subrequests: 1,000 per invocation across ALL external services (KV + R2 + fetch all share this pool)
- Script size: 10MB compressed including dependencies
- Request body: plan-dependent. Responses unlimited

**Variables:**

| Variable | Range | Guard rail |
|----------|-------|------------|
| CPU budget per Worker | 2ms - 300,000ms | Set `cpu_ms` in wrangler config to cap cost |
| Subrequest allocation | 0 - 1,000 per invocation | Monitor via Workers Analytics. Pool is shared |
| Script size | 0 - 10MB compressed | Tree-shake dependencies. Watch for bloat |

**Cost model:** $5/mo base. 10M requests + 30M CPU-ms included. Then $0.30/M requests, $0.02/M CPU-ms. No egress ever. Set `cpu_ms` limits to prevent runaway bills — this is your cost firewall.

For full limits table and pricing details, read `references/workers-limits.md`.

**IMO:**
- Input: An HTTP request hitting a Worker (or a cron trigger, or a queue consumer event)
- Middle: Hono routes the request. Business logic executes. Bindings accessed for state. All within the CPU/memory/subrequest envelope
- Output: HTTP response (or queue message, or KV/D1/R2 write)

**CTB:**
- Trunk: V8 isolate — the compute primitive
- Branches: Hono routing, bindings (KV/D1/R2/DO), cron triggers, queue consumers
- Leaves: `cpu_ms` config, script size optimization, subrequest budgeting

**Hub-and-Spoke:**
- Workers are the rim — they are the I/O boundary between the outside world and internal services
- Every child repo calls through Workers. No direct access to storage services from outside
- Hono routes inside the Worker act as the hub's M-layer routing

**Circle:**
- Validation: Worker returns 1102 (CPU exceeded) or 1101 (script too large) = limit violated, design must change
- Feedback: CPU overruns trigger `cpu_ms` tuning or workload splitting. Subrequest exhaustion triggers batching redesign

**Go/No-Go:** Worker stays within CPU, memory, subrequest, and script size limits. Cost firewall (`cpu_ms`) is set. Proceed.

---

### BLOCK 3: Storage Services
**Governed by: CTB**

Three tiers of storage. Each has a role. Using the wrong one is a design error.

#### KV — Read-Optimized Key-Value

Globally distributed, eventually consistent. Think of it as a CDN for data, not a database.

**Constants:**
- Writes propagate in up to 60 seconds globally. If you need read-after-write consistency, KV is the wrong tool. Use D1 (the working database under BAR-100)
- Keys: 512 bytes max. Values: 25MB max. Metadata: 1KB/key
- Shares the 1,000-operation-per-invocation cap with all other external services
- Use for: config, feature flags, cached API responses, session tokens
- Never use for: transactional data, anything needing strong consistency, high-write workloads

#### D1 — Edge SQLite

Managed SQLite. Single-threaded per database. Designed for many small databases (per-tenant,
per-user), not one big database.

**Constants:**
- 10GB max per database. Cannot be increased. Period
- Single-threaded: throughput = 1 / query_duration. A 1ms query = ~1,000 QPS. A 100ms query = 10 QPS
- Large mutations must be batched at ~1,000 rows. A single UPDATE touching 100K+ rows exceeds execution limits
- 6 simultaneous connections per Worker invocation
- Runs within Workers CPU/memory limits — large result serialization can hit the CPU cap

**Index everything you filter on.** Unindexed scans bill for every row touched, and
an unindexed SELECT on 5,000 rows = 5,000 rows_read billed even if you only return 10.

Time Travel gives you point-in-time recovery to any minute in the last 30 days.

For full D1 limits, pricing, and performance rules, read `references/d1-r2-limits.md`.

#### R2 — Object Storage (Zero Egress)

S3-compatible. The reason to use R2 over S3/GCS is one thing: **$0 egress**.

**Constants:**
- 10GB free storage, 1M writes, 10M reads/month
- Standard storage: $0.015/GB-month
- Max object: 5TB (multipart), 5GB (single PUT)
- Super Slurper for bulk migration from S3/GCS. Sippy for incremental

Use for files, PDFs, images, backups, anything served to users. Never as a database.

**Variables:**

| Variable | Range | Guard rail |
|----------|-------|------------|
| KV consistency window | 0 - 60s | Design for eventual consistency or use D1 |
| D1 database size | 0 - 10GB | Split across multiple databases if needed |
| D1 query duration | < 1ms to 100ms+ | Index strategy determines throughput ceiling |
| R2 object size | 0 - 5TB | Use multipart upload above 5GB |

**IMO:**
- Input: A data storage or retrieval request from a Worker
- Middle: Route to the correct storage tier — KV for hot reads, D1 for relational/consistent working data, R2 for files/objects
- Output: Data stored or retrieved within the limits of the selected tier

**CTB:**
- Trunk: "Where does this data live?" — the storage routing question
- Branches: KV (read-optimized, eventually consistent), D1 (relational, consistent, working layer), R2 (objects, zero egress)
- Leaves: Key size limits, database size caps, object size caps, pricing per tier

**Circle:**
- Validation: D1 returns "overloaded" = query is too heavy or unindexed. KV returns stale data in a consistency-sensitive path = wrong storage tier selected
- Feedback: Storage tier mismatches feed back as architecture corrections. Add the failure pattern to Known Failure Modes

**Go/No-Go:** Correct storage tier selected for the workload. Limits respected. Indexes planned for D1. No consistency-sensitive data in KV. Proceed.

---

### BLOCK 4: Stateful and Async Services
**Governed by: IMO**

The async processing pipeline. When synchronous request-response is not enough.

#### Durable Objects — Stateful Singletons

Each DO has a unique ID and runs in one location. Single-writer semantics.

**Constants:**
- Billed for wall-clock time while active (not just CPU)
- Hibernation stops billing on idle objects
- Each D1 database is backed by a Durable Object
- SQLite backend on free plan, KV backend on paid
- Use for: coordination, counters, rate limiting, WebSocket management

#### Queues

**Constants:**
- $0.40/M operations. Each 64KB chunk = 1 operation

#### Workflows

**Constants:**
- 100 instances/second creation rate. 10,000 concurrent instances/account

**Variables:**

| Variable | Range | Guard rail |
|----------|-------|------------|
| DO active duration | 0 - unbounded | Use hibernation to stop billing on idle |
| Queue message size | 0 - 64KB per chunk | Chunk large payloads; each chunk = 1 billed operation |
| Workflow concurrency | 0 - 10,000 | Monitor creation rate (100/s cap) |

**IMO:**
- Input: An event that requires stateful coordination, async processing, or durable execution
- Middle: Route to the correct async primitive — DO for single-writer coordination, Queues for decoupled message passing, Workflows for multi-step durable execution
- Output: Stateful operation completed with exactly-once or at-least-once guarantees (depending on primitive)

**CTB:**
- Trunk: "Does this need state or async?" — the statefulness question
- Branches: Durable Objects (stateful singletons), Queues (async messaging), Workflows (durable multi-step)
- Leaves: Billing models, concurrency caps, hibernation config

**Circle:**
- Validation: DO billing runaway = missing hibernation. Queue backlog growing = consumer not keeping up. Workflow hitting 10K concurrent cap = need to rethink batch size
- Feedback: Cost surprises from DO wall-clock billing feed back as hibernation requirements. Queue backlogs feed back as consumer scaling decisions

**Go/No-Go:** Correct async primitive selected. Hibernation configured for DOs. Queue chunk sizes planned. Workflow concurrency within cap. Proceed.

---

### BLOCK 5: Vault Connectivity and Fleet Reference
**Governed by: Circle**

The feedback loop between the working layer (edge) and the vault (Neon).

#### Connecting to Neon Vault from Workers (BAR-100/102)

**Neon is vault-only. Working data lives in D1/KV.** Vault connections are for:
- Nightly sync (BAR-102): Hyperdrive pushes D1 working data -> Neon vault
- Admin/migration: Schema governance, CTB enforcement
- Disaster recovery: Restore from Neon vault to D1

Two vault-access paths:
1. **Hyperdrive** (vault-sync): CF's global connection pooler. Use `node-postgres` (pg) — NOT for hot-path queries
2. **Neon serverless driver**: Admin one-shot queries for vault inspection

See the Neon skill for vault-side configuration details.

#### API Rate Limit

1,200 requests per 5 minutes per user across all API access methods. Exceed = HTTP 429 for 5 minutes.

#### Fleet Reference — Ultimate Tool (UT)

The **Ultimate Tool** (`fleet/snap-on/ultimate-tool/`) is the fleet's heaviest Cloudflare
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
UT's full spec lives at `fleet/snap-on/ultimate-tool/README.md`. The field-monitor
implementation lives at `fleet/snap-on/ultimate-tool/field-monitor/`.

Child repos never import UT code — they call UT via HTTP through SH-06 (the Rim).

**Variables:**

| Variable | Range | Guard rail |
|----------|-------|------------|
| Vault sync frequency | Nightly (BAR-102) | D1 -> Neon direction only. Never hot-path |
| API rate budget | 0 - 1,200 per 5 min | Monitor via CF dashboard. 429 = 5 min lockout |
| UT sub-hub count | Currently 14 CF-native | Check UT README for current state |

**IMO:**
- Input: A need to connect the edge working layer to the Neon vault, or a question about how UT uses CF services
- Middle: Route through the correct vault-access path (Hyperdrive for sync, serverless driver for admin). For UT questions, consult the UT README and field-monitor spec
- Output: Vault operation completed within the sync contract (BAR-102), or UT architecture question answered with specific sub-hub reference

**CTB:**
- Trunk: The edge-to-vault connection — working data (D1) syncs to vault (Neon)
- Branches: Hyperdrive (sync path), Neon serverless driver (admin path), UT fleet (reference implementation)
- Leaves: BAR-100/102 contract details, API rate limits, UT sub-hub table

**Circle:**
- Validation: Vault sync completing on schedule (BAR-102)? API rate limit not being hit? UT sub-hubs operating within their respective CF service limits?
- Feedback: Sync failures feed back as Hyperdrive config issues. Rate limit hits feed back as request batching requirements. UT limit violations feed back into this skill's Known Failure Modes

**Go/No-Go:** Vault connectivity follows BAR-100/102 contract. API rate budget managed. UT reference consulted for any CF service question. Proceed.

---

## Dave's Operational Notes
<!-- Feed raw notes here: patterns that work, things that broke, cost surprises -->

## Known Failure Modes
<!-- Document actual production failures and their root causes -->

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.1.0 |
| Created | 2026-03-09 |
| Reformatted | v4 Block Format 2026-03-14 |
| Authority | imo-creator (Sovereign) |
| BAR | BAR-130 |
