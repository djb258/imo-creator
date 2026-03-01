# ADR: Prompt, Reverse Prompt, and Skills Libraries for PSB

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | 2.1.0 |
| **CC Layer** | CC-01 |

---

## ADR Identity

| Field | Value |
|-------|-------|
| **ADR ID** | ADR-023 |
| **Status** | [x] Proposed / [ ] Accepted / [ ] Superseded / [ ] Deprecated |
| **Date** | 2026-03-01 |

---

## Owning Hub (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | imo-creator |
| **Hub Name** | Prompt and Skills Bay |
| **Hub ID** | psb |

---

## CC Layer Scope

| Layer | Affected | Description |
|-------|----------|-------------|
| CC-01 (Sovereign) | [x] | Libraries are sovereign-level assets — fleet-wide prompt and skill governance |
| CC-02 (Hub) | [x] | PSB hub gains data branch with registered tables |
| CC-03 (Context) | [ ] | |
| CC-04 (Process) | [ ] | |

---

## IMO Layer Scope

| Layer | Affected |
|-------|----------|
| I — Ingress | [x] |
| M — Middle | [x] |
| O — Egress | [x] |

---

## Constant vs Variable

| Classification | Value |
|----------------|-------|
| **This decision defines** | [x] Variable (new capability) |
| **Mutability** | [x] Configuration (CONFIG tables) + Event (EVENT tables for version history) |

---

## Context

The PSB Constitution (PSB-CONST-001, v1.0.0) declares the Prompt and Skills Bay as "the human-facing hub definition engine that produces doctrine-compliant hub definition artifacts." It references a "corpus of 359 production prompts" as the empirical evidence base and mandates that the corpus be analyzed with the Transformation Law as the organizing principle.

Currently, prompts exist as markdown files in `templates/claude/` (15 files) and the broader 359-prompt corpus exists outside the CTB framework. Skills exist as agent definition files in `ai/agents/` and `.claude/agents/` but are not registered, versioned, or searchable.

There is no reverse lookup capability — given a desired output, there is no way to find which prompt produces it.

---

## Decision

Create three database-backed libraries as CTB tables within a `psb` schema, following the existing migration pattern (continuing from 011). These are sovereign-level operational tables for the Prompt and Skills Bay.

**Three libraries, six tables, four views:**

### 1. Prompt Library (Migration 012)

| Table | Classification | Purpose |
|-------|---------------|---------|
| `psb.prompt_registry` | CONFIG | Versioned, searchable prompt definitions with Transformation Law metadata |
| `psb.prompt_versions` | EVENT | Immutable version history — INSERT-only audit trail |

### 2. Reverse Prompt Library (Migration 013)

| Table | Classification | Purpose |
|-------|---------------|---------|
| `psb.reverse_prompt_index` | CONFIG | Output-first lookup — given a desired variable, find the prompt constant that produces it |

### 3. Skills Library (Migration 014)

| Table | Classification | Purpose |
|-------|---------------|---------|
| `psb.skill_registry` | CONFIG | Versioned skill definitions with input/output contracts |
| `psb.skill_versions` | EVENT | Immutable version history — INSERT-only audit trail |
| `psb.prompt_skill_binding` | CONFIG | Cross-reference: which skills use which prompts |

### 4. Egress Views (Migration 015)

| View | Purpose |
|------|---------|
| `psb.prompts_active` | Active prompts only (status = ACTIVE) |
| `psb.reverse_lookup` | Joined reverse index with prompt details |
| `psb.skills_active` | Active skills only (status = ACTIVE) |
| `psb.skill_dependency_tree` | Recursive skill dependency resolution |

---

## Transformation Law Statement

> The PSB Libraries transform **registered prompt constants and skill definitions** (constants) into **retrievable, versioned, searchable, doctrine-compliant knowledge assets** (variables).

The reverse library inverts this: given the **desired variable** (output), find the **constant** (prompt) that produces it. This is the Transformation Law running backward — which is itself a valid transformation: `desired_output → matching_prompt`.

---

## Alternatives Considered

| Option | Why Not Chosen |
|--------|----------------|
| Keep prompts as markdown files only | Not searchable, not versioned in database, no reverse lookup capability, no cross-reference with skills |
| Use external prompt management tool | Violates tool doctrine — tool not in SNAP_ON_TOOLBOX.yaml. Also moves sovereign data outside the CTB. |
| Store in JSON files | JSON is prohibited beyond the vendor layer (CTB_REGISTRY_ENFORCEMENT.md §9). Structured columns only. |

---

## Consequences

### Enables

- Searchable prompt corpus within CTB framework
- Reverse prompt lookup: "I want output X" → "Use prompt Y"
- Skill registry with dependency tracking
- Prompt-to-skill binding: know which skills use which prompts
- Immutable version history for both prompts and skills
- The 359-prompt corpus can be ingested and organized by CONST → VAR patterns
- Fleet-wide prompt and skill governance from sovereign level

### Prevents

- Prompts and skills remain unregistered markdown files
- No reverse lookup capability
- No cross-reference between prompts and skills
- No version audit trail in the database

### Risks

- Initial data migration (15 existing prompts + 5 agent definitions) must be carefully mapped
- Schema evolution requires ADR (as with all CTB tables)

---

## Guard Rails

| Type | Value | CC Layer |
|------|-------|----------|
| Table classification | CONFIG (registries) + EVENT (versions) | CC-01 |
| Version tables | INSERT-only — EVENT classification enforced by existing immutability triggers | CC-01 |
| JSON prohibition | No JSON columns in any PSB table — structured columns only | CC-01 |
| Write permissions | `ctb_vendor_writer` for prompt/skill ingestion; `ctb_data_reader` for queries | CC-02 |
| Status transitions | DRAFT → ACTIVE → DEPRECATED only (no backward movement) | CC-02 |
| Deletion | Soft-delete via DEPRECATED status. No physical DELETE. | CC-01 |

---

## Rollback

Drop migrations in reverse order: 015, 014, 013, 012. Each migration includes `DROP` statements in its rollback section. No data migration required for rollback since tables are new.

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | ARCHITECTURE.md v2.1.0 |
| PSB Constitution | PSB-CONST-001 v1.0.0 |
| CTB Registry Enforcement | CTB_REGISTRY_ENFORCEMENT.md v1.5.0 |
| Work Items | PSB Libraries implementation |
| PR(s) | (this PR) |

---

## Approval

| Role | Name | Date |
|------|------|------|
| Hub Owner (CC-01) | | |
| Reviewer | | |
