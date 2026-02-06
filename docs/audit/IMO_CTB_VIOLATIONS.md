# IMO/CTB Violations Report — LLM Clarity Focus

**Audit Date**: 2026-02-06
**Auditor**: Claude Code (READ-ONLY)
**Focus**: Identify what causes LLM confusion and non-compliance

---

## Audit Goal

**Primary Objective**: Simplify doctrine so LLMs do not get lost and follow instructions correctly.

**Key Questions**:
1. Where do LLMs encounter conflicting instructions?
2. Where do LLMs have too many files to read?
3. Where are concepts duplicated, causing confusion?
4. Where is the reading order unclear?

---

## Critical LLM Confusion Points

### CONFUSION-1: Duplicate ERD Governance (HIGH)

**Problem**: LLM must read 3 files to understand ERD rules

| File | Content | LLM reads... |
|------|---------|--------------|
| `ERD_CONSTITUTION.md` | Pressure Test, Upstream Flow Test, OSAM Alignment | "These are the validation rules" |
| `ERD_DOCTRINE.md` | Same tests + "ERD is structural proof" | "Wait, more rules?" |
| `DOCUMENTATION_ERD_DOCTRINE.md` | Formatting standards | "And formatting too?" |

**LLM Confusion**: "Which file is authoritative? Do I follow all three? What if they conflict?"

**Evidence of Duplication**:
- Both `ERD_CONSTITUTION.md` and `ERD_DOCTRINE.md` contain:
  - "ERD Validity Principle"
  - "Pass-to-Table Mapping"
  - "OSAM Alignment (MANDATORY)"
  - Identical validation criteria tables

**Impact**: LLM may miss rules or apply them inconsistently.

---

### CONFUSION-2: Two AI Agent Contracts (HIGH)

**Problem**: LLM must reconcile two documents about its own behavior

| File | Location | Content |
|------|----------|---------|
| `AI_EMPLOYEE_OPERATING_CONTRACT.md` | templates/ root | Role definition, halt conditions, permissions |
| `AI_EMPLOYEE_PROTOCOL.md` | templates/ai-employee/ | Gate checks, execution protocol, FAIL HARD |

**LLM Confusion**: "Which document governs me? Do I follow both? What if they conflict?"

**Specific Overlaps**:
- Both define halt conditions
- Both define escalation rules
- Both define what AI "MAY" and "MAY NOT" do

**Impact**: LLM may miss rules or follow the wrong document.

---

### CONFUSION-3: Too Many Entry Points (MEDIUM)

**Problem**: LLM encounters 4+ "read first" documents

| Document | Claims |
|----------|--------|
| `TEMPLATES_MANIFEST.yaml` | "AI AGENTS: READ THIS FIRST" |
| `IMO_SYSTEM_SPEC.md` | "First Read for All Agents" |
| `README.md` | "Reading Order (Mandatory)" |
| `AI_EMPLOYEE_OPERATING_CONTRACT.md` | "MANDATORY PRELOAD (DO NOT SKIP)" |

**LLM Confusion**: "Which one is actually first? They all say 'read first'."

**Impact**: LLM may start in wrong place or miss critical context.

---

### CONFUSION-4: Config Folder Contains Doctrine (MEDIUM)

**Problem**: Doctrine-like content in unexpected location

| File | Location | Content Type |
|------|----------|--------------|
| `CTB_DOCTRINE.md` | templates/config/ | Doctrine pointer |
| `QUICK_REFERENCE.md` | templates/config/ | Doctrine summary |

**LLM Confusion**: "Is config/ INPUT or DOCTRINE? Should I treat these as authoritative?"

**Actual Answer**: `CTB_DOCTRINE.md` explicitly states "POINTER DOCUMENT" — but LLM may not read that.

**Impact**: LLM may treat quick reference as authoritative, causing drift.

---

### CONFUSION-5: Scattered Prompt Locations (MEDIUM)

**Problem**: AI prompts are in 3 different folders

| Folder | Content | Count |
|--------|---------|-------|
| `templates/claude/` | Claude prompts | 16 |
| `templates/gpt/` | GPT intake guide | 1 |
| `templates/ai-employee/` | AI protocol + task | 2 |

**LLM Confusion**: "Where do I find the prompt for this task? Why are they in different places?"

**Impact**: LLM may miss relevant prompts or use wrong one.

---

### CONFUSION-6: Empty Folders (LOW)

**Problem**: Placeholder folders with no content

| Folder | Status |
|--------|--------|
| `templates/validators/` | Contains only README.md |
| `templates/workflows/` | Empty |

**LLM Confusion**: "Should I look here? Is content missing? Am I supposed to create it?"

**Impact**: Wasted processing, potential hallucination about expected content.

---

### CONFUSION-7: Integrations Mixed Content (LOW)

**Problem**: Same folder has different content types

| Content Type | Files |
|--------------|-------|
| Guidance docs (*.md) | COMPOSIO.md, DOPPLER.md, HEIR.md, OBSIDIAN.md, TOOLS.md |
| Config templates | doppler.yaml.template, heir.doctrine.yaml.template |
| Shell completions | doppler/*.bash, etc. |
| Vendor subfolders | abacus-ai/, hostinger/ |

**LLM Confusion**: "Are these INPUT templates or OUTPUT guidance? Do I copy these to child repos?"

**Impact**: LLM may incorrectly classify or copy wrong files.

---

## Violation Summary by LLM Impact

| ID | Violation | LLM Impact | Severity |
|----|-----------|------------|----------|
| CONFUSION-1 | Duplicate ERD governance | May miss or misapply rules | HIGH |
| CONFUSION-2 | Two AI contracts | May follow wrong document | HIGH |
| CONFUSION-3 | Multiple "read first" | May start in wrong place | MEDIUM |
| CONFUSION-4 | Doctrine in config/ | May misclassify authority | MEDIUM |
| CONFUSION-5 | Scattered prompts | May miss relevant prompt | MEDIUM |
| CONFUSION-6 | Empty folders | Wasted processing | LOW |
| CONFUSION-7 | Mixed integrations | May copy wrong files | LOW |

---

## Root Cause Analysis

### Why Do These Confusions Exist?

| Confusion | Root Cause |
|-----------|------------|
| Duplicate ERD | Organic growth — constitution added, doctrine not deprecated |
| Two AI contracts | Different authors/times — contract for identity, protocol for execution |
| Multiple entry points | Different audiences — human vs machine vs AI agent |
| Doctrine in config | Quick reference wanted but put in wrong folder |
| Scattered prompts | Historical — gpt/ was for ChatGPT, ai-employee/ was for protocol |
| Empty folders | Placeholders that were never implemented |
| Mixed integrations | Grew organically as integrations were added |

### Pattern: Organic Growth Without Consolidation

The templates/ folder grew over time without periodic simplification. Each new concept got its own file, but old files weren't deprecated.

---

## What LLMs Need

For an LLM to follow doctrine correctly, it needs:

| Need | Current State | Gap |
|------|---------------|-----|
| **One authoritative file per concept** | 2-3 files for ERD, 2 files for AI | VIOLATION |
| **Clear reading order** | 4 "read first" claims | CONFUSING |
| **Clean folder structure** | 21 subfolders, some empty | BLOATED |
| **Consistent content types per folder** | integrations/ is mixed | INCONSISTENT |
| **Prompts in one location** | 3 prompt folders | SCATTERED |

---

## Quantified Confusion Load

**Current LLM Burden**:
- Files to potentially read: 95
- Doctrine files: 11
- Prompt files: 19
- Entry point documents: 4
- Duplicate/overlapping concepts: 2

**Ideal LLM Burden**:
- One entry point → reading order → relevant doctrine → relevant prompt
- No backtracking, no reconciliation needed

---

## Document Control

| Field | Value |
|-------|-------|
| Generated | 2026-02-06 |
| Auditor | Claude Code |
| Type | LLM Clarity Audit |
| Focus | What confuses AI agents |
