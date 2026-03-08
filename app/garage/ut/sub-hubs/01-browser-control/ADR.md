# ADR: Puppeteer for Browser Control Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-01 |
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
| CC-03 (Context) | [x] | Sub-hub driver selection for browser automation |
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

The UT hub requires headless browser automation to navigate URLs, execute page interactions, and capture rendered DOM. This sub-hub operates in the browser layer (EXTERNAL) and cannot run inside Cloudflare Workers. A driver must be selected that supports full JavaScript rendering and programmatic page control.

---

## Decision

Puppeteer chosen for full browser automation with JS rendering. It provides a high-level API to control headless Chrome/Chromium, supports all required page interaction patterns (navigation, clicking, form filling, screenshot capture), and has the widest ecosystem support among CF Workers-adjacent tooling.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Playwright | Wider CF Workers ecosystem support with Puppeteer; Playwright adds multi-browser complexity not needed here |
| Selenium | Too heavy, requires JVM; operational burden exceeds value for headless-only use case |
| Do Nothing | Browser automation is a core requirement for UT; no alternative path exists |

---

## Consequences

### Enables

- Full JavaScript-rendered page capture
- Programmatic page interaction (clicks, form fills, navigation)
- Screenshot and DOM snapshot capture
- Integration with downstream crawl-orchestration sub-hub

### Prevents

- Running inside Cloudflare Workers (EXTERNAL sub-hub by design)
- Multi-browser testing (Chromium only)

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Max concurrent browser instances bounded by host memory | CC-03 |
| Timeout | 30s per page navigation, 60s per action sequence | CC-03 |
| Kill Switch | Terminate all browser instances on error threshold breach | CC-03 |

---

## Rollback

Revert to direct HTTP fetching without JS rendering. Downstream sub-hubs consuming rendered DOM would fall back to raw HTML. No data loss — browser-control is stateless per invocation.

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
