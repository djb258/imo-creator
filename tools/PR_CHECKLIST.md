# PR Tool Compliance Checklist

## PR TOOL COMPLIANCE CHECK

Before merging any PR, verify:

- [ ] Uses only tools from Tool Ledger
- [ ] Deterministic used before fuzzy
- [ ] LLM only in arbitration or generation tail
- [ ] Failure / reject path defined

## Rejection Criteria

PRs will be rejected if they:

1. Introduce tools not in the approved Tool Ledger
2. Use LLMs where deterministic scripts suffice
3. Reorder pipeline stages (Deterministic → Fuzzy → LLM)
4. Lack defined failure/rejection handling paths

## Review Process

1. Check tool usage against `PRD.md` ledger
2. Verify pipeline ordering per `ADR-001-tool-selection.md`
3. Confirm flow matches `PIPELINE_DIAGRAM.md`
4. All checklist items must be verified before approval
