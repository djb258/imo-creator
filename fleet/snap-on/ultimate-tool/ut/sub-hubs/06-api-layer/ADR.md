# ADR: Hono for API Layer Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-06 |
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
| CC-02 (Hub) | [x] | REST API surface definition for UT hub |
| CC-03 (Context) | [x] | Sub-hub driver selection for API routing |
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

The UT hub requires a REST API layer to expose endpoints (POST /query, POST /ingest, GET /domains) to external consumers. This sub-hub is the rim — the ingress/egress surface that routes requests to appropriate sub-hubs via the Middle layer. All ingress is schema-validated. A lightweight, Cloudflare-native HTTP framework is required.

---

## Decision

Hono chosen for lightweight, Cloudflare-native routing. It provides a minimal, high-performance HTTP framework purpose-built for edge runtimes including Cloudflare Workers. Hono offers built-in middleware support for validation, CORS, and error handling with full TypeScript support and zero external dependencies.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Express | Not Cloudflare Workers-compatible; requires Node.js runtime |
| itty-router | Hono has better middleware ecosystem and TypeScript support |
| Do Nothing | API surface is a core requirement for UT; no alternative path exists |

---

## Consequences

### Enables

- Three REST endpoints exposed (POST /query, POST /ingest, GET /domains)
- Schema validation at ingress boundary
- Structured JSON responses at egress
- Middleware-based request pipeline (auth, validation, error handling)

### Prevents

- Direct sub-hub access bypassing the API layer
- Unvalidated requests reaching the Middle layer

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Per-endpoint rate limiting via CF Worker limits | CC-03 |
| Timeout | 30s per request processing | CC-03 |
| Kill Switch | Return 503 on error threshold breach | CC-03 |

---

## Rollback

Revert to raw Worker fetch handler without Hono routing. All endpoints would need manual request parsing. No data loss — api-layer is stateless per invocation.

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
