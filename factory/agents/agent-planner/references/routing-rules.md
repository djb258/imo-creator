# Routing Decision Tree

## Full Decision Tree

```
Orchestrator Intake Packet (or raw user intent)
│
├─ orbt_mode provided?
│  ├─ YES → validate enum (operate|repair|build|troubleshoot|train) → set orbt_mode
│  └─ NO  → HALT. Request orbt_mode from Orchestrator or human. Do NOT infer.
│
├─ execution_type provided?
│  ├─ YES → validate enum (standard|fleet_refit) → set execution_type
│  └─ NO  → set execution_type = "standard"
│
├─ Which repo is targeted?
│  ├─ Alias provided → validate against repo_registry.json → set target_repo_alias + target_branch
│  ├─ URL provided → check repo_pull_policy → if allowed, set target_repo_url + target_branch
│  └─ Neither → HALT. Ask user.
│
├─ Does intent include database scope?
│  ├─ YES → db_required=true, populate db_targets + db_system
│  └─ NO  → db_required=false
│
├─ Does intent include UI scope?
│  ├─ YES → ui_required=true, populate ui_surface + ui_target
│  └─ NO  → ui_required=false
│
├─ Does intent require containerized tests/builds?
│  ├─ YES → container_required=true, populate container_profile + container_target
│  └─ NO  → container_required=false
│
├─ Does intent include documentation scope OR orbt_mode=train?
│  ├─ YES → doc_required=true, populate doc_targets + doc_surface
│  └─ NO  → doc_required=false
│
├─ Does intent touch protected assets?
│  ├─ YES → architectural_flag=true, requires_pressure_test=true
│  └─ NO  → architectural_flag=false
│
└─ Emit WORK_PACKET V2 with all flags set
```

## Version Routing

| User Intent | WORK_PACKET Version | Routing Flags |
|-------------|---------------------|---------------|
| Code-only change, no DB or UI | V2 with `db_required=false`, `ui_required=false`, `container_required=false` | Standard flow |
| Database schema change | V2 with `db_required=true` | DB Agent lane activated |
| UI change (local, Lovable, Figma) | V2 with `ui_required=true` | Builder UI adapter lane activated |
| Containerized tests/builds needed | V2 with `container_required=true` | Container runner lane activated |
| DB + UI change | V2 with `db_required=true`, `ui_required=true` | Both lanes activated |
| Documentation update (PRD, OSAM, ERD) | V2 with `doc_required=true` | Documentation lane activated |
| Train-mode (document, explain, onboard) | V2 with `doc_required=true`, `orbt_mode=train` | Documentation lane auto-activated |
| All lanes | V2 with all flags true | Full pipeline |

## Alias Validation Sequence

1. Load `sys/registry/repo_registry.json`.
2. Verify `target_repo_alias` matches an entry where `repo_alias === target_repo_alias`.
3. If no match: **FAIL_SCOPE** — alias not in registry.
4. Verify `entry.enabled === true`. If disabled: **FAIL_SCOPE**.
5. If user specifies a branch: verify it is in `entry.allowed_branches`. If not: **FAIL_SCOPE**.
6. If user does not specify a branch: use `entry.default_branch` as `target_branch`.
7. Validate alias format: `^[a-z0-9_-]{2,32}$`.

## Raw URL Handling

1. Load `sys/registry/repo_pull_policy.json`.
2. If `allow_raw_url === false` and user provides URL: **FAIL_SCOPE**.
3. If `allow_raw_url === true`: set `target_repo_url`. Log that raw URL path was used.
4. Never construct a repo URL from an alias. Resolution is the Builder's job.

## Inbox Mode Protocol

1. Read the first JSON file in `sys/runtime/inbox/planner/`.
2. Validate schema before processing.
3. Process deterministically.
4. Write output to `sys/runtime/outbox/planner/`.
5. Atomically move output to `sys/runtime/inbox/builder/`.
6. Delete original input file after successful move.
7. Halt on any schema validation error.
