# Sub-Hub 19: Orchestrator

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 19-orchestrator |
| Driver | Workers Runtime |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

UT orchestrator. Owns the 7-gate funnel governing the UT monitoring workflow.

## Interface Contract

### Triggers

Scheduled UT monitoring cycle from 15-scheduling, or on-demand trigger.

### Data Arrival

Cycle trigger with domain scope and configuration.

### Emissions

Cycle completion report with per-domain gate results, new content routed to storage, error events for failed gates.

## 7-Gate Funnel

| Gate | Name | Purpose | Pass Condition |
|------|------|---------|----------------|
| 1 | Fetch | Retrieve content from target | HTTP 200 + content body present |
| 2 | Parse | Extract structured data using domain parser | Parser config found + extraction successful |
| 3 | Validate | Verify extracted data meets schema | All required fields present + types correct |
| 4 | Diff | Compare against previous version | Diff computed (changed or unchanged both PASS) |
| 5 | Classify | Categorize the change type | Classification assigned (new/updated/deleted/unchanged) |
| 6 | Route | Determine downstream destination | Valid routing target resolved |
| 7 | Store | Persist to canonical storage | Write confirmed + hash recorded |

**Rule**: Failure at any gate halts the pipeline for that item. No gate may be skipped. Gates execute sequentially.

## Error Table

All errors are recorded in `ut_err.orchestrator_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
