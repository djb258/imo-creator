# ADR: Workers Cron Triggers Selection for Scheduling

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-015 |
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

Sub-hub 15 (scheduling) requires a scheduled execution runtime for recurring tasks — crawl refreshes, stale content checks, metric aggregation, and health checks. The scheduler must support sub-minute granularity and integrate natively with CF Workers. No external scheduling infrastructure is permitted.

## Decision

Use Workers Cron Triggers as the scheduled execution runtime. Cron Triggers provide native CF scheduled execution with sub-minute granularity, direct Worker bindings, and zero external infrastructure — configured entirely via wrangler.toml.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| External cron (Linux crontab) | No CF integration — requires separate server infrastructure |
| Temporal | Massive overhead for simple scheduling needs — enterprise workflow engine unnecessary |

## Consequences

**Enables:**
- Native scheduled execution at CF edge with sub-minute granularity
- Zero external infrastructure — schedules declared in wrangler.toml
- Direct Worker invocation — no HTTP trigger overhead for scheduled tasks
- Multiple independent schedules per Worker

**Prevents:**
- Complex workflow orchestration (multi-step, conditional branching)
- Dynamic schedule modification at runtime (requires redeployment)
- Sub-second scheduling precision

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| All schedules declared in wrangler.toml | Deployment validation |
| Scheduled tasks bounded by execution time limits | CF Worker CPU limits |
| Overlapping executions handled idempotently | Task implementation contract |
| Schedule intervals validated against rate limits | Configuration review |

## Rollback

Revert to HTTP-triggered execution with external scheduler if Cron Triggers proves insufficient. Convert scheduled Workers to HTTP-callable endpoints, use Queues-based delayed messages as fallback trigger mechanism. No external dependencies introduced.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 15-scheduling |
| Driver | Workers Cron Triggers |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
