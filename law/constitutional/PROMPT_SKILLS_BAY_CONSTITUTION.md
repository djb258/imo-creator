# PROMPT_SKILLS_BAY_CONSTITUTION.md

**Document Classification:** CONSTITUTIONAL — IMMUTABLE WITHOUT ADR AND HUMAN APPROVAL
**Placement:** `docs/constitutional/PROMPT_SKILLS_BAY_CONSTITUTION.md`
**Doctrine Version:** 1.0.0
**Effective Date:** 2026-02-28
**Authority:** Derives from and is subordinate to CONSTITUTION.md and ARCHITECTURE.md
**Supersedes:** `IMO_CREATOR_DOCTRINE_BRIEFING.md` (session notes — retired)
**DOCTRINE_INDEX Entry:** PSB-CONST-001 — Governs the Prompt and Skills Bay, its artifacts, its audit requirements, and its relationship to the Garage pipeline.

---

## DECLARATION OF AUTHORITY

This document governs the **Prompt and Skills Bay** — a specialized bay inside the Garage. It derives its authority from the IMO-Creator CONSTITUTION.md and ARCHITECTURE.md. Any conflict between this document and those foundational documents SHALL be resolved in favor of CONSTITUTION.md and ARCHITECTURE.md.

This document MAY NOT be modified by any AI agent. Modifications require an ADR and human approval.

---

## PART I — THE SUPREME PRINCIPLE

### The Transformation Law

> *Nothing may exist unless it transforms declared constants into declared variables.*

This is the single constitutional principle from which all rules in this system are derived. Every artifact, every process, every agent, every table, every hub, every sub-hub, and every communication produced by the Prompt and Skills Bay MUST be reducible to the statement: "This transforms X constants into Y variables." If an artifact cannot be stated in those terms, it MAY NOT exist.

**Applied to the Prompt and Skills Bay:**

The Prompt and Skills Bay transforms **declared human intent** (constants) into **doctrine-compliant hub definition artifacts** (variables).

- Constants: the desired outcome, the domain context, the CC layer, the ORBT mode, the authority scope, the sovereign reference
- Variables: the HEIR record, the CTB placement declaration, the PRD, the OSAM contract, the constants block, the variables block, the audit certification

The factory's intake form MUST begin with this question: **"What constants does this hub transform, and what variables does it produce?"** The outcome statement is derived from the answer. The outcome is not the starting point.

---

## PART II — THE AUTHORITY HIERARCHY (CC LAYERS)

The Canonical Chain defines the authority hierarchy. Every hub definition produced by the Prompt and Skills Bay MUST declare its CC layer placement.

| Layer | Name | Authority | Scope |
|-------|------|-----------|-------|
| CC-01 | Sovereign | Supreme authority | System-wide governance, doctrine, fleet |
| CC-02 | Hub | Domain authority | Domain coordination, sub-hub management |
| CC-03 | Context | Feature authority | Contextual execution, ADR decisions |
| CC-04 | Process | Execution authority | Bounded task execution, reporting |

**Descent Gate Law:** CC-04 artifacts may not be created before CC-03 context exists. CC-03 context may not be created before CC-02 hub exists. CC-02 hub may not be created before CC-01 sovereign reference is declared. The factory MUST enforce this sequence. No artifact may be generated for a CC layer whose parent layer has not been declared.

---

## PART III — THE COMPLETE ACRONYM DICTIONARY

Every acronym in this system has a precise definition. Imprecise usage is a doctrine violation.

**IMO — Ingress, Middle, Egress** The data flow law inside every hub. NOT "Input, Method, Output." NOT "Input, Middle, Output."

- **Ingress:** Schema validation ONLY. MUST NOT make decisions. MUST NOT mutate business state.
- **Middle:** ALL logic, ALL decisions, ALL state, ALL tools. Nothing else may own logic.
- **Egress:** Read-only views and exports ONLY. MUST NOT contain logic.

Violation type: `IMO_VIOLATION`. Law IDs: IMO-01 through IMO-06. Any logic in Ingress or Egress is an automatic CRITICAL violation.

**ACE — Authority, Charter, Accountability** The constitutional layer of every agent at every altitude. Distinct from and complementary to IMO.

- **Authority:** Who the agent is and what governance it holds — not just a name, a right to act
- **Charter:** What the agent is constitutionally permitted to do — its founding scope document
- **Accountability:** What the agent must produce and answer for — upward reporting and downward protection

ACE is the instructions layer. IMO is the data flow layer. Both MUST be present at every altitude. Neither is optional. The ACE block is written once per agent definition. The IMO block runs on every execution.

**CTB — Christmas Tree Backbone** The physical file placement law. Exactly five branches under `src/`:

- `sys/` — system contracts, schemas, registries
- `data/` — database layer, migrations, column registry
- `app/` — application logic, processes, services
- `ai/` — agent definitions, prompts, LLM integrations
- `ui/` — frontend, views, components

Forbidden folder names (automatic CRITICAL violation if found anywhere): `utils/`, `helpers/`, `common/`, `shared/`, `lib/`, `misc/`

Support surfaces (permitted outside `src/`): `.github/workflows/` (YAML only), `scripts/` (imo-creator scripts only), `.git/hooks/` (pre-commit hook only), `migrations/` (SQL only)

Prohibited execution surfaces (automatic violation): `bin/`, `tools/`, `lambda/`, `functions/`, `workers/`, `jobs/`, `cron/` at repo root. Default posture: DENY. Code MUST be placed in a declared surface.

**HEIR — Hub Environment Identity Record** The 8-field flat machine-validated identity contract. Garage validates programmatically during mount. No valid HEIR = no mount = no execution. No exceptions.

Required fields:

1. `sovereign_ref` — reference to the CC-01 sovereign hub
2. `hub_id` — unique identifier for this hub
3. `ctb_placement` — declared branch under `src/`
4. `imo_topology` — declared IMO role (ingress / middle / egress)
5. `cc_layer` — CC-01 through CC-04
6. `services` — declared service dependencies
7. `secrets_provider` — where secrets are sourced (Doppler, env, vault)
8. `acceptance_criteria` — what must be true for this hub to be considered operational

**ORBT — Operate, Repair, Build, Troubleshoot, Train** The operational intent classification system. Auditor checks ORBT mode in Phase 0 — before envelope validation, before anything else. No inference permitted. If ORBT mode is missing or invalid, the work packet is rejected immediately.

- **Operate:** Normal execution of declared processes
- **Repair:** Fixing a known defect with a known root cause
- **Build:** Creating new capability within declared scope
- **Troubleshoot:** Investigating an unknown root cause
- **Train:** Learning or documentation activities

**OSAM — Operational Semantic Access Map** The query routing contract. Declares where data is queried, which tables own which concepts, which joins are allowed. OSAM sits above ERDs and drives them. Every hub with a data branch MUST have an OSAM. OSAM MUST be updated within 30 days of any data layer change.

**ADR — Architecture Decision Record** The formal decision artifact at CC-03. The ONLY path to change doctrine or deviate from templates. ADR requires: problem statement, options considered, decision made, consequences accepted, human approval. No ADR = no change. No exceptions.

**PRD — Product Requirements Document** The hub's founding requirements document. MUST be summarizable as "This transforms X constants into Y variables." HSS (Hub Spoke Specification) is the worksheet inside the PRD that declares the transformation explicitly. PRD MUST be updated within 30 days of any `src/` change.

**ERD — Entity Relationship Diagram** Mermaid format ONLY. One ERD per sub-hub. Table names in ALL CAPS. No descriptions inside the ERD. No colors. No annotations. Left-to-right relationships only. ERD MUST be updated within 14 days of any schema registry change.

**HSS — Hub Spoke Specification** The worksheet inside the PRD that explicitly declares: what are the constants, what are the variables, what is the transformation, what are the spoke relationships. The factory's intake sequence MUST walk through the HSS before generating any artifact.

**PID — Process Instance Document** Format: `AI-{HUB_ID}-{TIMESTAMP}-{RANDOM}`. Never reuse PIDs across sessions. The PID is the audit identity of a single work session.

**TAS — Task Accounting System** The system that tracks every task from declaration through completion. TAS states: DECLARED → DESIGNED → IMPLEMENTED → TESTED → DEPLOYED → DEPRECATED. Every process_id owned by exactly one sub-hub. Processes may not share state. Signals are the only permitted cross-process communication.

**DBA — Database Administrator (enforcement role)** Two gate types enforced before any schema change merges:

- **Gate A (non-structural):** Table bloat check, ADR present, deprecation review, audit logging present
- **Gate B (structural):** Table metadata complete, column metadata complete, relationships documented, ERD updated, migrations present

**CAPA — Corrective Action, Preventive Action** The audit remediation protocol. Every audit finding of HIGH or CRITICAL severity requires a CAPA record: root cause identified, corrective action defined, preventive action defined, verification criteria stated, responsible party declared.

**FIPS — Federal Information Processing Standards (county code)** The constitutional identity of a US county. Used in the storage facility feasibility system as the sovereign ID for county-level regulatory intelligence.

**CID — Communication ID** The constitutional anchor for a relationship entity in the benefits outreach system. Every company, contact, and relationship traces back to a CID.

**SID — Systems ID** The operational context layer in the benefits outreach system. Declares which system, which workflow, and which authority scope is active for a given CID.

**MID — Message ID** The atomic transaction record in the benefits outreach system. The specific communication, at a specific point in time, with a specific intent and a specific authorized sender. Every MID is traceable to a SID, which is traceable to a CID.

**PEPM — Per Employee Per Month** The fee structure for benefits operations. Flat fee regardless of plan cost. Eliminates commission conflict of interest.

**PLE — Perpetual Lead Engine** The original name for the benefits relationship operating system. Retired in favor of the full system description but preserved as historical reference.

---

## PART IV — THE DATABASE TABLE CLASSIFICATION

Every table in the system MUST be classified. Unclassified tables are a CRITICAL violation.

| Classification | Purpose | Mutability |
|----------------|---------|------------|
| `SPINE` | Constitutional identity tables — sovereign IDs, hub IDs, entity anchors | INSERT-only after creation. Never UPDATE or DELETE. |
| `STATE` | Current operational state — what is true right now | UPDATE permitted. Represents present reality. |
| `EVENT` | Immutable audit log — what happened and when | INSERT-only. Never UPDATE or DELETE. The system's memory. |
| `CONFIG` | System configuration — rules, thresholds, parameters | UPDATE permitted with ADR. |
| `CACHE` | Derived or computed data — can be rebuilt from source | Truncate and rebuild permitted. |

The master ERROR table is classified as `EVENT`. Every fault record is INSERT-only. The complete fault history is immutable.

---

## PART V — THE GARAGE CONTROL PLANE

The Garage is the certification pipeline. No hub definition merges without passing through the Garage. No exceptions.

**The five agents:**

| Agent | Role | Authority |
|-------|------|-----------|
| Orchestrator | Session authority, work packet routing, gate enforcement | CC-02 |
| Planner | PRD decomposition, task sequencing, HSS validation | CC-03 |
| Worker | Artifact execution within declared scope and allowed_paths | CC-04 |
| DB Agent | Schema changes, migrations, DBA gate enforcement | CC-03 (data branch) |
| Auditor | Compliance evaluation, violation detection, certification decision | CC-02 (independent) |

**The 10-stage pipeline:**

1. HEIR validation — identity confirmed or mount rejected
2. ORBT classification — Phase 0, before anything else
3. Envelope validation — work packet schema complete
4. Scope declaration — allowed_paths declared, no scope creep permitted
5. Planner decomposition — PRD → tasks → HSS validation
6. Worker execution — artifacts produced within declared scope
7. DBA gate — Gate A and Gate B checks if schema touched
8. Auditor evaluation — all 14 audit rules checked
9. Signature engine — HMAC-SHA256 certification if PASS
10. Fleet propagation — doctrine version updated across fleet

**The certification artifact (certification.json):**

- `artifact_hash` — SHA-256 of the certified artifact
- `doctrine_version` — version of doctrine in effect at certification time
- `auditor_signature` — HMAC-SHA256 signature
- `timestamp` — UTC Unix milliseconds
- `violations` — empty array for PASS
- `capa_required` — boolean

---

## PART VI — THE 14 AUDIT RULES

The Auditor evaluates every artifact against these 14 rules. CRITICAL or HIGH violations block compliance. No exceptions. No "fix later." No conditional pass.

| Rule ID | Name | Severity |
|---------|------|----------|
| AUD-001 | HEIR_COMPLETENESS | CRITICAL |
| AUD-002 | ORBT_MODE_DECLARED | CRITICAL |
| AUD-003 | CTB_PLACEMENT_VALID | CRITICAL |
| AUD-004 | TRANSFORMATION_LAW_SATISFIED | CRITICAL |
| AUD-005 | IMO_VIOLATION | CRITICAL |
| AUD-006 | FORBIDDEN_FOLDER_PRESENT | CRITICAL |
| AUD-007 | PROHIBITED_EXECUTION_SURFACE | CRITICAL |
| AUD-008 | SCOPE_EXCEEDED | HIGH |
| AUD-009 | PRD_STALE | HIGH |
| AUD-010 | ERD_STALE | HIGH |
| AUD-011 | OSAM_STALE | HIGH |
| AUD-012 | COLUMN_REGISTRY_STALE | CRITICAL |
| AUD-013 | DBA_GATE_BYPASSED | CRITICAL |
| AUD-014 | TEMPLATE_IMMUTABILITY_VIOLATED | CRITICAL |

**Staleness thresholds:**

- `column_registry` stale after SQL change: 7 days — CRITICAL
- `ERD` / `SCHEMA.md` stale after registry change: 14 days — HIGH
- `PRD` / `OSAM` stale after `src/` change: 30 days — HIGH
- Doctrine version behind parent: HIGH

**The compliance gate is absolute:**

> *"Feeling compliant is NOT compliance. Checklist output IS compliance."*

Prohibited declarations (automatic audit failure):

- "100% compliant without checklist"
- "Looks compliant to me"
- "I created all the files so it's compliant"
- "Compliant with CRITICAL or HIGH counts greater than zero"

---

## PART VII — THE AI EMPLOYEE PROTOCOL

Every AI agent operating in this system is an AI Employee. The AI Employee Protocol is non-negotiable.

**PID format:** `AI-{HUB_ID}-{TIMESTAMP}-{RANDOM}`. Never reuse PIDs across sessions.

**MAY:**

- Read all files in declared scope
- Execute approved prompts
- Create artifacts at CC-04

**MAY NOT:**

- Modify doctrine
- Skip gates
- Proceed despite violations
- Modify locked prompt files

**MUST:**

- Halt and report if violations exist
- Escalate if doctrine is insufficient: create ADR proposal, halt, await human
- Log every fault to the master ERROR table
- Ask rather than guess when uncertain

> *"You are an operator, not a legislator."*

---

## PART VIII — EXECUTION WIRING

Every process_id MUST have execution wiring OR be marked `DECLARED_BUT_NOT_IMPLEMENTED`. Execution wiring is a separate phase from data declaration. No logic edits, no schema edits, no migrations, no refactors, and no new code during the execution wiring phase.

**Required files per sub-hub with execution wiring:**

- `execution.yaml` — process bindings
- `triggers.yaml` — event triggers
- `schedules.yaml` — scheduled executions
- `kill_switches.yaml` — emergency stops
- `observability.yaml` — monitoring declarations

Kill switches MUST declare: `env_flag`, `default_state`, `safe_mode`, `authority` (human_only vs agent_allowed).

Autonomy safety declarations MUST include: `allowed_side_effects`, `forbidden_side_effects`, `idempotency_expectation`, `retry_behavior`.

---

## PART IX — LEGACY COLLAPSE PLAYBOOK

When retiring a table or component, the Legacy Collapse Playbook MUST be followed. No shortcuts.

Five phases: **Inventory → Map → Migrate → Parity → Rename+Drop**

The Rename phase renames to `_legacy` suffix and keeps for ONE release cycle grace period. The Drop phase requires all of the following:

- One release cycle elapsed
- No `_legacy` references in codebase
- No queries to `_legacy` table in logs for 7+ consecutive days
- ADR documenting the decision
- Human sign-off
- Rollback migration present

Anti-patterns that are automatic violations: drop without rename, drop without ADR, drop without human sign-off.

---

## PART X — FLEET ALIGNMENT STANDARD

Three fleet alignment states. No backward movement permitted.

| State | Definition |
|-------|------------|
| Independent | No Garage surfaces present |
| Partial | Some Garage surfaces present |
| Aligned | All 6 required surfaces present |

Six required surfaces for aligned status: certification gate CI, `changesets/` directory, `audit_reports/` directory, `.garage/` directory, CI schema validation, no governance logic inside repo.

**RULE-009 — no_governance_in_car:** No agent definitions, no WORK_PACKET schema, no audit taxonomy, no doctrine registry in child repos. Governance lives in the Garage. Cars carry only their own artifacts.

---

## PART XI — THE LLM CONTAINMENT RULE

> *LLM is tail, not spine.*

LLM calls MUST be the last resort after deterministic logic is exhausted. LLM MUST NOT be the first call. Every LLM call MUST be:

- Scoped to the Middle layer only
- Preceded by deterministic validation
- Followed by deterministic output validation
- Logged with the PID of the session that invoked it

LLM MAY NOT: modify doctrine, write to SPINE tables, execute schema changes, certify artifacts, or bypass any gate.

---

## PART XII — QUARTERLY HYGIENE AUDIT

The Hygiene Auditor runs quarterly. Staleness thresholds are enforced as violations, not suggestions.

| Artifact | Trigger | Threshold | Severity |
|----------|---------|-----------|----------|
| `column_registry` | SQL change | 7 days | CRITICAL |
| `ERD` / `SCHEMA.md` | Registry change | 14 days | HIGH |
| `PRD` | `src/` change | 30 days | HIGH |
| `OSAM` | Data layer change | 30 days | HIGH |
| Doctrine version | Parent advances | Immediate | HIGH |
| Data dictionary | Checkpoint | 30 days | MEDIUM |

---

## PART XIII — DOCUMENTATION ERD DOCTRINE

Every ERD MUST pass the AI Readability Test before the work session is closed.

**AI Readability Test:** An AI agent reading only the documentation MUST be able to reconstruct: all tables and their columns, all relationships and their cardinality, all ownership boundaries, all signal boundaries, all data flow paths. If the AI cannot reconstruct these from the documentation, it is a `DOCUMENTATION_FAILURE` violation — not a documentation gap, a violation.

**Column Data Dictionary — 8 required fields per column:**

1. `column_unique_id`
2. `description`
3. `data_type`
4. `format`
5. `constraints`
6. `source_of_truth`
7. `volatility`
8. `consumer`

Every PR touching schema MUST include the Documentation Compliance Checklist.

---

## PART XIV — THE DUAL FRAME AT EVERY ALTITUDE

Every agent at every altitude carries two frames simultaneously. Neither is optional.

**ACE — Constitutional layer (instructions):**

- Authority: who the agent is and what governance it holds
- Charter: what the agent is constitutionally permitted to do
- Accountability: what the agent must produce and answer for

**IMO — Operational layer (data flow):**

- Ingress: schema validation only, no decisions
- Middle: all logic, all decisions, all state
- Egress: read-only views, no logic

| Altitude | ACE | IMO |
|----------|-----|-----|
| CC-01 Sovereign | Authority: system governance / Charter: constitutional doctrine / Accountability: fleet integrity | Ingress: strategic signals / Middle: doctrine reasoning / Egress: binding decisions |
| CC-02 Hub | Authority: domain governance / Charter: hub coordination / Accountability: sub-hub compliance | Ingress: domain requests / Middle: routing and arbitration / Egress: directed work |
| CC-03 Context | Authority: feature scope / Charter: contextual execution / Accountability: quality and escalation | Ingress: task parameters / Middle: contextual processing / Egress: feature artifacts |
| CC-04 Process | Authority: process role / Charter: bounded execution / Accountability: accurate reporting | Ingress: raw data / Middle: transformation / Egress: processed results |

---

## PART XV — THE PROMPT AND SKILLS BAY

### Constitutional Declaration

The Prompt and Skills Bay is a specialized bay inside the Garage. It is NOT a standalone tool. It is NOT a prompt generator. It is the human-facing hub definition engine that produces doctrine-compliant hub definition artifacts for entry into the Garage pipeline.

**The Bay's Transformation Law statement:**

> *The Prompt and Skills Bay transforms declared human intent (constants) into doctrine-compliant hub definition artifacts (variables).*

### What the Bay Produces

Every artifact produced by the Prompt and Skills Bay MUST be a complete hub definition package containing all of the following:

1. **HEIR record** — all 8 fields complete and valid
2. **CTB placement declaration** — correct branch under `src/`
3. **ORBT mode classification** — declared before any other artifact is generated
4. **PRD with HSS worksheet** — summarizable as CONST → VAR
5. **OSAM contract** — if the hub has a data branch
6. **Constants block** — all constitutional constants declared explicitly
7. **Variables block** — all runtime variables declared as explicit slots
8. **REPO_DOMAIN_SPEC** — domain bindings for the deployment context
9. **column_registry template** — if the hub has a data branch
10. **Audit certification** — PASS or FAIL with doctrine references and CAPA if required

### The Six Required Changes to the Current Build

These changes MUST be implemented before the Prompt and Skills Bay is considered doctrine-compliant:

**Change 1 — Intake sequence rebuilt around the HSS worksheet.** The factory intake MUST begin with the HSS question: "What constants does this hub transform, and what variables does it produce?" The outcome statement is derived from this answer, not the other way around.

**Change 2 — Slot structure rebuilt around constants and variables.** The current slot structure uses prompt anatomy labels (role definition, context, constraints, output format). These MUST be replaced with a CONSTANTS BLOCK (everything that does not change at runtime) and a VARIABLES BLOCK (everything instantiated at deployment time). Every constant and every variable MUST be explicitly labeled.

**Change 3 — HEIR generation as a required output.** The factory MUST generate a complete HEIR record for every hub definition it produces. The HEIR record is not optional metadata. It is the identity contract without which the Garage will not mount the hub.

**Change 4 — ORBT mode as Phase 0.** The factory's audit engine MUST check ORBT mode as its first check, before any other validation runs. If ORBT mode is missing or invalid, the artifact is rejected immediately. No inference permitted.

**Change 5 — Transformation Law as the constitutional test.** The audit engine MUST apply the Transformation Law as its primary compliance check. The question "can this artifact be stated as CONST → VAR?" MUST be answered affirmatively before any other audit rule is checked.

**Change 6 — Corpus statistics reorganized by CONST → VAR patterns.** The corpus of 359 production prompts MUST be re-analyzed with the Transformation Law as the organizing principle. The statistics MUST answer: "For a hub that transforms these types of constants into these types of variables, what does the constants block typically contain and what does the variables block typically contain?"

### What Stays the Same

The following elements of the current build are correct and MUST be preserved:

- CC layer classification
- ORBT mode classification structure
- Audit loop with CAPA
- Version history and tweak log
- Corpus as the empirical evidence base
- The platform's identity as a bay inside the Garage

---

## PART XVI — THE SELF-HEALING ARCHITECTURE

The system is designed for the long haul. It does not decay. It gets more reliable over time.

**HEIR is the immune system.** Every hub must carry a valid identity record before it can mount. If the doctrine version in the HEIR does not match the current doctrine version, the Garage rejects it. The system cannot run on outdated identity. Structurally impossible.

**ORBT is the diagnostic layer.** The system knows the difference between normal operation, a known defect being fixed, new capability being built, and an unknown root cause being investigated. That classification changes what the Auditor checks, what artifacts are required, and what the certification criteria are.

**The master ERROR table is the fault registry.** Every fault that any part of the system produces gets written there. Error code, sub-hub origin, ORBT mode at time of fault, doctrine version, timestamp, severity, artifact hash. Immutable. INSERT-only. The system's complete fault history.

**The repair agent reads the ERROR table.** It pulls the fault code, identifies the sub-hub, reads the HEIR, classifies the ORBT mode as `repair` or `troubleshoot`, generates a WORK_PACKET scoped to the failing component, and routes it through the Garage. The repair is certified through the same pipeline as any other change. The repair agent cannot self-certify.

**The Descent Gate Law prevents drift.** Because every change must pass through ADR → PRD → execution wiring → certification, the doctrine and the implementation cannot drift. Every change is constitutionally grounded before it is implemented.

---

## PART XVII — THE AUTOMOTIVE ANALOGY

This system was derived from automotive repair principles. The naming is intentional and precise.

| Automotive | System |
|------------|--------|
| VIN | HEIR — immutable identity before any work begins |
| OBD-II diagnostic port | ORBT — plug in and read the fault classification |
| Garage | The Garage control plane |
| Car | A hub definition and its repo |
| Fleet | All hubs under the sovereign |
| Fleet refit (recall) | Doctrine update propagated to all hubs |
| Inspection sticker | certification.json |
| Fault code | ERROR table record |
| Technician | Repair agent |

The Prompt and Skills Bay is the bay where hub definitions are built and skills are assembled. It operates under the same shop standards, the same certification process, and the same quality gate as every other bay. A hub definition that comes through the Prompt and Skills Bay receives the same certification as a hub built anywhere else in the Garage.

---

## PART XVIII — SESSION START CHECKLIST

Every AI agent beginning a session that touches the Prompt and Skills Bay MUST complete this checklist before taking any action:

- [ ] Read this document in full
- [ ] Confirm doctrine version matches current `DOCTRINE_INDEX.md`
- [ ] Declare PID: `AI-{HUB_ID}-{TIMESTAMP}-{RANDOM}`
- [ ] Declare ORBT mode for this session
- [ ] Confirm the hub being worked on has a valid HEIR
- [ ] Confirm CC layer placement is declared
- [ ] Confirm the Transformation Law statement can be made for any artifact to be produced
- [ ] Confirm no locked prompt files will be modified
- [ ] Confirm no governance logic will be placed in a child repo (RULE-009)

If any checklist item cannot be confirmed, HALT and report before proceeding.

---

## PART XIX — CLAUDE.MD BLOCK

The CLAUDE.md block for this constitution is maintained in the IMO-Creator `CLAUDE.md` file under the "PROMPT AND SKILLS BAY — CONSTITUTIONAL SUMMARY" section.

---

## PART XX — MASTER RULES SUMMARY

1. The Transformation Law is supreme. Everything derives from it.
2. IMO means Ingress-Middle-Egress. Never Input-Method-Output.
3. ACE and IMO are both required at every altitude. Neither is optional.
4. The factory intake begins with the HSS question, not the outcome statement.
5. ORBT mode is Phase 0. Nothing runs before it is declared.
6. HEIR is the identity contract. No HEIR = no mount = no execution.
7. CTB is physical placement law. Forbidden folders are automatic CRITICAL violations.
8. The Descent Gate Law is absolute. No CC-04 without CC-03. No CC-03 without CC-02.
9. The compliance gate is absolute. CRITICAL or HIGH violations block compliance.
10. LLM is tail, not spine. Deterministic logic runs first.
11. The master ERROR table is INSERT-only. Fault history is immutable.
12. RULE-009: no governance logic in child repos.
13. Template immutability is enforced. Locked files cannot be modified by AI agents.
14. The Prompt and Skills Bay is a bay inside the Garage. It is not a standalone tool.
15. The corpus of 359 prompts is the empirical evidence base. It backs the Transformation Law with real examples.

---

*This document is CONSTITUTIONAL and IMMUTABLE without an ADR and human approval. Doctrine Version: 1.0.0 | Effective: 2026-02-28 | Index: PSB-CONST-001*

*Placement: docs/constitutional/PROMPT_SKILLS_BAY_CONSTITUTION.md*
