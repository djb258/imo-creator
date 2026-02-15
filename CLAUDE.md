# CLAUDE.md — IMO-Creator

## IDENTITY

This is the **repo of repos**. All doctrine originates here. Downstream repos CONFORM to this repo. This repo conforms to NOTHING.

**Authority**: Sovereign (CC-01)
**Purpose**: Define operating physics for all derived systems

---

## LOCKED FILES (READ-ONLY)

The following files are **LAW**. Claude Code may READ them. Claude Code may NEVER modify them.

### Doctrine (Constitutional Law)

| File | Purpose |
|------|---------|
| `templates/doctrine/ARCHITECTURE.md` | CTB Constitutional Law - CTB, CC, Hub-Spoke, IMO, Descent, PID (v2.1.0) |
| `templates/doctrine/ROLLBACK_PROTOCOL.md` | Doctrine sync rollback procedure - when to use, 6-step revert, version pinning |
| `templates/integrations/TOOLS.md` | Tool law - determinism first, LLM as tail only |

**Note**: ARCHITECTURE.md consolidates CANONICAL_ARCHITECTURE_DOCTRINE.md, HUB_SPOKE_ARCHITECTURE.md, and ALTITUDE_DESCENT_MODEL.md (which now exist as redirects).

### PRD Template

| File | Purpose |
|------|---------|
| `templates/prd/PRD_HUB.md` | Hub PRD format (15 sections) |

### ADR Template

| File | Purpose |
|------|---------|
| `templates/adr/ADR.md` | Architecture Decision Record format |

### Checklist Template

| File | Purpose |
|------|---------|
| `templates/checklists/HUB_COMPLIANCE.md` | Hub compliance checklist format |

### Semantic Access (CONSTITUTIONAL)

| File | Purpose |
|------|---------|
| `templates/semantic/OSAM.md` | Operational Semantic Access Map - authoritative query-routing contract |

### PR Templates

| File | Purpose |
|------|---------|
| `templates/pr/PULL_REQUEST_TEMPLATE_HUB.md` | Hub PR format |
| `templates/pr/PULL_REQUEST_TEMPLATE_SPOKE.md` | Spoke PR format |

### Snap-On Toolbox (CONSTITUTIONAL)

| File | Purpose |
|------|--------|
| `templates/SNAP_ON_TOOLBOX.yaml` | Master tool registry - all approved tools, throttles, gates, banned list |

### Integration Specs

| File | Purpose |
|------|---------|
| `templates/integrations/COMPOSIO.md` | Composio integration spec |
| `templates/integrations/DOPPLER.md` | Doppler integration spec |
| `templates/integrations/HEIR.md` | HEIR integration spec |
| `templates/integrations/OBSIDIAN.md` | Obsidian integration spec |
| `templates/integrations/doppler.yaml.template` | Doppler config template |
| `templates/integrations/heir.doctrine.yaml.template` | HEIR config template |

---

## TOOL DOCTRINE (CONSTITUTIONAL)

**TOOLS.md and SNAP_ON_TOOLBOX.yaml are constitutional law.**

### Snap-On Toolbox Authority

`templates/SNAP_ON_TOOLBOX.yaml` is the **master tool registry**. Before suggesting ANY tool, library, or vendor:

| Step | Action |
|------|--------|
| 1 | Check BANNED list → If banned, STOP, suggest alternative |
| 2 | Check TIER 0 (FREE) → Prefer free tools first |
| 3 | Check TIER 1 (CHEAP) → Use existing subscriptions |
| 4 | Check TIER 2 (SURGICAL) → Gated, require conditions |
| 5 | If NOT LISTED → ASK, may need ADR |

### Core Rules

| Rule | Violation |
|------|-----------|
| Tools scoped to hub M layer only | Doctrine violation |
| Spokes do not own tools | Doctrine violation |
| Deterministic solution evaluated first | Doctrine violation |
| LLM as tail arbitration only | Doctrine violation |
| ADR required for every tool | PR rejected |
| Tool ledger maintained per hub | Non-compliant |
| Tool not in SNAP_ON_TOOLBOX.yaml | Doctrine violation |

### LLM Containment

```
ALLOWED:
  Deterministic logic → exhausted → LLM arbitrates edge case → output validated → action

FORBIDDEN:
  User request → LLM decides → action
```

**LLM is tail, not spine. AI assists, it does not decide.**

---

## ENFORCEMENT

### What LOCKED Means

| Action | Permitted |
|--------|-----------|
| READ | ✅ Required before any downstream work |
| WRITE | ❌ Prohibited. No exceptions. |
| COPY structure | ✅ To downstream repos only |
| MODIFY structure | ❌ Prohibited. ADR + human approval required. |
| ADD sections | ❌ Prohibited. Doctrine violation. |
| REMOVE sections | ❌ Prohibited. Doctrine violation. |
| RENAME sections | ❌ Prohibited. Doctrine violation. |
| REORDER sections | ❌ Prohibited. Doctrine violation. |
| INTERPRET | ❌ Prohibited. Apply as written. |

**Violation of any LOCKED file is a doctrine violation. Stop immediately.**

---

## TEMPLATE RULES

When a child repo uses a template:

1. **Copy the template** to the child repo
2. **Fill in bracketed values** `[PLACEHOLDER]` with actual values
3. **DO NOT** add sections
4. **DO NOT** remove sections
5. **DO NOT** rename sections
6. **DO NOT** add prose between sections
7. **DO NOT** change table structures

If the template doesn't fit your use case, you have two options:
- A) Your use case is wrong. Conform.
- B) Submit an ADR to imo-creator to modify the template. Human approval required.

There is no option C.

---

## DOWNSTREAM CONFORMANCE REQUIREMENTS

Every repo that derives from imo-creator MUST:

1. **Declare conformance** in its CLAUDE.md:
   ```markdown
   ## CANONICAL REFERENCE

   | Template | imo-creator Path | Version |
   |----------|------------------|---------|
   | Architecture | templates/doctrine/ARCHITECTURE.md | 2.1.0 |
   | Tools | templates/integrations/TOOLS.md | 1.1.0 |
   | OSAM | templates/semantic/OSAM.md | 1.1.0 |
   | PRD | templates/prd/PRD_HUB.md | 1.0.0 |
   | ADR | templates/adr/ADR.md | 1.0.0 |
   | Checklist | templates/checklists/HUB_COMPLIANCE.md | 1.0.0 |
   ```

2. **Match template structure exactly** - same sections, same order, same tables

3. **Version-lock** - if imo-creator updates a template, downstream must update or be NON-COMPLIANT

4. **Maintain tool ledger** - every hub must have registered tools with ADR references

---

## CHANGE PROTOCOL

Any change to a LOCKED FILE requires:

| Step | Action | Authority |
|------|--------|-----------|
| 1 | ADR created in imo-creator | Human |
| 2 | ADR approved | Human |
| 3 | Template version incremented | Human |
| 4 | Change applied | Human (not Claude Code) |
| 5 | All downstream repos notified | Human |

**No exceptions. No "quick fixes." No interpretation. No Claude Code modifications.**

---

## HIERARCHY

```
imo-creator (THIS REPO) ← SOVEREIGN
│
├── templates/doctrine/     ← CONSTITUTIONAL LAW (locked)
│   ├── ARCHITECTURE.md              ← CTB Constitutional Law (v2.0.0)
│   ├── CANONICAL_ARCHITECTURE_DOCTRINE.md  ← REDIRECT
│   ├── HUB_SPOKE_ARCHITECTURE.md    ← REDIRECT
│   └── ALTITUDE_DESCENT_MODEL.md    ← REDIRECT
│
├── templates/integrations/TOOLS.md ← CONSTITUTIONAL LAW (locked)
│
├── templates/semantic/     ← CONSTITUTIONAL LAW (locked)
│   └── OSAM.md
│
├── templates/prd/          ← TEMPLATE LAW (locked)
├── templates/adr/          ← TEMPLATE LAW (locked)
├── templates/checklists/   ← TEMPLATE LAW (locked)
├── templates/pr/           ← TEMPLATE LAW (locked)
├── templates/integrations/ ← SPEC LAW (locked)
│
├── company-lifecycle (child repo)
│   └── Conforms to imo-creator
│
├── outreach (child repo)
│   └── Conforms to imo-creator
│
├── sales (child repo)
│   └── Conforms to imo-creator
│
└── client (child repo)
    └── Conforms to imo-creator
```

**Parent defines. Children conform. Never the reverse.**

---

## WHAT CLAUDE CODE CAN DO IN THIS REPO

| Action | Permitted |
|--------|-----------|
| Read locked files | ✅ YES |
| Read templates | ✅ YES |
| Create NEW templates (with human approval) | ✅ YES |
| Create ADR drafts (for human review) | ✅ YES |
| Modify locked files | ❌ NO |
| Modify template structure | ❌ NO |
| Reinterpret templates | ❌ NO |
| Add concepts not in canonical | ❌ NO |
| "Improve" templates | ❌ NO |
| Add "helpful" sections | ❌ NO |
| Use LLM as primary solution | ❌ NO |

---

## DRIFT DETECTION

If Claude Code sees a downstream file that doesn't match the template:

1. **Flag it** - Report the drift
2. **Do NOT "fix" it by adding to the template** - The template is correct
3. **Do NOT add the drift to future work** - It's a bug, not a feature
4. **Recommend conformance** - The downstream file must be corrected

Drift is a child repo problem, not a template problem.

---

## GOLDEN RULES

1. **This repo is the parent. It conforms to nothing.**
2. **Locked files are law. Read, don't touch.**
3. **Templates are structure. Fill in blanks, don't redesign.**
4. **Children conform to parent. Never the reverse.**
5. **Changes require ADR. No shortcuts.**
6. **Drift is a bug. Templates are correct.**
7. **Determinism first. LLM as tail only.**

---

## Fleet Management Files (Repo Root)

These files live at the imo-creator repo root (NOT in templates/). They are operational files for managing the fleet of child repos.

| File | Purpose | Maintained By |
|------|---------|---------------|
| `FLEET_REGISTRY.yaml` | All child repos, versions, sync status | Human |
| `ADR_INDEX.md` | Fleet-wide ADR lookup table | Human + AI (after ADR creation) |
| `scripts/fleet-status.sh` | Fleet health check (reads FLEET_REGISTRY.yaml) | Automated |
| `scripts/fleet-status.ps1` | Fleet health check (Windows) | Automated |
| `scripts/adr-check.sh` | ADR index audit (compares index vs repo files) | Automated |
| `scripts/adr-check.ps1` | ADR index audit (Windows) | Automated |

**Note**: These are NOT templates. They are not tracked in TEMPLATES_MANIFEST.yaml. They operate on imo-creator itself.

---

## RELATIONSHIP TO CONSTITUTION.MD

`CONSTITUTION.md` and `CLAUDE.md` serve different audiences:

| File | Audience | Purpose |
|------|----------|---------|
| `CONSTITUTION.md` | Humans, downstream repos | What is governed, invariants, transformation law, enforcement mechanisms |
| `CLAUDE.md` | AI agents (Claude Code, Copilot) | Locked file registry, permissions, operational rules |

**Do not duplicate content between them.** CONSTITUTION.md defines the law. CLAUDE.md defines what AI can and cannot do under that law. If a rule appears in both, CONSTITUTION.md is authoritative.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-06 |
| Last Modified | 2026-02-15 |
| Status | ACTIVE |
| Authority | Human only |
