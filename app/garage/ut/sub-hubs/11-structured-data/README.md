# Sub-Hub 11: Structured Data

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 11-structured-data |
| Driver | D1 |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Stores structured relational data. Domain metadata, crawl state, job records, configuration. The canonical structured data store for UT.

## Interface Contract

### Triggers

Any sub-hub needing to persist or query structured state.

### Data Arrival

SQL operations via D1 bindings with parameterized queries.

### Emissions

Query results, write confirmations, schema validation outcomes.

## Error Table

All errors are recorded in `ut_err.structured_data_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
