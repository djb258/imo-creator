# ADR: BAR-104 LOCKED File Platform Purge — Retired Platform References

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 3.4.1 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-028 |
| **Status** | [x] Accepted |
| **Date** | 2026-03-11 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | imo-creator |
| **Hub Name** | Sovereign |
| **Hub ID** | CC-01 |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | SNAP_ON_TOOLBOX.yaml infrastructure block, CONSTITUTION.md enforcement list |
| CC-02 (Hub) | [ ] | |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [x] | TEMPLATES_MANIFEST.yaml hostinger entries, hostinger integration directory |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [ ] |
| M — Middle | [x] |
| O — Egress | [ ] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Constant (structure/meaning) |
| **Mutability** | [x] Immutable |

---

## Context

BAR-100 (CF-primary architecture) retired five platforms: Lovable.dev, Supabase, Hostinger/n8n, Vercel, and Instantly.ai. BAR-104 swept the entire fleet and updated all modifiable files. However, four LOCKED files in imo-creator still contain stale references to retired platforms. These files are constitutional law and require ADR + human approval to modify.

The stale references are:

1. **SNAP_ON_TOOLBOX.yaml** (lines 427-430): `infrastructure.ui` = Lovable.dev, `infrastructure.compute` = Supabase Edge Functions, `infrastructure.orchestration` = n8n @ Hostinger
2. **CONSTITUTION.md** (line 15): "Enforcement mechanisms — Pre-commit, CI, Claude Code, Lovable.dev"
3. **templates/integrations/hostinger/** (entire directory): Hostinger VPS/n8n integration spec — platform is retired
4. **templates/TEMPLATES_MANIFEST.yaml** (lines 605-611): Hostinger integration entries

---

## Decision

Update all four LOCKED artifacts to reflect the BAR-100 architecture:

| File | Change |
|------|--------|
| `SNAP_ON_TOOLBOX.yaml` line 427 | `ui: Lovable.dev` → `ui: Figma UI` (role: "Design + Prototyping") |
| `SNAP_ON_TOOLBOX.yaml` line 428 | `compute: Supabase Edge Functions` → `compute: CF Workers` (role: "Edge compute (BAR-100)") |
| `SNAP_ON_TOOLBOX.yaml` line 430 | `orchestration: n8n @ Hostinger` → `orchestration: CF Workers + Queues` (role: "Native orchestration (BAR-100)") |
| `CONSTITUTION.md` line 15 | `Lovable.dev` → `Figma UI` in enforcement mechanisms list |
| `templates/integrations/hostinger/` | Mark both files as RETIRED with deprecation header; do NOT delete (preserves git history) |
| `templates/TEMPLATES_MANIFEST.yaml` lines 605-611 | Mark hostinger entries as `status: RETIRED (BAR-100)` |

The `infrastructure.database` entry (line 429) already reads `Neon, role: "Vault - source of truth"` which is correct post-BAR-100 — no change needed there.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Delete hostinger directory entirely | Loses git history; deprecation header is cleaner |
| Leave stale references | Creates permanent drift between LOCKED files and operational reality |
| Do Nothing | Fleet has already moved — stale LOCKED files become misleading constitutional law |

---

## Consequences

### Enables

- All LOCKED files aligned with BAR-100 architecture
- Child repos syncing SNAP_ON_TOOLBOX.yaml get correct infrastructure block
- No more misleading references to retired platforms in constitutional documents

### Prevents

- New repos bootstrapping with stale Lovable.dev/Supabase/Hostinger references
- Audit confusion when LOCKED files contradict operational registries

---

## PID Impact (if CC-04 affected)

| Field | Value |
|-------|-------|
| **New PID required** | [x] No |
| **PID pattern change** | [x] No |
| **Audit trail impact** | TEMPLATES_MANIFEST entries marked RETIRED |

---

## Guard Rails

_No runtime behavior affected. These are documentation/registry updates only._

| Type | Value | CC Layer |
|------|-------|----------|
| Rate Limit | N/A | |
| Timeout | N/A | |
| Kill Switch | N/A | |

---

## Rollback

Revert the commit containing these changes. All modifications are text-only in LOCKED files with no runtime dependencies.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md |
| PRD | N/A (infrastructure alignment, not feature) |
| Work Items | BAR-100 (CF-primary), BAR-102 (Hyperdrive vault-sync), BAR-104 (fleet audit) |
| PR(s) | Direct commit to master (sovereign repo, human-approved ADR) |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | Dave (Human) | 2026-03-11 |
| Reviewer | Claude Code (AI, executing under human approval) | 2026-03-11 |
