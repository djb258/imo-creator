# Sub-Hub 15: Scheduling

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 15-scheduling |
| Driver | Workers Cron Triggers |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Schedules recurring tasks — crawl refreshes, stale content checks, metric aggregation, health checks. Time-based trigger surface.

## Interface Contract

### Triggers

Cron schedule fires at configured intervals.

### Data Arrival

Cron event with schedule name, execution timestamp, configuration.

### Emissions

Task dispatch events to target sub-hubs, schedule execution logs.

## Error Table

All errors are recorded in `ut_err.scheduling_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
