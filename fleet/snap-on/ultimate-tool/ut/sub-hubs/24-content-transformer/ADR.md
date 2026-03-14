# ADR: Workers Selection for Content Transformer

## Conformance

| Field | Value |
|-------|-------|
| Doctrine | 2.1.0 |
| CC Layer | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-024 |
| Status | [x] PROPOSED [ ] ACCEPTED [ ] DEPRECATED [ ] SUPERSEDED |
| Date | 2026-03-08 |

---

## Owning Hub

| Field | Value |
|-------|-------|
| Sovereign | imo-creator |
| Hub | UT |
| Hub ID | ut |

---

## CC Layer Scope

| Layer | In Scope |
|-------|----------|
| CC-01 | [ ] |
| CC-02 | [x] |
| CC-03 | [x] |
| CC-04 | [ ] |

---

## IMO Layer Scope

| Layer | In Scope |
|-------|----------|
| I (Ingress) | [ ] |
| M (Middle) | [x] |
| O (Egress) | [ ] |

---

## Context

Sub-hub 24 (content-transformer) provides a content normalization layer between raw ingestion and embedding. It cleans HTML, converts to markdown, detects language, fixes encoding, strips boilerplate (nav, footer, ads), and extracts the main content body. All transformations are deterministic — no LLM involvement. The content transformer must operate entirely within the CF Native execution surface.

---

## Decision

Plain Workers chosen for deterministic text transformations. All operations are rule-based: regex cleanup, DOM traversal for boilerplate removal, encoding normalization. No external libraries required — Workers built-in APIs (TextDecoder, HTMLRewriter) handle all transformation needs. Readability.js considered but adds bundle size for a subset of needed features. LLM-based extraction rejected — violates determinism-first doctrine. External transformation service rejected — adds dependency for CPU-light operations.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Readability.js | Bundle bloat — provides partial coverage of needed features |
| LLM extraction | Non-deterministic — violates determinism-first doctrine |
| External service (Diffbot) | External dependency — adds cost and complexity for CPU-light operations |

---

## Consequences

**Enables:**
- Deterministic, repeatable content normalization with no LLM dependency
- Idempotent transformations — running twice produces identical output
- Language detection and encoding normalization at edge
- Clean markdown output ready for chunking and embedding

**Prevents:**
- Semantic content understanding (rule-based only, no contextual extraction)
- Complex layout analysis (DOM traversal handles common patterns only)
- Content beyond 5MB input size limit

---

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Max input size 5MB | Runtime validation |
| Output always UTF-8 markdown | Encoding enforcement |
| Language detection confidence threshold 0.8 | Runtime validation |
| No content modification beyond cleanup — semantic meaning preserved | Code path enforcement |
| Transformation is idempotent — running twice produces identical output | Design invariant |

---

## Rollback

Revert to passing raw HTML/text content directly from knowledge-ingestion (03) to embedding (12) without normalization. Embedding quality degrades due to boilerplate noise, encoding inconsistencies, and HTML artifacts in content, but the pipeline remains functional.

---

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 24-content-transformer |
| Driver | Workers |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
