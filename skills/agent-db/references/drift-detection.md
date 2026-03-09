# Drift Detection Rules

## When to Run

Run drift detection when `WORK_PACKET.change_type=fix` and `db_required=true`.

## Drift Check Table

| Check | Description | Classification |
|-------|-------------|---------------|
| ROGUE tables | Tables in live DB not in `ctb.table_registry` | **VIOLATION** |
| PHANTOM tables | In registry but not in DB | WARNING |
| ORPHAN tables | In DB but not in `column_registry.yml` | WARNING |
| GHOST tables | In `column_registry.yml` but not in DB | WARNING |
| COLUMN drift | Column mismatches between DB and registry | WARNING |
| REGISTRY desync | `ctb.table_registry` vs `column_registry.yml` mismatch | WARNING |

## Severity Mapping

- **VIOLATION**: Must be resolved before DB_CHANGESET can be generated. Blocks forward progress.
- **WARNING**: Documented in DB_CHANGESET. Does not block generation but must be addressed.

## Resolution Rules

- ROGUE tables must be either registered or dropped (with ADR for drops).
- PHANTOM tables indicate failed migrations — verify migration history.
- ORPHAN tables indicate missing registry entries — add to column_registry.yml.
- GHOST tables indicate stale registry — remove from column_registry.yml or create table.
- COLUMN drift requires migration to reconcile DB state with registry.
- REGISTRY desync requires column_registry.yml update to match ctb.table_registry.
