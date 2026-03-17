---
name: sales-objections
description: >
  Objection Handling Playbook Engine — generates OBJECTION-PLAYBOOK.md with word-for-word
  response scripts for 15 universal objections, 5 industry-specific objections, competitive
  battle cards, pricing tactics, and prevention techniques. Uses Feel-Felt-Found (FFR) and
  Acknowledge-Bridge-Close (ABC) dual-framework structure. Invoked standalone via
  `/sales objections <topic/industry>`. Industry-agnostic engine.
---

# Objection Handling Playbook Engine

## Tier 0 Doctrine

- **Tier:** Master (standalone skill, invoked directly)
- **Authority:** Invoked via `/sales objections <topic/industry>`; reads context files if present in working directory
- **Determinism first:** All responses use declared frameworks (FFR, ABC). Objection labels, component structure, pricing tactics, and prevention techniques are fixed constants. No LLM interpretation of structure.
- **No fabrication:** Proof points must cite source or be flagged as placeholders. Absence of data is noted, not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | `<topic/industry>` argument + optional context files in working directory (schema validation only) |
| **Middle** | Context gathering; 15 universal + 5 industry objections scripted through dual framework; competitive battle cards; pricing tactics; prevention techniques |
| **Egress** | `OBJECTION-PLAYBOOK.md` written to working directory (read-only structured output) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Frameworks | Feel-Felt-Found (FFR), Acknowledge-Bridge-Close (ABC) | Fixed; both required per objection |
| FFR Structure | Feel (acknowledge concern), Felt (reference similar company), Found (specific measurable outcome) | Fixed; 3 components |
| ABC Structure | Acknowledge (validate concern), Bridge (reframe as advantage), Close (evidence + next step) | Fixed; 3 components |
| Universal Objection Count | 15 | Fixed |
| Universal Objection Labels | 1-Too expensive, 2-Happy with current, 3-Need to think, 4-Send info, 5-Not ready/timing, 6-Need boss approval, 7-Tried before, 8-Competitor has X, 9-Build in-house, 10-No ROI, 11-Locked in contract, 12-Not a priority, 13-No bandwidth, 14-How do I know, 15-Not interested | Fixed; immutable list |
| Components Per Objection | 6: real meaning, FFR response, ABC response, follow-up question, proof point, walk-away criteria | Fixed |
| Industry Objection Count | 5 per run | Fixed |
| Industry Objection Sources | Regulations/compliance, technology constraints, buying processes, competitive dynamics, cultural norms | Fixed; 5 categories |
| Competitor Battle Card Count | Top 3 competitors per run | Fixed |
| Battle Card Components | One-sentence positioning, response script, 3 landmine questions, 3 "if they say" responses | Fixed |
| Pricing Tactics | 5: Reframe as Investment, Cost of Inaction, TCO Comparison, Tier Down, Payment Terms | Fixed; immutable list |
| Prevention Techniques | 5: Pre-emptive framing, Social proof loading, Discovery-driven selling, Mutual action plan, Champion building | Fixed; immutable list |
| Response Length | 3-5 sentences, 15-25 seconds spoken | Fixed |
| Competitive Response Rules | Never bash competitor, acknowledge strengths, use landmine questions, admit genuine losses | Fixed |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `topic_or_industry` | User argument `<topic/industry>` | Per-run |
| `target_url` | User argument (if URL provided instead of topic) | Per-run |
| `product_service` | Inferred from context files or user input | Per-run |
| `prospect_company` | Inferred from URL or context files | Per-run |
| `company_size` | SMB / mid-market / enterprise (inferred or declared) | Per-run |
| `competitors` | Top 3 identified for the space | Discovered |
| `deal_size` | Average deal size (affects pricing objection handling) | Per-run |
| `proof_points` | Best case studies, metrics, testimonials available | Discovered |
| `context_files` | `PROSPECT-ANALYSIS.md`, `COMPANY-RESEARCH.md`, `COMPETITIVE-INTEL.md` (if present) | Discovered |
| `industry_objections` | 5 objections generated from industry/topic input | Computed |
| `battle_cards` | Competitive response scripts per competitor | Computed |
| `pricing_scripts` | Populated pricing tactic scripts | Computed |
| `prevention_scripts` | Populated prevention technique scripts | Computed |
| `playbook_output` | Final `OBJECTION-PLAYBOOK.md` content | Computed |

---

## Workflow

### BLOCK 1: Context Gathering
**Governed by: C&V**

**Constants:** Universal objection labels (15), frameworks (FFR, ABC), components per objection (6)
**Variables:** `topic_or_industry`, `target_url`, `product_service`, `prospect_company`, `company_size`, `competitors`, `deal_size`, `proof_points`, `context_files`

**IMO:**
- **Ingress:** `<topic/industry>` argument validated present; check for URL vs. topic string
- **Middle:**
  - If URL provided: fetch via WebFetch, determine industry, company size, likely objections
  - Scan working directory for context files (`PROSPECT-ANALYSIS.md`, `COMPANY-RESEARCH.md`, `COMPETITIVE-INTEL.md`)
  - If context files exist: extract product/service, competitors, proof points, prospect details
  - If no context files: infer from topic/industry argument; flag gaps for placeholder generation
  - Collect or infer all 6 context items: product/service, target industry, company size, typical competitors, deal size, strongest proof points
- **Egress:** Context object with all variables populated or flagged as placeholder

**Go/No-Go:** Proceed if `topic_or_industry` or `target_url` is present. If neither, halt with usage message: `/sales objections <topic/industry>`.

---

### BLOCK 2: Universal + Industry Objection Scripting
**Governed by: IMO**

**Constants:** 15 universal objection labels, 6 components per objection, FFR structure, ABC structure, response length (15-25 seconds), 5 industry objection source categories
**Variables:** `topic_or_industry`, `prospect_company`, `industry_objections`, `proof_points`

**IMO:**
- **Ingress:** Context object from Block 1
- **Middle:**
  - For each of the 15 universal objections, generate all 6 components:
    1. Real meaning (what the objection actually signals)
    2. FFR response (Feel-Felt-Found, 3-5 sentences, tailored to context)
    3. ABC response (Acknowledge-Bridge-Close, 3-5 sentences, tailored to context)
    4. Follow-up question (keeps dialogue alive)
    5. Proof point (specific metric or flagged as placeholder)
    6. Walk-away criteria (when to stop pushing)
  - Generate 5 industry-specific objections from the 5 source categories (regulations, tech constraints, buying processes, competitive dynamics, cultural norms)
  - Each industry objection uses same 6-component structure
  - If URL was provided, tailor industry objections to that company, not just the industry
  - All scripts use natural conversational language, contractions, genuine empathy
- **Egress:** 20 fully scripted objections (15 universal + 5 industry) with all components

**Go/No-Go:** Proceed if all 15 universal objections have all 6 components populated. Industry objections must have at least 4 of 5 generated.

---

### BLOCK 3: Competitive + Pricing Scripting
**Governed by: Circle**

**Constants:** Battle card components (positioning, script, 3 landmine questions, 3 "if they say" responses), 5 pricing tactics (Reframe as Investment, Cost of Inaction, TCO Comparison, Tier Down, Payment Terms), competitive response rules (never bash, acknowledge strengths, landmine questions, admit losses)
**Variables:** `competitors`, `battle_cards`, `pricing_scripts`, `deal_size`

**IMO:**
- **Ingress:** Context object from Block 1 + competitor list
- **Middle:**
  - For each of the top 3 competitors, generate battle card:
    - One-sentence positioning vs. that competitor
    - 2-3 sentence response script (acknowledge strengths, differentiate, redirect)
    - 3 landmine questions (expose competitor weaknesses without naming them)
    - 3 "if they say" responses: "[Competitor] is cheaper", "[Competitor] has more features", "[Competitor] is the market leader"
  - For each of the 5 pricing tactics, generate complete script template:
    - Reframe as Investment: ROI math walkthrough using prospect's numbers
    - Cost of Inaction: quantify status-quo losses over 12 months
    - TCO Comparison: surface + hidden costs side-by-side
    - Tier Down: starter scope at lower price with upgrade path
    - Payment Terms: annual/monthly, deferred start, pilot, milestone-based options
  - All competitive responses follow rules: never bash, acknowledge strengths, use landmines, admit genuine losses
- **Egress:** 3 battle cards + 5 pricing scripts fully populated

**Go/No-Go:** Proceed if at least 2 of 3 competitors have complete battle cards and all 5 pricing tactics are scripted.

---

### BLOCK 4: Prevention + Assembly
**Governed by: CTB**

**Constants:** 5 prevention techniques (pre-emptive framing, social proof loading, discovery-driven selling, mutual action plan, champion building), output file (`OBJECTION-PLAYBOOK.md`), output structure
**Variables:** `prevention_scripts`, `playbook_output`

**IMO:**
- **Ingress:** All scripted content from Blocks 2-3
- **Middle:**
  - For each of 5 prevention techniques, generate:
    - When to deploy in the sales process
    - Specific language/script to use
    - Example of how it prevents a specific objection
  - Assemble Quick Reference matrix (all 20 objections: number, label, real meaning, best framework, key response)
  - Assemble full playbook in output structure:
    1. Header (industry, date, prospect if applicable)
    2. Quick Reference: Objection Response Matrix
    3. Frameworks (FFR + ABC descriptions)
    4. Universal Objections 1-15 (full 6-component scripts)
    5. Industry-Specific Objections 16-20
    6. Competitive Objections (3 battle cards)
    7. Pricing Deep Dive (5 tactics)
    8. Objection Prevention Tactics (5 techniques)
    9. Practice Guide (role-play scenarios, recording prompts, common mistakes)
  - Write to `OBJECTION-PLAYBOOK.md` in working directory
- **Egress:** `OBJECTION-PLAYBOOK.md` written to disk

**Go/No-Go:** Output is always produced. Any section with insufficient data must include explicit placeholder notes. File must contain all 9 sections.

---

## Rules

1. **Never** produce summaries or framework descriptions instead of word-for-word scripts. Every response must be ready to speak aloud or copy-paste.
2. **Never** bash a competitor directly. Acknowledge strengths honestly; use landmine questions to let the prospect discover weaknesses.
3. **Never** use high-pressure tactics, guilt trips, fear-mongering, or manufactured urgency. Respect the prospect as an intelligent professional.
4. **Never** omit the follow-up question. An objection response without a follow-up question leaves the conversation dead.
5. **Never** omit walk-away criteria. Real salespeople need to know when an objection is genuine and the deal should be deprioritized.
6. **Never** produce vague proof points. "Customers love us" is not a proof point. Specific metrics or explicit placeholder flags are required.
7. **Never** skip both frameworks. Every universal and industry objection must have both FFR and ABC versions.
8. **Never** modify the 15 universal objection labels or the 6-component structure. These are fixed constants.
9. **Never** generate generic responses when context files exist. If `PROSPECT-ANALYSIS.md`, `COMPANY-RESEARCH.md`, or `COMPETITIVE-INTEL.md` are present, incorporate their intelligence.
10. **Never** produce robotic language. Scripts must use contractions, conversational transitions, and genuine empathy — natural human speech.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Sales Prospect orchestrator | `agents/sales-prospect.md` (or `skills/sales-prospect/SKILL.md`) |
| Competitive Intel skill | `skills/sales-competitive/SKILL.md` |
| ICP definition | `IDEAL-CUSTOMER-PROFILE.md` (working directory, optional) |
| Prospect Analysis | `PROSPECT-ANALYSIS.md` (working directory, optional) |
| Company Research | `COMPANY-RESEARCH.md` (working directory, optional) |
| Competitive Intel file | `COMPETITIVE-INTEL.md` (working directory, optional) |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
