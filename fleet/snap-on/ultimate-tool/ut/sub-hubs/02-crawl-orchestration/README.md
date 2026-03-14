# 02-crawl-orchestration

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | ut-sh-02 |
| **Driver** | Crawlee |
| **Category** | EXTERNAL (browser layer, cannot run inside Cloudflare) |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT (Universal Toolkit) |

---

## Responsibility

Manages crawl queues, deduplication, rate limiting, and crawl scheduling. Orchestrates browser-control for systematic site traversal.

---

## Interface Contract

### Triggers

Ingest request specifying domain or URL pattern to crawl.

### Data Arrival

Domain/URL pattern via ingress with crawl config (depth, rate, selectors).

### Emissions

Crawl completion events with page inventory, crawl metadata.

---

## Error Table

Error table: `ut_err.crawl_orchestration_errors`

See `schema.sql` for table definition.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
