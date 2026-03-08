# Sub-Hub 20: Cache Layer

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 20-cache-layer |
| Driver | Workers KV |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Hot-path caching layer. Sits between consumers and storage (D1, R2, Vectorize) for frequently accessed query results, embeddings, and document metadata. TTL-based expiration with cache-aside pattern.

## Interface Contract

### Triggers

Any read request from api-layer (06) or internal sub-hub lookups.

### Data Arrival

Cache key + optional TTL from requesting sub-hub. On miss, fetches from origin store and populates cache.

### Emissions

Cached response with hit/miss metadata. Cache invalidation events on content updates.

## Error Table

All errors are recorded in `ut_err.cache_layer_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | UT Hub |
