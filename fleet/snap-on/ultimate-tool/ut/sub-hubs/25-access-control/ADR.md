# ADR: Workers + D1 Selection for Access Control

## Conformance

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-025 |
| Status | [x] PROPOSED [ ] ACCEPTED [ ] DEPRECATED [ ] SUPERSEDED |
| Date | 2026-03-08 |

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| Sovereign ID | imo-creator |
| Hub Name | UT |
| Hub ID | ut |

## CC Layer Scope

| Layer | In Scope |
|-------|----------|
| CC-01 (Sovereign) | [ ] |
| CC-02 (Hub) | [x] |
| CC-03 (Context) | [x] |
| CC-04 (Process) | [ ] |

## IMO Layer Scope

| Layer | In Scope |
|-------|----------|
| I (Ingress) | [ ] |
| M (Middle) | [x] |
| O (Egress) | [ ] |

## Context

Sub-hub 25 (access-control) is the API authentication and authorization gate for UT. It sits in front of the rim (06-api-layer) as the ingress security boundary. Every external request must pass access-control before reaching any sub-hub. The solution must manage API keys, tenant isolation, usage quotas, and permission scopes within the CF Native execution surface.

## Decision

Workers + D1 chosen. Workers for request interception and validation at edge. D1 for API key storage, tenant records, quota tracking, and scope definitions. This combination provides a fully self-contained auth gate with zero external dependencies.

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Cloudflare Access | Designed for user-facing applications, not API-to-API authentication |
| Auth0 / Clerk | External dependency, overkill for API key gating |
| JWT-only | Requires key management infrastructure UT doesn't need yet |
| KV for keys | No relational queries for tenant/scope management |

## Consequences

### Enables

- Every external request authenticated before reaching any sub-hub
- Tenant isolation enforced at the gate — no cross-tenant data access
- Usage quotas tracked per API key with configurable limits
- Key rotation supported without downtime

### Prevents

- Unauthenticated access to UT endpoints
- Cross-tenant data leakage
- Unbounded API usage without quota enforcement

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Key length | Minimum 32 characters | CC-03 |
| Key storage | SHA-256 hashed, no plaintext | CC-03 |
| Rate limit | Configurable per key | CC-03 |
| Logging | No plaintext keys in logs or errors | CC-03 |

## Rollback

Remove access-control Worker binding from api-layer. Revert to open rim. D1 tables remain for audit trail.

## Traceability

| Artifact | Reference |
|----------|-----------|
| Sub-Hub | 25-access-control |
| Driver | Workers + D1 |
| Category | CF Native |

## Approval

| Role | Name | Date |
|------|------|------|
| Human | _Pending_ | |
