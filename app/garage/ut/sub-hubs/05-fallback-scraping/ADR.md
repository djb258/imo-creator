# ADR: ScraperAPI for Fallback Scraping Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-05 |
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
| CC-03 (Context) | [x] | Sub-hub driver selection for fallback scraping |
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

The UT hub requires a fallback mechanism when primary scraping via Puppeteer/Crawlee encounters anti-bot protection, CAPTCHAs, or IP blocking. This sub-hub operates in the browser layer (EXTERNAL) and provides managed proxy infrastructure with CAPTCHA handling as a last-resort scraping path.

---

## Decision

ScraperAPI chosen for managed proxy infrastructure with CAPTCHA handling. It provides residential IP rotation, automatic CAPTCHA solving, and anti-detection measures through a simple API interface. The managed service approach eliminates the operational burden of maintaining proxy infrastructure while providing reliable fallback scraping capability.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Bright Data | Higher cost and complexity for equivalent capability |
| Self-hosted proxies | Operational burden of maintaining proxy infrastructure exceeds value |
| Do Nothing | Anti-bot protection would create blind spots in crawl coverage; unacceptable data gaps |

---

## Consequences

### Enables

- Scraping of anti-bot protected pages via managed proxy rotation
- CAPTCHA bypass through ScraperAPI managed solving
- Residential IP pools for sites that block datacenter IPs
- Terminal failure reporting when all scraping strategies are exhausted

### Prevents

- Running inside Cloudflare Workers (EXTERNAL sub-hub by design)
- Self-hosted proxy management overhead

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Max 20 concurrent fallback requests | CC-03 |
| Timeout | 60s per scrape attempt | CC-03 |
| Kill Switch | Disable fallback for domain after 5 consecutive terminal failures | CC-03 |

---

## Rollback

Revert to primary scraping only (Puppeteer/Crawlee) without fallback path. Pages behind anti-bot protection would return terminal failure immediately. No data loss — fallback scraping is a retry mechanism, not a data store.

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
