# ADR: Workers Queues Selection for Error Queue

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-013 |
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

Sub-hub 13 (error-queue) requires a message queuing system to collect, queue, and route error events from all sub-hubs. The queue must support guaranteed delivery, dead-letter handling for unrecoverable failures, and retry orchestration for transient errors. The solution must be CF Native with zero external infrastructure.

## Decision

Use Workers Queues as the error event queuing system. Workers Queues provides native CF message queuing with guaranteed delivery, built-in retry logic, and dead-letter queue support — all without external infrastructure or credentials.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| RabbitMQ | External infrastructure — requires separate hosting and management |
| SQS | AWS dependency — violates CF Native constraint |
| Custom polling | Reinventing solved problems — unreliable delivery guarantees |

## Consequences

**Enables:**
- Guaranteed message delivery for all error events across sub-hubs
- Native dead-letter queue for terminal failures
- Built-in retry with configurable backoff for transient errors
- Zero external infrastructure — fully managed by CF

**Prevents:**
- Advanced message routing patterns (topic exchanges, fan-out beyond CF capabilities)
- Cross-cloud queue federation
- Message persistence beyond CF Queue retention limits

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Error events conform to structured schema | Ingress validation |
| Dead-letter queue monitored for accumulation | Observability alerts |
| Retry count bounded to prevent infinite loops | Queue configuration |
| Queue bindings declared in wrangler.toml | Deployment validation |

## Rollback

Revert to synchronous error logging if Workers Queues proves insufficient. Redirect error events to D1-based error tables directly, losing async decoupling but maintaining error capture. No external dependencies affected.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 13-error-queue |
| Driver | Workers Queues |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
