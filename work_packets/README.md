# WORK_PACKET Routing

- Planner writes to `/work_packets/outbox`
- Builder reads from `/work_packets/inbox`
- No agent may read its own outbox
- No agent may move artifacts
- Only orchestrator or CI may move files between inbox/outbox
