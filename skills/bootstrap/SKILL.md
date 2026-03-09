---
name: bootstrap
description: >
  Stamps any repo with the IMO-Creator doctrine skeleton.
  Trigger: Developer runs /bootstrap in any repo root.
  Output: Doctrine-compliant file skeleton stamped for detected tier
  (Garage / Car / Sub-Hub). Non-destructive — fills missing files only,
  never overwrites existing doctrine.
---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** Developer runs /bootstrap in a repo root. Optionally passes
`--tier=garage|car|sub-hub` to declare tier explicitly.

**Middle (Processing):**
- Detect or accept tier declaration
- Read existing repo file inventory
- Compare against required skeleton for detected tier
- Stamp missing files only from imo-creator templates
- Confirm sovereign ID present or prompt for declaration
- Produce bootstrap report

**Egress (Output):** Missing doctrine files stamped at repo root and /ADRs/.
Bootstrap report listing what was created, what already existed, and sovereign ID status.

**Go/No-Go Gate:** Do not close until bootstrap report confirms zero missing required
files for the declared tier and sovereign ID is declared.

---

## Constants — What Is Fixed About Every Bootstrap Run

1. Bootstrap is always non-destructive. Existing files are never overwritten.
2. Tier determines the required file skeleton. Tier is always declared — never inferred silently.
3. Sovereign ID must be declared before bootstrap closes. No exceptions.
4. All stamped files come from imo-creator templates. No hand-written files during bootstrap.
5. Bootstrap produces a report. A run with no report is not complete.
6. ADR-000-template.md is always stamped regardless of tier.
7. Doctrine flows DOWN. Bootstrap reads from imo-creator. It never modifies imo-creator.
8. If imo-creator path cannot be resolved, bootstrap halts immediately — it does not guess.

---

## Variables — What Changes Per Invocation

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `target_repo_path` | Absolute path to repo being bootstrapped | Detected from working directory |
| `tier` | Garage / Car / Sub-Hub | Developer declaration or Phase 1 detection |
| `sovereign_id` | Unique ID connecting this repo to its parent hub | Developer declaration |
| `imo_creator_path` | Path to imo-creator templates | Resolved from FLEET_REGISTRY or declared |
| `missing_files` | List of required files not yet present | Computed in Phase 2 |

---

## Hub-and-Spoke Configuration

The bootstrap process is a wheel. Hub is the stamped repo. Each spoke is a phase.

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| Detect | Repo path + optional --tier flag | Confirmed tier | Go/No-Go: tier is unambiguous |
| Inventory | Repo file list | Missing file list per tier | Go/No-Go: delta computed, no unknowns |
| Resolve | imo-creator path | Template file paths confirmed | Go/No-Go: all templates found |
| Stamp | Missing file list + templates | Files written to repo | Go/No-Go: all missing files now present |
| Sovereign | Repo state | Sovereign ID declared in CLAUDE.md | Go/No-Go: sovereign ID present |
| Report | Completed repo state | Bootstrap report | Final output — task complete |

**Hub rule:** Each spoke completes and returns to hub. Spokes do not call other spokes.

---

## Rules — What This Skill Never Does

- Never overwrite an existing file. If it exists, skip it and note it in the report.
- Never stamp files without a confirmed tier. Tier ambiguity halts bootstrap.
- Never generate sovereign ID automatically. Developer declares it — bootstrap confirms it.
- Never modify imo-creator templates. Read only. Doctrine flows down, never up.
- Never close without a bootstrap report. Silent completion is not completion.
- Never stamp a sub-hub without confirming its parent Car repo is already bootstrapped.
- Never put tool names or repo-specific values in the stamped CLAUDE.md Constants block.

---

## Tier Skeletons — Required Files Per Tier

### GARAGE (imo-creator itself)
```
CLAUDE.md
CONSTITUTION.md
README.md
FLEET_REGISTRY.yaml
ADR_INDEX.md
REPO_HOUSEKEEPING.md
/templates/  (already exists)
/ADRs/ADR-000-template.md
```

### CAR REPO (e.g. UT, barton-outreach-core)
```
CLAUDE.md              (9-section skeleton — defer to Garage)
README.md              (repo-specific orientation)
SYSTEM_MAP.md          (hub/spoke/data flow map)
/ADRs/ADR-000-template.md
/docs/OSAM.md          (routing contract)
/docs/PRD.md           (what this repo does + why)
```

### SUB-HUB (e.g. Fetcher, Parser Registry)
```
CLAUDE.md              (thin — identity + pointer to Car CLAUDE.md)
README.md              (sub-hub purpose, spokes, triggers)
/docs/PRD.md           (required — if you can't write it, don't build it)
/docs/OSAM.md          (routing contract)
/ADRs/ADR-000-template.md
```

---

## Workflow

### Phase 1 — Detect Tier (Spoke 1)

**Constants for this phase:**
- Tier must be one of exactly three values: Garage / Car / Sub-Hub.
- If --tier flag is passed, accept it. If not, ask — never infer silently.
- A repo that looks like a Car but has no FLEET_REGISTRY.yaml is a Car, not a Garage.

**Variables for this phase:**
- Whether --tier flag was passed.
- Repo contents used for detection hints.

**Execute:**
1. Check for --tier flag. If present, accept and proceed.
2. If no flag: scan repo root for FLEET_REGISTRY.yaml (Garage signal),
   CONSTITUTION.md (Garage signal), or neither (Car/Sub-Hub).
3. If ambiguous between Car and Sub-Hub, ask: "Does this repo have its own
   hub processing logic, or is it a domain within a Car repo?"
4. Confirm tier with developer before proceeding.

**Go/No-Go:** Tier is declared and confirmed. If not confirmed, halt and ask.

---

### Phase 2 — Inventory (Spoke 2)

**Constants for this phase:**
- Required file list is determined by tier skeleton above. It is a Constant per tier.
- A file that exists but is empty counts as present — bootstrap does not validate content.
- Only root-level and /docs/ and /ADRs/ files are in scope. Bootstrap does not recurse deeper.

**Variables for this phase:**
- Which specific files are missing in this repo.

**Execute:**
1. Load required file list for confirmed tier.
2. Check repo root, /docs/, and /ADRs/ for each required file.
3. Build two lists: PRESENT (skip) and MISSING (stamp).
4. Display both lists to developer before proceeding.

**Go/No-Go:** Missing file list is complete and confirmed. Developer has seen it.

---

### Phase 3 — Resolve Templates (Spoke 3)

**Constants for this phase:**
- All templates come from imo-creator. No other source.
- If imo-creator path cannot be resolved, halt immediately.
- Template paths are fixed per the CLAUDE.md locked file registry.

**Variables for this phase:**
- Actual resolved path to imo-creator on this machine.

**Execute:**
1. Check for imo-creator path in FLEET_REGISTRY.yaml or ask developer.
2. Verify each required template exists at resolved path.
3. Map: missing file → source template path.

**Go/No-Go:** Every missing file has a confirmed source template. If any template
is missing from imo-creator, halt and report — do not improvise.

---

### Phase 4 — Stamp (Spoke 4)

**Constants for this phase:**
- Stamp = copy template to target path. No modification of template content
  except replacing [REPO_NAME], [TIER], [DATE], [SOVEREIGN_ID] placeholders.
- Never overwrite. If file appeared between Phase 2 and Phase 4, skip it.
- Placeholder replacement is the only permitted modification during stamp.

**Variables for this phase:**
- The specific placeholder values for this repo.

**Execute:**
1. For each file in MISSING list:
   - Copy from source template to target path.
   - Replace placeholders: [REPO_NAME], [TIER], [DATE], [SOVEREIGN_ID].
   - Confirm file written.
2. Log each stamped file: path + source template.

**Go/No-Go:** Every file in MISSING list now exists in repo. Zero failures.

---

### Phase 5 — Sovereign ID (Spoke 5)

**Constants for this phase:**
- Sovereign ID is always declared by the developer. Never generated.
- Sovereign ID must appear in CLAUDE.md Section 01 (Repo Identity).
- Format follows HEIR naming convention: H.E.I.R notation per imo-creator doctrine.

**Variables for this phase:**
- The actual sovereign ID value for this repo.

**Execute:**
1. Check CLAUDE.md Section 01 for sovereign ID field.
2. If present: confirm with developer and proceed.
3. If absent: ask developer to declare it now. Insert into CLAUDE.md Section 01.

**Go/No-Go:** Sovereign ID is declared and present in CLAUDE.md. If not, do not close.

---

### Phase 6 — Report (Spoke 6)

**Constants for this phase:**
- Report always has four sections: Tier, Files Stamped, Files Skipped, Sovereign ID.
- A bootstrap with zero files stamped is still a valid run — it means the repo was
  already compliant. Report it as such.

**Execute:**
Produce bootstrap report in this format:

```
BOOTSTRAP REPORT
────────────────
Repo:         [repo name]
Tier:         [Garage / Car / Sub-Hub]
Date:         [date]
Sovereign ID: [value]

FILES STAMPED (created)
  → [file path] (from [template source])
  → ...

FILES SKIPPED (already present)
  → [file path]
  → ...

STATUS: COMPLETE — repo is doctrine-compliant for [tier] tier.
```

**Go/No-Go:** Report produced and shown to developer. Task complete.

---

## Phase Failure Handling

**IMO of a Phase Failure:**
- **Ingress:** Phase produces unexpected result not matching defined output.
- **Middle:** Log three fields — (1) which phase failed, (2) what was attempted,
  (3) what was returned. Do not guess. Do not retry silently.
- **Egress:** Escalate to developer with three-field log. Ask for direction.

**OTHER path:** If failure cannot be classified, log to error with
`phase_failed`, `attempted_action`, `raw_output`. Do not resolve without developer input.

---

## CTB Backbone Mapping

Bootstrap output maps to repo structure:
- CLAUDE.md → constitutional layer (CANONICAL — do not modify after stamp without ADR)
- SYSTEM_MAP.md → architectural declaration
- /docs/PRD.md → transformation proof (CONST → VAR)
- /docs/OSAM.md → routing contract
- /ADRs/ → decision log

Bootstrap IS the Day 0 structural proof. A repo that has passed bootstrap has
satisfied the structural instantiation requirement per CONSTITUTION.md.

---

## Reference Files

| File | Contains | Load When |
|------|----------|-----------|
| `references/tier-skeletons.md` | Full required file list per tier with template mappings | Phase 2 — building missing file list |
| `references/placeholder-map.md` | All valid placeholders and replacement rules | Phase 4 — stamping files |

---

## Observability

- Bootstrap report IS the telemetry. Every run produces one.
- Failed phases log three-field entries before escalating.
- A bootstrap run with no report = audit violation. Treat as Phase 6 failure.
