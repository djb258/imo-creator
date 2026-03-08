# ADR: Cloudflare AI Gateway for LLM Router Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-09 |
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
| CC-02 (Hub) | [x] | LLM routing policy and cost governance for UT hub |
| CC-03 (Context) | [x] | Sub-hub driver selection for LLM inference routing |
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

The UT hub requires controlled LLM inference routing for edge-case arbitration after deterministic logic is exhausted. This sub-hub manages model selection, rate limiting, caching, and cost tracking through a unified gateway. LLM is TAIL ONLY — deterministic solutions are always evaluated first. A Cloudflare-native gateway with built-in observability is required.

---

## Decision

CF AI Gateway chosen for unified LLM routing with built-in caching, rate limiting, and analytics. It provides a single control plane for all LLM inference requests with native Cloudflare integration, request/response logging, and cost tracking. No external dependencies required.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Direct API calls | No observability, no caching, no rate limiting; impossible to enforce tail-only policy |
| LangChain | Adds abstraction overhead; violates determinism-first doctrine; external dependency |
| Do Nothing | LLM arbitration for edge cases is a core requirement; no alternative path exists |

---

## Consequences

### Enables

- Unified LLM routing through a single gateway
- Built-in caching to reduce redundant inference calls
- Rate limiting and cost tracking per model
- Request/response logging for audit and observability

### Prevents

- Uncontrolled direct LLM API calls
- LLM usage without observability
- LLM as primary decision maker (gateway enforces tail-only pattern)

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Per-model rate limiting via AI Gateway configuration | CC-03 |
| Timeout | 30s per inference request | CC-03 |
| Kill Switch | Disable LLM routing on cost threshold breach; return deterministic fallback | CC-03 |

---

## Rollback

Revert to direct API calls without gateway routing. Caching, rate limiting, and analytics would be lost. No data loss — LLM router is stateless per invocation.

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
