# Sub-Hub 06: API Layer

## Identity

| Field | Value |
|-------|-------|
| **Sub-Hub ID** | 06-api-layer |
| **Driver** | Workers + Hono |
| **Category** | CF Native |
| **CC Layer** | CC-03 |
| **Parent Hub** | UT |

---

## Responsibility

The rim. Exposes 3 REST endpoints (POST /query, POST /ingest, GET /domains). Routes requests to appropriate sub-hub via Middle layer. Schema validates all ingress.

---

## Interface Contract

### Triggers

External HTTP requests hitting the Worker.

### Data Arrival

HTTP request with JSON body, validated against ingress schema.

### Emissions

HTTP response with structured JSON result.

---

## Error Table

All errors are recorded in `ut_err.api_layer_errors`.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Last Modified | 2026-03-08 |
| Status | ACTIVE |
