# Sub-Hub 23: Rate Limiter

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 23-rate-limiter |
| Driver | Workers KV + Durable Objects |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Centralized rate limiting across all UT outbound requests. Prevents UT from hammering target domains. Enforces per-domain, per-endpoint, and global request budgets. Sliding window counters with configurable thresholds.

## Interface Contract

### Triggers

Any outbound request from browser-control (01), crawl-orchestration (02), fetcher (16), or fallback-scraping (05) checks rate limiter before executing.

### Data Arrival

Rate check request with target domain, endpoint, and request weight. Returns allow/deny with remaining budget and reset time.

### Emissions

Allow/deny verdict with rate limit headers (remaining, reset, retry-after). Throttle events logged to observability (14). Budget exhaustion alerts to error-queue (13).

## Error Table

All errors are recorded in `ut_err.rate_limiter_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | UT Hub |
