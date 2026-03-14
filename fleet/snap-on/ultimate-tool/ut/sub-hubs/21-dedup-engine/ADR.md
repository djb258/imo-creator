# ADR: D1 + Workers Selection for Dedup Engine

## Conformance

| Field | Value |
|-------|-------|
| Doctrine | 2.1.0 |
| CC Layer | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| ADR ID | ADR-UT-021 |
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

Sub-hub 21 (dedup-engine) provides content-level deduplication using simhash/minhash fingerprinting to detect near-duplicate pages across different URLs. It prevents redundant embedding and storage of substantially identical content. The engine requires structured fingerprint storage (D1) with compute-intensive hashing on Workers, all within the CF Native execution surface.

---

## Decision

D1 + Workers chosen for fingerprint storage (D1) with compute-intensive hashing on Workers. Dedicated dedup service (e.g., SimHash library) considered but adds external dependency. Exact-match only (MD5/SHA) rejected — misses near-duplicates. LLM-based similarity rejected — violates determinism-first doctrine.

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| External SimHash service | External dependency — violates CF Native constraint |
| Exact hash only (MD5/SHA) | Misses near-duplicates — insufficient for content deduplication |
| LLM similarity | Non-deterministic — violates determinism-first doctrine |

---

## Consequences

**Enables:**
- Near-duplicate detection across different URLs using simhash/minhash
- Fingerprint index partitioned by domain for efficient lookups
- Dedup verdicts with similarity scores and canonical references
- Prevention of redundant embedding and storage

**Prevents:**
- Semantic deduplication (fingerprinting is syntactic, not semantic)
- Cross-domain fingerprint comparison without explicit partition scanning
- Real-time dedup for high-volume ingestion (D1 write latency)

---

## Guard Rails

| Guard Rail | Enforcement |
|-----------|-------------|
| Similarity threshold configurable per domain (default 0.85) | Runtime configuration |
| Fingerprint index partitioned by domain | D1 schema enforcement |
| No content stored in dedup engine — fingerprints only | Code path enforcement |
| Deterministic hashing only — no LLM similarity | Doctrine enforcement |

---

## Rollback

Revert to pass-through mode where all content is treated as unique. Remove fingerprint index from D1. All content proceeds to embedding pipeline without dedup checks. This increases storage and compute costs but preserves correctness — duplicate content is stored redundantly rather than deduplicated.

---

## Traceability

| Field | Value |
|-------|-------|
| Sub-Hub | 21-dedup-engine |
| Driver | D1 + Workers |
| Category | CF Native |
| Doctrine Ref | ARCHITECTURE.md v2.1.0 |

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Human Approver | | | PENDING |
