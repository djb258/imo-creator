# ADR: Workers + Hono Selection for Proxy Router

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-018 |
| Status | [x] PROPOSED [ ] ACCEPTED [ ] DEPRECATED [ ] SUPERSEDED |
| Date | 2026-03-08 |

## Owning Hub

| Field | Value |
|-------|-------|
| Sovereign ID | imo-creator |
| Hub Name | UT |
| Hub ID | ut |

## CC Layer Scope

| Layer | In Scope |
|-------|----------|
| CC-01 | [ ] |
| CC-02 | [x] |
| CC-03 | [x] |
| CC-04 | [ ] |

## IMO Layer Scope

| Layer | In Scope |
|-------|----------|
| I (Ingress) | [ ] |
| M (Middle) | [x] |
| O (Egress) | [ ] |

## Context

Sub-hub 18 (proxy-router) selects the optimal proxy chain for each fetch target based on domain difficulty, geo requirements, and rate limits. It routes through ScraperAPI tiers to ensure fetcher requests succeed against protected domains. The routing logic requires middleware support for request classification and proxy selection.

## Decision

Use Workers + Hono as the proxy routing runtime. Workers provides the native CF execution surface. Hono provides lightweight middleware support for request classification, proxy selection logic, and rate limit enforcement without framework overhead.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Dedicated proxy service | Adds infrastructure UT doesn't control — external dependency |
| Hardcoded proxy config | Cannot adapt to domain-specific requirements — no dynamic routing |

## Consequences

**Enables:**
- Lightweight proxy routing with Hono middleware for request classification
- Dynamic proxy selection based on domain difficulty and geo requirements
- Rate limit enforcement per domain and proxy tier
- Native CF execution with direct service bindings to 16-fetcher

**Prevents:**
- Complex proxy chain management beyond ScraperAPI tiers
- Proxy provider independence (tightly coupled to ScraperAPI tier model)
- Stateful proxy session management (Workers are stateless per request)

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Proxy selection deterministic — no LLM involvement | Code review + runtime assertion |
| Rate limit state checked before proxy assignment | Middleware enforcement |
| Proxy credentials stored in secrets provider | Doppler binding |
| Fallback proxy path defined for every difficulty tier | Configuration validation |

## Rollback

Revert to static proxy configuration if dynamic routing proves unreliable. Replace Hono middleware with a static lookup table mapping domains to proxy configs. Accept reduced adaptability for protected domains. Hono can be removed without affecting Worker deployment.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 18-proxy-router |
| Driver | Workers + Hono |
| Category | CF Native (Field Monitor) |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
