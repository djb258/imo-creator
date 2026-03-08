# ADR: Crawlee for Crawl Orchestration Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-02 |
| **Status** | [x] Proposed / [ ] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-03-08 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | CC-01 |
| **Hub Name** | UT (Universal Toolkit) |
| **Hub ID** | ut |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [ ] | |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [x] | Sub-hub driver selection for crawl management |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [x] |
| O — Egress | [x] |

---

## Context

The UT hub requires systematic site traversal with crawl queue management, deduplication, rate limiting, and scheduling. This sub-hub orchestrates browser-control for multi-page crawling and operates in the browser layer (EXTERNAL). A production-grade crawl framework is needed to avoid reinventing request queuing and anti-blocking logic.

---

## Decision

Crawlee chosen for production-grade crawl management with built-in request queuing and anti-blocking. It provides native Puppeteer integration, automatic request deduplication, configurable rate limiting, and retry logic out of the box. Crawlee runs in Node.js and integrates directly with the browser-control sub-hub.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Scrapy | Python-only; does not integrate with Puppeteer browser instances |
| Custom crawl solution | Reinventing solved problems; request queuing, dedup, and rate limiting are complex to build correctly |
| Do Nothing | Systematic site traversal is a core UT requirement; manual URL management is not viable |

---

## Consequences

### Enables

- Managed crawl queues with automatic deduplication
- Configurable rate limiting per domain
- Built-in retry and error handling for failed requests
- Integration with browser-control sub-hub via Puppeteer crawler
- Crawl scheduling and depth control

### Prevents

- Running inside Cloudflare Workers (EXTERNAL sub-hub by design)
- Using non-Node.js crawl frameworks

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Configurable per-domain request rate; default 1 req/s | CC-03 |
| Timeout | 120s per crawl job, 30s per individual page | CC-03 |
| Kill Switch | Halt all active crawls on error threshold or manual trigger | CC-03 |

---

## Rollback

Disable Crawlee and revert to direct single-URL fetching via browser-control. Crawl queue state is ephemeral and can be discarded. No persistent data loss — crawl results already emitted downstream are unaffected.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md |
| PRD | |
| Work Items | |
| PR(s) | |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | | |
| Reviewer | | |
