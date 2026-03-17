# Lane Validation — Per-Lane Audit Checks

## DB Lane (when `db_required=true`)

| Check | On Failure |
|-------|-----------|
| DB_CHANGESET exists at `changesets/outbox/<wp_id>/db/db_changeset.json` | FAIL_EXECUTION |
| DB_CHANGESET validates against `factory/contracts/db_changeset.schema.json` | FAIL_EXECUTION |
| `db_system` matches WORK_PACKET.db_system | FAIL_SCOPE |
| `db_targets` is subset of WORK_PACKET.db_targets | FAIL_SCOPE |
| `rollback_plan` is present and complete (strategy + migrations + verification) | FAIL_EXECUTION |
| All `validation_steps` have been executed and passed | FAIL_EXECUTION |
| Migration files exist and are numbered sequentially | FAIL_EXECUTION |
| V1 packet attempting DB work (no `db_required` field) | FAIL_SCOPE |

## UI Lane (when `ui_required=true`)

| Check | On Failure |
|-------|-----------|
| UI_CHANGESET exists at `changesets/outbox/<wp_id>/ui/ui_changeset.json` | FAIL_EXECUTION |
| UI_CHANGESET validates against `factory/contracts/ui_changeset.schema.json` | FAIL_EXECUTION |
| `ui_surface` matches WORK_PACKET.ui_surface | FAIL_SCOPE |
| `ui_target` matches WORK_PACKET.ui_target | FAIL_SCOPE |
| `preview_artifacts` array is non-empty and all files exist | FAIL_EXECUTION |
| All `acceptance_checks` have `status: PASS` | FAIL_EXECUTION |
| V1 packet attempting UI work | FAIL_SCOPE |

## Container Lane (when `container_required=true`)

| Check | On Failure |
|-------|-----------|
| CONTAINER_RUN exists at `changesets/outbox/<wp_id>/container/container_run.json` | FAIL_EXECUTION |
| CONTAINER_RUN validates against `factory/contracts/container_run.schema.json` | FAIL_EXECUTION |
| `container_profile` matches WORK_PACKET.container_profile | FAIL_SCOPE |
| `container_target` matches WORK_PACKET.container_target | FAIL_SCOPE |
| `exit_code` is 0 | FAIL_EXECUTION |
| All test suites have `failed: 0` | FAIL_EXECUTION |
| `image_digest` is present and valid format | FAIL_EXECUTION |

## Documentation Lane (when `doc_required=true`)

| Check | On Failure |
|-------|-----------|
| DOC_ARTIFACT exists at `changesets/outbox/<wp_id>/doc/doc_artifact.json` | FAIL_EXECUTION |
| DOC_ARTIFACT `doc_surface` matches WORK_PACKET.doc_surface | FAIL_SCOPE |
| DOC_ARTIFACT `doc_targets` is subset of WORK_PACKET.doc_targets | FAIL_SCOPE |
| All `staleness_resolved` entries reference valid AUD rules | FAIL_EXECUTION |

## DB Documentation Lane (when `db_required=true` and schema changes present)

| Check | On Failure |
|-------|-----------|
| DB_DOC_ARTIFACT exists at `changesets/outbox/<wp_id>/db/db_doc_artifact.json` | FAIL_EXECUTION |
| All `doc_impact` entries map to valid staleness rules (AUD-009 through AUD-012) | FAIL_EXECUTION |
