# CHANGESET Routing

- Builder writes to `/changesets/outbox`
- Auditor reads from `/changesets/inbox`
- No agent may read its own outbox
- No agent may move artifacts
- Only orchestrator or CI may move files between inbox/outbox
