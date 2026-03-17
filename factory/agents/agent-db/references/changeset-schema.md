# DB_CHANGESET — Field Rules and Schema

## DB_CHANGESET Fields

| Field | Rule |
|-------|------|
| `changeset_id` | Generate unique identifier. Format: `db-cs-YYYYMMDD-<seq>`. |
| `work_packet_id` | Copy from WORK_PACKET.id exactly. |
| `db_system` | Copy from WORK_PACKET.db_system exactly. |
| `db_targets` | Must be subset of WORK_PACKET.db_targets. |
| `migrations` | Ordered list of migration files. Forward and rollback. Sequential numbering. No gaps. |
| `schema_diff_artifact` | Path to before/after schema diff. Must be produced as artifact. |
| `rollback_plan` | Mandatory. Strategy + rollback migrations + verification query. |
| `validation_steps` | Post-migration validation. Each step must be deterministically verifiable. |
| `risk_class` | LOW: additive, no data loss. MED: type change, index rebuild. HIGH: table drop, data migration. |
| `doctrine_version` | Copy from WORK_PACKET.doctrine_version. |
| `timestamp` | ISO 8601 at generation time. |

## DB_DOC_ARTIFACT Fields

Produced when DB_CHANGESET includes schema changes (new tables, altered columns, new indexes).

| Field | Rule |
|-------|------|
| `changeset_id` | Reference to the DB_CHANGESET ID. |
| `work_packet_id` | Copy from WORK_PACKET.id. |
| `schema_changes` | Array of `{object, change_type, description}`. |
| `doc_impact` | Array of `{target, staleness_rule, action_required}` — maps to AUD-009 through AUD-012. |
| `doctrine_version` | Copy from WORK_PACKET.doctrine_version. |
| `timestamp` | ISO 8601 at generation time. |

## Pre-Generation Validation Checks

| Check | Description | Doctrine Reference |
|-------|-------------|-------------------|
| Registry-first | Every new table must be registered in column_registry.yml before migration SQL | CTB_REGISTRY_ENFORCEMENT §1 |
| Cardinality | Each sub-hub: exactly 1 CANONICAL + 1 ERROR. 0-2 SUPPORTING. | CTB_REGISTRY_ENFORCEMENT §1, ADR-001 |
| Migration ordering | Files numbered sequentially from last existing migration. No gaps. | Migrations README |
| RAW immutability | STAGING/SUPPORTING/CANONICAL: INSERT-only. No UPDATE/DELETE. | CTB_REGISTRY_ENFORCEMENT §8 |
| Vendor JSON containment | JSON/JSONB only in `vendor_claude_*` tables. | CTB_REGISTRY_ENFORCEMENT §9 |
| Bridge versioning | Bridge function changes require version bump. | CTB_REGISTRY_ENFORCEMENT §9 |
| Application role | Connections use `ctb_app_role` (NOSUPERUSER). | CTB_REGISTRY_ENFORCEMENT §10 |

## Risk Classification

| Risk Class | Criteria | Gate |
|------------|----------|------|
| LOW | Additive only: new columns (nullable or with defaults), new indexes, new views. No data loss possible. | Automatic — Builder proceeds. |
| MED | Column type changes, index rebuilds, constraint additions, view redefinitions. Potential performance impact. | Rollback plan must be reviewed. Builder proceeds with caution. |
| HIGH | Table drops, data migrations, column removals, constraint removals. Data loss possible. | Human approval required before Builder applies. |

## Database System Rules

| System | Migration Format | Validation Method |
|--------|-----------------|-------------------|
| `neon` | SQL files in `migrations/` directory. PostgreSQL dialect. | Direct SQL query via connection string. |
| `firebase` | Firestore rules JSON or RTDB rules JSON. | Firebase emulator or rules API. |
| `bigquery` | BigQuery DDL SQL. | BigQuery dry-run API. |
