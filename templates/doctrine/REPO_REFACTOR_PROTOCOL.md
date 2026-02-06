# Repo Refactor Protocol

**Governs HOW repos are organized and refactored to conform to doctrine.**

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 1.2.0 |
| **Authority** | Architecture Doctrine |
| **Status** | LOCKED |
| **CTB Definition** | ARCHITECTURE.md Part II |

---

## Overview

This protocol defines the mandatory structure for all repos operating under the CTB Doctrine. Every repo is a hub. Every hub conforms to CTB. No exceptions.

---

## 1. Folder Structure (CTB-Enforced)

**CTB branches are canonically defined in ARCHITECTURE.md Part II.**

This section implements the canonical structure. Every repo MUST have this structure:

```
repo/
├── src/
│   ├── sys/      # System: env loaders, bootstraps, infrastructure
│   ├── data/     # Data: schemas, queries, migrations
│   ├── app/      # App: modules, services, business logic
│   ├── ai/       # AI: agents, routers, prompts
│   └── ui/       # UI: pages, components, interfaces
├── docs/         # PRD, ADRs, process flows
├── config/       # Environment, feature flags
├── scripts/      # Automation, hooks, cron
├── validators/   # Doctrine compliance scripts
├── REGISTRY.yaml # CC-layered component registry
├── AGENT_CONTEXT.yaml # Machine-readable agent instructions
└── DOCTRINE.md   # Pointer to IMO-Creator doctrine source
```

---

## 2. File Placement Rule

**IMMUTABLE RULE (per Architecture Doctrine Part II):**

> Every file MUST map to exactly one CTB branch: `sys`, `data`, `app`, `ai`, `ui`.
> 
> If a file does not fit → **DELETE IT**.
> 
> No exceptions. No "misc" folders. No "utils" dumping grounds. No "helpers" directories.
> 
> If you cannot place it, the file should not exist.

### Placement Decision Tree

```
Is it infrastructure, env, bootstrap?
  └─ Yes → src/sys/
  └─ No ↓

Is it schema, query, migration, data model?
  └─ Yes → src/data/
  └─ No ↓

Is it business logic, service, workflow?
  └─ Yes → src/app/
  └─ No ↓

Is it agent, prompt, AI router?
  └─ Yes → src/ai/
  └─ No ↓

Is it UI, component, page?
  └─ Yes → src/ui/
  └─ No ↓

DELETE IT.
```

### Forbidden Patterns

| Pattern | Violation |
|---------|-----------|
| `src/utils/` | CTB_VIOLATION - DELETE |
| `src/helpers/` | CTB_VIOLATION - DELETE |
| `src/common/` | CTB_VIOLATION - DELETE |
| `src/shared/` | CTB_VIOLATION - DELETE |
| `src/lib/` | CTB_VIOLATION - DELETE |
| `src/misc/` | CTB_VIOLATION - DELETE |
| Files in `src/` root | CTB_VIOLATION - MOVE OR DELETE |

---

## 3. REGISTRY.yaml Format

Every repo MUST have a `REGISTRY.yaml` at root declaring CC layers:

```yaml
doctrine_version: "1.1.0"
ctb_version: "1.0.0"

# CC-01: Sovereign reference (declared externally)
sovereign_ref: "[SOV_ID]"

# CC-02: Hub declaration
hub:
  id: "HUB-XXX"
  name: ""
  ctb_placement:
    trunk: ""
    branch: ""
    leaf: ""
  prd: "docs/PRD.md"
  imo:
    ingress: []   # Spoke IDs (type: I)
    middle: []    # Internal logic refs
    egress: []    # Spoke IDs (type: O)
  status: DRAFT  # DRAFT | ACTIVE | SUSPENDED | TERMINATED

# CC-03: Contexts and Spokes
contexts: []

# CC-04: Process log (PIDs minted at runtime)
process_log: []
```

---

## 4. AGENT_CONTEXT.yaml Format

Every repo MUST have machine-readable agent instructions:

```yaml
doctrine:
  version: "2.0.0"
  source: "imo-creator/templates/doctrine/"
  files:
    - ARCHITECTURE.md
    - REPO_REFACTOR_PROTOCOL.md

read_first:
  - REGISTRY.yaml
  - docs/PRD.md

structure:
  folders:
    src/sys: "System infrastructure"
    src/data: "Schemas, queries, migrations"
    src/app: "Modules, services, workflows"
    src/ai: "Agents, routers, prompts"
    src/ui: "Pages, components"

cc_layers:
  CC-01: {name: "Sovereign", legal: ["boundary declaration"]}
  CC-02: {name: "Hub", legal: ["PRD", "CTB placement", "IMO definition"]}
  CC-03: {name: "Context", legal: ["ADR", "process flows"]}
  CC-04: {name: "Process", legal: ["code", "tests", "config"]}

descent_rule: "No artifact at CC-N until CC-(N-1) gate passes."

file_placement_rule: |
  Every file MUST map to exactly one CTB branch.
  If it does not fit → DELETE IT.
  No exceptions.

forbidden:
  - Logic in spokes
  - Spoke-to-spoke communication
  - Code without PRD
  - Code without ADR
  - PID reuse
  - Rogue folders in src/
```

---

## 5. Refactor Sequence

When refactoring an existing repo:

### Step 1: Declare Hub (CC-02)
1. Assign Hub ID
2. Create `REGISTRY.yaml`
3. Declare `sovereign_ref`

### Step 2: Write PRD (CC-02 Gate)
1. Create `docs/PRD.md`
2. Define IMO (Ingress/Middle/Egress)
3. List spokes

### Step 3: Create Folder Structure
1. Create `src/{sys,data,app,ai,ui}/`
2. Create `docs/`, `config/`, `scripts/`, `validators/`

### Step 4: Move Files to CTB Branches
1. For each file, apply placement decision tree
2. Move to correct branch
3. If no branch fits → DELETE

### Step 5: Write ADRs (CC-03 Gate)
1. Document key decisions in `docs/ADR-XXX-*.md`
2. Reference in REGISTRY contexts

### Step 6: Tag Components
1. Add CTB/IMO comments to code files
2. Register in REGISTRY.yaml

### Step 7: Review and Update All MD Files (MANDATORY)

**After refactor, all documentation must be verified and updated.**

MD files are AI instructions. Stale or incorrect MD files cause AI agents to operate on bad information. This step is MANDATORY.

#### Required MD File Review

| File | Review For |
|------|------------|
| `CLAUDE.md` | Correct doctrine references, hub identity, locked files list |
| `README.md` | Accurate project description, correct folder structure |
| `docs/PRD.md` | Constants/Variables match actual implementation |
| `docs/ADR-*.md` | Decisions still valid, references correct |
| `DOCTRINE.md` | Points to correct imo-creator version |
| `REGISTRY.yaml` | Hub ID, spokes, IMO definition all accurate |

#### MD File Review Checklist

| Check | Status |
|-------|--------|
| [ ] All file paths in MD files are correct (no references to moved/deleted files) |
| [ ] All doctrine references point to correct imo-creator templates |
| [ ] CLAUDE.md lists correct locked files for this repo |
| [ ] README.md folder structure matches actual structure |
| [ ] PRD constants and variables match what the system actually does |
| [ ] No references to old structure remain |
| [ ] Hub ID is consistent across all files |

#### Why This Matters

```
PROBLEM: Refactored structure, but CLAUDE.md still references old paths
RESULT:  AI agent reads wrong instructions, makes wrong decisions

PROBLEM: PRD declares old constants, but system now uses different inputs
RESULT:  AI agent validates against wrong spec, misses real violations

PROBLEM: README shows old folder structure
RESULT:  Humans and AI confused about where things live
```

**Documentation drift is a violation. MD files MUST match reality.**

### Step 8: Validate Structure
```bash
./validators/ctb-structure-check.sh
./validators/cc-descent-check.sh
./validators/hub-spoke-check.sh
```

### Step 9: Execute Compliance Checklist (MANDATORY)

**You CANNOT declare refactor complete without this step.**

Per CONSTITUTION.md §Violation Zero Tolerance:

1. Execute `templates/checklists/HUB_COMPLIANCE.md` for the hub
2. Fill out EVERY section with actual counts
3. Complete the Compliance Gate Verification section
4. Complete the AI Agent Acknowledgment (if you are an AI agent)

| Outcome | Action |
|---------|--------|
| CRITICAL unchecked > 0 | STOP. Status = NON-COMPLIANT. Fix and re-run. |
| HIGH violations > 0 | STOP. Status = NON-COMPLIANT. Fix and re-run. |
| Both = 0 | MAY proceed to Step 10 |

**"I created all the files" is NOT compliance. Checklist verification IS compliance.**

### Step 10: Reference Doctrine
1. Create `DOCTRINE.md` pointing to IMO-Creator
2. Do NOT duplicate doctrine content

---

## 6. Validation Requirements

Every repo MUST pass these validators before merge:

| Validator | Checks |
|-----------|--------|
| `ctb-structure-check.sh` | CTB folders exist, no rogue folders, no loose files |
| `cc-descent-check.sh` | PRD before code, ADR before code |
| `hub-spoke-check.sh` | Spokes typed I/O only, hub has IMO |
| `registry-schema.json` | REGISTRY.yaml format compliance |

Validation runs:
- Pre-commit hook (local)
- CI pipeline (remote)
- Manual audit (quarterly)

---

## 7. Hub-and-Spoke Configuration

For multi-repo systems:

```
IMO-Creator (Sovereign)
    │
    ├── Hub: example-hub-alpha
    │   ├── Spoke-I: External API ingress
    │   ├── Spoke-I: File upload ingress
    │   ├── Spoke-O: Database write egress
    │   └── Spoke-O: Notification egress
    │
    ├── Hub: example-hub-beta
    │   ├── Spoke-I: Webhook ingress
    │   └── Spoke-O: Report egress
    │
    └── Hub: [next project]
```

Each hub:
- Is one repo
- Has its own REGISTRY.yaml
- References same sovereign
- Follows identical CTB structure

---

## 8. Doctrine Reference Rule

Every repo MUST contain a `DOCTRINE.md` with ONLY this content:

```markdown
# Doctrine Reference

This repo conforms to CTB Doctrine v1.1.0.

**Source of truth:**
imo-creator/templates/doctrine/
├── ARCHITECTURE.md
└── REPO_REFACTOR_PROTOCOL.md

Do not duplicate. Reference and obey.
```

**NEVER** copy doctrine content into repos. Reference only.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| CC Layers | ARCHITECTURE.md Part III |
| Descent Gates | ARCHITECTURE.md Part VI |
| Hub/Spoke Geometry | ARCHITECTURE.md Part IV |

---

## 9. Remediation Order (CONSTITUTIONAL LAW)

When an audit identifies violations, remediation MUST follow this exact order.
**Audits may NOT recommend fixes that violate this sequence.**

### Canonical Remediation Sequence

| Order | Phase | Description | Gate |
|-------|-------|-------------|------|
| 1 | **Constitutional Validity** | Verify CONST → VAR transformation is declared | Must pass before Phase 2 |
| 2 | **PRD Alignment** | PRD exists and declares constants, variables, passes | Must pass before Phase 3 |
| 3 | **Hub Manifest Alignment** | REGISTRY.yaml matches PRD declarations | Must pass before Phase 4 |
| 4 | **ERD Validation** | All tables pass Pressure Test and Upstream Flow Test | Must pass before Phase 5 |
| 5 | **Process Declaration** | Process references PRD/ERD, introduces no new CONST/VAR | Must pass before Phase 6 |
| 6 | **Audit Attestation** | CONSTITUTIONAL_AUDIT_ATTESTATION.md produced | Compliance proven |

### Remediation Rules

| Rule | Enforcement |
|------|-------------|
| No skipping phases | MANDATORY |
| No parallel remediation across phases | MANDATORY |
| Each phase must pass before next begins | MANDATORY |
| Attestation required at completion | MANDATORY |

### Why This Order Matters

```
INVALID: "Fix ERD first, then write PRD"
         → ERD cannot be validated without PRD constants/variables

INVALID: "Add process, then fix hub manifest"
         → Process references manifest; manifest must be correct first

VALID:   "Constitutional → PRD → Manifest → ERD → Process → Attest"
         → Each phase builds on proven foundation
```

**Constitutional rule**: Remediation order is not a suggestion. It is law. Violations of remediation order are doctrine violations.

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-01-08 |
| Last Modified | 2026-01-30 |
| Doctrine Version | 1.3.0 |
| Status | LOCKED |
| Change Protocol | ADR-triggered only |
