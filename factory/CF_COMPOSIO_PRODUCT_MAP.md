# CF + Composio Product Map — BAR-101

**Date**: 2026-03-12
**Scope**: Complete mapping of Cloudflare products and Composio gap coverage across the fleet
**Trigger**: BAR-100 (CF-primary architecture), BAR-101 (this ticket)
**Authority**: imo-creator (Sovereign CC-01)

---

## 1. Architecture Summary

Post BAR-100, the fleet operates on a three-layer architecture:

| Layer | Product | Role |
|-------|---------|------|
| Working | CF D1 / KV / Queues / R2 / Workers | Edge-primary compute + storage |
| Vault Sync | CF Hyperdrive | Nightly D1 to Neon sync pipe (BAR-102) |
| Vault | Neon PostgreSQL | Cold archive / system of record / disaster recovery |
| External Integration | Composio MCP | 500+ app router for non-CF/Neon/Doppler services |
| Secrets | Doppler | Centralized secrets management |

---

## 2. Cloudflare Product Inventory (20 Bindings)

### 2.1 D1 Databases (7)

| Binding | Database Name | Purpose | BAR Ticket | Replaced |
|---------|--------------|---------|------------|----------|
| `D1_REFERENCE_BIBLE` | svg-reference-bible | Glossary, architecture docs, schema reference, CF platform ref | BAR-100 | Neon sovereign DB (partial — reference subset) |
| `D1_ACTIVITY_LOG` | svg-activity-log | Womb-to-tomb client activity ledger (working DB at edge) | BAR-100 | Neon CL DB (activity tracking) |
| `D1_EMAIL_TRIAGE` | svg-email-triage | Email metadata index for client filing and triage | BAR-100 | Manual Gmail filing / no prior system |
| `D1_SOVEREIGN` | svg-d1-sovereign | Hot mirror of Neon sovereign DB (edge working copy) | BAR-100, BAR-102 | Neon sovereign DB (hot-path queries) |
| `D1_SPINE` | svg-d1-spine | Hot mirror of CL spine (edge working copy) | BAR-100, BAR-102 | Neon CL DB (hot-path queries) |
| `D1_OUTREACH_OPS` | svg-d1-outreach-ops | Hot mirror of outreach ops (edge working copy) | BAR-100, BAR-102 | Neon outreach DB (hot-path queries) |
| `D1_STORAGE` | svg-d1-storage | Hot mirror of storage DB (edge working copy) | BAR-100, BAR-102 | Neon storage DB (hot-path queries) |

**Pattern**: 3 purpose-built D1 databases + 4 hot mirrors of Neon vaults. Hot mirrors are synced nightly via Hyperdrive (BAR-102). Purpose-built D1s are CF-native with no Neon equivalent.

### 2.2 Hyperdrive Connections (7)

| Binding | Target Neon DB | Purpose | BAR Ticket | Replaced |
|---------|---------------|---------|------------|----------|
| `HD_SOVEREIGN` | ep-round-bird (sovereign) | Vault sync pipe to sovereign Neon | BAR-102 | Direct Neon hot-path connection |
| `HD_CL` | ep-empty-queen (CL) | Vault sync pipe to CL Neon | BAR-102 | Direct Neon hot-path connection |
| `HD_CLIENT` | ep-frosty-brook (client) | Vault sync pipe to client Neon | BAR-102 | Direct Neon hot-path connection |
| `HD_OUTREACH` | ep-ancient-waterfall (outreach) | Vault sync pipe to outreach Neon | BAR-102 | Direct Neon hot-path connection |
| `HD_RESEARCH` | ep-young-block (research) | Vault sync pipe to research Neon | BAR-102 | Direct Neon hot-path connection |
| `HD_SALES` | ep-orange-pine (sales) | Vault sync pipe to sales Neon | BAR-102 | Direct Neon hot-path connection |
| `HD_STORAGE` | ep-rapid-dream (storage) | Vault sync pipe to storage Neon | BAR-102 | Direct Neon hot-path connection |

**Pattern**: 1:1 Hyperdrive-to-Neon mapping. These are vault-sync-only pipes (nightly schedule). NOT used for hot-path queries. All 7 Neon instances remain as cold archive / system of record.

### 2.3 KV Namespaces (4)

| Binding | Purpose | BAR Ticket | Replaced |
|---------|---------|------------|----------|
| `KV_PIPELINE_STATE` | Outreach/sales stage tracking, video access tokens | BAR-100 | Neon tables / pg_notify (pipeline state), Vimeo tokens (video auth) |
| `KV_CONTENT_CACHE` | Edge cache for 600pg insurance knowledge base | BAR-100 | Neon direct queries (slow, cross-region) |
| `KV_EGRESS` | Field monitor egress (DeltaHound) | ADR-026, ADR-027 | No prior system (greenfield) |
| `KV_PARSER` | Field monitor parser (DeltaHound) | ADR-026, ADR-027 | No prior system (greenfield) |

**Pattern**: 2 new BAR-100 KV namespaces + 2 pre-existing DeltaHound KV namespaces. KV is read-optimized and eventually consistent (up to 60s). Used for hot reads, not transactional data.

### 2.4 Queues (1)

| Binding | Queue Name | Purpose | BAR Ticket | Replaced |
|---------|-----------|---------|------------|----------|
| `QUEUE_SIGNAL` | svg-signal-queue | LCS signals from sub-hubs waiting to be processed | BAR-100 | Neon tables / pg_notify, n8n webhooks @ Hostinger |

**Status**: Producer binding active. Consumer handler not yet implemented. When active, this replaces the n8n orchestration layer that ran on the retired Hostinger VPS.

### 2.5 R2 Object Storage (1)

| Binding | Bucket | Purpose | BAR Ticket | Replaced |
|---------|--------|---------|------------|----------|
| `R2_FILES` | svg-files | PDFs, exports, client deliverables, video hosting | BAR-100, BAR-103 | Vimeo (video hosting), local file shares, various cloud storage |

**Key feature**: Zero egress cost. Video hosting endpoint (`/video/*`) already implemented in Workers with token-gated access, Range header support for seeking.

### 2.6 Workers (1 deployed)

| Worker | Framework | Purpose | BAR Ticket | Replaced |
|--------|-----------|---------|------------|----------|
| `svgagency-api` | Hono | Unified API rim for all hubs | BAR-100 | Legacy serverless functions, legacy orchestration VPS, legacy hosting serverless |

**Endpoints implemented**:
- `/health` and `/health/:db` -- database connectivity checks (all 7 Hyperdrive pipes)
- `/domains` -- sub-hub registry with health status
- `/query` -- multi-action dispatcher (LCS cycle, LCS query, outreach query, schema inspect)
- `/ingest` -- write endpoint with LCS smoke test
- `/outreach/send` and `/outreach/health` -- outreach stubs
- `/video/*` -- full CRUD video hosting with R2 + token auth (BAR-103)

---

## 3. Complete "What Replaced What" Table

| Before (Pre-BAR-100) | After (BAR-100+) | CF Product(s) | BAR Ticket |
|----------------------|------------------|---------------|------------|
| Neon PostgreSQL (hot-path working DB) | CF D1 (edge SQLite) | D1 x7 | BAR-100 |
| Neon direct queries (hot reads) | CF KV (edge key-value) | KV x4 | BAR-100 |
| Neon tables / pg_notify (message queues) | CF Queues (async signals) | Queues x1 | BAR-100 |
| Neon (also working + archive) | Neon (vault-only) + Hyperdrive (sync) | Hyperdrive x7 | BAR-100, BAR-102 |
| Vimeo (video hosting) | CF R2 + Workers (token-gated video) | R2 x1, Workers | BAR-103 |
| Various cloud storage | CF R2 (zero egress) | R2 x1 | BAR-100 |
| Legacy serverless functions | CF Workers | Workers x1 | BAR-100 |
| Legacy orchestration VPS | CF Workers + Queues | Workers x1, Queues x1 | BAR-100 |
| Legacy hosting serverless | CF Workers | Workers x1 | BAR-100 |
| Legacy UI platform (retired) | Figma UI (design only) | N/A (UI layer, not CF) | BAR-100 |
| Instantly.ai (email outreach) | Mailgun (transactional email) | N/A (via Composio) | BAR-100 |
| Zapier / Make (automations) | CF Workers + Queues + Composio | Workers, Queues | BAR-100 |

---

## 4. Composio Gap Coverage

Composio covers what CF cannot do natively: third-party SaaS integration. All Composio traffic routes through a single MCP server (`composio-sovereign`, TOOL-007, Tier 1 at $30/month).

### 4.1 Connected Toolkits (Active)

| Toolkit | Purpose | What CF Cannot Do Here | Auth Status | Fleet Consumer |
|---------|---------|----------------------|-------------|----------------|
| Gmail | Email send/read/draft/triage | CF has no email service (R2/D1 store metadata, Gmail does the sending) | Pending OAuth | D1_EMAIL_TRIAGE indexes; Gmail sends/receives |
| Slack | Team messaging, notifications | CF has no chat integration | Pending OAuth | Workers can trigger via Composio API |
| Google Sheets | Spreadsheet read/write | CF has no spreadsheet service | Pending OAuth | Pipeline data export/import |
| Google Calendar | Calendar events, scheduling | CF has no calendar service | Pending OAuth | Client scheduling, appointment management |
| GitHub | Repo/PR/issue management | CF has no source control integration | Pending OAuth | Fleet management, CI coordination |

### 4.2 Planned Toolkits (Not Yet Added)

| Toolkit | Purpose | What CF Cannot Do Here | Priority | Fleet Consumer |
|---------|---------|----------------------|----------|----------------|
| HubSpot | CRM integration | CF has no CRM | High | Client + Sales hubs |
| Mailgun | Transactional email sending | CF has no email delivery service | High | Outreach hub (replaces Instantly.ai) |
| HeyReach | LinkedIn outreach automation | CF has no LinkedIn API | Medium | Outreach hub |
| Linear | Project management | CF has no project management | Medium | Fleet ops coordination |

### 4.3 Composio Routing Rule

| Request Type | Route | Product |
|-------------|-------|---------|
| DNS, CDN, Workers, D1, KV, Queues, R2 | Cloudflare (direct) | CF native |
| Working database queries | CF D1 (direct binding) | D1 |
| Vault database queries | Neon (direct PostgreSQL) | Neon |
| Secrets management | Doppler (direct CLI) | Doppler |
| **All third-party SaaS** | **Composio-first** | Composio MCP |

---

## 5. CF Product to BAR Ticket Cross-Reference

| BAR Ticket | Description | CF Products Involved |
|------------|-------------|---------------------|
| BAR-100 | CF-primary architecture shift | D1 x7, KV x2 (new), Queues x1, R2 x1, Workers x1 |
| BAR-101 | CF + Composio product mapping (this document) | Documentation only |
| BAR-102 | Hyperdrive vault-sync (nightly D1 to Neon) | Hyperdrive x7 |
| BAR-103 | Video hosting migration (Vimeo to R2) | R2 x1, KV x1 (token store), Workers (video endpoints) |
| BAR-104 | Architecture shift fleet audit | All (audit sweep, no new resources) |
| ADR-026 | DeltaHound tool registration | KV x2 (pre-existing: KV_EGRESS, KV_PARSER) |
| ADR-027 | DeltaHound scheduler selection | GitHub Actions selected (CF Scheduled Workers evaluated, rejected) |
| ADR-028 | LOCKED file platform purge | Documentation only (SNAP_ON_TOOLBOX, CONSTITUTION, hostinger templates) |

---

## 6. Unserved Gaps

These capabilities are not covered by CF natively or by Composio toolkits:

| Gap | Description | Current Status | Candidate Solution |
|-----|-------------|---------------|-------------------|
| Apollo/PDL enrichment | Company/people data enrichment APIs | No Composio toolkit exists; accessed via direct API calls | Custom Workers + direct API (already in outreach pipeline) |
| HeyReach LinkedIn automation | LinkedIn outreach at scale | Composio toolkit planned but not connected | Composio HeyReach toolkit (when available) |
| Nightly vault sync scheduler | Trigger for Hyperdrive D1-to-Neon sync | Queue consumer not yet implemented | CF Cron Trigger or GitHub Actions (BAR-102 pending implementation) |
| D1 schema migrations | DDL management for 7 D1 databases | No built-in migration tool for D1 | Wrangler CLI + custom migration scripts |
| Full-text search | Search across D1 content | D1 has no FTS; KV is key-only | Vectorize (CF AI product) or external search service |
| Webhook ingestion | Receiving webhooks from external services | Workers can receive but no dedicated webhook management | Workers endpoint + Queue for async processing |
| SMS / Voice | Phone-based communication | Neither CF nor Composio covers this natively | Twilio (not yet evaluated, not in SNAP_ON_TOOLBOX) |

---

## 7. Binding Count Summary

| CF Product | Count | Monthly Cost (est.) |
|-----------|-------|-------------------|
| D1 Databases | 7 | Free tier (5GB each, 10GB max) |
| Hyperdrive | 7 | Included in Workers plan |
| KV Namespaces | 4 | Free tier (1GB storage, 100K reads/day) |
| Queues | 1 | $0.40/M operations |
| R2 Buckets | 1 | Free tier (10GB), then $0.015/GB-month |
| Workers | 1 | $5/mo base (10M requests included) |
| **Total Bindings** | **20** | **~$5/mo base + usage** |
| Composio MCP | 1 server | $30/mo fixed |
| **Combined** | **21** | **~$35/mo base** |

---

## 8. Infrastructure Diagram

```
                         ┌─────────────────────────────────┐
                         │     svgagency-api (Worker)       │
                         │     Hono framework, edge         │
                         │                                  │
                         │  Endpoints:                      │
                         │    /health, /domains, /query     │
                         │    /ingest, /outreach/*          │
                         │    /video/* (BAR-103)            │
                         └──────────┬───────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────────┐
              │                     │                         │
     ┌────────┴────────┐  ┌────────┴────────┐  ┌────────────┴──────────┐
     │   D1 (x7)       │  │   KV (x4)       │  │  R2 + Queues          │
     │                  │  │                  │  │                       │
     │  REFERENCE_BIBLE │  │  PIPELINE_STATE  │  │  R2_FILES (svg-files) │
     │  ACTIVITY_LOG    │  │  CONTENT_CACHE   │  │  QUEUE_SIGNAL         │
     │  EMAIL_TRIAGE    │  │  KV_EGRESS       │  │                       │
     │  D1_SOVEREIGN    │  │  KV_PARSER       │  │                       │
     │  D1_SPINE        │  │                  │  │                       │
     │  D1_OUTREACH_OPS │  └──────────────────┘  └───────────────────────┘
     │  D1_STORAGE      │
     └────────┬─────────┘
              │ nightly sync (BAR-102)
     ┌────────┴─────────┐
     │  Hyperdrive (x7)  │
     │  HD_SOVEREIGN     │
     │  HD_CL            │──────────┐
     │  HD_CLIENT        │          │
     │  HD_OUTREACH      │     ┌────┴──────────┐
     │  HD_RESEARCH      │     │  Neon Vault    │
     │  HD_SALES         │     │  (7 instances) │
     │  HD_STORAGE       │     │  Cold archive  │
     └──────────────────┘     └───────────────┘

     ┌──────────────────────────────────────────┐
     │         Composio MCP (composio-sovereign) │
     │                                           │
     │   Gmail  |  Slack  |  Sheets  |  Calendar │
     │   GitHub |  [HubSpot] | [Mailgun]         │
     │   [HeyReach] | [Linear]                   │
     │                                           │
     │   $30/mo | 60 req/app/min                 │
     └──────────────────────────────────────────┘
```

---

## Document Control

| Field | Value |
|-------|-------|
| BAR Reference | BAR-101 |
| Created | 2026-03-12 |
| Last Modified | 2026-03-12 |
| Authority | Operations (Human + AI) |
| Related Files | `docs/operations/CF_INFRASTRUCTURE_REGISTRY.yaml`, `docs/operations/COMPOSIO_MCP_REGISTRY.md`, `docs/audit/BAR-104_ARCHITECTURE_SHIFT_AUDIT.md` |
| Related BAR Tickets | BAR-100, BAR-102, BAR-103, BAR-104 |
| Related ADRs | ADR-026, ADR-027, ADR-028 |
