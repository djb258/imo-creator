# Sub-Hub 12: Embedding

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 12-embedding |
| Driver | Workers AI |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Generates vector embeddings from text content. Converts chunked knowledge into dense vector representations for semantic search.

## Interface Contract

### Triggers

Chunked content arrives from knowledge-ingestion pipeline.

### Data Arrival

Text chunks with metadata and source references.

### Emissions

Vector arrays (embeddings) with dimension metadata, routed to vector-brain.

## Error Table

All errors are recorded in `ut_err.embedding_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | Human only |
