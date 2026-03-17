---
name: sales-icp
description: >
  Ideal Customer Profile Builder — standalone skill invoked via `/sales icp <description>`.
  Takes a business/product description, conducts market research, and produces a comprehensive
  IDEAL-CUSTOMER-PROFILE.md with 6 ICP dimensions, negative ICP, 100-point scoring rubric,
  buyer personas, prospecting playbook, and competitive context. Industry-agnostic engine.
---

# Ideal Customer Profile Builder

## Tier 0 Doctrine

- **Tier:** Master (standalone skill, invoked directly)
- **Authority:** User provides business description; skill owns ICP production end-to-end
- **Determinism first:** All scoring uses declared formulas and calibration tables. No LLM interpretation of scores.
- **No fabrication:** Every criterion must be grounded in research or stated as an explicit assumption. Generic platitudes are forbidden.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Business description text validated present (minimum 10 words, product/service identifiable) |
| **Middle** | 5-query market research; 6-dimension ICP analysis; negative ICP; scoring rubric; personas; playbook; competitive context |
| **Egress** | `IDEAL-CUSTOMER-PROFILE.md` written to working directory (read-only structured output, 12 sections) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| ICP Dimensions | Firmographic, Technographic, Behavioral, Pain Points, Budget, Channel | Fixed; 6 dimensions |
| Negative ICP Minimum | 8-10 disqualification criteria | Fixed |
| Total Score | 100 points | Fixed |
| Weight: Firmographic | 25 points | Fixed |
| Weight: Technographic | 15 points | Fixed |
| Weight: Pain Alignment | 20 points | Fixed |
| Weight: Budget Capacity | 20 points | Fixed |
| Weight: Contact Access | 10 points | Fixed |
| Weight: Timing Signals | 10 points | Fixed |
| Grade: A+ | 90-100 — drop everything and pursue | Fixed |
| Grade: A | 75-89 — high priority, personalized outreach | Fixed |
| Grade: B | 60-74 — worth pursuing, semi-personalized | Fixed |
| Grade: C | 40-59 — marginal, automated nurture only | Fixed |
| Grade: D | 0-39 — does not fit, do not pursue | Fixed |
| Scoring Tiers per Category | 0%, 25%, 50%, 75%, 100% of max points | Fixed |
| Quick Qual Questions | 5 yes/no questions | Fixed |
| Quick Qual Mapping | 5Y=A, 3-4Y=B, 1-2Y=C, 0Y=D | Fixed |
| Personas per ICP | 2-3 buyer personas | Fixed |
| Research Queries | 5 WebSearch patterns | Fixed |
| Output Sections | 12 sections in IDEAL-CUSTOMER-PROFILE.md | Fixed |
| Review Cadence | Quarterly or after major change | Fixed |
| Update Trigger: Deals Outside ICP | 3+ closed deals outside parameters | Fixed |
| Update Trigger: Lost Deals | 3+ losses to same competitor/objection | Fixed |
| Clarifying Questions Max | 1 question maximum, then proceed with assumptions | Fixed |
| Output Line Target | 300-400 lines of substantive content | Fixed |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `business_description` | User input via `/sales icp <description>` | Per-run |
| `product_service` | Parsed from description | Extracted |
| `current_customers` | Parsed from description (if mentioned) | Extracted |
| `price_point` | Parsed from description (if mentioned) | Extracted |
| `differentiators` | Parsed from description | Extracted |
| `industry_focus` | Parsed from description | Extracted |
| `company_stage` | Parsed from description | Extracted |
| `market_size_data` | WebSearch: `[category] market size TAM` | Discovered |
| `competitor_data` | WebSearch: `[category] competitors alternatives` | Discovered |
| `trend_data` | WebSearch: `[category] trends [year]` | Discovered |
| `buyer_behavior_data` | WebSearch: `[category] buying process B2B` | Discovered |
| `pricing_benchmarks` | WebSearch: `[category] pricing benchmarks` | Discovered |
| `firmographic_criteria` | Analysis of description + research | Computed |
| `technographic_signals` | Analysis of description + research | Computed |
| `behavioral_indicators` | Analysis of description + research | Computed |
| `pain_points` | Analysis of description + research | Computed |
| `budget_qualifiers` | Analysis of description + research | Computed |
| `channel_preferences` | Analysis of description + research | Computed |
| `negative_icp` | Analysis of description + research | Computed |
| `scoring_rubric` | Constants applied to dimensions | Computed |
| `buyer_personas` | Synthesized from ICP dimensions | Computed |
| `prospecting_playbook` | Synthesized from ICP + market data | Computed |
| `competitive_context` | Synthesized from competitor research | Computed |

---

## Workflow

### BLOCK 1: Input Parsing & Market Research
**Governed by: C&V**

**Constants:** Research queries (5 patterns), clarifying questions max (1), ICP dimensions (6)
**Variables:** `business_description`, `product_service`, `current_customers`, `price_point`, `differentiators`, `industry_focus`, `company_stage`, `market_size_data`, `competitor_data`, `trend_data`, `buyer_behavior_data`, `pricing_benchmarks`

**IMO:**
- **Ingress:** Business description validated: minimum 10 words, product/service identifiable. If too vague, ask ONE clarifying question then proceed.
- **Middle:**
  - Parse description: extract product/service, current customers, price point, differentiators, industry focus, company stage
  - If any field not mentioned, state assumption explicitly
  - Execute 5 WebSearch queries to ground ICP in market reality:
    1. `[product category] market size TAM` — addressable market
    2. `[product category] competitors alternatives` — positioning
    3. `[product category] trends [current year]` — market dynamics
    4. `[product category] buying process B2B` — buyer behavior
    5. `[product category] pricing benchmarks` — budget calibration
  - Compile research findings for use in all subsequent blocks
- **Egress:** Parsed description fields + research dataset ready for analysis

**Go/No-Go:** Proceed if description is parseable (10+ words, product identifiable). If fewer than 10 words and no product identifiable, ask one question then proceed regardless.

---

### BLOCK 2: 6-Dimension ICP Build + Negative ICP
**Governed by: IMO**

**Constants:** ICP dimensions (6), negative ICP minimum (8-10 criteria)
**Variables:** `firmographic_criteria`, `technographic_signals`, `behavioral_indicators`, `pain_points`, `budget_qualifiers`, `channel_preferences`, `negative_icp`

**IMO:**
- **Ingress:** Parsed description + research dataset from Block 1
- **Middle:**
  - **Firmographic:** company size (revenue range + headcount range), industry verticals (3-5 primary, 2-3 secondary), geography, stage, growth rate. Present as table: Criteria | Ideal Range | Why It Matters | Red Flag If Missing
  - **Technographic:** current tech stack by category, technical sophistication (1-5), integration needs, adoption patterns, digital maturity indicators
  - **Behavioral:** content consumption, event attendance (5-10 named events), community membership, buying patterns, social signals, hiring patterns
  - **Pain Points:** top 3-5 ranked. Each: name, severity (Critical/High/Medium/Low), manifestation, business impact (quantified), trigger events, current workaround, solution angle
  - **Budget:** revenue thresholds, funding stage, tech spend %, deal size sweet spot, budget cycle timing, pricing sensitivity, ROI expectations, budget authority signals
  - **Channel:** research channels, contact methods (ranked), decision process map (initiator/evaluator/approver/timeline), content preferences, engagement cadence, trust signals
  - **Negative ICP:** 8-10 disqualification criteria: too small, too large, wrong industry, wrong tech stack, wrong stage, no budget signals, cultural misfit, long sales cycle risk, high churn risk, competitive lock-in. Each with specific red flag AND rationale.
  - All criteria must use exact numbers, named tools, specific titles. No generic advice.
- **Egress:** 6-dimension ICP + negative ICP ready for scoring

**Go/No-Go:** Proceed if all 6 dimensions have at least one specific criterion and negative ICP has 8+ entries. If research returned no data for a dimension, state assumption and proceed.

---

### BLOCK 3: Scoring Rubric + Personas + Playbook
**Governed by: Circle**

**Constants:** Scoring weights (25/15/20/20/10/10), scoring tiers (0-100%), grade bands (A+/A/B/C/D), quick qual (5 questions), personas per ICP (2-3)
**Variables:** `scoring_rubric`, `buyer_personas`, `prospecting_playbook`, `competitive_context`

**IMO:**
- **Ingress:** 6-dimension ICP + negative ICP from Block 2
- **Middle:**
  - **Scoring rubric:** For each of 6 categories, define what scores 0%, 25%, 50%, 75%, 100% of max points. Must be specific enough that any salesperson can score a lead in under 5 minutes.
  - **Grade bands:** A+ (90-100), A (75-89), B (60-74), C (40-59), D (0-39) with action guidance per band
  - **Quick qualification:** 5 yes/no questions: (1) target industry? (2) ideal size range? (3) growth signals? (4) likely pain point? (5) decision maker findable? Map: 5Y=A, 3-4Y=B, 1-2Y=C, 0Y=D
  - **Buyer personas (2-3):** Each: archetype name, title/age/career/reporting, day-in-the-life, goals/KPIs, top 3 pain points (their language), information diet, top 3-5 objections (their words + underlying concern), 2-3 message angles (subject lines + openers), turn-offs, how to win them
  - **Prospecting playbook:** where to find (specific platforms/URLs), search strategies (actual query strings for LinkedIn Sales Nav, Google operators, job boards), signal monitoring (funding, leadership, hiring, product launches), prioritization framework (100 found -> top 10 how), enrichment checklist (10 items), warm path strategies, timing tactics, disqualification speed check (first 3 things), enrichment sources (named tools + what to extract), outreach templates per persona
  - **Competitive context:** 3-5 primary competitors (target segment + differentiator each), positioning statement (1 sentence), displacement scenarios (switch-from triggers), 2-3 market trends affecting ICP relevance
- **Egress:** Scoring system + personas + playbook + competitive context ready for assembly

**Go/No-Go:** Proceed if scoring rubric covers all 6 categories and at least 2 personas are defined.

---

### BLOCK 4: Document Assembly & Output
**Governed by: CTB**

**Constants:** Output sections (12), output line target (300-400), review cadence (quarterly), update triggers
**Variables:** All computed variables from Blocks 1-3

**IMO:**
- **Ingress:** All ICP components from Blocks 1-3
- **Middle:**
  - Assemble `IDEAL-CUSTOMER-PROFILE.md` with 12 sections in order:
    1. ICP Summary (2-3 paragraph executive summary)
    2. Firmographic Criteria (table format)
    3. Technographic Profile
    4. Behavioral Signals
    5. Pain Point Map (ranked with severity)
    6. Budget Qualifiers
    7. Channel Strategy
    8. Negative ICP (Who to Avoid)
    9. ICP Scoring Rubric (100-point scorecard + grade bands)
    10. Buyer Personas (2-3 full personas)
    11. Prospecting Playbook
    12. Competitive Context
  - Append ICP Maintenance Guide: review quarterly; update triggers (3+ deals outside ICP, 3+ losses to same competitor, major feature/pricing/market change); feedback loop (after 10+ `/sales prospect` runs, compare scores to deal outcomes); version control (date-stamp, keep previous versions)
  - Validate: every criterion is specific (exact ranges, not "medium-sized"), every recommendation is actionable, every persona feels real, scoring rubric is usable in under 5 minutes
- **Egress:** Write `IDEAL-CUSTOMER-PROFILE.md` to working directory. Confirm file path to user. Provide brief ICP highlights summary + suggest next steps (`/sales prospect <url>`)

**Go/No-Go:** Output always produced. If any section lacks specificity, flag the assumption inline rather than omitting the section.

---

## Rules

1. **Never** ask more than one clarifying question. Work with what you have and state assumptions explicitly.
2. **Never** produce generic advice. Every criterion must be specific to the user's business — exact ranges, named tools, specific titles.
3. **Never** skip any required section. All 6 dimensions, negative ICP, scoring rubric, personas, playbook, and competitive context are mandatory.
4. **Never** use filler content. Every sentence must add actionable value.
5. **Never** let LLM interpretation drive scoring. Scoring weights, grade bands, and quick-qual mapping are constants applied mechanically.
6. **Never** omit the negative ICP. Knowing who NOT to sell to saves more time than knowing who to sell to.
7. **Never** fabricate market data. If research returns no results, state "Not publicly available" and note impact on the criterion.
8. **Never** produce a rubric that takes more than 5 minutes to score a lead. If a salesperson needs help to use it, it is too complex.
9. **Never** write personas as marketing abstractions. Use specific language patterns, real frustrations, actual objections in their words.
10. **Never** hardcode industry names in scoring constants. The engine is industry-agnostic; industry specifics are variables discovered at runtime.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Prospect scoring (uses ICP) | `skills/sales-prospect/SKILL.md` |
| Opportunity assessment | `agents/sales-opportunity.md` |
| Full qualification (BANT + MEDDIC) | `skills/sales-qualify/SKILL.md` |
| ICP output file | `IDEAL-CUSTOMER-PROFILE.md` (working directory) |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
