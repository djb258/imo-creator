# Pipeline Tool Doctrine — PRD

## Purpose
This repository implements a fixed, doctrine-locked pipeline.
Tool selection is constrained to the approved Tool Ledger below.

Claude Code MAY:
- Select tools from the ledger
- Enforce ordering (Deterministic → Fuzzy → LLM)
- Reject invalid tool usage

Claude Code MAY NOT:
- Invent new tools
- Replace deterministic tools with LLMs
- Reorder pipeline stages

---

## Approved Tool Ledger (HARD LOCK)

| Step | Tool Name | Approved Solution |
|------|-----------|-------------------|
| 1 | Exact Matcher | Deterministic code / DB constraints |
| 2 | Fuzzy Matcher | Levenshtein / Jaro-Winkler / RapidFuzz |
| 3 | Fuzzy Arbitration Resolver | LLM tail only (Abacus.ai), reject allowed |
| 4 | Domain Parser | Deterministic parsing |
| 5 | DNS / MX Validator | Direct DNS/MX lookup |
| 6 | Pattern Discovery Worker | Deterministic frequency/stat analysis |
| 7 | Pattern Generator | Deterministic template generation |
| 8 | Email Verifier (Light) | DNS + SMTP handshake |
| 9 | Email Verifier (Authoritative) | External verifier (final stage only) |
| 10 | Signal Deduplicator | Hashing + DB uniqueness |
| 11 | BIT Scoring Engine | Deterministic weighted rules |
| 12 | People Classifier | Rules first, LLM only for unknown |
| 13 | Email Generator | Templates first, LLM high-value only |
| 14 | Slot Assignment Engine | Deterministic resolver |
| 15 | Enrichment Queue Manager | Self-hosted scheduler |
| 16 | Talent Movement Detector | Deterministic diff + timestamps |
| 17 | DOL Importer | Deterministic fetch + parse |
| 18 | Exact EIN Matcher | Normalized exact numeric match |
| 19 | Blog / RSS Ingestor | RSS + fetch + n8n scheduler |
