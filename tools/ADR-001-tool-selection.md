# ADR-001: Tool Selection Doctrine

## Status
Accepted

## Decision
All pipelines MUST use the approved Tool Ledger.

## Rationale
- Determinism > cost > auditability
- LLMs are allowed only as tail arbitration
- Tools are swappable; doctrine is not

## Consequences
- Any PR introducing new tools is rejected
- Any PR using LLMs where scripts suffice is invalid
