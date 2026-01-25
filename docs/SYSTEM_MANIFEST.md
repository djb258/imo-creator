# System Manifest — IMO-Creator

**Type**: Template Sovereign Repository
**Status**: CONSTITUTIONAL
**Last Updated**: 2026-01-11

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
| `LOVABLE_CONTROL.json` | UI build control | CONSTITUTIONAL |
| `CLAUDE.md` | AI assistant context | OPERATIONAL |

### Doctrine (templates/doctrine/)

| File | Purpose | Version |
|------|---------|---------|
| `CANONICAL_ARCHITECTURE_DOCTRINE.md` | Master doctrine | 1.3.0 |
| `HUB_SPOKE_ARCHITECTURE.md` | Hub-spoke geometry | 1.2.0 |
| `ALTITUDE_DESCENT_MODEL.md` | CC descent gates | 1.1.0 |
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

### Global Configuration (global-config/)

| File | Purpose |
|------|---------|
| `global_manifest.yaml` | Master ecosystem config |
| `repo_organization_standard.yaml` | Universal structure pattern |
| `imo-ra-schema.json` | Fractal hub-spoke schema |
| `CTB_DOCTRINE.md` | Pointer to canonical (thin doc) |

### Operations (docs/operations/)

| File | Purpose |
|------|---------|
| `SECURITY_LOCKDOWN.md` | MCP vault, secret handling |
| `CTB_ENFORCEMENT.md` | Enforcement checks |
| `GIT_BRANCH_STRATEGY.md` | Git branch structure |

### Automation (scripts/)

| Directory | Purpose |
|-----------|---------|
| `scripts/hooks/` | Pre-commit hooks |
| `scripts/*.sh` | Doctrine enforcement scripts |

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
2. Copying `LOVABLE_CONTROL.json` if UI exists
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
    └── templates/doctrine/ (Executable Doctrine)
            │
            ├── CANONICAL_ARCHITECTURE_DOCTRINE.md (Master)
            ├── HUB_SPOKE_ARCHITECTURE.md (Subordinate)
            ├── ALTITUDE_DESCENT_MODEL.md (Subordinate)
            └── REPO_REFACTOR_PROTOCOL.md (Subordinate)
```

All other documents are operational and subordinate to doctrine.

---

## Validation

| Check | Script |
|-------|--------|
| CTB Structure | `global-config/scripts/ctb_verify.sh` |
| Doctrine Sync | `.github/workflows/doctrine_sync.yml` |
| Enforcement | `.github/workflows/doctrine-enforcement.yml` |
| Security | `global-config/scripts/security_lockdown.sh` |

---

## Cross-Reference

| Manifest | Location | Purpose |
|----------|----------|---------|
| IMO_CONTROL.json | Root | Claude Code behavior binding |
| LOVABLE_CONTROL.json | Root | UI build control |
| global_manifest.yaml | global-config/ | Ecosystem configuration |
| imo-ra-schema.json | global-config/ | Fractal architecture template |
| REGISTRY.yaml | N/A (in child repos) | Child repo component registry |

---

## Document Control

| Field | Value |
|-------|-------|
| Type | System Manifest |
| Authority | Describes sovereign |
| Created | 2026-01-11 |
| Change Protocol | ADR-triggered only |
