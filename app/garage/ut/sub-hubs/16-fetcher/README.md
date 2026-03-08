# Sub-Hub 16: Fetcher

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 16-fetcher |
| Driver | Workers + ScraperAPI |
| Category | CF Native (Field Monitor) |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Field Monitor fetch layer. Executes targeted HTTP fetches against monitored domains. Checks for content changes, new pages, structural shifts. First gate in the 7-gate funnel.

## Interface Contract

### Triggers

Scheduled check from 15-scheduling or on-demand from 19-orchestrator.

### Data Arrival

Fetch target list with URLs, expected hashes, last-seen timestamps.

### Emissions

Raw fetch results with change detection flags (changed/unchanged/error), new content hashes.

## Error Table

All errors are recorded in `ut_err.fetcher_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
