# Sub-Hub 25: Access Control

## Identity

| Field | Value |
|-------|-------|
| Sub-Hub ID | 25-access-control |
| Driver | Workers + D1 |
| Category | CF Native |
| CC Layer | CC-03 |
| Parent Hub | UT |

## Responsibility

API authentication and authorization gate. Manages API keys, tenant isolation, usage quotas, and permission scopes. Sits in front of the rim (06-api-layer) as the ingress security boundary. Every external request must pass access-control before reaching any sub-hub.

## Interface Contract

### Triggers

Every inbound HTTP request to the rim (06-api-layer) passes through access-control first.

### Data Arrival

HTTP request with Authorization header (Bearer token or API key). Access-control validates credentials, checks quotas, and resolves tenant context.

### Emissions

Authenticated request context (tenant ID, scopes, remaining quota) forwarded to api-layer. Rejection responses (401/403/429) for invalid/expired/over-quota requests. Usage records to observability (14).

## Error Table

All errors are recorded in `ut_err.access_control_errors`.

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-08 |
| Status | ACTIVE |
| Authority | UT Hub |
