# OSAM — Semantic Access Map

**Status**: LOCKED
**Authority**: CONSTITUTIONAL
**Version**: 1.0.0
**Change Protocol**: ADR + HUMAN APPROVAL REQUIRED

---

## Purpose & Scope

The **Operational Semantic Access Map (OSAM)** is the authoritative query-routing contract for a repository. It defines:

- **Where** data is queried from (query surfaces)
- **Which** tables own which concepts (semantic ownership)
- **Which** join paths are allowed (relationship contracts)
- **When** an agent MUST STOP and ask for clarification (halt conditions)

### What OSAM Is

| OSAM Is | OSAM Is NOT |
|---------|-------------|
| Authoritative query contract | Database schema |
| Semantic ownership map | Implementation guide |
| Join path declaration | Query optimization tool |
| Agent routing instructions | Business logic definition |

### Hierarchical Position

```
CONSTITUTION.md (Transformation Law)
    │
    ▼
PRD (Behavioral Proof — WHAT transformation occurs)
    │
    ▼
OSAM (Semantic Access Map — WHERE to query, HOW to join) ← THIS DOCUMENT
    │
    ▼
ERD (Structural Proof — WHAT tables implement OSAM contracts)
    │
    ▼
PROCESS (Execution Declaration — HOW transformation executes)
```

**OSAM sits ABOVE ERDs and DRIVES them.**
ERDs may only implement relationships that OSAM declares.

---

## Chain of Authority

### Parent → Spine → Sub-Hub Hierarchy

Every OSAM declares a chain of authority from the parent hub through the spine table to sub-hubs.

```
<PARENT_HUB> (CC-02)
    │
    ▼ owns
    │
<SPINE_TABLE> (Universal Join Key: <UNIVERSAL_JOIN_KEY>)
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
<SUB_HUB_A> (CC-03)                        <SUB_HUB_B> (CC-03)
    │                                             │
    ▼                                             ▼
[Tables join via <UNIVERSAL_JOIN_KEY>]    [Tables join via <UNIVERSAL_JOIN_KEY>]
```

### Authority Rules

| Rule | Description |
|------|-------------|
| Single Spine | Every hub has exactly ONE spine table |
| Universal Key | All sub-hub tables join to spine via the universal join key |
| No Cross-Sub-Hub Joins | Sub-hubs may not join directly to each other |
| Spine Owns Identity | The spine table is the authoritative source of entity identity |

---

## Universal Join Key Declaration

**REQUIRED**: Every OSAM must declare a single universal join key.

```yaml
universal_join_key:
  name: "<UNIVERSAL_JOIN_KEY>"
  type: "<DATA_TYPE>"  # e.g., UUID, INTEGER, STRING
  source_table: "<SPINE_TABLE>"
  description: "The single key that connects all tables in this hub"
```

### Join Key Rules

| Rule | Enforcement |
|------|-------------|
| Single Source | Universal join key is minted ONLY in the spine table |
| Immutable | Once assigned, a universal join key cannot change |
| Propagated | All sub-hub tables receive the key via FK relationship |
| Required | No table may exist without relationship to the universal join key |

---

## Query Routing Table

The Query Routing Table declares which table answers which question.

### Structure

| Question Type | Authoritative Table | Join Path | Notes |
|---------------|---------------------|-----------|-------|
| `<QUESTION_CATEGORY_1>` | `<TABLE_NAME>` | `<SPINE_TABLE>` → `<TABLE_NAME>` | |
| `<QUESTION_CATEGORY_2>` | `<TABLE_NAME>` | `<SPINE_TABLE>` → `<INTERMEDIATE>` → `<TABLE_NAME>` | |
| `<QUESTION_CATEGORY_N>` | `<TABLE_NAME>` | `<JOIN_PATH>` | |

### Routing Rules

| Rule | Description |
|------|-------------|
| One Table Per Question | Each question type has exactly ONE authoritative table |
| Explicit Paths Only | Only declared join paths may be used |
| No Discovery | Agents may not discover new query paths at runtime |
| HALT on Unknown | If a question cannot be routed, agent MUST HALT |

---

## Hub Definitions

### Parent Hub

```yaml
parent_hub:
  name: "<PARENT_HUB>"
  cc_layer: CC-02
  spine_table: "<SPINE_TABLE>"
  universal_join_key: "<UNIVERSAL_JOIN_KEY>"
  owns:
    - "<SUB_HUB_A>"
    - "<SUB_HUB_B>"
```

### Spine Table

```yaml
spine_table:
  name: "<SPINE_TABLE>"
  purpose: "Authoritative source of entity identity"
  primary_key: "<UNIVERSAL_JOIN_KEY>"
  query_surface: true  # This table CAN be queried directly
  columns:
    - name: "<UNIVERSAL_JOIN_KEY>"
      type: "<DATA_TYPE>"
      role: "Universal join key"
    - name: "<COLUMN_N>"
      type: "<DATA_TYPE>"
      role: "<DESCRIPTION>"
```

### Sub-Hubs

```yaml
sub_hubs:
  - name: "<SUB_HUB_A>"
    cc_layer: CC-03
    purpose: "<DESCRIPTION>"
    joins_to_spine_via: "<UNIVERSAL_JOIN_KEY>"
    tables:
      - "<TABLE_1>"
      - "<TABLE_2>"

  - name: "<SUB_HUB_B>"
    cc_layer: CC-03
    purpose: "<DESCRIPTION>"
    joins_to_spine_via: "<UNIVERSAL_JOIN_KEY>"
    tables:
      - "<TABLE_3>"
      - "<TABLE_4>"
```

---

## Allowed Join Paths

### Declared Joins

Only joins declared in this section are permitted. All other joins are INVALID.

| From Table | To Table | Join Key | Direction | Purpose |
|------------|----------|----------|-----------|---------|
| `<SPINE_TABLE>` | `<TABLE_1>` | `<UNIVERSAL_JOIN_KEY>` | 1:N | |
| `<SPINE_TABLE>` | `<TABLE_2>` | `<UNIVERSAL_JOIN_KEY>` | 1:N | |
| `<TABLE_1>` | `<TABLE_3>` | `<FK_NAME>` | N:1 | |

### Join Rules

| Rule | Enforcement |
|------|-------------|
| Declared Only | If a join is not in this table, it is INVALID |
| No Ad-Hoc Joins | Agents may not invent joins at runtime |
| ERD Must Implement | ERDs may only contain joins declared here |
| ADR for New Joins | Adding a new join requires ADR approval |

### Forbidden Joins

| From | To | Reason |
|------|----|--------|
| Sub-Hub A tables | Sub-Hub B tables (direct) | Cross-sub-hub isolation |
| Any table | Source/Enrichment tables | Source tables are not query surfaces |

---

## Source / Enrichment Table Classification

### Table Classifications

| Classification | Query Surface | Description |
|----------------|---------------|-------------|
| **QUERY** | YES | Tables that answer questions |
| **SOURCE** | NO | Raw ingested data; not for direct query |
| **ENRICHMENT** | NO | Lookup/reference data; joined for enrichment only |
| **AUDIT** | NO | Logging/tracking; not for business queries |

### Classification Table

| Table Name | Classification | Query Surface | Notes |
|------------|----------------|---------------|-------|
| `<SPINE_TABLE>` | QUERY | YES | |
| `<TABLE_1>` | QUERY | YES | |
| `<SOURCE_TABLE>` | SOURCE | **NO** | Raw import data |
| `<ENRICHMENT_TABLE>` | ENRICHMENT | **NO** | Reference lookup only |

### Classification Rules

| Rule | Enforcement |
|------|-------------|
| SOURCE tables are NEVER query surfaces | Agent MUST HALT if asked to query SOURCE |
| ENRICHMENT tables are joined, not queried | Never the "FROM" table |
| QUERY tables are the only valid query surfaces | All questions route to QUERY tables |
| Misclassified queries are INVALID | Agent rejects and escalates |

---

## STOP Conditions

Agents MUST HALT and request clarification when:

### Query Routing STOP Conditions

| Condition | Action |
|-----------|--------|
| Question cannot be routed to a declared table | HALT — ask human for routing |
| Question requires a join not declared in OSAM | HALT — request ADR |
| Question targets a SOURCE or ENRICHMENT table | HALT — query surfaces only |
| Question requires cross-sub-hub direct join | HALT — isolation violation |

### Semantic STOP Conditions

| Condition | Action |
|-----------|--------|
| Concept not declared in OSAM | HALT — semantic gap |
| Multiple tables claim ownership of concept | HALT — ambiguity resolution required |
| Universal join key not found in query path | HALT — structural violation |

### STOP Output Format

```
OSAM HALT
═════════════════════════════════════════════════════════════════════════════

Reason: [QUERY_UNROUTABLE | JOIN_UNDECLARED | SOURCE_QUERY | ISOLATION_VIOLATION | SEMANTIC_GAP | AMBIGUITY | STRUCTURAL]

Question: "<THE_QUESTION_ASKED>"
Attempted Route: [What the agent tried to do]
OSAM Reference: [Section that applies]

Resolution Required:
  [ ] Human must declare new routing
  [ ] ADR required for new join
  [ ] Clarify which table owns this concept

Agent is HALTED. Awaiting resolution.
```

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | `<DATE>` | `<AUTHOR>` | Initial OSAM declaration |

---

## Validation Checklist

Before OSAM is considered valid:

| Check | Status |
|-------|--------|
| [ ] Universal join key declared | |
| [ ] Spine table identified | |
| [ ] All sub-hubs listed with table ownership | |
| [ ] All allowed joins explicitly declared | |
| [ ] All tables classified (QUERY/SOURCE/ENRICHMENT/AUDIT) | |
| [ ] Query routing table complete | |
| [ ] STOP conditions understood | |
| [ ] No undeclared joins exist in ERD | |

---

## Relationship to Other Artifacts

| Artifact | OSAM Relationship |
|----------|-------------------|
| **PRD** | PRD declares WHAT transformation. OSAM declares WHERE to query. PRD must reference OSAM. |
| **ERD** | ERD implements OSAM. ERD may not introduce joins not in OSAM. |
| **Process** | Processes query via OSAM routes. No ad-hoc queries. |
| **Agents** | Agents follow OSAM routing strictly. HALT on unknown routes. |

---

## Document Control

| Field | Value |
|-------|-------|
| Created | `<DATE>` |
| Last Modified | `<DATE>` |
| Version | 1.0.0 |
| Status | LOCKED |
| Authority | CONSTITUTIONAL |
| Derives From | CONSTITUTION.md (Transformation Law) |
| Change Protocol | ADR + HUMAN APPROVAL REQUIRED |
