# Sub-Hub 03: Knowledge Ingestion

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | 03-knowledge-ingestion |
| **Driver** | NotebookLM + Puppeteer |
| **Category** | External |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT |

---

## Responsibility

Ingests documents and web content into structured knowledge. Handles PDF extraction, page parsing, content chunking.

---

## Interface Contract

### Triggers

New content event from crawl-orchestration or direct ingest API call.

### Data Arrival

Raw HTML/PDF/document content with source metadata.

### Emissions

Chunked, cleaned content with metadata ready for embedding.

---

## Error Table

All errors are recorded in `ut_err.knowledge_ingestion_errors`.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
