# Sub-Hub 18: Proxy Router

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 18-proxy-router |
| Driver | Workers + Hono |
| Category | CF Native (Field Monitor) |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Field Monitor proxy routing. Selects optimal proxy chain for each fetch target based on domain difficulty, geo requirements, and rate limits. Routes through ScraperAPI tiers.

## Interface Contract

### Triggers

Fetch request from 16-fetcher that requires proxy routing.

### Data Arrival

Target URL with domain profile (difficulty tier, geo requirement, rate limit state).

### Emissions

Proxy configuration (endpoint, headers, rotation policy) for fetcher to consume.

## Error Table

All errors are recorded in `ut_err.proxy_router_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
