# Sub-Hub 08: Doc Storage

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | 08-doc-storage |
| **Driver** | R2 |
| **Category** | CF Native |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT |

---

## Responsibility

Stores raw documents, PDFs, HTML snapshots, and large content objects. Immutable object storage with versioning.

---

## Interface Contract

### Triggers

New content from knowledge-ingestion ready for persistent storage.

### Data Arrival

Binary/text content with storage key and metadata headers.

### Emissions

Storage confirmation with R2 key, retrieval responses on read.

---

## Error Table

All errors are recorded in `ut_err.doc_storage_errors`.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
