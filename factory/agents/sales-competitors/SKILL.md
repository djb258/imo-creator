---
name: sales-competitors
description: >
  Competitive Intelligence Engine Subagent — detects what tools/solutions a prospect currently uses
  via 6 detection methods, builds 10-section battle cards per overlapping competitor, and assembles
  a scored competitive strategy. Trigger standalone via `/sales competitors <url>` producing
  COMPETITIVE-INTEL.md, or as subagent during `/sales prospect <url>` returning Competitive
  Position Score 0-100. Industry-agnostic engine.
weight: 0.15
tier: spoke
---

# Competitive Intelligence Engine

## Tier 0 Doctrine

- **Tier:** Spoke (subagent of sales-prospect orchestrator; also standalone via `/sales competitors <url>`)
- **Authority:** Reads prospect URL from orchestrator or user; detects current solutions and builds competitive battle cards only
- **Determinism first:** All detection uses 6 declared methods. All scoring uses declared formulas and confidence levels. No LLM interpretation of scores.
- **No fabrication:** Every competitor capability must have a source. Unverified claims are labeled "Reported." Absence of data is noted, not invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Company URL + optional prior analysis files (PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, LEAD-QUALIFICATION.md) — schema validation only |
| **Middle** | 6-method solution detection; 10-section battle card generation per competitor; feature gap analysis; win/loss pattern recognition; competitive strategy assembly; 0-100 scoring |
| **Egress** | COMPETITIVE-INTEL.md (standalone) or Competitive Position Score 0-100 with structured data (subagent) — read-only output |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Detection Methods | 6 fixed: Website Technology Analysis, Job Posting Analysis, Case Study/Partnership Search, Review Site Search, Tech Stack Detection Services, Social Signal Analysis | Locked |
| Confidence Levels | High (explicit mention/badge), Medium (script tag/indirect reference), Low (inference from job posting/industry norm) | Fixed; 3 levels |
| Battle Card Sections | 10 fixed: What They Use It For, Strengths (3-5), Weaknesses (3-5), Your Advantages + proof, Their Advantages + Neutralization, Switching Cost Assessment (5 factors), Switching Triggers (5), Landmine Questions (5), Trap to Avoid, Positioning Statement | Locked |
| Switching Cost Factors | 5 fixed: Technical migration, Financial cost, Organizational change, Data portability, Timeline estimate | Fixed |
| Feature Comparison Rules | Include wins AND losses; specific details not checkmarks; mark unverified as "Reported"; organize by prospect importance | Fixed |
| Win/Loss Pattern Format | 3-5 win reasons + 3-5 loss reasons per competitor | Fixed |
| Deal Qualification Signal Format | "If prospect says X -> favors you/competitor" | Fixed |
| Competitive Strategy Structure | Strategy Summary, Conversation Sequence (5 topics), What to Lead With, What to Avoid, Displacement Timeline | Fixed; 5 sections |
| Scoring Sub-Dimensions | Detection Breadth, Battle Card Depth, Strategy Coherence, Evidence Quality, Displacement Feasibility | Fixed; 5 sub-dimensions |
| Sub-Dimension Range | 0-20 each | Fixed |
| Score Formula | `sum of 5 sub-dimensions` | Produces 0-100 |
| Output: Standalone | COMPETITIVE-INTEL.md | Fixed |
| Output: Subagent | Competitive Position Score 0-100 + structured data block | Fixed |
| Output Sections | Executive Summary, Current Solutions Detected, Battle Cards, Feature Gap Analysis, Win/Loss Patterns, Competitive Positioning Statements, Switching Cost Assessment, Recommended Strategy, Detection Sources | Fixed; 9 sections |
| Refresh Recommendation | Every 3-6 months or before major competitive deal | Fixed |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `target_url` | User input or orchestrator briefing | Per-run |
| `company_name` | Homepage detection | Discovered |
| `invocation_mode` | `standalone` or `subagent` | Per-run |
| `prior_analysis` | PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, LEAD-QUALIFICATION.md (if present) | Per-run |
| `detected_solutions` | 6 detection methods | Discovered |
| `confidence_ratings` | Per solution — High/Medium/Low | Computed |
| `solution_categories` | CRM, Marketing Automation, Analytics, Customer Support, Project Management, Communication, etc. | Discovered |
| `overlapping_competitors` | Subset of detected solutions that compete with offering | Computed |
| `battle_cards` | 10-section card per overlapping competitor | Computed |
| `feature_comparison` | Side-by-side table across competitors | Computed |
| `win_loss_patterns` | 3-5 win reasons + 3-5 loss reasons per competitor | Computed |
| `deal_qualification_signals` | Computed from win/loss patterns | Computed |
| `competitive_strategy` | Strategy Summary + Conversation Sequence + Lead/Avoid + Displacement Timeline | Computed |
| `detection_breadth_score` | Sub-dimension 0-20 | Computed |
| `battle_card_depth_score` | Sub-dimension 0-20 | Computed |
| `strategy_coherence_score` | Sub-dimension 0-20 | Computed |
| `evidence_quality_score` | Sub-dimension 0-20 | Computed |
| `displacement_feasibility_score` | Sub-dimension 0-20 | Computed |
| `competitive_position_score` | `sum of 5 sub-dimensions` | Computed |

---

## Workflow

### BLOCK 1: Solution Detection
**Governed by: C&V**

**Constants:** 6 detection methods, 3 confidence levels, source priority
**Variables:** `target_url`, `company_name`, `detected_solutions`, `confidence_ratings`, `prior_analysis`

**IMO:**
- **Ingress:** URL validated as reachable; prior analysis files loaded if present in working directory
- **Middle:**
  - Execute all 6 detection methods in parallel via WebFetch and WebSearch:
    - **Website Technology Analysis:** Fetch prospect URL. Inspect HTML source for script tags, meta tags, link tags referencing known tools. Check homepage, footer, integrations page, partners page for tool logos/badges. Detect "Powered by" footers. Identify website platform, hosting, CDN, email provider. Check login/portal links and API documentation pages.
    - **Job Posting Analysis:** WebSearch `"[Company Name]" careers`, `"[Company Name]" open jobs`, `"[Company Name]" hiring`. Extract tool-specific requirements, tech stack mentions, vendor certifications, process tool references. These are HIGH confidence signals.
    - **Case Study/Partnership Search:** WebSearch `"[Company Name]" case study [competitor]`, `"[Company Name]" customer story`, `"[Company Name]" testimonial`. Check if prospect appears on competitor websites as customer, in testimonials, as partner.
    - **Review Site Search:** WebSearch `site:g2.com "[Company Name]"`, `site:capterra.com "[Company Name]"`, `"[Company Name]" review [tool category]`. Note which products reviewed, satisfaction level, specific complaints/praise, review date.
    - **Tech Stack Detection Services:** WebSearch `site:builtwith.com [Company Domain]`, `site:stackshare.io "[Company Name]"`, `"[Company Domain]" technology stack`. Catalog technologies not visible through direct inspection.
    - **Social Signal Analysis:** WebSearch `"[Company Name]" [tool category] site:linkedin.com`, `"[Company Name]" "we use" OR "switched to" OR "implemented"`. Look for blog posts, LinkedIn posts, conference talks, community forum posts about tool choices.
  - For each detected technology, record: tool/platform name, evidence source (URL/page element/signal), confidence level (High/Medium/Low)
  - If prior analysis files exist, incorporate prospect priorities and pain points into detection weighting
  - If URL unreachable: attempt www/non-www and https/http variants; if still unreachable, halt
- **Egress:** Structured detection inventory: tool name + evidence + confidence per entry

**Go/No-Go:** Proceed if at least 1 solution detected. If zero solutions detected across all 6 methods, halt and report to user.

---

### BLOCK 2: Battle Card Generation
**Governed by: IMO**

**Constants:** 10 battle card sections, switching cost factors (5), feature comparison rules
**Variables:** `overlapping_competitors`, `battle_cards`, `feature_comparison`, `solution_categories`

**IMO:**
- **Ingress:** Full detection inventory from Block 1
- **Middle:**
  - Categorize all detected solutions into relevant categories (CRM, Marketing Automation, Analytics, Customer Support, Project Management, Communication, etc.)
  - Identify which detected solutions overlap with or compete against offering — these receive full battle cards
  - For EACH overlapping competitor, build 10-section battle card:
    1. **What They Use It For** — specific description based on detection evidence
    2. **Strengths (3-5)** — genuine strengths with why each matters to prospect. Credibility requires honesty.
    3. **Weaknesses (3-5)** — specific weaknesses with evidence. "Bad support" is too generic; "48-hour average ticket response, no dedicated AM under $50K ARR" is specific.
    4. **Your Advantages** — each with proof point (metric, case study, testimonial)
    5. **Their Advantages + Neutralization** — honest about where competitor wins; for each, explain how to neutralize or reframe
    6. **Switching Cost Assessment** — 5 factors table: Technical migration (Low/Med/High + details), Financial cost (Low/Med/High + details), Organizational change (Low/Med/High + details), Data portability (Easy/Moderate/Difficult + details), Timeline estimate (weeks/months + details)
    7. **Switching Triggers (5)** — events that commonly cause customers to switch (contract renewal price increase, outgrowing tier structure, feature gap blocking workflow, new leadership vendor consolidation, poor support during critical incident)
    8. **Landmine Questions (5)** — questions exposing competitor weaknesses without bashing. Must be genuinely curious questions any smart buyer would ask.
    9. **Trap to Avoid** — what NOT to say about this competitor and why
    10. **Positioning Statement** — one sentence: "While [Competitor] is [honest strength], [Your Company] [differentiator] which means [specific outcome for prospect]."
  - Build feature comparison table: side-by-side across competitors. Include features where you win AND lose. Use specific details not checkmarks. Mark unverified as "Reported." Organize by prospect importance.
- **Egress:** Structured battle cards + feature comparison table per competitor

**Go/No-Go:** Proceed if at least 1 battle card produced. If no overlapping competitors found, produce detection report only (no battle cards needed).

---

### BLOCK 3: Win/Loss Analysis & Strategy
**Governed by: Circle**

**Constants:** Win/loss pattern format (3-5 each), deal qualification signal format, competitive strategy structure (5 sections)
**Variables:** `win_loss_patterns`, `deal_qualification_signals`, `competitive_strategy`

**IMO:**
- **Ingress:** All battle cards + feature comparison from Block 2 + prior analysis context
- **Middle:**
  - For each competitor, compile win/loss patterns:
    - **Win Patterns (3-5):** "We win when [specific situation or buyer profile]" — derived from battle card analysis, switching triggers, and feature advantages
    - **Loss Patterns (3-5):** "We lose when [specific situation or buyer profile]" — derived from competitor strengths and their advantages
  - Generate deal qualification signals from win/loss patterns: "If prospect says [X] -> favors you because [reason]", "If prospect prioritizes [Z] -> strong deal for you", "If prospect prioritizes [W] -> consider deprioritizing"
  - Assemble competitive strategy:
    - **Strategy Summary:** One paragraph — which competitor to focus on displacing, which to ignore, what messaging to lead with
    - **Conversation Sequence:** 5 topics in recommended order, each with reasoning
    - **What to Lead With:** Single strongest differentiator with talking point script
    - **What to Avoid:** Topics, claims, comparisons to deliberately avoid with reasons
    - **Displacement Timeline:** When to start (relative to contract renewal), expected evaluation period, migration timeline, full transition period
  - Validate: every claim traceable to detection evidence or battle card analysis. No unsourced assertions.
- **Egress:** Validated win/loss patterns + deal qualification signals + competitive strategy

**Go/No-Go:** Proceed unconditionally. If limited data, reduce strategy confidence and note gaps.

---

### BLOCK 4: Scoring & Output Assembly
**Governed by: CTB**

**Constants:** 5 scoring sub-dimensions, sub-dimension range 0-20, score formula, output sections (9), refresh recommendation
**Variables:** All 5 sub-dimension scores, `competitive_position_score`, `invocation_mode`

**IMO:**
- **Ingress:** All data from Blocks 1-3: detection inventory, battle cards, feature comparison, win/loss patterns, competitive strategy
- **Middle:**
  - Score 5 sub-dimensions (0-20 each):
    - **Detection Breadth (0-20):** How many methods yielded results; how many solutions detected; confidence distribution. 6/6 methods with High confidence = 18-20; 1-2 methods with Low confidence = 2-6.
    - **Battle Card Depth (0-20):** Completeness of 10 sections per card; specificity of evidence; actionability of talking points. All 10 sections with specific evidence = 16-20; sparse or generic = 4-8.
    - **Strategy Coherence (0-20):** Logical consistency between detection, battle cards, and strategy; clear prioritization; actionable conversation sequence. Fully coherent = 16-20; contradictory or vague = 4-8.
    - **Evidence Quality (0-20):** Proportion of High confidence detections; source diversity; recency of sources. Mostly High + multiple sources = 16-20; mostly Low + single source = 2-6.
    - **Displacement Feasibility (0-20):** Realistic switching costs; identified triggers aligned with prospect context; viable timeline. Clear path with triggers = 16-20; high switching cost + no triggers = 2-6.
  - Compute `competitive_position_score = sum of 5 sub-dimensions`
  - If `invocation_mode = standalone`: assemble full COMPETITIVE-INTEL.md with all 9 output sections (Executive Summary, Current Solutions Detected, Battle Cards, Feature Gap Analysis, Win/Loss Patterns, Competitive Positioning Statements, Switching Cost Assessment, Recommended Strategy, Detection Sources)
  - If `invocation_mode = subagent`: return structured data block with Competitive Position Score, sub-dimension breakdown, top competitors, key strategy points
  - Append refresh recommendation: "Refresh every 3-6 months or before major competitive deal"
  - Note detection source dates throughout
- **Egress:** COMPETITIVE-INTEL.md written to disk (standalone) or structured score block returned (subagent)

**Go/No-Go:** Output is always produced. Clearly note all data gaps and confidence limitations.

---

## Rules

1. **Never** fabricate competitor capabilities. If a feature, price, or capability cannot be verified, label it as "Reported" or "Unverified." Sales credibility depends on accuracy.
2. **Never** omit competitor strengths from a battle card. Every battle card must include genuine strengths. One-sided portrayals destroy credibility the moment the prospect pushes back.
3. **Never** recommend bashing competitors. Battle cards position and differentiate. Negative selling backfires.
4. **Never** use generic assessments. "Better support" is useless. "Dedicated AM for all plans, 2-hour avg response vs their 24-hour SLA" is actionable. Specific over generic always.
5. **Never** skip confidence labeling on detected technologies. High/Medium/Low must accompany every detection. A badge on the website carries different weight than an industry-norm inference.
6. **Never** underestimate or overestimate switching costs. Underestimating looks naive. Overestimating makes the deal feel impossible. Accuracy matters.
7. **Never** ignore prior analysis files when present. If PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, or LEAD-QUALIFICATION.md exist, incorporate their findings into competitive positioning.
8. **Never** write transparent trap questions. Landmine questions must be genuinely curious questions any smart buyer would ask, not obvious traps designed to embarrass the competitor.
9. **Never** omit refresh recommendation date. Competitive intelligence has a shelf life. Note source dates and recommend refresh timeline.
10. **Never** present one-sided feature comparisons. Include features where you win AND where you lose. Credibility requires showing both.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Orchestrator | `skills/sales-prospect/SKILL.md` |
| Company research skill | `skills/sales-research/SKILL.md` |
| Qualification skill | `skills/sales-qualify/SKILL.md` |
| Contacts skill | `skills/sales-contacts/SKILL.md` |
| Prior analysis files | `PROSPECT-ANALYSIS.md`, `COMPANY-RESEARCH.md`, `LEAD-QUALIFICATION.md` (working directory, optional) |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
