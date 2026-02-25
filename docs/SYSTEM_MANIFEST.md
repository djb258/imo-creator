# System Manifest — IMO-Creator

**Type**: Template Sovereign Repository
**Status**: CONSTITUTIONAL
**Last Updated**: 2026-02-25

---

## What This Repository Is

IMO-Creator is the **governing sovereign** for all derived systems. It is a **template and doctrine repository**, not an implementation repository.

| Attribute | Value |
|-----------|-------|
| Repository Type | Sovereign Template |
| CC Layer | CC-01 (Sovereign) |
| Contains Code | No (templates only) |
| Contains Doctrine | Yes (authoritative) |
| Downstream Inheritance | Required |

---

## What This Repository Contains

### Constitutional Documents (Root)

| File | Purpose | Authority |
|------|---------|-----------|
| `CONSTITUTION.md` | Governing law | CONSTITUTIONAL |
| `IMO_CONTROL.json` | Control plane binding | CONSTITUTIONAL |
| `UI_CONTROL_CONTRACT.json` | UI build control | CONSTITUTIONAL |
| `CLAUDE.md` | AI assistant context | OPERATIONAL |

### Doctrine (templates/doctrine/)

| File | Purpose | Version |
|------|---------|---------|
| `ARCHITECTURE.md` | Primary architecture doctrine (CTB, CC, Hub-Spoke, IMO, Descent) | 2.1.0 |
| `CANONICAL_ARCHITECTURE_DOCTRINE.md` | REDIRECT to ARCHITECTURE.md | N/A |
| `HUB_SPOKE_ARCHITECTURE.md` | REDIRECT to ARCHITECTURE.md Part IV | N/A |
| `ALTITUDE_DESCENT_MODEL.md` | REDIRECT to ARCHITECTURE.md Part VI | N/A |
| `REPO_REFACTOR_PROTOCOL.md` | Repo structure law | 1.2.0 |

### Templates (templates/)

| Directory | Purpose |
|-----------|---------|
| `templates/prd/` | PRD templates for hubs |
| `templates/adr/` | ADR templates |
| `templates/pr/` | Pull request templates |
| `templates/checklists/` | Compliance checklists |
| `templates/integrations/` | Tool integration guides |
| `templates/claude/` | Claude Code lifecycle prompts |

### Agent Contracts (agents/)

| Directory/File | Purpose |
|----------------|---------|
| `agents/contracts/work_packet.schema.json` | WORK_PACKET governance envelope |
| `agents/contracts/changeset.schema.json` | CHANGESET governance envelope |
| `agents/contracts/audit_report.schema.json` | AUDIT_REPORT governance envelope |
| `agents/contracts/arch_pressure_report.schema.json` | Structural pressure test (5 PASS/FAIL fields) |
| `agents/contracts/flow_pressure_report.schema.json` | Flow pressure test (5 PASS/FAIL fields) |
| `agents/planner/master_prompt.md` | Planner role prompt |
| `agents/builder/master_prompt.md` | Builder role prompt |
| `agents/auditor/master_prompt.md` | Auditor role prompt |
| `agents/control_panel/master_prompt.md` | Control Panel role prompt |

### Constitutional Documents (docs/constitutional/)

| File | Purpose |
|------|---------|
| `backbone.md` | CTB backbone authority, altitude hierarchy, elevation triggers |
| `governance.md` | Agent roles, artifact flow, bus enforcement, pressure test routing |
| `protected_assets.md` | Protected models and folders |

### Global Configuration (templates/config/)

| File | Purpose |
|------|---------|
| `global_manifest.yaml` | Master ecosystem config |
| `repo_organization_standard.yaml` | Universal structure pattern |
| `imo-ra-schema.json` | Fractal hub-spoke schema |
| `CTB_DOCTRINE.md` | Pointer to canonical (thin doc) |

### Automation (scripts/)

| Directory | Purpose |
|-----------|---------|
| `scripts/fleet-status.sh` | Fleet health check |
| `scripts/adr-check.sh` | ADR index audit |

---

## What This Repository Does NOT Contain

| Absent | Reason |
|--------|--------|
| Implementation code | Template repo only |
| `src/` directory | No implementation |
| Business logic | Lives in child repos |
| Runtime configuration | Lives in child repos |
| Individual PRDs | Template only, instances in children |
| Individual ADRs | Template only, instances in children |

---

## Downstream Inheritance

Child repositories inherit from IMO-Creator by:

1. Copying `IMO_CONTROL.json` to root
2. Copying `UI_CONTROL_CONTRACT.json` if UI exists
3. Running `scripts/install-hooks.sh`
4. Creating `DOCTRINE.md` pointing to imo-creator
5. Following CTB structure exactly

**Override allowed**: No
**Interpretation allowed**: No

---

## Authority Chain

```
CONSTITUTION.md (Law)
    │
    ├── IMO_CONTROL.json (Control Plane)
    │
    ├── templates/doctrine/ (Executable Doctrine)
    │       │
    │       ├── ARCHITECTURE.md (Primary architecture doctrine v2.1.0)
    │       └── REPO_REFACTOR_PROTOCOL.md (Subordinate)
    │
    ├── docs/constitutional/ (Agent Governance)
    │       ├── backbone.md
    │       ├── governance.md
    │       └── protected_assets.md
    │
    └── agents/contracts/ (Schema Contracts)
            ├── work_packet.schema.json
            ├── changeset.schema.json
            ├── audit_report.schema.json
            ├── arch_pressure_report.schema.json
            └── flow_pressure_report.schema.json
```

All other documents are operational and subordinate to doctrine.

---

## Validation

| Check | Script |
|-------|--------|
| Doctrine Enforcement | `.github/workflows/doctrine-enforcement.yml` |
| Pressure Test Gate | `.github/workflows/doctrine-enforcement.yml` (pressure-test-gate job) |
| CTB Governance | `.github/workflows/ctb-governance-required.yml` |
| Fail-Closed Gate | `.github/workflows/reusable-fail-closed-gate.yml` |
| Fleet Status | `scripts/fleet-status.sh` |
| ADR Index Audit | `scripts/adr-check.sh` |

---

## Cross-Reference

| Manifest | Location | Purpose |
|----------|----------|---------|
| IMO_CONTROL.json | Root | Claude Code behavior binding |
| UI_CONTROL_CONTRACT.json | Root | UI build control |
| FLEET_REGISTRY.yaml | Root | Fleet child repo inventory |
| TEMPLATES_MANIFEST.yaml | templates/ | Machine-readable file index (v3.4.0) |
| AUTHORITY_MAP.md | docs/ | Governance topology |
| REGISTRY.yaml | N/A (in child repos) | Child repo component registry |

---

## Document Control

| Field | Value |
|-------|-------|
| Type | System Manifest |
| Authority | Describes sovereign |
| Created | 2026-01-11 |
| Last Modified | 2026-02-25 |
| Change Protocol | ADR-triggered only |
