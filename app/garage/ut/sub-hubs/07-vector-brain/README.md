# Sub-Hub 07: Vector Brain

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | 07-vector-brain |
| **Driver** | Vectorize |
| **Category** | CF Native |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT |

---

## Responsibility

Stores and queries vector embeddings. Powers semantic search across ingested knowledge. Manages vector indexes and similarity thresholds.

---

## Interface Contract

### Triggers

Embedding vectors arrive from 12-embedding, or semantic query from 06-api-layer.

### Data Arrival

Vector arrays with metadata for storage; query vectors for similarity search.

### Emissions

Ranked similarity results with source references and scores.

---

## Error Table

All errors are recorded in `ut_err.vector_brain_errors`.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
