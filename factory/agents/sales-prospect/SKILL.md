---
name: sales-prospect
description: >
  Prospect Analysis Orchestrator — produces a scored, prioritized, actionable prospect
  report by launching 5 parallel subagents and synthesizing their results into a unified
  PROSPECT-ANALYSIS.md. Trigger on `/sales prospect <url>`, or when any task requires
  full multi-dimensional prospect scoring from publicly available data.
  Industry-agnostic engine.
---

# Prospect Analysis Orchestrator

## Tier 0 Doctrine

- **Tier:** Hub (orchestrator that launches 5 parallel subagents)
- **Authority:** Owns the discovery briefing, composite scoring formula, and final report. Each subagent owns one scoring dimension only.
- **Determinism first:** All scoring uses declared weights, formulas, and grade bands. No LLM interpretation of scores. Company type detection uses signal tables, not judgment.
- **No fabrication:** Every data point must have a source URL or signal reference. Absence of data is scored (neutral 50), not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Target URL (schema validation only: must be well-formed URL; reject if empty) |
| **Middle** | Discovery briefing compilation; 5 parallel subagent launches; weighted score aggregation; grade assignment; action plan generation; email draft; confidence assessment |
| **Egress** | PROSPECT-ANALYSIS.md + terminal scorecard (read-only structured output) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Subagent count | 5 | Orchestrator architecture |
| Weight: Company Fit | 0.25 | Composite score formula |
| Weight: Contact Access | 0.20 | Composite score formula |
| Weight: Opportunity Quality | 0.20 | Composite score formula |
| Weight: Competitive Position | 0.15 | Composite score formula |
| Weight: Outreach Readiness | 0.20 | Composite score formula |
| Grade A+ | 90-100 (Hot Lead) | Grade band table |
| Grade A | 75-89 (Strong Prospect) | Grade band table |
| Grade B | 60-74 (Qualified Lead) | Grade band table |
| Grade C | 40-59 (Lukewarm) | Grade band table |
| Grade D | 0-39 (Poor Fit) | Grade band table |
| Subagent failure neutral score | 50 | Error-handling contract |
| Confidence levels | High / Medium / Low / Very Low | Confidence rubric |
| Interior page cap | 5 key pages max | Discovery scope limit |
| First email word limit | 100 words max body | Outreach constraint |
| Bar chart width | 10 characters (Unicode block fill) | Terminal display spec |
| Score formula | `Sum(dimension_score * weight)` | Composite score formula |
| BANT framework | Budget, Authority, Need, Timeline | Universal sales qualification (industry-agnostic) |
| MEDDIC framework | Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion | Universal sales qualification (industry-agnostic) |
| Action plan tiers | Immediate (24-48h) / Short-term (1-2wk) / Long-term (1-3mo) | Action plan structure |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `target_url` | User invocation `/sales prospect <url>` | Per-run |
| `company_name` | Extracted from homepage fetch | Per-run |
| `company_type` | Detected via signal table (SaaS, Agency, E-commerce, Enterprise, SMB, Startup, or custom) | Per-run |
| `industry_vertical` | Detected from site content and external signals | Per-run |
| `discovery_briefing` | Compiled from fetched pages + script output | Per-run |
| `pages_found[]` | URLs of accessible interior pages | Per-run |
| `homepage_content` | Raw text from homepage fetch | Per-run |
| `script_output` | JSON from `analyze_prospect.py` or "unavailable" | Per-run |
| `company_fit_score` | Returned by sales-company subagent (0-100) | Per-run |
| `contact_access_score` | Returned by sales-contacts subagent (0-100) | Per-run |
| `opportunity_quality_score` | Returned by sales-opportunity subagent (0-100) | Per-run |
| `competitive_position_score` | Returned by sales-competitive subagent (0-100) | Per-run |
| `outreach_readiness_score` | Returned by sales-strategy subagent (0-100) | Per-run |
| `prospect_score` | Computed composite (0-100) | Per-run |
| `grade` | Derived from prospect_score via grade band table | Per-run |
| `confidence_level` | Derived from subagent completion count + data richness | Per-run |
| `failed_subagents[]` | List of subagents that failed or timed out | Per-run |
| `existing_reports{}` | Pre-existing analysis files in cwd (cross-skill) | Per-run |
| `action_plan` | Three-tier action items generated from synthesis | Per-run |
| `first_email` | Copy-paste-ready outreach email under 100 words | Per-run |

---

## Workflow

### BLOCK 1: Discovery & Briefing Compilation

**Governed by: C&V**

**Constants:** target_url schema (well-formed URL), interior page cap (5), company type signal table (6 categories), confidence levels (4 tiers).

**Variables:** `target_url`, `company_name`, `company_type`, `industry_vertical`, `pages_found[]`, `homepage_content`, `script_output`, `discovery_briefing`, `existing_reports{}`.

**Ingress:** Receive `target_url` from user invocation. Validate: non-empty, well-formed URL. Reject immediately if validation fails.

**Middle:**

1. **Fetch homepage** via WebFetch. If unreachable, try alternate formats (www/non-www, http/https). If all fail, HALT with error message -- do not proceed on zero data.
2. **Fetch interior pages** (up to 5): About, Team, Pricing, Blog/Resources, Careers, Contact. Store URL, title, raw content, key data points for each accessible page.
3. **Detect company type** using signal table below. Scan homepage, careers, pricing, and investor mentions. Assign best-fit category; note runner-up if ambiguous.

| Company Type | Detection Signals |
|--------------|-------------------|
| SaaS/Software | Free trial CTA, pricing tiers, login link, API docs, integration marketplace |
| Agency/Services | Case studies, portfolio, client logos, service packages, retainer pricing |
| E-commerce | Product listings, cart/checkout, SKU counts, shipping/return policy |
| Enterprise | 500+ employees, multiple offices, compliance pages, procurement portal |
| SMB | 1-50 team, owner-operator signals, local focus, simple pricing |
| Startup | Investor logos, recent founding year, beta language, accelerator badges |

4. **Identify industry vertical** from site terminology, customer logos, case study industries, job posting requirements, compliance mentions. Assign primary vertical (variable, not hardcoded list).
5. **Run structured data extraction** via `python3 scripts/analyze_prospect.py --url <url> --output json`. If unavailable or fails, log error, continue with manual extraction, set `script_output` = "unavailable".
6. **Check for existing reports** in cwd: COMPANY-RESEARCH.md, DECISION-MAKERS.md, LEAD-QUALIFICATION.md, COMPETITIVE-INTEL.md, OUTREACH-SEQUENCE.md. If present, flag for subagent consumption.
7. **Compile discovery briefing** object with all gathered data: URL, company name, company type, industry vertical, pages found, page contents, script output, initial signals.

**Egress:** `discovery_briefing` object ready for subagent distribution.

**Go/No-Go:** Homepage must be accessible (at least 1 page fetched). If zero pages accessible after retries, HALT. If homepage fetched but interior pages limited, proceed with reduced confidence.

---

### BLOCK 2: Parallel Subagent Dispatch

**Governed by: IMO**

**Constants:** Subagent count (5), subagent skill file paths, subagent weights, subagent failure neutral score (50).

**Variables:** `discovery_briefing`, `existing_reports{}`, `company_fit_score`, `contact_access_score`, `opportunity_quality_score`, `competitive_position_score`, `outreach_readiness_score`, `failed_subagents[]`.

**Ingress:** Receive compiled `discovery_briefing` from BLOCK 1. Validate: briefing contains at minimum `target_url`, `company_name`, and `homepage_content`.

**Middle:**

Launch ALL 5 subagents simultaneously (parallel, not sequential). Each receives the full discovery briefing plus any relevant existing report.

| # | Subagent | Skill File | Weight | Output |
|---|----------|-----------|--------|--------|
| 1 | sales-company | `skills/sales-research/SKILL.md` | 0.25 | Company Fit Score (0-100): size fit, industry fit, growth trajectory, tech sophistication, budget signals |
| 2 | sales-contacts | `skills/sales-contacts/SKILL.md` | 0.20 | Contact Access Score (0-100): decision makers identified, contact info accessibility, personalization anchors, warm paths |
| 3 | sales-opportunity | `skills/sales-qualify/SKILL.md` | 0.20 | Opportunity Quality Score (0-100): BANT scorecard, MEDDIC assessment, buying signals, red flags |
| 4 | sales-competitive | `skills/sales-competitors/SKILL.md` | 0.15 | Competitive Position Score (0-100): current vendor identified, switching costs, competitive gaps, win probability |
| 5 | sales-strategy | `skills/sales-outreach/SKILL.md` | 0.20 | Outreach Readiness Score (0-100): personalization depth, trigger events, channel strategy, message-market fit |

**Error handling per subagent:**
- If subagent fails or times out: log failure reason, assign neutral score (50), append to `failed_subagents[]`.
- Continue with all available data regardless of individual failures.

**Egress:** Five dimension scores collected (actual or neutral-50 fallback). `failed_subagents[]` populated.

**Go/No-Go:** At least 3 of 5 subagents must return results. If fewer than 3 succeed, set `confidence_level` = "Very Low" and append prominent data-gap warning to report. Never halt on subagent failure alone -- always produce a report.

---

### BLOCK 3: Score Synthesis & Action Plan

**Governed by: CTB**

**Constants:** Score formula (`Sum(dimension * weight)`), grade band table (5 bands), action plan tiers (3), first email word limit (100), confidence rubric (4 levels).

**Variables:** `company_fit_score`, `contact_access_score`, `opportunity_quality_score`, `competitive_position_score`, `outreach_readiness_score`, `prospect_score`, `grade`, `confidence_level`, `failed_subagents[]`, `action_plan`, `first_email`.

**Ingress:** Receive five dimension scores from BLOCK 2. Validate: each score is integer 0-100.

**Middle:**

1. **Calculate composite Prospect Score:**

```
prospect_score = (
    company_fit_score        * 0.25 +
    contact_access_score     * 0.20 +
    opportunity_quality_score * 0.20 +
    competitive_position_score * 0.15 +
    outreach_readiness_score  * 0.20
)
```

2. **Assign grade** from band table:

| Range | Grade | Label |
|-------|-------|-------|
| 90-100 | A+ | Hot Lead |
| 75-89 | A | Strong Prospect |
| 60-74 | B | Qualified Lead |
| 40-59 | C | Lukewarm |
| 0-39 | D | Poor Fit |

3. **Assess confidence level:**

| Level | Criteria |
|-------|----------|
| High | 5/5 subagents completed, rich public data, multiple sources confirmed |
| Medium | 4/5 completed, moderate data, some inference |
| Low | 3/5 completed, limited data, significant inference |
| Very Low | <3 completed or major data gaps, mostly speculative |

Reduce confidence by one level for each failed subagent.

4. **Generate action plan** (three tiers):
   - Immediate (24-48h): 3-5 specific outreach actions, LinkedIn connections, content to share, CRM notes.
   - Short-term (1-2 weeks): follow-up sequence, additional research, stakeholder engagement, competitive prep.
   - Long-term (1-3 months): relationship building, content nurture, event opportunities, referral approaches.

5. **Craft first email** using sales-strategy subagent findings: copy-paste ready, personalized with real data, under 100 words body, 2 subject line options (A/B), specific send target (name, title, company), clear low-friction CTA, recommended send timing and follow-up cadence.

**Egress:** `prospect_score`, `grade`, `confidence_level`, `action_plan`, `first_email` ready for report assembly.

**Go/No-Go:** Score must be computable (all 5 dimension scores present, even if neutral-50). Grade must map to exactly one band. If any computation fails, log error and report partial results with explanation.

---

### BLOCK 4: Report Assembly & Output

**Governed by: Circle**

**Constants:** Output file name (PROSPECT-ANALYSIS.md), bar chart width (10 chars), Unicode fill character, terminal scorecard layout.

**Variables:** All variables from BLOCKs 1-3 assembled into final artifacts.

**Ingress:** Receive all computed values: discovery data, dimension scores, composite score, grade, confidence, action plan, first email, subagent detail sections. Validate: all required sections have content (even if partial).

**Middle:**

1. **Write PROSPECT-ANALYSIS.md** with these sections (structure defined in output template pointer):
   - Header: company name, URL, date, type, industry, score, grade, confidence.
   - Executive Summary: 3-5 paragraphs for sales leader. Lead with score/grade. Biggest opportunity, biggest risk, recommended approach, top decision maker, timing, go/no-go.
   - Prospect Snapshot table.
   - Score Breakdown table (5 dimensions with scores, weights, weighted values, key findings).
   - Company Profile (from sales-company subagent).
   - Decision Maker Map with buying committee table, text org chart, top 3 priority contacts (from sales-contacts subagent).
   - Opportunity Assessment with BANT scorecard and MEDDIC assessment (from sales-opportunity subagent).
   - Competitive Landscape with current solutions, switching costs, positioning angles (from sales-competitive subagent).
   - Outreach Strategy with framework, channels, personalization, objection prep (from sales-strategy subagent).
   - Prioritized Action Plan (3 tiers from BLOCK 3).
   - Ready-to-Send First Email with subject lines, body, CTA, timing, follow-up.

2. **Render terminal scorecard** with condensed output:
   - Company name, type, industry, URL.
   - Prospect Score with grade and label.
   - 5-dimension bar chart (10-char wide, Unicode block fill/empty).
   - Key decision maker.
   - Top 3 opportunities, top 3 risks.
   - Single most important next step.
   - File save confirmation.

3. **Suggest follow-up commands:** `/sales outreach` for full email sequence, `/sales prep` for meeting prep, `/sales proposal` for deal proposal.

**Egress:** PROSPECT-ANALYSIS.md written to cwd. Terminal scorecard displayed. No further mutations.

**Go/No-Go:** File must be writable to cwd. Terminal output must render without error. If file write fails, display full report in terminal as fallback.

---

## Rules

1. **Never** launch subagents sequentially -- all 5 must run in parallel.
2. **Never** generate a report on zero fetched pages -- HALT if homepage is unreachable after retries.
3. **Never** invent data points -- absence is scored as neutral (50) or noted as "not found," never fabricated.
4. **Never** hardcode industry verticals in Constants -- industries are Variables detected at runtime.
5. **Never** let a single subagent failure halt the entire pipeline -- assign neutral score (50), reduce confidence, continue.
6. **Never** exceed 100 words in the first email body.
7. **Never** use LLM judgment to override the composite score formula or grade band assignment -- scores are mechanical.
8. **Never** modify the subagent weight allocation at runtime -- weights are Constants.
9. **Never** skip the discovery briefing -- every subagent must receive the full briefing object.
10. **Never** produce a report without a confidence assessment -- every report declares High, Medium, Low, or Very Low.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Subagent: sales-company | `skills/sales-research/SKILL.md` |
| Subagent: sales-contacts | `skills/sales-contacts/SKILL.md` |
| Subagent: sales-opportunity | `skills/sales-qualify/SKILL.md` |
| Subagent: sales-competitive | `skills/sales-competitors/SKILL.md` |
| Subagent: sales-strategy | `skills/sales-outreach/SKILL.md` |
| Output template | PROSPECT-ANALYSIS.md (structure defined in BLOCK 4 Middle, section 1) |
| Structured data script | `scripts/analyze_prospect.py` |
| Architecture doctrine | `templates/doctrine/ARCHITECTURE.md` |
| Tool doctrine | `templates/integrations/TOOLS.md` |
