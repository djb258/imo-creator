# PROCESS.md Template — Reference

Load this file during Phase 6 (Write) when constructing the process document.

---

## Template Structure

Every PROCESS-{SHORTNAME}.md follows this exact structure. No sections added, removed, or reordered.

```markdown
# PROCESS-{SHORTNAME}: {Full Process Name}

| Field | Value |
|-------|-------|
| Process ID | PROC-{SHORTNAME} |
| Version | {X.Y.Z} |
| Status | {ACTIVE / IN_PROGRESS / PLANNED} |
| Repos | {comma-separated repo names} |
| Last Verified | {YYYY-MM-DD} |

## Summary

{1-3 sentences. What this process does end-to-end. No filler.}

## IMO — Ingress / Middle / Egress

### Ingress

| Field | Value |
|-------|-------|
| Trigger | {What starts this process} |
| Entry Table | {schema.table_name} |
| Entry Schema | {key columns with types} |

### Middle

| Phase | Step | Function | File | Reads | Writes | Gate |
|-------|------|----------|------|-------|--------|------|
| {1} | {step name} | {functionName()} | {path} | {tables} | {tables} | {gate name or —} |

### Egress

| Output | Table/View | Consumers |
|--------|-----------|-----------|
| {output name} | {schema.table} | {downstream processes or repos} |

## ID Addressing Chain

### Forward (Trigger → Output)

{Diagram or table showing ID flow from ingress to egress}

| Phase | ID Created | Format | Join Key To Next |
|-------|-----------|--------|-----------------|
| {phase} | {id_name} | {format pattern} | {foreign key} |

### Reverse (Output → Trigger)

{Step-by-step reverse trace from any output record back to the original trigger}

1. Find {output_table} by {output_id}
2. Extract {join_key} → query {middle_table}
3. Extract {join_key} → query {ingress_table}
4. Original trigger recovered

## Phase Breakdown

### Phase {N}: {Phase Name}

**Entry**: {What triggers this phase}
**Code**: `{file_path}` → `{functionName()}`

**Steps**:
1. {Step with specific function/query}
2. {Step}

**Gates**:
- {Gate Name}: {what it checks} → {PASS/BLOCK/DOWNGRADE}

**Writes**: {table → columns}

**Exit**: {What state the data is in when this phase completes}

{Repeat for each phase}

## ERD — Entity Relationship

| Table | Schema | Repo | Access | Phase | Key Columns |
|-------|--------|------|--------|-------|-------------|
| {table} | {schema} | {repo} | {R/W/RW} | {which phase} | {PK, FKs} |

### Cross-Repo Joins

| Source Table | Target Table | Join Key | Direction |
|-------------|-------------|----------|-----------|
| {source} | {target} | {key} | {→ or ←} |

## Services and Infrastructure

| Service | Purpose | Binding/Config | Status |
|---------|---------|---------------|--------|
| {service} | {what it does in this process} | {env var or binding} | {WIRED/PARTIAL/PLANNED} |

## ORBT Status

| Field | Value |
|-------|-------|
| Mode | {OPERATE / REPAIR / BUILD / TROUBLESHOOT} |
| Health | {GREEN / YELLOW / RED} |
| Notes | {Current state, last smoke test, known issues} |

## Migration Status

| Component | Current State | Target State | Status | Notes |
|-----------|-------------|-------------|--------|-------|
| {component} | {what it uses now} | {what it should use} | {WIRED/PARTIAL/PLANNED} | {details} |

## Document Control

| Field | Value |
|-------|-------|
| Version | {X.Y.Z} |
| Created | {YYYY-MM-DD} |
| Last Modified | {YYYY-MM-DD} |
| Authority | imo-creator (Sovereign) |
| Source Process | processes.ts → PROC-{SHORTNAME} |
```

---

## Field Rules

| Field | Rule |
|-------|------|
| Status | ACTIVE = fully deployed. IN_PROGRESS = partially deployed. PLANNED = no deployment. |
| Migration Status | WIRED = deployed + smoke tested. PARTIAL = code exists, not deployed. PLANNED = no code. |
| Phase steps | Must reference actual function names and file paths. No aspirational steps. |
| Gates | Must reference actual gate functions. Include what they return (PASS/BLOCK/DOWNGRADE). |
| ERD tables | Must be confirmed against live database. Note any discrepancies. |
| ID formats | Include actual format pattern with example. |
| Cross-Repo Joins | Document every case where one repo reads another repo's tables. |

---

## Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Phase steps with no function reference | Trace to code or mark as PLANNED |
| ERD tables not in live DB | Remove or mark as PLANNED |
| ID chain with gaps | Find the missing join key or document the gap |
| "TBD" or "TODO" in main sections | Move to Migration Status |
| Duplicating PRD content | Reference the PRD, don't copy |
