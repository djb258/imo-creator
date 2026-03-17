# Sub-Hub 21: Dedup Engine

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 21-dedup-engine |
| Driver | D1 + Workers |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Content-level deduplication. Fingerprints ingested content using simhash/minhash to detect near-duplicate pages across different URLs. Prevents redundant embedding and storage of substantially identical content.

## Interface Contract

### Triggers

New content arrives from knowledge-ingestion (03) or content-transformer (24) before embedding.

### Data Arrival

Content chunks with source URL and metadata. Engine computes fingerprint and checks against existing fingerprint index.

### Emissions

Dedup verdict (unique/duplicate/near-duplicate) with similarity score and canonical reference if duplicate. Unique content forwarded to embedding pipeline.

## Error Table

All errors are recorded in `ut_err.dedup_engine_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | UT Hub |
