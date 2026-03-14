# ADR: NotebookLM + Puppeteer for Knowledge Ingestion Sub-Hub

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-03 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-UT-SH-03 |
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
| CC-03 (Context) | [x] | Sub-hub driver selection for knowledge ingestion |
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

The UT hub requires document and web content ingestion into structured knowledge. This includes PDF extraction, page parsing, and content chunking. The sub-hub operates in the browser layer (EXTERNAL) and must handle complex document layouts while adhering to determinism-first doctrine.

---

## Decision

NotebookLM for document understanding combined with Puppeteer for web content extraction. NotebookLM provides structured document parsing for PDFs and complex layouts. Puppeteer handles web content extraction with full JS rendering. The combination ensures deterministic parsing is attempted first, with LLM-assisted understanding as tail arbitration only for ambiguous content structures.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Manual parsing libraries only | Does not handle complex document layouts (multi-column PDFs, embedded tables) |
| LLM-only approach | Violates determinism-first doctrine; LLM is tail, not spine |
| Do Nothing | Knowledge ingestion is a core UT requirement; raw content without structuring is not usable downstream |

---

## Consequences

### Enables

- Structured extraction from PDFs, HTML, and complex document formats
- Content chunking with preserved metadata and source attribution
- Deterministic parsing with LLM tail for edge cases
- Integration with upstream crawl-orchestration for automated ingestion

### Prevents

- Running inside Cloudflare Workers (EXTERNAL sub-hub by design)
- Pure LLM-driven content understanding (doctrine compliance)

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | Max 10 concurrent document ingestion jobs | CC-03 |
| Timeout | 120s per document, 60s per web page extraction | CC-03 |
| Kill Switch | Halt ingestion pipeline on repeated parsing failures | CC-03 |

---

## Rollback

Revert to raw content pass-through without structuring or chunking. Downstream consumers would receive unprocessed content. No data loss — ingestion is a transformation step, source content is preserved upstream.

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
