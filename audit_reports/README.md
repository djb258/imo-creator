# AUDIT_REPORT Routing

- Auditor writes to `/audit_reports/outbox`
- Human reviews from `/audit_reports/inbox`
- No agent may read its own outbox
- No agent may move artifacts
- Only orchestrator or CI may move files between inbox/outbox
