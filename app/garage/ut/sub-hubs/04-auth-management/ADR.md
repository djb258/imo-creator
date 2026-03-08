# ADR: Puppeteer Cookie Store for Auth Management Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-04 |
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
| CC-03 (Context) | [x] | Sub-hub driver selection for auth management |
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

The UT hub requires authentication state management for accessing protected websites during browser automation and crawling. This sub-hub operates in the browser layer (EXTERNAL) and must handle login flows, cookie persistence, and session rotation for browser-control to consume.

---

## Decision

Puppeteer Cookie Store chosen for direct browser session management. It provides native integration with the Puppeteer browser instances used by browser-control, enabling seamless cookie injection, extraction, and persistence. Session state is managed deterministically through explicit cookie read/write operations rather than implicit browser state.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| OAuth library | Most target sites use form-based auth, not OAuth flows |
| Shared cookie jar | Violates sub-hub sovereignty; each sub-hub must own its own state |
| Do Nothing | Protected content is inaccessible without auth management; blocks crawl coverage |

---

## Consequences

### Enables

- Automated login flows for protected sites
- Cookie and session persistence across browser instances
- Credential rotation via Doppler secure store integration
- Seamless auth handoff to browser-control sub-hub

### Prevents

- Running inside Cloudflare Workers (EXTERNAL sub-hub by design)
- Shared session state between sub-hubs (sovereignty preserved)

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Max 5 concurrent auth sessions per domain | CC-03 |
| Timeout | 30s per login flow attempt | CC-03 |
| Kill Switch | Disable auth for domain after 3 consecutive failures | CC-03 |

---

## Rollback

Revert to manual credential injection without automated session management. Browser-control would require pre-configured cookies passed as static config. No data loss — auth state is ephemeral by design.

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
