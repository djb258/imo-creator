# PACKET_CONTRACT.md — Agent Pipeline Packet Envelope

**Authority**: BAR-134
**Version**: 1.0.0
**Effective**: 2026-03-14

---

## 1. JSON Packet Envelope Schema

Every packet in the `sys/runtime/` pipeline MUST conform to this envelope:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `packet_id` | UUID | YES | Unique identifier per packet |
| `bar_id` | String | YES | `BAR-XXX` — ties to Linear ticket |
| `source_agent` | String | YES | Agent that created this packet |
| `target_agent` | String | YES | Agent that should pick this up |
| `created_at` | String | YES | ISO-8601 timestamp |
| `status` | Enum | YES | `pending` ǀ `in-progress` ǀ `complete` ǀ `failed` ǀ `rejected` |
| `payload` | Object | YES | Agent-specific content |
| `foreman_notes` | String | NO | Foreman notes — at front (writing) or back (reviewing) |

### Example Envelope

```json
{
  "packet_id": "a1b2c3d4-0314-2026-bar134-000000000001",
  "bar_id": "BAR-134",
  "source_agent": "foreman",
  "target_agent": "orchestrator",
  "created_at": "2026-03-14T08:20:00Z",
  "status": "pending",
  "foreman_notes": "Optional context for the receiving agent.",
  "payload": {
    "task": "Description of work",
    "deliverables": []
  }
}
```

---

## 2. Agent Pipeline Flow

```
Foreman (Claude.ai + Dave)
    │
    ▼
inbox/orchestrator/    ← ONLY entry point
    │
    ▼
Orchestrator → reads, decomposes, routes
    │
    ▼
inbox/planner/
    │
    ▼
Planner → breaks into buildable steps with specs
    │
    ▼
inbox/builder/
    │
    ▼
Builder → executes code/file changes
    │
    ▼
inbox/db-agent/
    │
    ▼
DB Agent → handles database operations (D1, Neon, KV)
    │
    ▼
inbox/auditor/
    │
    ▼
Auditor → final QA against BAR spec
    │
    ▼
outbox/auditor/        ← ONLY exit point
    │
    ▼
Foreman reviews → completed/
```

---

## 3. Handoff Rules

| # | Rule |
|---|------|
| 1 | Foreman drops packet in `inbox/orchestrator/` — **ONLY entry point** |
| 2 | Agents pass work autonomously: Orchestrator → Planner → Builder → DB Agent → Auditor |
| 3 | No foreman gate between agent stops — pipeline runs end to end |
| 4 | Auditor is the quality gate — checks against BAR spec, validates all output |
| 5 | Foreman reviews Auditor report in `outbox/auditor/` — **ONLY exit point** |
| 6 | Any agent can flag `status=failed` which halts pipeline and alerts foreman |
| 7 | Packets are **immutable** — never edit, write new ones |
| 8 | Agents read their own inbox ONLY, write their own outbox ONLY |

---

## 4. Directory Ownership

| Directory | Owner | Reads | Writes |
|-----------|-------|-------|--------|
| `inbox/orchestrator/` | Orchestrator | Orchestrator | Foreman |
| `inbox/planner/` | Planner | Planner | Orchestrator |
| `inbox/builder/` | Builder | Builder | Planner |
| `inbox/db-agent/` | DB Agent | DB Agent | Builder |
| `inbox/auditor/` | Auditor | Auditor | DB Agent |
| `outbox/orchestrator/` | Orchestrator | Planner | Orchestrator |
| `outbox/planner/` | Planner | Builder | Planner |
| `outbox/builder/` | Builder | DB Agent | Builder |
| `outbox/db-agent/` | DB Agent | Auditor | DB Agent |
| `outbox/auditor/` | Auditor | Foreman | Auditor |
| `completed/` | Foreman | Foreman | Foreman |

---

## 5. Status Lifecycle

```
pending → in-progress → complete
                      → failed   (halts pipeline, alerts foreman)
                      → rejected (auditor rejects, returns to foreman)
```

---

## 6. Naming Convention

Packet files follow this pattern:

```
{bar_id}_{short_description}_{target_agent}.json
```

Example: `BAR-134_build-agent-pipeline_orchestrator.json`

---

## 7. Automatic Trigger

Mailbox to mailbox. Each agent does work, drops a packet in the next agent's inbox.

### How It Works

```
Claude.ai (Foreman) + Dave
    │
    ▼
Composio → commits packet to inbox/orchestrator/ on GitHub
    │
    ▼
GitHub Actions detects new .json → invokes Orchestrator
    │
    ▼
Orchestrator does work → drops packet in inbox/planner/ → commits + pushes
    │
    ▼
GitHub Actions detects new .json → invokes Planner
    │
    ▼
Planner does work → drops packet in inbox/builder/ → commits + pushes
    │
    ▼
... continues through DB Agent ...
    │
    ▼
Auditor does work → drops report in outbox/auditor/ → STOP
    │
    ▼
Dave reviews in Claude.ai
```

### Rules

| Rule | Detail |
|------|--------|
| Trigger | `push` to `master`/`main` with changes in `sys/runtime/inbox/**/*.json` |
| Detection | `git diff HEAD~1 HEAD` — which inbox got a new file? |
| Execution | GitHub Actions invokes that agent via `claude-code-action` |
| Cascade | Agent commits next packet → push re-triggers workflow → next agent runs |
| Terminal | Auditor writes to `outbox/auditor/` only — no downstream inbox, cascade stops |
| Manual retry | `workflow_dispatch` with agent name + optional packet path |
| Failure | Agent writes `status=failed` — no downstream packet, cascade stops |

### Entry Point

Claude.ai (Foreman) uses Composio's GitHub integration to commit the initial packet directly to `sys/runtime/inbox/orchestrator/`. Dave never leaves the Claude.ai conversation.

### Workflow File

`.github/workflows/pipeline-trigger.yml`

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-14 |
| Authority | BAR-134 |
| Status | ACTIVE |
