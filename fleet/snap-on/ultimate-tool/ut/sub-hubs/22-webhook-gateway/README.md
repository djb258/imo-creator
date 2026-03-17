# Sub-Hub 22: Webhook Gateway

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 22-webhook-gateway |
| Driver | Workers + Hono |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Outbound notification surface. Pushes alerts when monitored content changes, crawls complete, or errors exceed thresholds. Manages webhook subscriptions, payload formatting, delivery retries, and delivery receipts.

## Interface Contract

### Triggers

Change events from orchestrator (19), error threshold alerts from error-queue (13), crawl completions from crawl-orchestration (02).

### Data Arrival

Structured event with type, payload, and subscriber list from emitting sub-hub.

### Emissions

HTTP POST to registered webhook URLs with signed payloads. Delivery receipts (success/failure/retry) logged. Dead-letter events for exhausted retries.

## Error Table

All errors are recorded in `ut_err.webhook_gateway_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | UT Hub |
