# Planner Intake Packet — Full Schema

## Packet Fields

| Field | Type | Rule |
|-------|------|------|
| `target_repo_alias` | string | From input. Validated against repo_registry. Mutually exclusive with target_repo_url. |
| `target_repo_url` | string | From input. Only if `allow_raw_url=true`. Mutually exclusive with target_repo_alias. |
| `target_branch` | string | From input or defaulted from registry entry's `default_branch`. |
| `operational_id` | string (UUID v4) | Minted by Orchestrator. Unique per execution. Never delegated to other agents. |
| `orbt_mode` | string (enum) | Classified deterministically. One of: operate, repair, build, troubleshoot, train. |
| `execution_type` | string (enum) | Classified deterministically. One of: standard, fleet_refit. |
| `intent_summary` | string | Cleaned version of human intent. No interpretation, just normalization. |
| `constraints` | array | Fail-closed reminders: ["Do not expand scope", "Do not infer missing fields", "Do not bypass alias resolution"]. |

## ORBT Mode Classification Table

Classification is rule-based. NO LLM creativity. NO prose interpretation beyond keyword matching.

**Step 1**: If `requested_mode` is provided and is a valid enum value, use it. Skip Step 2.

**Step 2**: Match intent keywords (case-insensitive, whole-word or substring):

| Priority | Keywords | orbt_mode |
|----------|----------|-----------|
| 1 | refit, align, fleet refit, bundle, bootstrap | `build` (also sets execution_type=fleet_refit) |
| 2 | fix, repair, hotfix, error, broken, fail, bug | `repair` |
| 3 | add, build, implement, create, refactor, new, feature | `build` |
| 4 | investigate, why, debug, trace, diagnose, inspect | `troubleshoot` |
| 5 | train, document, explain, onboard, learn | `train` |
| 6 | (no match) | `operate` |

Priority order matters. First match wins.

## Execution Type Classification

| Condition | execution_type |
|-----------|----------------|
| Intent matches priority 1 keywords (refit/align/bundle/bootstrap) | `fleet_refit` |
| Fleet inventory shows target repo as `independent` and intent is structural | `fleet_refit` |
| All other cases | `standard` |

## Validation Checks (All Must Pass)

1. Verify exactly one of `target_repo_alias` or `target_repo_url` is present.
2. If alias: verify it exists in `repo_registry.json` and `enabled=true`.
3. If URL: verify `repo_pull_policy.allow_raw_url=true`.
4. Verify `orbt_mode` is a valid enum value.
5. Verify `execution_type` is a valid enum value.
6. Verify `operational_id` is a valid UUID.
7. Verify `intent_summary` is non-empty.

If any validation fails: HALT. Report the error. Do not emit a Planner Intake Packet.

## Registry References

- `sys/registry/repo_registry.json` — alias validation
- `sys/registry/repo_pull_policy.json` — raw URL gate
- `sys/registry/fleet_inventory.json` — fleet alignment status (informs refit detection)

## Inbox Mode Protocol

1. Read the first JSON file in `sys/runtime/inbox/orchestrator/`.
2. Validate schema before processing.
3. Process deterministically.
4. Write output to `sys/runtime/outbox/orchestrator/`.
5. Atomically move output to `sys/runtime/inbox/planner/`.
6. Delete original input file after successful move.
7. Halt on any schema validation error.

Do not allow manual JSON pasting when inbox mode is active.
Do not infer missing fields.
