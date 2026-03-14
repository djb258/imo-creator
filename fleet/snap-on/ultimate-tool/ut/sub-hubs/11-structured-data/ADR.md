# ADR: D1 Selection for Structured Data

| Field | Value |
|-------|-------|
| Doctrine Version | 2.1.0 |
| CC Layer | CC-03 |

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-011 |
| Status | [x] PROPOSED [ ] ACCEPTED [ ] DEPRECATED [ ] SUPERSEDED |
| Date | 2026-03-08 |

## Owning Hub

| Field | Value |
|-------|-------|
| Sovereign ID | imo-creator |
| Hub Name | UT |
| Hub ID | ut |

## CC Layer Scope

| Layer | In Scope |
|-------|----------|
| CC-01 | [ ] |
| CC-02 | [x] |
| CC-03 | [x] |
| CC-04 | [ ] |

## IMO Layer Scope

| Layer | In Scope |
|-------|----------|
| I (Ingress) | [ ] |
| M (Middle) | [x] |
| O (Egress) | [ ] |

## Context

Sub-hub 11 (structured-data) requires a relational data store for domain metadata, crawl state, job records, and configuration. The store must operate at the edge with zero external dependencies to maintain the CF Native category. SQLite-compatible semantics are sufficient for the structured data workloads UT produces.

## Decision

Use Cloudflare D1 as the structured relational data store. D1 provides native SQLite-at-edge with zero configuration, automatic replication, and direct Worker bindings. No external infrastructure or credentials required.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Turso | Adds external dependency — violates CF Native constraint |
| PlanetScale | External MySQL service — unnecessary complexity for edge workloads |

## Consequences

**Enables:**
- Zero-config SQLite-at-edge with automatic replication
- Direct Worker bindings — no connection strings or credential management
- Native CF integration with zero external dependencies
- Parameterized query support for safe SQL operations

**Prevents:**
- Use of advanced PostgreSQL/MySQL features (stored procedures, advanced joins)
- Multi-region write consistency (D1 uses single-writer model)
- Vendor portability without SQL migration effort

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| All queries use parameterized bindings | Code review + linting |
| Schema migrations tracked in version control | CI gate |
| No raw SQL string concatenation | Static analysis |
| D1 database bound via wrangler.toml | Deployment validation |

## Rollback

Revert to direct KV-based structured storage if D1 proves insufficient. Export all D1 data via SQL dump, transform to KV-compatible format, update bindings in wrangler.toml. No external dependencies affected.

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 11-structured-data |
| Driver | D1 |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
