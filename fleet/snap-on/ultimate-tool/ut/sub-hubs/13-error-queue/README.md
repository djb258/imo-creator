# Sub-Hub 13: Error Queue

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 13-error-queue |
| Driver | Workers Queues |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Collects, queues, and routes error events from all sub-hubs. Dead letter queue for unrecoverable failures. Retry orchestration for transient errors.

## Interface Contract

### Triggers

Any sub-hub emits an error event.

### Data Arrival

Structured error events with sub-hub source, error code, context, severity.

### Emissions

Retry dispatches for transient errors, dead-letter records for terminal failures, error aggregation metrics.

## Error Table

All errors are recorded in `ut_err.error_queue_errors` (meta — errors about the error queue itself).

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
