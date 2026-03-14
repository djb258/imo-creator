# Ultimate Tool (UT) — Snap-On Tool Reference
# ═══════════════════════════════════════════════════════════════════════════════
# Authority: imo-creator (CC-01)
# Tool ID: TOOL-012 (pending ADR-026 registration)
# Status: ACTIVE — Documentation Phase
# Location: imo-creator/templates/snap-on/ultimate-tool/README.md
# Last Updated: 2026-03-09
# ═══════════════════════════════════════════════════════════════════════════════

## What UT Is

UT is a sovereign AI platform registered as a single Snap-On Tool in
imo-creator. It provides 20 sub-hubs covering browser automation, crawling,
knowledge ingestion, scraping, API routing, vector search, object storage,
LLM inference, structured data, embedding, error handling, observability,
scheduling, and movement detection — all callable through one Cloudflare
Worker rim.

Any child repo (Car) calls UT via HTTP. The child repo never imports UT
code, never depends on UT internals. One endpoint, one tool, one
registration.

**Hub:** Claude Code
**Rim:** Cloudflare Worker REST API (Hono)
**Rim Endpoints:**
- `POST /query` — Send a task to the hub for processing
- `POST /ingest` — Push data into UT for storage/embedding
- `GET /domains` — List registered domains and their sub-hub coverage

**Cost:** ~$70/month total

---

## How a Child Repo Calls UT

```
Child Repo (any Car)
    ↓ HTTP POST
Cloudflare Worker (Rim — Hono router, SH-06)
    ↓ route by payload.action
Target Sub-Hub (sovereign, processes request)
    ↓ result
Cloudflare Worker (Rim — returns response)
    ↓ HTTP Response
Child Repo (receives result)
```

```typescript
// Example: Child repo calls UT for semantic search
const response = await fetch("https://ut.svgagency.workers.dev/query", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "search",
    sovereign_id: "barton-outreach-core",
    data: { query: "companies that changed broker in Q1 2026", top_k: 10 },
  }),
});
```

The child repo does NOT need to know which sub-hub handles the request.
SH-06 (API Layer) resolves routing from the action field.

---

## Triggers Into the Rim

Any of these can fire an HTTP request into the UT Cloudflare Worker:

| Trigger | Type | Notes |
|---------|------|-------|
| n8n | Automation | Self-hosted on Hostinger VPS, HTTP Request node |
| Claude Desktop MCP | Tool call | Direct from any Claude session |
| Composio | Bridge | $30/mo, 500+ app integrations |
| Retell AI | Voice | AI voice calling |
| Bland AI | Voice | AI voice calling |
| Vapi | Voice | AI voice calling |
| Slack | Messaging | Webhook or bot event |
| Mailgun Inbound | Email | Inbound email parsing |
| Twilio SMS | SMS | Inbound text messages |
| Manus | Agent | Autonomous agent trigger |
| ChatGPT Custom Action | LLM | OpenAI function calling |
| Gemini | LLM | Google function calling |
| Workers Cron | Schedule | Cloudflare-native time triggers |
| GitHub Actions | CI/Schedule | Cron schedules and workflow_dispatch |
| Zapier / Make | Automation | Third-party workflow platforms |

---

## Architecture Rules

- Hub = Claude Code. ALL logic lives here.
- Rim = Cloudflare Worker (SH-06). I/O only. No logic in the rim.
- Spokes = dumb transport between rim and sub-hubs.
- Each sub-hub is sovereign — knows nothing about the others.
- No sideways calls between sub-hubs.
- Each sub-hub has its own error table.
- External sub-hubs (01–05, 20) require browser runtime or external APIs.
- Cloudflare sub-hubs (06–19) run entirely within CF free tier at V1 scale.
- LLM is tail-only arbitration (per TOOLS.md doctrine).
- Tools scoped to Hub M layer only (per ARCHITECTURE.md).

---

## Sub-Hub Registry (20 Total: 6 External, 14 Cloudflare-Native)

### SH-01: Browser Control
| Field | Value |
|-------|-------|
| **Driver** | Puppeteer |
| **Layer** | External |
| **Triggers** | `action: "browse"` via POST /query |
| **Does** | Headless browser automation for JS-rendered pages. Navigates URLs, waits for dynamic content, captures rendered DOM. |
| **Emits** | Rendered HTML string, screenshot (optional), page metadata |
| **Error table** | ut_errors.sh01_browser_control |
| **Does NOT** | Parse content, make decisions, store results |

### SH-02: Crawl Orchestration
| Field | Value |
|-------|-------|
| **Driver** | Crawlee |
| **Layer** | External |
| **Triggers** | `action: "crawl"` via POST /query |
| **Does** | Multi-page crawl sequencing. URL queue management, depth limits, rate limiting, page-to-page navigation for structured site traversal. |
| **Emits** | Array of crawled page results (URL, body, status, metadata) |
| **Error table** | ut_errors.sh02_crawl_orchestration |
| **Does NOT** | Extract specific fields, classify content, call other sub-hubs |

### SH-03: Knowledge Ingestion
| Field | Value |
|-------|-------|
| **Driver** | NotebookLM + Puppeteer |
| **Layer** | External |
| **Triggers** | `action: "knowledge"` via POST /ingest |
| **Does** | Ingests documents into NotebookLM via browser automation. Creates notebooks, adds sources, triggers grounded Q&A. All answers anchored to uploaded source material. |
| **Emits** | Grounded answer text, source citations, notebook reference ID |
| **Error table** | ut_errors.sh03_knowledge_ingestion |
| **Does NOT** | Generate answers from training data — grounded responses only |

### SH-04: Auth Management
| Field | Value |
|-------|-------|
| **Driver** | Puppeteer Cookie Store |
| **Layer** | External |
| **Triggers** | Internal call from SH-01 or SH-02 when auth required |
| **Does** | Manages browser session state. Stores/rotates cookies, handles login flows, maintains authenticated sessions across crawl jobs. |
| **Emits** | Session cookie set, auth status (valid/expired/failed) |
| **Error table** | ut_errors.sh04_auth_management |
| **Does NOT** | Store credentials directly — pulls from Doppler secrets provider |

### SH-05: Fallback Scraping
| Field | Value |
|-------|-------|
| **Driver** | ScraperAPI |
| **Layer** | External |
| **Triggers** | Automatic fallback when SH-01 or SH-16 fails (403/429/timeout) |
| **Does** | Routes blocked requests through ScraperAPI rotating proxy network. Anti-bot bypass, CAPTCHA handling, IP rotation. |
| **Emits** | Raw HTML response, HTTP status, proxy metadata |
| **Error table** | ut_errors.sh05_fallback_scraping |
| **Cost gate** | Tier 1 — ~$0.001/call, 100K/month cap (SNAP_ON_TOOLBOX TOOL-005) |
| **Does NOT** | Parse, classify, or store — returns raw response only |

### SH-06: API Layer (THE RIM)
| Field | Value |
|-------|-------|
| **Driver** | Workers + Hono |
| **Layer** | Cloudflare |
| **Triggers** | Any inbound HTTP request from any trigger |
| **Does** | THE RIM. Routes all inbound requests to the correct sub-hub based on `payload.action`. Validates request shape, applies rate limiting, returns responses. The only sub-hub that touches the outside world. |
| **Emits** | Routed request to target sub-hub; HTTP response to caller |
| **Endpoints** | `POST /query`, `POST /ingest`, `GET /domains` |
| **Error table** | ut_errors.sh06_api_layer |
| **Does NOT** | Process requests — routing and validation only. No logic. No state. |

### SH-07: Vector Brain
| Field | Value |
|-------|-------|
| **Driver** | Vectorize |
| **Layer** | Cloudflare |
| **Triggers** | `action: "search"` via POST /query, or internal call after embedding |
| **Does** | Semantic similarity search across stored embeddings. Accepts query vector, returns top-k nearest neighbors with metadata and similarity scores. |
| **Emits** | Ranked result set: document IDs, similarity scores, metadata |
| **Error table** | ut_errors.sh07_vector_brain |
| **Does NOT** | Generate embeddings (SH-12) or store raw documents (SH-08) |

### SH-08: Doc Storage
| Field | Value |
|-------|-------|
| **Driver** | R2 |
| **Layer** | Cloudflare |
| **Triggers** | `action: "store"` via POST /ingest, or internal call after processing |
| **Does** | Object storage for raw documents, PDFs, HTML snapshots, images. Write once, read many. Objects keyed by sovereign_id + document hash. |
| **Emits** | Storage key (R2 object path), byte count, content type |
| **Error table** | ut_errors.sh08_doc_storage |
| **Does NOT** | Parse, embed, or classify stored content |

### SH-09: LLM Router
| Field | Value |
|-------|-------|
| **Driver** | AI Gateway |
| **Layer** | Cloudflare |
| **Triggers** | Internal call when any sub-hub needs LLM inference |
| **Does** | Routes LLM requests through Cloudflare AI Gateway. Model selection, response caching, rate limiting, cost tracking, automatic fallback between models. |
| **Emits** | LLM response text, model used, token count, cache hit status |
| **Error table** | ut_errors.sh09_llm_router |
| **Does NOT** | Make business decisions — LLM is tail-only arbitration per TOOLS.md |

### SH-10: Runtime
| Field | Value |
|-------|-------|
| **Driver** | Workers Runtime |
| **Layer** | Cloudflare |
| **Triggers** | Internal routing from SH-06 for general compute tasks |
| **Does** | General-purpose compute execution surface. Runs transformation logic, data pipeline steps, orchestration that doesn't fit a specialized sub-hub. |
| **Emits** | Processed result payload (shape depends on task) |
| **Error table** | ut_errors.sh10_runtime |
| **Does NOT** | Own a specific domain — catch-all compute surface |

### SH-11: Structured Data
| Field | Value |
|-------|-------|
| **Driver** | D1 |
| **Layer** | Cloudflare |
| **Triggers** | Internal call for structured read/write operations |
| **Does** | SQLite-compatible relational storage at the edge. Stores structured records, lookup tables, registry state, metadata needing SQL queries. |
| **Emits** | Query result sets, row counts, write confirmations |
| **Error table** | ut_errors.sh11_structured_data |
| **Does NOT** | Store large objects (SH-08) or vectors (SH-07) |

### SH-12: Embedding
| Field | Value |
|-------|-------|
| **Driver** | Workers AI |
| **Layer** | Cloudflare |
| **Triggers** | `action: "embed"` via POST /ingest, or internal call during ingestion |
| **Does** | Converts text to vector embeddings using Cloudflare Workers AI models. Batch-capable. Output vectors feed into SH-07 for storage and search. |
| **Emits** | Vector array (float32[]), model ID, token count |
| **Error table** | ut_errors.sh12_embedding |
| **Does NOT** | Store vectors (SH-07) or generate text (SH-09) |

### SH-13: Error Queue
| Field | Value |
|-------|-------|
| **Driver** | Workers Queues |
| **Layer** | Cloudflare |
| **Triggers** | Any sub-hub failure that needs retry or dead-letter routing |
| **Does** | Captures failed operations from any sub-hub. Retry logic with exponential backoff. Routes permanently failed records to dead-letter storage. Writes to per-sub-hub error tables. |
| **Emits** | Retry dispatch or dead-letter confirmation |
| **Error table** | This IS the error routing system — writes to all other sub-hub error tables |
| **Does NOT** | Fix errors — only queues, retries, and routes failures |

### SH-14: Observability
| Field | Value |
|-------|-------|
| **Driver** | Workers Analytics |
| **Layer** | Cloudflare |
| **Triggers** | Every request automatically (passive collection) |
| **Does** | Collects telemetry from all sub-hubs. Request counts, latency distributions, error rates, cost tracking per sub-hub. |
| **Emits** | Analytics data points (not consumed by other sub-hubs) |
| **Error table** | None — observability degrades gracefully, does not fail |
| **Does NOT** | Alert or take action — read-only telemetry |

### SH-15: Scheduling
| Field | Value |
|-------|-------|
| **Driver** | Workers Cron |
| **Layer** | Cloudflare |
| **Triggers** | Cloudflare cron schedule definitions |
| **Does** | Time-based triggers for batch jobs, maintenance tasks, periodic operations within the Cloudflare network. |
| **Emits** | Trigger payloads to target sub-hubs based on schedule config |
| **Error table** | ut_errors.sh15_scheduling |
| **Does NOT** | Run jobs — only triggers them on schedule |

### SH-16: Fetcher
| Field | Value |
|-------|-------|
| **Driver** | Workers + ScraperAPI |
| **Layer** | Cloudflare |
| **Triggers** | SH-19 dispatches a fetch task |
| **Does** | Given a URL and fetch mode, retrieves current page content. Handles plain HTTP and proxied modes. ScraperAPI fallback for blocked targets. |
| **Interface in** | `{ url, fetch_mode, timeout_ms, byte_limit }` |
| **Interface out** | `{ success, status_code, body, content_type, fetch_duration_ms, byte_count, error }` |
| **Error table** | ut_errors.sh16_fetcher |
| **Does NOT** | Parse, classify, compare, or emit signals |

### SH-17: Parser Registry
| Field | Value |
|-------|-------|
| **Driver** | D1 + KV |
| **Layer** | Cloudflare |
| **Triggers** | SH-19 sends response body for field extraction |
| **Does** | Domain-specific field extraction. Each domain type has a registered parser (stored in KV) that knows where to find the constant field in that domain's response format. New parsers are config rows, not code changes. |
| **Interface in** | `{ domain, response_body, field_name }` |
| **Interface out** | `{ extracted_value, confidence_score, parser_version }` |
| **Error table** | ut_errors.sh17_parser_registry |
| **Does NOT** | Fetch URLs, route requests, or compare values across time |

### SH-18: Proxy Router
| Field | Value |
|-------|-------|
| **Driver** | Workers + Hono |
| **Layer** | Cloudflare |
| **Triggers** | SH-19 determines URL needs proxied or browser fetch |
| **Does** | Decides which fetch path a URL takes based on domain rules and historical success rates. Routes to plain fetch, proxy fetch, or browser-rendered fetch. Tracks per-domain success/fail rates in KV for adaptive routing. |
| **Interface in** | `{ url, domain, historical_fetch_stats }` |
| **Interface out** | `{ recommended_fetch_mode, proxy_config }` |
| **Error table** | ut_errors.sh18_proxy_router |
| **V2 concern** | Rate state contention under concurrency |
| **Does NOT** | Fetch pages — only decides HOW to fetch |

### SH-19: Orchestrator
| Field | Value |
|-------|-------|
| **Driver** | Workers Runtime |
| **Layer** | Cloudflare |
| **Triggers** | SH-20 dispatches due URLs, or direct POST from calling sub-hub (bypass path) |
| **Does** | Owns the 7-gate cost funnel for movement detection. Sequences the check pipeline: reachability → fetch → parse → compare → confirm → enrich → emit. Each gate is pass/fail. Only records passing all gates emit a signal downstream. Gate 7 is the only gate with real per-record cost. |
| **Interface in** | `{ url_id, domain, path, field_name, field_id }` |
| **Interface out** | `{ gates[], old_value, new_value, changed, total_duration_ms, error }` |
| **Signal emission** | Changed records emit to downstream intake functions (caller-defined) |
| **Error table** | ut_errors.sh19_orchestrator |
| **V2 concerns** | Gate 5 confirmation state explosion; Gate 7 backpressure |
| **Does NOT** | Fetch, parse, or route — delegates to SH-16, SH-17, SH-18 |

### SH-20: Scheduler
| Field | Value |
|-------|-------|
| **Driver** | GitHub Actions (cron) |
| **Layer** | External |
| **Triggers** | GitHub Actions cron (monthly default) or workflow_dispatch |
| **Does** | Reads Neon url_registry, evaluates which URLs are due for checking, dispatches job payloads to SH-19 endpoint. Optional bypass — calling sub-hubs can POST directly to SH-19. Supports dry_run mode for queue inspection without dispatch. |
| **Emits** | Trigger payloads to SH-19 Worker endpoint |
| **Error table** | None — read-only, does NOT write to Neon |
| **ADR** | ADR-027 (accepted) — GitHub Actions over CF Scheduled Workers |
| **Guard rails** | Write prohibition: never writes to Neon. Bypass preservation: direct POST to SH-19 must always work. V2 migration requires new ADR. |
| **Does NOT** | Write to Neon, modify registry state, run enrichment |

---

## Movement Detection Workflow (Sub-Hubs 16–20)

When UT is called for movement detection (watching constant fields for
changes on sovereign_id-tied URLs), sub-hubs 16–20 chain together through
the 7-gate cost funnel:

```
SH-20 (Scheduler) reads Neon url_registry, finds due URLs
    ↓ dispatches batch to SH-19
SH-19 (Orchestrator) runs each URL through the 7-gate funnel:
    │
    ├─ Gate 1: Reachability — is the URL still live?
    ├─ Gate 2: Fetch — SH-18 picks mode → SH-16 retrieves content
    ├─ Gate 3: Parse — SH-17 extracts constant field value
    ├─ Gate 4: Compare — has value changed from last known?
    ├─ Gate 5: Confirm — re-fetch 3-7 days later to verify change
    ├─ Gate 6: Classify — categorize the type of change
    └─ Gate 7: Enrich — pull additional context (PAID — only gate with cost)
    │
    ↓ if all gates pass and change confirmed
Signal emitted to downstream intake function (caller-defined)
```

**Key design points:**
- ~3% of registered URLs reach Gate 7 at current scale
- Stagnation (no change for 3+ cycles) detected by a DB view, not the funnel
- The funnel detects movement. The view detects stagnation. Same data, different campaigns.
- Bypass path: any calling sub-hub can skip SH-20 and POST directly to SH-19

**V1 → V2 Scale Breakpoints (from architecture v1.2 pressure test):**
1. Gate 5 confirmation state explosion — pending records accumulate across multi-day windows
2. SH-18 Proxy Router rate state contention under concurrency — needs Durable Objects at V2
3. Gate 7 backpressure — enrichment API rate limits propagate upward

All V2 upgrades require new ADRs per sub-hub. No contract changes — tool swaps only.

---

## Cost Summary

| Component | Sub-Hubs | Monthly Cost |
|-----------|----------|-------------|
| Cloudflare Free Tier | SH-06 through SH-19 | $0 at V1 scale |
| ScraperAPI (SH-05, SH-16 fallback) | Tier 1 | ~$0.001/call, budget cap |
| Composio (trigger bridge) | — | $30/mo fixed |
| n8n (self-hosted Hostinger VPS) | — | Included in VPS |
| GitHub Actions (SH-20) | — | $0 (free tier) |
| **Total** | | **~$70/month** |

---

## Registration Status

| Item | Status |
|------|--------|
| TOOL-012 in SNAP_ON_TOOLBOX.yaml | **PENDING** — needs ADR-026 |
| ADR-026 (UT Tool Registration) | **NOT WRITTEN** — referenced in ADR-027 traceability |
| ADR-027 (Scheduler Selection) | **ACCEPTED** — GitHub Actions for SH-20 |
| SH-16 through SH-19 implementation | **IN PROGRESS** — CF Worker stubs exist |
| SH-01 through SH-15 implementation | **SKELETON ONLY** — contracts documented, no code |
| SH-20 implementation | **IN PROGRESS** — GitHub Actions workflow exists |

---

## Claude Code Instructions

When working in ANY child repo that needs UT capabilities:

1. **READ this file first** — know what sub-hubs exist and what they do
2. **Do NOT rebuild UT capabilities in the child repo** — call UT through the rim
3. **Do NOT add direct dependencies on UT internals** — HTTP only, no imports
4. **Route through n8n or direct HTTP** — n8n for workflow integration, direct POST for simple calls
5. **Respect the cost funnel** — gates 1–6 are free, gate 7 costs money
6. **Error handling** — UT returns structured errors; child repo handles retries at its own layer
7. **Action field is the routing key** — SH-06 reads `payload.action` to pick the sub-hub
