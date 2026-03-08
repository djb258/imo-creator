# ADR: Cloudflare R2 for Doc Storage Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-08 |
| **Status** | [x] Proposed / [ ] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-03-08 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | CC-01 |
| **Hub Name** | UT (Universal Toolkit) |
| **Hub ID** | ut |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [ ] | |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [x] | Sub-hub driver selection for document object storage |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [x] |
| O — Egress | [x] |

---

## Context

The UT hub requires persistent storage for raw documents, PDFs, HTML snapshots, and large content objects. This sub-hub provides immutable object storage with versioning for all ingested content. An S3-compatible object store with native Cloudflare integration and zero egress fees is required.

---

## Decision

Cloudflare R2 chosen for S3-compatible object storage with zero egress fees. It provides native Worker bindings, immutable object storage with versioning, and direct integration with the Cloudflare network. No external dependencies required.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| AWS S3 | External dependency; egress costs; violates CF Native zero-external-dependency rule |
| D1 | Not suited for large binary objects; designed for relational data |
| Do Nothing | Persistent document storage is a core requirement for UT knowledge ingestion; no alternative path exists |

---

## Consequences

### Enables

- Immutable object storage for raw documents and binary content
- S3-compatible API for interoperability
- Zero egress fees on content retrieval
- Object versioning for content history

### Prevents

- External storage dependencies
- Egress cost exposure
- Mutable document overwrites (versioning enforced)

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | R2 operations bounded by CF plan limits | CC-03 |
| Timeout | 60s per upload, 30s per retrieval | CC-03 |
| Kill Switch | Disable writes on storage quota threshold breach | CC-03 |

---

## Rollback

Revert to inline content storage in D1. Large binary objects would be excluded. No data loss — R2 objects can be migrated to alternative storage.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md |
| PRD | |
| Work Items | |
| PR(s) | |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-02) | | |
| Reviewer | | |
