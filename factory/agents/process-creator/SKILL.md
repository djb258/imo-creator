---
name: process-creator
description: >
  Documents cross-repo business processes as PROCESS.md files. Trigger on: "document process",
  "write PROCESS.md", "process audit", "map the pipeline", "process definition", any request to
  create or update a process document. Also trigger when processes.ts flags a PROCESS.md as MISSING.
  Reads existing code, DB schemas, and pipeline definitions to produce a doctrine-compliant process
  document that maps the full IMO, ID chain, ERD, and migration status.
---

# process-creator — Process Documentation Skill

**Authority**: imo-creator (CC-01 Sovereign)
**Output**: `docs/processes/PROCESS-{SHORTNAME}.md`

Document a cross-repo business process. Read code and data, confirm the chain, write the document.

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** User requests a process document, or processes.ts flags PROCESS.md as MISSING.

**Middle (Processing):**
- Identify the process from processes.ts or user description
- Read all pipeline code, DB schemas, and adapter implementations
- Map the full execution chain: trigger → ingress → middle steps → egress
- Map the ID addressing chain (forward and reverse)
- Map the ERD (tables, access patterns, cross-repo joins)
- Identify wired vs unwired components
- Write the PROCESS.md

**Egress (Output):** A validated PROCESS-{SHORTNAME}.md at `docs/processes/`.

**Go/No-Go Gate:** Every section filled. No unfilled placeholder values. ID chain verified bidirectionally. ERD matches actual DB schema.

---

## Constants — What Is Fixed About Every Process Document

1. Every PROCESS.md has exactly these sections in this order:
   - Header (process ID, name, version, status, date)
   - Summary (1-3 sentences)
   - IMO (Ingress / Middle / Egress)
   - ID Addressing Chain (forward + reverse)
   - Phase Breakdown (numbered phases with gates)
   - ERD (tables, schemas, access patterns)
   - Services and Infrastructure
   - ORBT Status
   - Migration Status (what's wired, what's not)
   - Document Control
2. The ID Addressing Chain section is mandatory. Every process has at least one ID that flows through it.
3. The Phase Breakdown must match actual code — not aspirational design.
4. The ERD must match actual database tables — query the DB if needed.
5. Migration Status is honest: WIRED means deployed and tested, PARTIAL means code exists but not deployed, PLANNED means no code.
6. A PROCESS.md documents what IS, not what SHOULD BE. Aspirational items go in Migration Status only.
7. No prose filler. Every line states a fact or a constraint.
8. The process document is independent of any single repo — it spans repos.

---

## Variables — What Changes Per Process

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `process_id` | PROC-{SHORTNAME} identifier | From processes.ts or user |
| `source_repos` | Which repos contain the process code | Discovered during audit |
| `pipeline_files` | Specific files implementing each phase | Discovered during audit |
| `db_tables` | Tables read/written by the process | Discovered from code + DB |
| `id_chain` | The specific IDs that flow through | Discovered from code |
| `services` | Infrastructure the process depends on | Discovered from code + config |
| `migration_status` | Per-component wired/partial/planned | Assessed during audit |

---

## Hub-and-Spoke Configuration

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| Identify | processes.ts + user request | Process scope confirmed | Go/No-Go: process_id is unambiguous |
| Audit Code | Pipeline source files | Phase-by-phase execution map | Go/No-Go: every phase traced to code |
| Audit Data | DB schemas + queries | ERD with actual tables | Go/No-Go: tables confirmed in live DB |
| Map IDs | Code + DB | Bidirectional ID chain | Go/No-Go: forward + reverse paths documented |
| Assess Status | All findings | Migration status per component | Go/No-Go: honest assessment, no guessing |
| Write | All spoke outputs | PROCESS-{SHORTNAME}.md | Go/No-Go: all sections filled, no placeholders |

---

## Rules — What This Skill Never Does

- Never document a process that doesn't exist in code. If the code isn't written, it's PLANNED in Migration Status.
- Never invent ID chains. Trace them from actual code — mintCommunicationId(), mintMessageRunId(), etc.
- Never assume table schemas. Query the database or read migration files.
- Never mix what IS with what SHOULD BE in the main sections. Aspirational items go in Migration Status only.
- Never skip the ID Addressing Chain section. If you can't find IDs, the process isn't understood yet.
- Never create a PROCESS.md with unfilled placeholder values. Every field filled or explicitly marked N/A.
- Never duplicate content from PRD, OSAM, or SCHEMA docs. Reference them, don't copy.

---

## Workflow

### Phase 1 — Identify Process

**Constants for this phase:**
- The process must exist in processes.ts or be describable as a concrete pipeline.

**Variables for this phase:**
- The specific process_id and its scope.

**Execute:**
Read `dashboard/src/data/processes.ts`. Find the process by ID or match the user's description. Extract: repos, sub-hubs, services, current IMO definition, ERD tables.

**Go/No-Go:** Can you name the process, its repos, and its entry point? If yes, proceed. If no, ask.

### Phase 2 — Audit Code

**Constants for this phase:**
- Every middle step must trace to a function in a source file.
- Gates must trace to actual gate functions.

**Execute:**
For each repo in the process:
1. Read all pipeline files (orchestrators, workers, engines, adapters)
2. Map each function to a phase: what triggers it, what it reads, what it writes, what it calls next
3. Map gate functions: what they check, what they return (PASS/BLOCK/DOWNGRADE)
4. Map adapter implementations: what channels, what APIs, what's deprecated

Record: file path, function name, reads (tables/views), writes (tables), calls (other functions).

**Go/No-Go:** Every pipeline step accounted for? Every gate identified? If yes, proceed. If no, read more files.

### Phase 3 — Audit Data

**Constants for this phase:**
- ERD must reflect actual database state, not just code references.

**Execute:**
1. Query the live database (via Hyperdrive or direct) for schema introspection
2. Confirm every table referenced in code actually exists
3. Note any tables in the DB that the code doesn't reference (orphans)
4. Map cross-repo table access (which process writes, which reads)

**Go/No-Go:** Table list confirmed against live DB? Access patterns documented? If yes, proceed.

### Phase 4 — Map ID Chain

**Constants for this phase:**
- Every process has at least one ID that flows through it.
- The chain must work in both directions (forward: trigger→output, reverse: output→trigger).

**Execute:**
1. Find all ID minting functions (mintCommunicationId, mintMessageRunId, etc.)
2. Trace forward: signal → CID → SID → MID → delivery (or equivalent)
3. Trace reverse: delivery record → MID → SID → CID → original signal
4. Document the join keys between each phase
5. Document the ID format (prefix, structure, uniqueness guarantee)

**Go/No-Go:** Can you trace any output record back to its original trigger? If yes, proceed. If no, there's a gap.

### Phase 5 — Assess Migration Status

**Constants for this phase:**
- Three statuses only: WIRED (deployed + tested), PARTIAL (code exists, not deployed), PLANNED (no code).
- Be honest. PARTIAL is not WIRED.

**Execute:**
For each component (phases, adapters, gates, infrastructure):
1. Code exists? → at least PARTIAL
2. Deployed to production? → at least PARTIAL
3. Smoke tested / confirmed working? → WIRED
4. No code at all? → PLANNED

Flag any component that routes through deprecated infrastructure (e.g., Lovable, Supabase edge functions) as needing migration.

**Go/No-Go:** Every component has a status? No guessing? If yes, proceed.

### Phase 6 — Write PROCESS.md

**Constants for this phase:**
- Use the template structure defined in Constants section 1.
- File goes to `docs/processes/PROCESS-{SHORTNAME}.md`.

**Load:** `references/process-template.md` (the section-by-section template)

**Execute:**
Write the document using all outputs from Phases 1-5. Fill every section. No placeholders.

**Go/No-Go:** All sections filled? ID chain verified? ERD matches DB? Migration status honest? If yes, deliver. If no, fix.

---

## Reference Files

| File | Contains | Load When |
|------|----------|-----------|
| `references/process-template.md` | Section-by-section PROCESS.md template with field definitions | Phase 6 — when writing the document |

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Created | 2026-03-10 |
| Authority | imo-creator (Sovereign) |
