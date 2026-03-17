---
name: sales-research
description: >
  Company Research & Firmographic Analysis Subagent — evaluates Company Fit (25% of Prospect Score)
  across 8 research dimensions and 5 scoring sub-dimensions using structured web intelligence.
  Trigger standalone via `/sales research <url>` producing COMPANY-RESEARCH.md, or as subagent 1
  during `/sales prospect <url>` returning Company Fit Score 0-100. Industry-agnostic engine.
weight: 0.25
tier: spoke
---

# Company Research & Firmographic Analysis

## Tier 0 Doctrine

- **Tier:** Spoke (subagent of sales-prospect orchestrator; also standalone via `/sales research <url>`)
- **Authority:** Reads discovery briefing from orchestrator or raw URL from user; scores company fit only
- **Determinism first:** All scoring uses declared sub-dimension formulas and calibration tables. No LLM interpretation of scores.
- **No fabrication:** Every data point must have a source. Absence of data is scored, not invented. Revenue estimates must state methodology and confidence.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Company URL + optional discovery briefing with pre-fetched pages (schema validation only) |
| **Middle** | 8-dimension web research; 5-sub-dimension scoring with evidence; strength/risk/insight synthesis |
| **Egress** | COMPANY-RESEARCH.md (standalone) or Company Fit Score 0-100 with structured data (subagent) — read-only output |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Research Dimensions | 8 fixed (see Workflow) | Locked |
| Scoring Sub-Dimensions | Size Fit, Industry Fit, Growth Trajectory, Tech Sophistication, Budget Signals | Fixed; 5 sub-dimensions |
| Sub-Dimension Range | 0-20 each | Fixed |
| Score Formula | `sum of 5 sub-dimensions` | Produces 0-100 |
| Calibration: 16-20 | Exceptional — clear evidence, ideal range, multiple confirming sources | Fixed |
| Calibration: 11-15 | Strong — good evidence from 2+ sources, within acceptable range | Fixed |
| Calibration: 6-10 | Moderate — some signals, partially fits criteria | Fixed |
| Calibration: 1-5 | Weak — limited signals, marginal fit | Fixed |
| Calibration: 0 | Disqualifying — evidence actively contradicts fit | Fixed |
| Source Priority (8 levels) | 1. Company website, 2. SEC/public filings, 3. Crunchbase/PitchBook, 4. LinkedIn, 5. Press releases, 6. News articles, 7. Review sites (G2/Capterra/Glassdoor), 8. Social media | Fixed hierarchy; higher wins on conflict |
| Revenue Estimation Methods | Employee-based ($200K-$300K/employee), Funding-based (A=$1-3M, B=$5-15M, C=$15-50M ARR), Customer-based (count x avg tier), Traffic-based (traffic x CVR x AOV) | Fixed; must state method + confidence |
| Confidence Levels | High, Medium, Low, Speculative | Fixed |
| Data Freshness: Employees | Within 6 months; flag if older | Fixed |
| Data Freshness: Funding | Must include most recent round; flag if 18+ months stale | Fixed |
| Data Freshness: News | Last 6 months for Recent Developments; older goes to History | Fixed |
| Tech Stack Signal Sources | Job postings, Website source, Integration pages, Developer docs, Blog posts, Conference talks | Fixed; 6 sources |
| Web Search Queries | 7 structured queries per company (see Block 2) | Fixed pattern |
| Output: Standalone | COMPANY-RESEARCH.md | Fixed |
| Output: Subagent | Company Fit Score 0-100 + structured data block | Fixed |
| Strengths | 3-5 items, each with statement + evidence + sales implication | Fixed format |
| Risks | 3-5 items, each with statement + evidence + mitigation | Fixed format |
| Key Insights | 5 items, each non-obvious + actionable + sourced + recommendation | Fixed format |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `target_url` | User input or orchestrator briefing | Per-run |
| `company_name` | Homepage detection | Discovered |
| `discovery_briefing` | Orchestrator (subagent mode only) | Per-run |
| `invocation_mode` | `standalone` or `subagent` | Per-run |
| `homepage_content` | WebFetch of target URL | Discovered |
| `interior_pages` | WebFetch of up to 9 key pages (about, team, pricing, blog, careers, customers, press, legal, contact) | Discovered |
| `tech_stack_signals` | 6 signal sources (job posts, source code, integrations, dev docs, blog, talks) | Discovered |
| `search_results` | 7 WebSearch queries | Discovered |
| `company_overview_data` | Dimension 1 extraction | Discovered |
| `business_model_data` | Dimension 2 extraction | Discovered |
| `product_tech_data` | Dimension 3 extraction | Discovered |
| `leadership_data` | Dimension 4 extraction | Discovered |
| `funding_data` | Dimension 5 extraction | Discovered |
| `market_position_data` | Dimension 6 extraction | Discovered |
| `culture_data` | Dimension 7 extraction | Discovered |
| `recent_dev_data` | Dimension 8 extraction | Discovered |
| `size_fit_score` | Calibration table | Computed |
| `industry_fit_score` | ICP match assessment | Computed |
| `growth_trajectory_score` | Growth signals | Computed |
| `tech_sophistication_score` | Tech stack analysis | Computed |
| `budget_signals_score` | Budget evidence | Computed |
| `company_fit_score` | `sum of 5 sub-dimensions` | Computed |
| `strengths` | Synthesis | Computed |
| `risks` | Synthesis | Computed |
| `key_insights` | Synthesis | Computed |

---

## Workflow

### BLOCK 1: Website Intelligence Collection
**Governed by: C&V**

**Constants:** 9 page types (about, team, pricing, blog, careers, customers, press, legal, contact), 6 tech stack signal sources, source priority hierarchy
**Variables:** `target_url`, `homepage_content`, `interior_pages`, `tech_stack_signals`, `discovery_briefing`

**IMO:**
- **Ingress:** URL validated as reachable; if discovery briefing present, pre-fetched pages loaded; skip already-fetched pages
- **Middle:**
  - Fetch homepage via WebFetch — extract company name, tagline, value prop, product positioning, social proof
  - Fetch up to 9 interior pages (About, Team, Pricing, Blog, Careers, Customers, Press, Legal, Contact) — skip any provided in briefing
  - For each page: store URL, title, raw content, key data points
  - Detect tech stack from 6 signal sources: job postings (required skills), website source (meta tags, scripts, framework signatures), integration pages (listed partners), developer docs (API tech, SDKs), blog posts (technical content), conference talks (architectural choices)
  - If URL unreachable: attempt www/non-www and https/http variants; if still unreachable, report error
  - If specific page not found: note "Not publicly available", proceed with available data
- **Egress:** Structured page content store + tech stack inventory

**Go/No-Go:** Proceed if homepage accessible. If zero pages accessible, halt and report URL error to user.

---

### BLOCK 2: External Research & 8-Dimension Extraction
**Governed by: IMO**

**Constants:** 7 web search query patterns, 8 research dimensions, data freshness rules, source priority hierarchy, revenue estimation methods
**Variables:** `search_results`, `company_overview_data` through `recent_dev_data`

**IMO:**
- **Ingress:** Company name + all page content from Block 1
- **Middle:**
  - Execute 7 WebSearch queries: `"[company]" overview`, `"[company]" funding round`, `"[company]" revenue employees`, `"[company]" CEO founder`, `"[company]" news recent`, `"[company]" reviews Glassdoor`, `"[company]" competitors market`
  - Resolve conflicting data using source priority hierarchy (company website > SEC > Crunchbase > LinkedIn > press > news > reviews > social)
  - Apply data freshness rules: flag employee data older than 6 months; flag funding older than 18 months; note revenue estimation methodology and confidence
  - Extract data for 8 dimensions:
    - **Dim 1 — Company Overview:** Name, founded, founders, HQ, offices, employee count, stage, mission, vision, structure
    - **Dim 2 — Business Model & Revenue:** Revenue model, pricing tiers, revenue estimate (use estimation methods constant), customer count, key metrics, unit economics
    - **Dim 3 — Product & Technology:** Core products, category, tech stack, differentiators, roadmap signals, integrations, API/platform, patents, open source
    - **Dim 4 — Leadership & Team:** CEO/founder, CTO, key executives, board, advisory, recent changes, public presence, leadership style
    - **Dim 5 — Funding & Financial Health:** Total funding, latest round, round history, key investors, valuation, burn rate signals, profitability path
    - **Dim 6 — Market Position:** Market category, competitors (top 3-5), market share estimate, competitive advantages, win/loss signals, analyst coverage, awards
    - **Dim 7 — Culture & Employer Brand:** Values, Glassdoor rating + themes, hiring pace, work model, DEI signals, benefits, employer brand strength
    - **Dim 8 — Recent Developments (6 months):** Product launches, partnerships, funding events, leadership changes, market moves, controversies, customer wins, acquisitions
- **Egress:** 8 dimension data objects with source citations per data point

**Go/No-Go:** Proceed unconditionally. If web search returns limited results, note data gap and reduce confidence. Always extract from whatever is available.

---

### BLOCK 3: 5-Sub-Dimension Scoring
**Governed by: CTB**

**Constants:** 5 sub-dimensions (Size Fit, Industry Fit, Growth Trajectory, Tech Sophistication, Budget Signals), calibration scale 0-20 per sub-dimension, score formula
**Variables:** `size_fit_score`, `industry_fit_score`, `growth_trajectory_score`, `tech_sophistication_score`, `budget_signals_score`, `company_fit_score`

**IMO:**
- **Ingress:** All 8 dimension data objects from Block 2
- **Middle:**
  - **Size Fit (0-20):** Score by employee range calibration: 1-10 (5-10), 11-50 (10-15), 51-200 (15-20), 201-1000 (12-18), 1001-5000 (8-15), 5000+ (5-12). Adjust within range based on trajectory (growing vs stable vs declining).
  - **Industry Fit (0-20):** Score by ICP alignment: exact match (15-20), adjacent with relevance (10-14), some relevance (5-9), minimal relevance (1-4), mismatch (0). If no ICP available, score based on general engagement signals.
  - **Growth Trajectory (0-20):** Score by growth signals: rapid hiring 20%+ in 6mo (15-20), recent funding <6mo (12-18), new launches/expansion (10-15), steady 5-15% growth (8-12), stable flat (3-7), declining/layoffs (0-3).
  - **Tech Sophistication (0-20):** Score by tech maturity: modern/API-first/developer-focused (15-20), modern SaaS tools + integrations (10-14), standard with some modern (5-9), legacy/limited (1-4).
  - **Budget Signals (0-20):** Score by evidence: enterprise pricing/"Contact Sales" (15-20), recent funding Series B+ (12-18), hiring for roles using product category (10-15), multiple paid tools in stack (8-12), bootstrap/price-sensitive (2-6), clear budget constraints (0-2).
  - Validate each sub-score is 0-20 integer
  - Compute `company_fit_score = size_fit + industry_fit + growth_trajectory + tech_sophistication + budget_signals`
- **Egress:** Score breakdown table with per-sub-dimension evidence

**Go/No-Go:** Output is always produced. Any sub-dimension scored 0 must include explicit data-gap note explaining why.

---

### BLOCK 4: Synthesis & Output Assembly
**Governed by: Circle**

**Constants:** Strengths format (3-5, statement + evidence + sales implication), Risks format (3-5, statement + evidence + mitigation), Key Insights format (5, non-obvious + actionable + sourced + recommendation), output schema
**Variables:** `strengths`, `risks`, `key_insights`, `invocation_mode`, `company_fit_score`

**IMO:**
- **Ingress:** All dimension data + all sub-dimension scores from Blocks 2-3
- **Middle:**
  - Compile Strengths (3-5): each with specific evidence, source citation, and sales implication
  - Compile Risks (3-5): each with specific evidence, source citation, and mitigation strategy
  - Extract Key Insights (5): each must be non-obvious (not learnable in 30 seconds from homepage), actionable (informs sales approach), sourced, with recommendation
  - Write Executive Summary: 2-3 paragraphs covering who they are, what they do, trajectory, fit assessment
  - If `invocation_mode = standalone`: assemble full COMPANY-RESEARCH.md (see Output Template pointer)
  - If `invocation_mode = subagent`: return structured data block with Company Fit Score, sub-dimension breakdown, company snapshot fields, top strengths, top risks
  - Terminal display (standalone): condensed summary with Unicode bar charts (10-char bars, filled=U+2588, empty=U+2591)
- **Egress:** COMPANY-RESEARCH.md written to disk (standalone) or structured score block returned (subagent)

**Go/No-Go:** Output is always produced. Clearly note all data gaps. If multiple dimensions have no data, set overall confidence to Low and recommend manual research.

---

## Output Template

```markdown
# Company Research: [Company Name]
**URL:** [url]
**Date:** [current date]
**Company Type:** [type]
**Industry:** [vertical]
**Company Fit Score: [X]/100**

---

## Executive Summary
[2-3 paragraphs: who they are, what they do, trajectory, fit assessment]

## Company Snapshot

| Field | Value |
|-------|-------|
| **Company Name** | [name] |
| **Founded** | [year] |
| **Founders** | [names] |
| **Headquarters** | [location] |
| **Employees** | [count] (source: [source]) |
| **Stage** | [Startup/Growth/Mature/Public] |
| **Total Funding** | [amount] |
| **Latest Round** | [round type, amount, date] |
| **Revenue Estimate** | [range] (method: [method], confidence: [H/M/L/S]) |
| **Key Investors** | [names] |
| **Tech Stack** | [key technologies] |

## 1. Company Overview
## 2. Business Model & Revenue
## 3. Product & Technology
## 4. Leadership & Team
## 5. Funding & Financial Health
## 6. Market Position
## 7. Culture & Employer Brand
## 8. Recent Developments

## Company Fit Score: [X]/100

| Sub-Dimension | Score | Evidence |
|--------------|-------|----------|
| Size Fit | [X]/20 | [key evidence] |
| Industry Fit | [X]/20 | [key evidence] |
| Growth Trajectory | [X]/20 | [key evidence] |
| Tech Sophistication | [X]/20 | [key evidence] |
| Budget Signals | [X]/20 | [key evidence] |
| **Total** | **[X]/100** | |

## Strengths
1. **[Strength]** — [Evidence]. *Sales implication: [how to use]*

## Risks
1. **[Risk]** — [Evidence]. *Mitigation: [how to address]*

## Key Insights for Sales
1. **[Insight]** — [Evidence]. *Action: [what to do]*
```

---

## Terminal Output (Standalone Mode)

```
=== COMPANY RESEARCH COMPLETE ===

Company: [name] ([type])
Industry: [vertical]
Stage: [stage]
Employees: [count]
Funding: [total]
Revenue Est.: [range]

Company Fit Score: [X]/100
  Size Fit:           [XX]/20 ████████░░
  Industry Fit:       [XX]/20 ██████░░░░
  Growth Trajectory:  [XX]/20 ███████░░░
  Tech Sophistication:[XX]/20 █████░░░░░
  Budget Signals:     [XX]/20 ████████░░

Top Strengths:
  1. [strength]
  2. [strength]
  3. [strength]

Top Risks:
  1. [risk]
  2. [risk]

Full report saved to: COMPANY-RESEARCH.md
```

---

## Rules

1. **Never** invent data points. Every fact requires a source citation. "They probably have X" is not evidence.
2. **Never** score optimistically when data is absent. Unknown = score at midpoint of sub-dimension range, not top.
3. **Never** omit the estimation methodology for revenue figures. State the method and confidence level for every estimate.
4. **Never** use employee count data older than 6 months without flagging staleness.
5. **Never** count funding rounds older than 18 months as "recent" for growth trajectory scoring.
6. **Never** treat a single review or social post as a signal. Patterns across sources are signals; isolated mentions are noise.
7. **Never** hardcode industry names in scoring logic. Industry fit is scored against ICP context (a variable), not a constant vertical list.
8. **Never** skip a research dimension. If data is unavailable for a dimension, report "Not publicly available" and note the gap.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Orchestrator | `skills/sales-prospect/SKILL.md` |
| ICP definition | `IDEAL-CUSTOMER-PROFILE.md` (working directory, optional) |
| Decision maker skill | `skills/sales-contacts/SKILL.md` |
| Qualification skill | `skills/sales-qualify/SKILL.md` |
| Competitive intel skill | `skills/sales-competitors/SKILL.md` |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
