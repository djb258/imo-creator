# UT — Ultimate Tool

## Overview

UT is a sovereign Cloudflare-native platform organized as 25 sub-hubs under imo-creator (CC-01). It provides browser automation, knowledge ingestion, and data processing capabilities through a strict Hub-Spoke geometry with IMO data flow.

- **Authority**: CC-02 (Hub) under imo-creator (CC-01 Sovereign)
- **CTB Placement**: `app/garage/ut/`
- **Hub**: Claude Code — all logic, all decisions, all orchestration
- **Rim**: Cloudflare Worker REST API (Hono) — ingress/egress surface only

---

## Architecture

### Hub-Spoke Geometry

UT follows Hub-Spoke architecture. The hub (Claude Code) owns all logic. The rim (Cloudflare Worker) is the execution surface. Sub-hubs are sovereign — each knows nothing about the others. No sideways calls are permitted.

### IMO Flow

| Layer | Rule |
|-------|------|
| Ingress | Schema validation only. No decisions. No logic. |
| Middle | All logic, all decisions, all state, all tools. |
| Egress | Read-only views only. No logic. No mutations. |

### CTB Placement

All UT source lives under `app/garage/ut/`. Sub-hubs are organized as numbered directories under `app/garage/ut/sub-hubs/`.

---

## Sub-Hub Tiers

### Tier 1 — External (01-05)

Browser layer. These sub-hubs require a browser runtime or external service and **cannot run inside Cloudflare**.

### Tier 2 — CF Native (06-25)

Native Cloudflare services. These sub-hubs run entirely within the Cloudflare platform. Sub-hubs 16-19 implement the **7-gate funnel** owned by sub-hub 19-orchestrator, handling fetch, parse, proxy, and orchestration for monitoring workflows.

---

## Rim Interface

The Hono REST API exposes three endpoints:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/query` | Query knowledge base |
| POST | `/ingest` | Ingest new content |
| GET | `/domains` | List tracked domains |

---

## Sub-Hub Registry

| Number | Name | Driver | Category | Responsibility |
|--------|------|--------|----------|----------------|
| 01 | browser-control | Puppeteer / Playwright | External | Launch and control headless browser sessions |
| 02 | crawl-orchestration | Crawl scheduler | External | Schedule, prioritize, and coordinate crawl jobs |
| 03 | knowledge-ingestion | Content extractor | External | Extract and normalize content from crawled pages |
| 04 | auth-management | Session / cookie manager | External | Manage authentication sessions and credentials for target sites |
| 05 | fallback-scraping | Raw HTTP fallback | External | Fetch pages via raw HTTP when browser automation is unavailable |
| 06 | api-layer | Hono REST API | CF Native | Expose rim endpoints and route inbound requests |
| 07 | vector-brain | Vectorize | CF Native | Store and query vector embeddings for semantic search |
| 08 | doc-storage | R2 | CF Native | Store raw documents and crawl artifacts |
| 09 | llm-router | Workers AI | CF Native | Route prompts to appropriate LLM models |
| 10 | runtime | Workers / DO | CF Native | Execute worker logic and manage durable state |
| 11 | structured-data | D1 | CF Native | Store structured metadata, domain records, and relational data |
| 12 | embedding | Workers AI | CF Native | Generate vector embeddings from text content |
| 13 | error-queue | Queues | CF Native | Queue failed operations for retry and dead-letter handling |
| 14 | observability | Logpush / Analytics | CF Native | Collect logs, metrics, and operational telemetry |
| 15 | scheduling | Cron Triggers | CF Native | Trigger scheduled crawls and maintenance tasks |
| 16 | fetcher | HTTP fetch | CF Native | Fetch field data from target URLs |
| 17 | parser-registry | Parser selection | CF Native | Select and apply the correct parser for each content type |
| 18 | proxy-router | Proxy rotation | CF Native | Rotate proxy endpoints to avoid rate limiting |
| 19 | orchestrator | Funnel orchestrator | CF Native | Own the 7-gate funnel and coordinate UT monitoring workflow |
| 20 | cache-layer | Workers KV | CF Native | Hot-path caching between consumers and storage |
| 21 | dedup-engine | D1 + Workers | CF Native | Content-level deduplication via fingerprinting |
| 22 | webhook-gateway | Workers + Hono | CF Native | Outbound notifications on content changes and alerts |
| 23 | rate-limiter | Workers KV + Durable Objects | CF Native | Centralized per-domain and global rate limiting |
| 24 | content-transformer | Workers | CF Native | Content normalization — HTML cleanup, markdown conversion, boilerplate removal |
| 25 | access-control | Workers + D1 | CF Native | API key management, tenant isolation, and auth gate |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
