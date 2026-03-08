# Sub-Hub 09: LLM Router

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | 09-llm-router |
| **Driver** | AI Gateway |
| **Category** | CF Native |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT |

---

## Responsibility

Routes LLM inference requests through Cloudflare AI Gateway. Manages model selection, rate limiting, caching, and cost tracking. LLM is TAIL ONLY — used for edge-case arbitration after deterministic logic is exhausted.

---

## Interface Contract

### Triggers

Middle layer determines deterministic logic exhausted, LLM arbitration needed.

### Data Arrival

Structured prompt with context, constraints, and expected output schema.

### Emissions

LLM response validated against output schema, with usage metrics.

---

## Error Table

All errors are recorded in `ut_err.llm_router_errors`.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
