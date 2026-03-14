# Rosetta Stone — Domain 4: APIs

## Layer 0 Reference: docs/LAYER0_DOCTRINE.md

---

## Gate 1 (50,000 ft) — What IS an API?

**Candidate Constant:** A defined contract between two systems specifying how to request services and receive responses.

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Regardless of what services are offered, the API defines the contract. |
| CTB | PASS | From internal function calls to global REST APIs to ancient trade agreements — a defined contract. |
| Circle | PASS | API fails → diagnose → update contract → retry. The loop closes. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 2 (45,000 ft) — Universal Components

**10 Root Concepts extracted and validated:**

| # | Constant | Definition | IMO | CTB | Circle | Verdict |
|---|----------|-----------|-----|-----|--------|---------|
| 1 | Endpoint | A specific address where a service can be reached | PASS | PASS | PASS | LOCKED |
| 2 | Method | The action type being requested (read, create, update, delete) | PASS | PASS | PASS | LOCKED |
| 3 | Payload | The data sent with or returned from a request | PASS | PASS | PASS | LOCKED |
| 4 | Header | Metadata about the request or response (not the data itself) | PASS | PASS | PASS | LOCKED |
| 5 | Authentication | Proof of identity required to access the service | PASS | PASS | PASS | LOCKED |
| 6 | Rate Limit | A cap on how many requests a client can make per time period | PASS | PASS | PASS | LOCKED |
| 7 | Webhook | A reverse call — the server pushes data to the client when an event occurs | PASS | PASS | PASS | LOCKED |
| 8 | Response Code | A standardized signal indicating the result of a request | PASS | PASS | PASS | LOCKED |
| 9 | Versioning | A mechanism to evolve the contract without breaking existing clients | PASS | PASS | PASS | LOCKED |
| 10 | Schema/Contract | The formal definition of what can be sent and received | PASS | PASS | PASS | LOCKED |

**Back-propagation check:** Clean.

---

## Gate 3 (40,000 ft) — Process Constant (IMO)

Every API call follows IMO:
- **Input:** Client constructs request (endpoint + method + payload + headers)
- **Middle:** Server receives, authenticates, processes, generates result
- **Output:** Server returns response (payload + response code + headers)

**Verdict:** CONSTANT_LOCKED

---

## Gate 4 (35,000 ft) — Organization Constant (CTB)

Every API organizes as CTB:
- **Trunk:** The API service (the contract surface)
- **Branches:** Resource groups / endpoints
- **Leaves:** Individual operations on resources (CRUD)

**Verdict:** CONSTANT_LOCKED

---

## Gate 5 — Rosetta Stone Matrix

| Root Concept | REST | GraphQL | gRPC | CF Workers API | Trade Agreements (Historical) | Diplomatic Protocols (Historical) |
|-------------|------|---------|------|---------------|-------------------------------|----------------------------------|
| Endpoint | URL path (`/users/123`) | Single endpoint (`/graphql`) | Service + method definition | Route pattern (`/api/*`) | Port of trade / market location | Embassy / court |
| Method | GET, POST, PUT, DELETE | query, mutation, subscription | Unary, server-stream, client-stream, bidi | HTTP methods on route | Buy, sell, negotiate, cancel | Petition, treaty, declaration, withdrawal |
| Payload | JSON body | GraphQL variables | Protobuf binary message | Request/Response body | Goods / currency | Letters / sealed documents |
| Header | HTTP headers (Content-Type, Auth) | HTTP headers | gRPC metadata | Headers object | Ship manifest / trade papers | Diplomatic credentials / seals |
| Authentication | Bearer token, API key, OAuth | Same (HTTP layer) | mTLS, token metadata | CF Access, API tokens | Trade licenses / guild membership | Letters of credence |
| Rate Limit | 429 Too Many Requests | Query complexity limits | Server-side throttling | CF rate limiting rules | Quota restrictions / embargo | Audience limits / diplomatic queue |
| Webhook | Callback URL on event | Subscription (WebSocket) | Server streaming | Worker event triggers | Signal fires / messenger dispatch | Courier notification system |
| Response Code | 200, 201, 400, 404, 500 | 200 with `errors` array | gRPC status codes | HTTP status codes | Goods accepted / rejected / taxed | Request granted / denied / deferred |
| Versioning | URL (`/v1/`) or header | Schema evolution + deprecation | Protobuf field numbering | URL or header versioning | Treaty amendments / new agreements | Protocol revisions |
| Schema/Contract | OpenAPI / Swagger | GraphQL SDL | .proto files | TypeScript types | Written trade terms | Diplomatic protocol manual |

---

## Gate 6 — Circle Validation (Feedback Patterns)

| Circle Pattern | Description | Universal? |
|---------------|-------------|------------|
| Error Circle | Request fails → read error code → fix request → retry | YES — from HTTP 400 to rejected trade goods |
| Evolution Circle | New need → version API → clients migrate → old deprecated | YES — from REST v1→v2 to treaty amendments |
| Security Circle | Unauthorized access → tighten auth → re-authenticate | YES — from API key rotation to credential renewal |
| Capacity Circle | Rate limited → implement backoff → request succeeds | YES — from 429 retry to queue at port |

**Verdict:** All four CONSTANT_LOCKED.

---

## Gate 7 — True Variables Isolated

| Variable | Why It's a Variable |
|----------|-------------------|
| Wire format | JSON vs GraphQL SDL vs Protobuf vs XML |
| Transport | HTTP/1.1 vs HTTP/2 vs WebSocket vs gRPC channel |
| Auth mechanism | Bearer vs API key vs mTLS vs OAuth2 flow |
| Schema language | OpenAPI vs GraphQL SDL vs .proto vs TypeScript |
| Error format | HTTP status codes vs GraphQL errors array vs gRPC status |

**Variable count:** 5 — within tolerance.

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates | 7 |
| Constants locked | 10 root concepts + 3 structural + 4 circles = 17 |
| Variables isolated | 5 |
| Back-propagation events | 0 |
| Domain-agnostic check | PASS — constants hold from diplomatic protocols to gRPC |