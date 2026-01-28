# IMO-Creator Adoption Protocol

This repository is governed by IMO-Creator.

IMO-Creator is the governor.
This repository is the subject.

Governor defines. Subject conforms.

---

## New Child Repo Checklist

Copy-paste actionable steps for creating a new child repo.

### Phase 0: Repository Setup

- [ ] Create new repository
- [ ] Clone locally

### Phase 1: Copy Templates

- [ ] Copy `templates/child/IMO_CONTROL.json.template` → `IMO_CONTROL.json`
- [ ] Copy `templates/child/REGISTRY.yaml.template` → `REGISTRY.yaml`
- [ ] Copy `templates/child/DOCTRINE.md.template` → `DOCTRINE.md`

### Phase 2: Fill Placeholders

In `IMO_CONTROL.json`:
- [ ] Replace `[YYYY-MM-DD]` with creation date
- [ ] Replace `[COMMIT_HASH]` with current imo-creator commit
- [ ] Replace `[REPO_NAME]` with repository name
- [ ] Replace `[HUB_ID]` with unique hub identifier
- [ ] Replace `[CC-01_REFERENCE]` with sovereign reference

In `REGISTRY.yaml`:
- [ ] Replace `[HUB_ID]` with unique hub identifier
- [ ] Replace `[HUB_NAME]` with human-readable name
- [ ] Replace `[OWNER_NAME]` with owner
- [ ] Replace `[DOCTRINE_VERSION]` with current doctrine version
- [ ] Replace `[CTB_VERSION]` with current CTB version
- [ ] Set `branches_used` to true/false for each branch

In `DOCTRINE.md`:
- [ ] Replace `[VERSION]` placeholders with current versions
- [ ] Replace `[YYYY-MM-DD]` with creation date

### Phase 3: Create Domain Binding

- [ ] Create `doctrine/` folder
- [ ] Create `doctrine/REPO_DOMAIN_SPEC.md` using stub from AI_EMPLOYEE_OPERATING_CONTRACT.md
- [ ] Fill all required sections (no brackets remaining)
- [ ] Verify binding completeness checklist passes

### Phase 4: Create CTB Structure

- [ ] Create `src/` folder
- [ ] Create required CTB branches:
  - [ ] `src/sys/` (if needed)
  - [ ] `src/data/` (if needed)
  - [ ] `src/app/` (if needed)
  - [ ] `src/ai/` (if needed)
  - [ ] `src/ui/` (if needed)
- [ ] Add `.gitkeep` to empty folders

### Phase 5: Constitutional Admission

- [ ] Read `CONSTITUTION.md` from imo-creator
- [ ] Read `IMO_CONTROL.json` (your copy)
- [ ] Execute `APPLY_DOCTRINE.prompt.md`
- [ ] Verify no violations

### Phase 6: Structural Instantiation

- [ ] Execute `DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md`
- [ ] Declare sub-hubs in `REGISTRY.yaml` (if any)
- [ ] Declare spokes in `REGISTRY.yaml` (if any)
- [ ] Mint unique IDs

### Phase 7: Ongoing Phases (As Needed)

- [ ] Data Declaration (if applicable)
- [ ] Execution Wiring
- [ ] DBA Enforcement (if applicable)
- [ ] Documentation Enforcement
- [ ] Hygiene Audit (scheduled)
- [ ] Cleanup Execution (as needed)

---

## Required Lifecycle (In Order)

Downstream repositories MUST progress through the following phases in order.
No phase may be skipped.

### 1. Constitutional Admission

Adopt governance and enforcement.

- Read `CONSTITUTION.md`
- Read `IMO_CONTROL.json`
- Execute `APPLY_DOCTRINE.prompt.md`

**Result:** Repo is legally governed.

---

### 2. Structural Instantiation

Declare structure and identity.

- Execute `DECLARE_STRUCTURE_AND_RENDER_TREE.prompt.md`
- Declare hubs, sub-hubs, spokes
- Mint unique IDs (hub, sub-hub, spoke, process)
- Normalize repository structure to CTB

**Result:** Repo matches doctrine shape.

---

### 3. Data Declaration (If Applicable)

Declare AI-ready data schemas.

- Execute `DECLARE_DATA_AND_RENDER_ERD.prompt.md`
- Define tables, columns, relationships
- Generate ERD artifacts

**Result:** Data layer is machine-readable and auditable.

---

### 4. Execution Wiring

Bind declared processes to executable intent.

- Execute `DECLARE_EXECUTION_WIRING.prompt.md`
- Define triggers, schedules, kill switches, observability

**Result:** System is runnable by humans or agents.

---

### 5. Hygiene Audit (Scheduled)

Verify ongoing compliance.

- Execute `HYGIENE_AUDITOR.prompt.md`
- Review structure, doctrine alignment, drift

**Result:** Compliance verified or issues surfaced.

---

### 6. Cleanup Execution (As Needed)

Execute approved cleanup tasks.

- Execute `CLEANUP_EXECUTOR.prompt.md`
- Only after hygiene audit approval
- Gated by human authorization

**Result:** Cleanup completed per audit findings.

---

## Scope Boundary

IMO-Creator governs:

- Structure
- Declaration
- Identity
- Documentation
- Wiring intent

IMO-Creator does NOT provide:

- Runtime execution
- Job history
- State mutation
- Scheduling engines

Those belong to downstream systems.

---

## Enforcement Rule

Governor first. Subject second.
Structure before logic.
If uncertain: STOP and ASK.
