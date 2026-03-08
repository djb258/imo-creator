# ADR: Workers Analytics Engine Selection for Observability

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-014 |
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

Sub-hub 14 (observability) requires an analytics platform to collect and surface operational metrics, request traces, and performance data across all sub-hubs. The platform must support SQL-queryable data points for dashboard-ready analytics. The solution must be CF Native with zero external monitoring infrastructure.

## Decision

Use Workers Analytics Engine as the telemetry and analytics platform. Workers Analytics Engine provides native CF analytics with SQL-queryable data points, high-cardinality event ingestion, and direct Worker bindings — all without external monitoring infrastructure.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Datadog | External dependency — adds cost and vendor lock outside CF ecosystem |
| Prometheus | Requires separate infrastructure — UT does not own monitoring servers |

## Consequences

**Enables:**
- Native high-cardinality event ingestion at CF edge
- SQL-queryable analytics for dashboards and alerting
- Direct Worker bindings — no external credentials or network egress
- Real-time operational visibility across all sub-hubs

**Prevents:**
- Advanced APM features (distributed tracing correlation, flame graphs)
- Long-term metric retention beyond Analytics Engine limits
- Cross-platform observability federation with non-CF systems

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Telemetry events conform to structured schema | Ingress validation |
| Data point cardinality monitored to prevent cost overrun | Analytics Engine limits |
| Alert thresholds defined for critical sub-hub metrics | Configuration review |
| Analytics Engine binding declared in wrangler.toml | Deployment validation |

## Rollback

Revert to console.log-based observability if Workers Analytics Engine proves insufficient. Structured logs captured by CF dashboard provide basic visibility. Metric aggregation would move to D1-based counters with scheduled rollup queries.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 14-observability |
| Driver | Workers Analytics Engine |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
