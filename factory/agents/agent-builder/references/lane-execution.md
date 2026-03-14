# Lane Execution Rules

## Standard Lane (always active)

| Constraint | Rule |
|------------|------|
| Scope | All file modifications within `WORK_PACKET.allowed_paths`. |
| Protected assets | Do not modify doctrine, constitutional docs, locked files, `.garage/`. |
| Forbidden folders | No files in `utils/`, `helpers/`, `common/`, `shared/`, `lib/`, `misc/`. |
| CTB compliance | New files in valid CTB branches or approved support surfaces. |
| Determinism | Deterministic solutions first. LLM as tail only. |

## DB Lane (when `db_required=true`)

| Constraint | Rule |
|------------|------|
| Prerequisite | DB_CHANGESET must exist at `changesets/outbox/<work_packet_id>/db/db_changeset.json`. If missing: **HALT. FAIL_EXECUTION.** |
| Apply exactly | Apply migrations in the order defined by DB_CHANGESET.migrations. Do not reorder, skip, or add migrations. |
| No invention | Do not invent schema policy. DB Agent defined the migrations. Builder applies them. |
| Validation | After applying, execute DB_CHANGESET.validation_steps. Record results. |
| Risk gate | If `risk_class=HIGH`, do not proceed without human approval flag in WORK_PACKET.payload. |
| V1 block | If WORK_PACKET is V1 and work involves DB changes: **FAIL_SCOPE.** |

## UI Adapter Lane (when `ui_required=true`)

| Constraint | Rule |
|------------|------|
| Surface routing | Route to correct execution surface based on `WORK_PACKET.ui_surface`. |
| `local` | Modify files within `src/ui/` in the mounted repo. Standard file operations. |
| `lovable` | Integration with Lovable.dev branch. Document changes as export/import operations. |
| `figma` | Figma export/import logic. Document-only for now (no live API calls). |
| UI_CHANGESET | Produce UI_CHANGESET artifact with changes, preview_artifacts, and acceptance_checks. |
| Preview required | At least one preview artifact must be produced. |
| Acceptance checks | All checks must have `status: PASS` before handoff to Auditor. |
| V1 block | If WORK_PACKET is V1 and work involves UI scope: **FAIL_SCOPE.** |

## Container Lane (when `container_required=true`)

| Constraint | Rule |
|------------|------|
| Runner contract | Follow `factory/runtime/container_runner/runner_contract.json` protocol. |
| Profile select | Use `WORK_PACKET.container_profile` to select base image and tooling. |
| Build | Build container from `WORK_PACKET.container_target` directory. |
| Run | Execute tests/builds in isolated container. Capture results. |
| CONTAINER_RUN | Produce CONTAINER_RUN artifact with build_log, test_results, exit_code, image_digest. |
| Exit code | Non-zero exit code is captured but does not halt Builder. Auditor evaluates. |

## Documentation Lane (when `doc_required=true`)

| Constraint | Rule |
|------------|------|
| Prerequisite | `doc_targets` and `doc_surface` must be present in WORK_PACKET. |
| Scope | Update only the documentation artifacts listed in `doc_targets`. |
| Freshness | All targeted docs must reflect the current state of the codebase — no stale references. |
| DOC_ARTIFACT | Produce DOC_ARTIFACT at `changesets/outbox/<work_packet_id>/doc/doc_artifact.json`. |
| DOC_ARTIFACT fields | `changeset_id`, `work_packet_id`, `doc_surface`, `doc_targets`, `updates`, `staleness_resolved`, `doctrine_version`, `timestamp`. |
| Train-mode | When `orbt_mode=train`, the documentation lane is the primary execution lane. All `doc_targets` must be fully updated. |
| No invention | Do not add new documentation categories not in `doc_targets`. |

## Always Produced

1. **Code changes** within `WORK_PACKET.allowed_paths` only.
2. **CHANGESET** artifact to `changesets/outbox/<work_packet_id>/changeset.json`.
3. **Execution log** — structured record of all actions taken.
