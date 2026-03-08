# ADR: Workers + ScraperAPI Selection for Fetcher

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-016 |
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

Sub-hub 16 (fetcher) is the Field Monitor fetch layer. It executes targeted HTTP fetches against monitored domains, checking for content changes, new pages, and structural shifts. It serves as the first gate in the 7-gate funnel owned by sub-hub 19-orchestrator. The solution must support reliable fetching with proxy fallback for protected sites.

## Decision

Use Workers + ScraperAPI as the fetch runtime. Workers provides the native CF execution surface. ScraperAPI provides proxy rotation and anti-detection capabilities for fetching protected domains. Together they deliver reliable change detection with fallback paths.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Pure Workers fetch | Lacks proxy rotation for protected sites — blocked by anti-bot measures |
| Puppeteer | Too heavy for simple change detection — External tier only, violates CF Native constraint |

## Consequences

**Enables:**
- Reliable HTTP fetching with proxy fallback for protected domains
- Content change detection via hash comparison
- Native CF execution with ScraperAPI as a controlled external dependency
- First gate in the 7-gate funnel with clear pass/fail semantics

**Prevents:**
- JavaScript-rendered content capture (requires browser — handled by External sub-hubs)
- Zero-dependency CF Native status (ScraperAPI is an external service)
- Unlimited fetch volume without ScraperAPI tier constraints

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Fetch timeout enforced per request | Runtime assertion |
| Response size validated before processing | Ingress validation |
| ScraperAPI key stored in secrets provider | Doppler binding |
| Change detection hash algorithm pinned | Configuration constant |

## Rollback

Revert to pure Workers fetch if ScraperAPI proves unreliable or cost-prohibitive. Remove ScraperAPI dependency from Worker bindings, accept reduced coverage of protected domains. Fetch targets that require proxy rotation would be flagged as unreachable until an alternative proxy provider is selected.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 16-fetcher |
| Driver | Workers + ScraperAPI |
| Category | CF Native (Field Monitor) |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
