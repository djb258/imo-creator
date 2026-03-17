# Sub-Hub 24: Content Transformer

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 24-content-transformer |
| Driver | Workers |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

Content normalization layer between raw ingestion and embedding. Cleans HTML, converts to markdown, detects language, fixes encoding, strips boilerplate (nav, footer, ads), extracts main content body. Deterministic transformations only — no LLM.

## Interface Contract

### Triggers

Raw content arrives from knowledge-ingestion (03) needing cleanup before embedding (12).

### Data Arrival

Raw HTML/text content with source metadata, content type, and encoding hints.

### Emissions

Cleaned, normalized content in markdown format with extracted metadata (title, language, word count, content hash). Ready for chunking and embedding.

## Error Table

All errors are recorded in `ut_err.content_transformer_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | UT Hub |
