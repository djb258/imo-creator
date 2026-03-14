# CLAUDE.md — IMO-Creator

## IDENTITY

This is the **repo of repos**. All doctrine originates here. Downstream repos CONFORM to this repo. This repo conforms to NOTHING.

**Authority**: Sovereign (CC-01)
**Purpose**: Define operating physics for all derived systems

---

## LOCKED FILES (READ-ONLY)

The following files are **LAW**. Claude Code may READ them. Claude Code may NEVER modify them.

### Tier 0 — The Foundation (HUMAN AUTHORITY ONLY)

| File | Purpose | Write Authority |
|------|---------|-----------------|
| `CLAUDE.md` | This file. Master instruction set for all AI agents operating in this repo. LOCKED. | Human only — no LLM may modify. |
| `law/doctrine/TIER0_DOCTRINE.md` | Tier 0 Doctrine — the universal constant-extraction engine. Three validators (IMO, CTB, Circle), gate mechanism, two-phase altitude structure, fractal IMO, tolerance cascade. Everything in the system derives from this. LOCKED. | Human only — no LLM may modify. |
| `factory/agents/skill-creator/SKILL.md` | Tier 0 Implementation Engine — 10-block constant-extraction pipeline. Extends three validators to five elements (C&V, IMO, CTB, Hub-and-Spoke, Circle). Produces all skills. Defines the block format constant. LOCKED. | Human only — no LLM may modify. |

**These three files are the top of the hierarchy. They govern everything below. No AI agent — Claude Code, Copilot, or any other LLM — may modify them. Changes require the human operator (Dave) directly.**

**Tier 0 is the engine. Everything below is fuel it processes.**

### Doctrine (Constitutional Law)

| File | Purpose |
|------|---------|
| `law/doctrine/ARCHITECTURE.md` | CTB Constitutional Law - CTB, CC, Hub-Spoke, IMO, Descent, PID (v2.1.0) |
| `law/doctrine/ROLLBACK_PROTOCOL.md` | Doctrine sync rollback procedure - when to use, 6-step revert, version pinning |
| `law/doctrine/EXECUTION_SURFACE_LAW.md` | Execution surface containment (v1.0.0) |
| `law/doctrine/CTB_REGISTRY_ENFORCEMENT.md` | Registry-first enforcement + batch-level RAW lockdown + vendor JSON containment + bootstrap enforcement (v1.5.0) |
| `law/doctrine/FAIL_CLOSED_CI_CONTRACT.md` | Fail-closed CI contract + bootstrap guarantees (v1.1.0) |
| `law/doctrine/LEGACY_COLLAPSE_PLAYBOOK.md` | Legacy collapse protocol (v1.0.0) |
| `law/integrations/TOOLS.md` | Tool law - determinism first, LLM as tail only |

**Note**: ARCHITECTURE.md consolidates CANONICAL_ARCHITECTURE_DOCTRINE.md, HUB_SPOKE_ARCHITECTURE.md, and ALTITUDE_DESCENT_MODEL.md (which now exist as redirects).

### PRD Template

| File | Purpose |
|------|---------|
| `fleet/car-template/docs/PRD_HUB.md` | Hub PRD format (15 sections) |

### ADR Template

| File | Purpose |
|------|---------|
| `fleet/adr-templates/ADR.md` | Architecture Decision Record format |

### Checklist Template

| File | Purpose |
|------|---------|
| `fleet/checklists/HUB_COMPLIANCE.md` | Hub compliance checklist format |

### Semantic Access (CONSTITUTIONAL)

| File | Purpose |
|------|---------|
| `law/semantic/OSAM.md` | Operational Semantic Access Map - authoritative query-routing contract |

### PR Templates

| File | Purpose |
|------|---------|
| `fleet/pr-templates/PULL_REQUEST_TEMPLATE_HUB.md` | Hub PR format |
| `fleet/pr-templates/PULL_REQUEST_TEMPLATE_SPOKE.md` | Spoke PR format |

### Snap-On Toolbox (CONSTITUTIONAL)

| File | Purpose |
|------|--------|
| `law/SNAP_ON_TOOLBOX.yaml` | Master tool registry - all approved tools, throttles, gates, banned list |

### Integration Specs

| File | Purpose |
|------|---------|
| `law/integrations/COMPOSIO.md` | Composio integration spec |
| `law/integrations/DOPPLER.md` | Doppler integration spec |
| `law/integrations/HEIR.md` | HEIR integration spec |
| `law/integrations/OBSIDIAN.md` | Obsidian integration spec |
| `law/integrations/doppler.yaml.template` | Doppler config template |
| `law/integrations/heir.doctrine.yaml.template` | HEIR config template |

### Prompt and Skills Bay (CONSTITUTIONAL)

| File | Purpose |
|------|---------|
| `law/constitutional/PROMPT_SKILLS_BAY_CONSTITUTION.md` | Prompt and Skills Bay governance — Transformation Law, PSB artifacts, audit requirements, Garage relationship (v1.0.0) |

### Operator Profile (HUMAN AUTHORITY ONLY)

| File | Purpose |
|------|---------|
| `OPERATOR_PROFILE.md` | Document of documents — operator constants, block format, five elements, compliance gate. HUMAN AUTHORITY ONLY — no LLM may modify. |

### Skills System Governance

| File | Purpose |
|------|---------|
| `factory/SKILLS_SYSTEM.md` | Skills governance — three tiers (agent/master/car), directory layout, creation rules. All tiers conform to Tier 0 Doctrine. |
| `factory/agents/skill-creator/SKILL.md` | Tier 0 implementation engine — 10-block constant-extraction pipeline. Registered above in Tier 0 section. Produces all other skills. |

**Chain of authority:** Tier 0 Doctrine → skill-creator (Tier 0 engine) → SKILLS_SYSTEM.md (governance) → all skills (agent, master, car).

---

## TOOL DOCTRINE (CONSTITUTIONAL)

**TOOLS.md and SNAP_ON_TOOLBOX.yaml are constitutional law.**

### Snap-On Toolbox Authority

`law/SNAP_ON_TOOLBOX.yaml` is the **master tool registry**. Before suggesting ANY tool, library, or vendor:

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

**The three Tier 0 files (`CLAUDE.md`, `law/doctrine/TIER0_DOCTRINE.md`, `factory/agents/skill-creator/SKILL.md`) are HUMAN AUTHORITY ONLY. No LLM may modify them under any circumstances. No ADR process — only the human operator.**

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

### Phase Two Lockdown (v3.0.2)

The CTB drift audit is now **mandatory** and **tamper-resistant**:

| Component | Purpose |
|-----------|---------|
| `ctb-governance-required.yml` | Mandatory CI workflow — runs fail-closed gate + drift audit on every PR/push |
| `ctb-drift-audit.sh` | **LOCKED** — modification requires ADR-REF trailer (CHECK 15) |
| `--mode=baseline\|strict` | Baseline mode allows legacy tables while blocking new entropy |
| `docs/CTB_DRIFT_BASELINE.json` | Captures known legacy drift state (child repo output — generated by `ctb-drift-audit.sh --write-baseline`; exists in child repos, not in imo-creator) |

### Batch-Level RAW Lockdown (v3.1.0)

INSERT-only enforcement across the entire data pipeline:

| Component | Purpose |
|-----------|---------|
| `CTB_REGISTRY_ENFORCEMENT.md §8` | Doctrine: vendor bridges, RAW immutability, batch registry, _active views |
| `005_raw_immutability.sql` | DB trigger: blocks UPDATE/DELETE on STAGING, SUPPORTING, CANONICAL tables |
| `006_raw_batch_registry.sql` | Batch lifecycle: `ctb.raw_batch_registry` with supersede chain |
| `007_raw_active_view_template.sql` | View helper: creates `_active` views filtering to current batches |
| Drift checks 7-9 | Detects missing immutability triggers, RAW columns, and _active views |

### Vendor JSON + Frozen Bridge Enforcement (v3.2.0)

JSON containment and versioned bridge enforcement:

| Component | Purpose |
|-----------|---------|
| `CTB_REGISTRY_ENFORCEMENT.md §9` | Doctrine: vendor JSON sandbox, frozen bridge law, RAW discipline, downstream access law |
| `008_vendor_json_template.sql` | Template for `vendor_claude_<subhub>` tables — JSON allowed ONLY here |
| `009_bridge_template.sql` | Template for versioned bridge functions — explicit JSON extraction, strict validation |
| `010_vendor_write_permissions.sql` | Role separation: `ctb_vendor_writer`, `ctb_data_reader`, `ctb_bridge_executor` |
| Drift checks 10-13 | JSON in RAW/downstream, bridge version constants, vendor reference violations |

**Vendor JSON Law**: All external tool output MUST land in `vendor_claude_*` tables. All JSON mapping MUST occur in versioned bridge functions. No JSON is permitted beyond the vendor layer. RAW, SUPPORTING, and CANONICAL tables contain structured columns only.

### Phase 3 Bootstrap Guarantees (v3.3.0)

No child repo is structurally valid without ALL of the following:

| Requirement | Verification |
|-------------|-------------|
| Non-superuser DB role | `ctb.validate_application_role()` — migration 011 |
| Governance CI wired | `verify-governance-ci.sh` — Gate E in fail-closed gate |
| Drift audit strict passing | `ctb-drift-audit.sh --mode=strict` — check 14 (SUPERUSER_CONNECTION) |
| Bootstrap attestation | `bootstrap-audit.sh` → `docs/BOOTSTRAP_AUDIT.md` present with PASS (child repo output; exists in child repos, not in imo-creator) |

| Component | Purpose |
|-----------|---------|
| `CTB_REGISTRY_ENFORCEMENT.md §10` | Doctrine: non-superuser requirement, governance CI, bootstrap audit |
| `FAIL_CLOSED_CI_CONTRACT.md §7` | Doctrine: bootstrap guarantees definition |
| `011_enforce_application_role.sql` | DB: `ctb_app_role` (NOSUPERUSER), `validate_application_role()` |
| `verify-governance-ci.sh` | CI: validates required workflows, no continue-on-error, scripts present |
| `bootstrap-audit.sh` | Audit: one-command Day 0 validation, produces attestation |
| Gate E | CI: runs verify-governance-ci.sh in fail-closed gate |
| Drift check 14 | Audit: SUPERUSER_CONNECTION detection |

### Structural + Flow Pressure Testing (v3.4.0)

Architectural and flow changes now require deterministic pressure proof artifacts:

| Requirement | Verification |
|-------------|-------------|
| Pressure test flag set | `work_packet.schema.json` — `requires_pressure_test` required; `if architectural_flag=true then requires_pressure_test=true` (schema-enforced) |
| Structural proof produced | `ARCH_PRESSURE_REPORT.json` — 5 PASS/FAIL fields, any FAIL blocks routing |
| Flow proof produced | `FLOW_PRESSURE_REPORT.json` — 5 PASS/FAIL fields, any FAIL blocks routing |
| CI mechanical gate | `doctrine-enforcement.yml` `pressure-test-gate` job — parses JSON, field-by-field, no override |
| Auditor mechanical halt | Auditor halts before standard verification if any pressure field != PASS |
| Bus routing blocked | No artifact routing when reports missing or any field FAIL |

| Component | Purpose |
|-----------|---------|
| `factory/contracts/work_packet.schema.json` | Added `requires_pressure_test`, `flow_contract`, `if/then` constraint |
| `archive/agents_v0/contracts/changeset.schema.json` | Added `requires_pressure_test` — carries forward from WORK_PACKET (archived) |
| `archive/agents_v0/contracts/arch_pressure_report.schema.json` | 5 structural invariants: cantonal_cardinality, registry_first, id_authority, no_sideways_calls, contracts_declared (archived) |
| `archive/agents_v0/contracts/flow_pressure_report.schema.json` | 5 flow invariants: ingress_contract_exists, egress_contract_exists, no_orphan_tables, no_unconsumed_events, id_propagation_intact (archived) |
| `factory/agents/agent-auditor/SKILL.md` | Constitutional Pressure Test section — HALT before standard checks |
| `factory/agents/agent-builder/SKILL.md` | Pressure test artifact production duty |
| `factory/agents/agent-planner/SKILL.md` | Pressure test classification rule + flow_contract enforcement |
| `factory/agents/agent-orchestrator/SKILL.md` | PRESSURE_TEST_REQUIRED + PRESSURE_TEST_PASSED signals |
| `doctrine-enforcement.yml` | `pressure-test-gate` CI job — mechanical, no manual fallback |
| `law/constitutional/governance.md` | Pressure Test Bus Enforcement routing rules |

**Pressure Test Law**: No architectural change can PASS without structural pressure proof. No new schema can PASS without cantonal proof. No new flow can PASS without flow proof. Auditor cannot override red invariants. All 10 gates are mechanical — zero advisory, zero interpretation.

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
   | Architecture | law/doctrine/ARCHITECTURE.md | 2.1.0 |
   | Tools | law/integrations/TOOLS.md | 1.1.0 |
   | OSAM | law/semantic/OSAM.md | 1.1.0 |
   | PRD | fleet/car-template/docs/PRD_HUB.md | 1.0.0 |
   | ADR | fleet/adr-templates/ADR.md | 1.0.0 |
   | Checklist | fleet/checklists/HUB_COMPLIANCE.md | 1.0.0 |
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
├── law/                          ← SILO: CONSTANTS
│   ├── heir.yaml                        ← Garage sovereign identity (HEIR)
│   ├── SNAP_ON_TOOLBOX.yaml             ← Master tool registry
│   ├── IMO_CONTROL.json                 ← Control document
│   ├── doctrine/                        ← LOCKED doctrine
│   │   ├── TIER0_DOCTRINE.md            ← THE FOUNDATION (HUMAN AUTHORITY ONLY)
│   │   ├── ARCHITECTURE.md              ← CTB Constitutional Law (v2.1.0)
│   │   ├── CTB_REGISTRY_ENFORCEMENT.md  ← Registry-first + RAW lockdown (v1.5.0)
│   │   ├── FAIL_CLOSED_CI_CONTRACT.md   ← Fail-closed CI (v1.1.0)
│   │   ├── EXECUTION_SURFACE_LAW.md     ← Execution containment (v1.0.0)
│   │   ├── ROLLBACK_PROTOCOL.md         ← Doctrine sync rollback
│   │   └── LEGACY_COLLAPSE_PLAYBOOK.md  ← Legacy migration (v1.0.0)
│   ├── constitutional/                  ← Governance, backbone, charter, PSB constitution
│   ├── registry/                        ← audit_rules, doctrine_registry, repo_registry
│   ├── integrations/                    ← TOOLS, COMPOSIO, DOPPLER, HEIR, OBSIDIAN
│   └── semantic/                        ← OSAM
│
├── factory/                      ← SILO: ASSEMBLY LINE
│   ├── SKILLS_SYSTEM.md                 ← Skills governance (three tiers, locked)
│   ├── agents/                          ← Pipeline agent skills
│   │   ├── skill-creator/SKILL.md       ← Tier 0 implementation (HUMAN AUTHORITY ONLY)
│   │   ├── agent-orchestrator/          ← Deterministic intake + ID minting
│   │   ├── agent-planner/               ← WORK_PACKET generation
│   │   ├── agent-builder/               ← Implementation execution
│   │   ├── agent-auditor/               ← Compliance verification
│   │   ├── agent-db/                    ← Database change governance
│   │   ├── cloudflare/                  ← Cloudflare platform skill
│   │   └── neon/                        ← Neon platform skill
│   ├── contracts/                       ← JSON schemas (work_packet, heir, orbt, etc.)
│   ├── runtime/                         ← Live pipeline inbox/outbox
│   │   ├── inbox/{orchestrator,planner,builder,db-agent,auditor}/
│   │   ├── outbox/{orchestrator,planner,builder,db-agent,auditor}/
│   │   └── completed/
│   ├── certification/                   ← Signature engine + validator
│   ├── examples/                        ← Example work packets
│   ├── operations/                      ← Operational docs
│   └── rosetta-stone/                   ← Domain translation guides
│
├── fleet/                        ← SILO: OUTPUT TO CHILDREN
│   ├── registry/                        ← Fleet registry, HEIR/ORBT per child
│   │   ├── FLEET_REGISTRY.yaml
│   │   ├── heir/                        ← Child HEIR records
│   │   └── orbt/                        ← Child ORBT tracking
│   ├── car-template/                    ← THE MOLD — blueprint for every child repo
│   │   ├── law/                         ← AI employee contracts, GUARDSPEC
│   │   ├── factory/agents/              ← CAR_SKILL_TEMPLATE
│   │   ├── src/                         ← Gatekeeper module
│   │   ├── docs/                        ← PRD_HUB, ERD_METRICS
│   │   └── log/                         ← Empty — child creates
│   ├── scripts/                         ← Scripts children inherit
│   ├── migrations/                      ← SQL templates (001-017)
│   ├── snap-on/                         ← Optional modules (field-monitor, ultimate-tool)
│   ├── prompts/                         ← Claude/GPT prompts
│   ├── config/                          ← Shared configuration patterns
│   ├── adr-templates/                   ← ADR format templates
│   ├── checklists/                      ← Compliance checklists
│   └── pr-templates/                    ← PR format templates
│
├── docs/                         ← GARAGE-LEVEL DOCS
│   ├── adr/                             ← Architecture Decision Records
│   └── audit/                           ← Audit reports
│
├── OPERATOR_PROFILE.md           ← Document of documents (HUMAN AUTHORITY ONLY)
├── CONSTITUTION.md               ← Human governance
│
├── barton-outreach-core (child repo)
│   └── Conforms to imo-creator
│
├── client (child repo)
│   └── Conforms to imo-creator
│
├── company-lifecycle-cl (child repo)
│   └── Conforms to imo-creator
│
├── sales (child repo)
│   └── Conforms to imo-creator
│
├── barton-storage (child repo)
│   └── Conforms to imo-creator
│
├── barton-processes (child repo — NEW)
│   └── Conforms to imo-creator
│
└── research (child repo — PLANNED)
    └── Not yet bootstrapped
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
| Modify CLAUDE.md | ❌ NO — HUMAN AUTHORITY ONLY |
| Modify law/doctrine/TIER0_DOCTRINE.md | ❌ NO — HUMAN AUTHORITY ONLY |
| Modify factory/agents/skill-creator/SKILL.md | ❌ NO — HUMAN AUTHORITY ONLY |
| Modify other locked files | ❌ NO |
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

1. **Tier 0 is the engine. Everything else is fuel it processes.** Constants first. Variables are a last resort.
2. **This repo is the parent. It conforms to nothing.**
3. **Locked files are law. Read, don't touch.**
4. **Templates are structure. Fill in blanks, don't redesign.**
5. **Children conform to parent. Never the reverse.**
6. **Changes require ADR. No shortcuts.**
7. **Drift is a bug. Templates are correct.**
8. **Determinism first. LLM as tail only.**
9. **OPERATOR_PROFILE.md is the document of documents. It conforms to nothing. All other documents conform to it.**
10. **Skills use the block format. Five elements validate every constant.**

---

## Fleet Management Files

Fleet management files now live under `fleet/registry/` and `scripts/`:

| File | Purpose | Maintained By |
|------|---------|---------------|
| `fleet/registry/FLEET_REGISTRY.yaml` | All child repos, versions, sync status | Human |
| `docs/adr/ADR_INDEX.md` | Fleet-wide ADR lookup table | Human + AI (after ADR creation) |
| `scripts/fleet-status.sh` | Fleet health check (reads FLEET_REGISTRY.yaml) | Automated |
| `scripts/fleet-status.ps1` | Fleet health check (Windows) | Automated |
| `scripts/adr-check.sh` | ADR index audit (compares index vs repo files) | Automated |
| `scripts/adr-check.ps1` | ADR index audit (Windows) | Automated |

---

## RELATIONSHIP TO CONSTITUTION.MD

`CONSTITUTION.md` and `CLAUDE.md` serve different audiences:

| File | Audience | Purpose |
|------|----------|---------|
| `CONSTITUTION.md` | Humans, downstream repos | What is governed, invariants, transformation law, enforcement mechanisms |
| `CLAUDE.md` | AI agents (Claude Code, Copilot) | Locked file registry, permissions, operational rules |

**Do not duplicate content between them.** CONSTITUTION.md defines the law. CLAUDE.md defines what AI can and cannot do under that law. If a rule appears in both, CONSTITUTION.md is authoritative.

---

## PROMPT AND SKILLS BAY — CONSTITUTIONAL SUMMARY

The Prompt and Skills Bay is a specialized bay inside the Garage. It is NOT a standalone prompt tool.
It is the human-facing hub definition engine that produces doctrine-compliant hub definition artifacts
for entry into the Garage pipeline.

**SUPREME PRINCIPLE — THE TRANSFORMATION LAW:**
Nothing may exist unless it transforms declared constants into declared variables.
The factory intake MUST begin with: "What constants does this hub transform, and what variables does it produce?"

**CRITICAL CORRECTIONS (do not revert these):**
- IMO = Ingress-Middle-Egress (NOT Input-Method-Output, NOT Input-Middle-Output)
- Ingress = schema validation ONLY, no decisions
- Middle = ALL logic, ALL decisions, ALL state
- Egress = read-only views ONLY, no logic

**THE TWO FRAMES (both required at every altitude):**
- ACE (constitutional): Authority, Charter, Accountability — the instructions layer, written once
- IMO (operational): Ingress, Middle, Egress — the data flow layer, runs on every execution

**WHAT THE FACTORY MUST PRODUCE (complete hub definition package):**
1. HEIR record — all 8 fields (sovereign_ref, hub_id, ctb_placement, imo_topology, cc_layer, services, secrets_provider, acceptance_criteria)
2. CTB placement declaration — correct branch under src/
3. ORBT mode — declared as Phase 0 before any other artifact
4. PRD with HSS worksheet — summarizable as CONST → VAR
5. OSAM contract — if hub has a data branch
6. Constants block — all constitutional constants declared explicitly
7. Variables block — all runtime variables as explicit slots
8. Audit certification — PASS or FAIL with doctrine references

**THE AUDIT ENGINE PHASE 0 CHECKS (in this order):**
1. ORBT mode present and valid — reject immediately if missing
2. Transformation Law satisfied — can this be stated as CONST → VAR?
3. HEIR complete — all 8 fields present
4. CTB placement valid — no forbidden folders
5. Then all 14 audit rules

**THE COMPLIANCE GATE IS ABSOLUTE:**
Any CRITICAL or HIGH violation blocks compliance. No exceptions. No "fix later."

**SELF-HEALING LOOP:**
HEIR validates identity at mount → ORBT classifies operational mode → ERROR table records faults →
repair agent reads fault code → Garage certifies repair → system returns to operational state

Full constitutional document: `law/constitutional/PROMPT_SKILLS_BAY_CONSTITUTION.md`
Doctrine version: 1.0.0 | Effective: 2026-02-28 | Index: PSB-CONST-001

---

## Agent Pipeline Protocol

All agent work flows through factory/runtime/ inbox/outbox pipeline.

### Architecture
- **Claude.ai** = Foreman (writes packets, reviews auditor reports)
- **Composio** = Bridge (commits packets to GitHub from Claude.ai)
- **Claude Code** = Execution engine (runs all 5 agents)
- **GitHub** = Mailbox (inbox/outbox directories)

### Flow
1. Dave + Claude.ai (Foreman) write packet
2. Composio commits packet to factory/runtime/inbox/orchestrator/ on GitHub
3. Claude.ai opens Claude Code → runs full chain autonomously
4. Each agent: reads inbox → loads skill → does work → drops packet in next inbox
5. Auditor does final QA → drops report in outbox/auditor/
6. Foreman reviews → moves to completed/ → closes BAR

### Rules
- Foreman touches pipeline TWICE: front (write packet) and back (review Auditor)
- Claude Code runs all agents in sequence — no human gate between stops
- Each agent reads its skill file before processing
- Auditor is the quality gate, not the foreman
- Any agent can halt pipeline with status=failed
- Packets are immutable — never edit, write new ones
- Packet format: see factory/runtime/PACKET_CONTRACT.md

### Fallback
GitHub Actions (pipeline-trigger.yml) can invoke agents if Claude.ai is not in the loop.
Requires ANTHROPIC_API_KEY in GitHub repo secrets.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-06 |
| Last Modified | 2026-03-14 |
| Status | ACTIVE |
| Authority | Human only |
