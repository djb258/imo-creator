# DEPRECATED — agents_v0

**Status**: DEPRECATED as of v3.5.0
**Archived from**: `templates/agents/`
**Replaced by**: Garage Control Plane V2

## New Locations (CTB-Compliant)

| V0 Path | V2 Path | Notes |
|---------|---------|-------|
| `templates/agents/planner/` | `ai/agents/planner/` | Same role, V2 WORK_PACKET contract |
| `templates/agents/builder/` | `ai/agents/worker/` | Renamed: Builder → Worker |
| `templates/agents/auditor/` | `ai/agents/auditor/` | Same role, certification layer added |
| `templates/agents/control_panel/` | `app/garage/` | Absorbed into garage orchestration |
| `templates/agents/contracts/work_packet.schema.json` | `sys/contracts/work_packet.schema.json` | V2 schema (new fields) |
| `templates/agents/contracts/changeset.schema.json` | — | Superseded by certification model |
| `templates/agents/contracts/audit_report.schema.json` | — | Retained in audit flow; certification wraps it |
| `templates/agents/contracts/arch_pressure_report.schema.json` | — | Retained in audit_rules.json |
| `templates/agents/contracts/flow_pressure_report.schema.json` | — | Retained in audit_rules.json |

## Compatibility

- **Builder = Worker** (deprecated name). Worker is the canonical term.
- V1 work packets can be translated to V2 via `sys/runtime/v1_translation_shim.json`.
- V1 read support remains active until next major doctrine version bump.
- V1 write support is discontinued. All new work packets must use V2 schema.

## Do Not Modify

This archive is a frozen snapshot. Do not edit files in this directory.
