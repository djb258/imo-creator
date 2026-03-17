---
name: sales-report
description: >
  Sales Pipeline Report Generator — scans the working directory for prospect
  analysis files and compiles them into a unified, executive-ready pipeline
  report (SALES-REPORT.md). Synthesizes scores, classifies pipeline stages,
  computes health metrics, and produces prioritized action items.
  Industry-agnostic engine.
weight: 1.00
tier: master
---

# Sales Pipeline Report Generator

## Tier 0 Doctrine

- **Tier:** Master (standalone — no subagents, no orchestrator dependency)
- **Authority:** Owns the pipeline report structure, grade bands, methodology weights, health rating thresholds, and all report sections. Prospect data is consumed read-only.
- **Determinism first:** All scoring uses declared weights. Grade bands, health ratings, and stage classifications are mechanical lookups. No LLM interpretation of scores or pipeline health.
- **No fabrication:** Every data point must originate from a prospect file on disk. Absence is marked "N/A," never invented.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | Working directory path (schema validation only: must be readable directory; reject if inaccessible) |
| **Middle** | Glob scan for prospect files; data extraction per prospect; pipeline stage classification; score distribution computation; health metric aggregation; prospect ranking; 8-section report assembly; empty-pipeline handling |
| **Egress** | SALES-REPORT.md + terminal summary (read-only structured output) |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Invocation | `/sales report` | Skill registry |
| Input | None (scans current working directory) | Skill contract |
| Output file | `SALES-REPORT.md` | Skill contract |
| Prospect file: primary analysis | `PROSPECT-ANALYSIS.md` | File discovery spec |
| Prospect file: company research | `COMPANY-RESEARCH.md` | File discovery spec |
| Prospect file: lead qualification | `LEAD-QUALIFICATION.md` | File discovery spec |
| Prospect file: decision makers | `DECISION-MAKERS.md` | File discovery spec |
| Prospect file: outreach sequence | `OUTREACH-SEQUENCE.md` | File discovery spec |
| Alt pattern: prospect analysis | `*-prospect-analysis.md` | File discovery spec |
| Alt pattern: company research | `*-company-research.md` | File discovery spec |
| Pipeline stage: New | URL identified, no analysis files | Stage classification table |
| Pipeline stage: Researched | COMPANY-RESEARCH.md exists | Stage classification table |
| Pipeline stage: Qualified | PROSPECT-ANALYSIS.md exists with score | Stage classification table |
| Pipeline stage: Contacted | OUTREACH-SEQUENCE.md exists | Stage classification table |
| Pipeline stage: Meeting | Meeting reference in any file | Stage classification table |
| Pipeline stage: Proposal | Proposal reference in any file | Stage classification table |
| Pipeline stage: Negotiation | Negotiation reference in any file | Stage classification table |
| Pipeline stage: Closed Won | Closed-won reference in any file | Stage classification table |
| Pipeline stage: Closed Lost | Closed-lost reference in any file | Stage classification table |
| Grade A+ | 90-100 | Grade band table |
| Grade A | 75-89 | Grade band table |
| Grade B | 60-74 | Grade band table |
| Grade C | 40-59 | Grade band table |
| Grade D | 0-39 | Grade band table |
| Weight: Company Fit | 0.25 | Methodology spec |
| Weight: Contact Access | 0.20 | Methodology spec |
| Weight: Opportunity Quality | 0.20 | Methodology spec |
| Weight: Competitive Position | 0.15 | Methodology spec |
| Weight: Outreach Readiness | 0.20 | Methodology spec |
| Component scores | Company Fit, Contact Access, Opportunity Quality, Competitive Position, Outreach Readiness | Methodology spec |
| Report sections | 8: Executive Summary, Pipeline Dashboard, Score Distribution, Top 5 Prospects, Action Items, Outreach Status, Pipeline Health Metrics, Weekly Focus | Report structure |
| Executive Summary length | 3-5 paragraphs | Report structure |
| Dashboard sort order | Score descending (highest first) | Report structure |
| Top Prospects shown | 5 (or all if fewer than 5) | Report structure |
| Action item timeframes | Immediate (This Week), Short-Term (Next 2 Weeks), Pipeline Building | Report structure |
| Weekly focus count | Top 3 prospects | Report structure |
| Weekly focus: Priority 1 breakdown | Mon-Tue / Wed-Thu / Fri | Report structure |
| Weekly focus criteria | 1) Highest uncontacted score, 2) Time-sensitive trigger, 3) One-action-from-advancing | Report structure |
| Health rating: Excellent | All metrics above target | Health rating table |
| Health rating: Good | Most metrics above target | Health rating table |
| Health rating: Needs Attention | Multiple metrics below target | Health rating table |
| Health rating: Critical | Majority metrics below target | Health rating table |
| Health metrics | Total Prospects, Average Score, A-Grade count/%, Pipeline Coverage ratio, Avg Component Spread, Highest Score, Lowest Score, Score Std Deviation | Health dashboard spec |
| Report length target | 250-350 lines of substantive content | Quality standard |
| Empty pipeline handling | Pipeline Empty notice + getting started instructions + example workflow | Empty pipeline spec |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `prospect_files[]` | Glob scan of working directory | Per-run |
| `prospect_data[]` | Extracted per prospect: name, url, score, grade, component scores, stage, pain points, contacts, next action, outreach status, est. value | Per-run |
| `pipeline_stage` | Classified per prospect from file presence via stage classification table | Per-run |
| `score_distribution` | Computed grade band counts and percentages | Per-run |
| `pipeline_health_metrics` | Computed aggregates: total, average, A-grade count/%, coverage, spread, high, low, std dev | Per-run |
| `health_rating` | Derived from metrics via health rating table | Per-run |
| `action_items[]` | Prioritized list partitioned by timeframe | Per-run |
| `weekly_focus[]` | Top 3 prospects selected by focus criteria | Per-run |
| `report_date` | System date at invocation | Per-run |
| `total_prospects` | Count of discovered prospect files | Per-run |
| `average_score` | Mean of all prospect scores | Per-run |
| `outreach_status[]` | Per-prospect: sequence created, type, first touch, status, response | Per-run |
| `top_prospects[]` | Top 5 (or fewer) ranked by score descending | Per-run |

---

## Workflow

### BLOCK 1: File Discovery & Data Extraction

**Governed by: C&V**

**Constants:** Prospect file names (5 types), alternative file patterns (2), pipeline stage classification table (9 stages), component score names (5).

**Variables:** `prospect_files[]`, `prospect_data[]`, `pipeline_stage`, `total_prospects`.

**Ingress:** Receive working directory path. Validate: directory exists and is readable. Reject immediately if inaccessible.

**Middle:**

1. **Glob scan** working directory and immediate subdirectories for all 5 prospect file types: `**/PROSPECT-ANALYSIS.md`, `**/COMPANY-RESEARCH.md`, `**/LEAD-QUALIFICATION.md`, `**/DECISION-MAKERS.md`, `**/OUTREACH-SEQUENCE.md`. Also scan for alternative patterns: `*-prospect-analysis.md`, `*-company-research.md`.
2. **Group files by prospect** using parent directory as prospect key.
3. **Handle empty pipeline:** If zero prospect files found, write SALES-REPORT.md with Pipeline Empty notice, getting started instructions (`/sales prospect <url>`, `/sales icp`), example workflow, and exit. No further blocks execute.
4. **Extract data from each prospect file:** company name (from heading), website/URL (from metadata), overall score (0-100), grade (from grade band table), 5 component scores, key pain points (top 2-3), decision makers (names and titles), recommended next action, outreach status (OUTREACH-SEQUENCE.md presence), estimated deal value (if present).
5. **Mark missing data** as "N/A" -- never guess or fabricate.
6. **Classify pipeline stage** per prospect by checking which files exist against the stage classification table. Assign highest applicable stage.
7. **Handle malformed files:** If a prospect file is malformed or missing key data, include the prospect with missing-data annotation rather than excluding it.

**Egress:** `prospect_files[]`, `prospect_data[]` (one entry per prospect with all extracted fields), `total_prospects`.

**Go/No-Go:** At least one prospect file must be found (empty pipeline is handled inline, not as failure). All discovered prospects must appear in `prospect_data[]` -- no silent exclusion.

---

### BLOCK 2: Pipeline Analysis & Classification

**Governed by: IMO**

**Constants:** Grade band table (5 bands), methodology weights (5), health rating thresholds (4 levels), health metrics list (8 metrics).

**Variables:** `prospect_data[]`, `score_distribution`, `pipeline_health_metrics`, `health_rating`, `average_score`, `top_prospects[]`, `weekly_focus[]`, `action_items[]`.

**Ingress:** Receive `prospect_data[]` from BLOCK 1. Validate: each prospect has at minimum a name and a score (or "N/A" annotation).

**Middle:**

1. **Compute score distribution** by counting prospects in each grade band (A+ 90-100, A 75-89, B 60-74, C 40-59, D 0-39). Calculate percentage of pipeline per band and average score per band.
2. **Compute pipeline health metrics:**
   - Total Prospects: count.
   - Average Score: mean of all prospect scores.
   - A-Grade Prospects: count and percentage scoring 75+.
   - Pipeline Coverage: ratio of total prospects to target (assess if healthy or needs more).
   - Avg Component Spread: average range between highest and lowest component score per prospect.
   - Highest Score: max score with company name.
   - Lowest Score: min score with company name.
   - Score Std Deviation: standard deviation of all scores.
3. **Derive health rating** from metrics via health rating table: Excellent, Good, Needs Attention, or Critical.
4. **Rank prospects** by score descending. Select top 5 (or all if fewer than 5) for detailed snapshots.
5. **Select weekly focus** top 3 using criteria: (1) highest score not yet contacted, (2) prospect with time-sensitive trigger event, (3) prospect where one action could advance the stage.
6. **Generate action items** partitioned into three timeframes: Immediate (This Week) -- urgent actions tied to specific companies; Short-Term (Next 2 Weeks) -- follow-up sequences and deeper research; Pipeline Building -- actions to strengthen weak areas. Every action must be company-specific and executable (not generic).

**Egress:** `score_distribution`, `pipeline_health_metrics`, `health_rating`, `average_score`, `top_prospects[]`, `weekly_focus[]`, `action_items[]`.

**Go/No-Go:** Score distribution must account for 100% of prospects. Health metrics must all be computable. Every prospect must be ranked -- no omissions.

---

### BLOCK 3: Report Compilation

**Governed by: Circle**

**Constants:** 8 report sections (in order), Executive Summary length (3-5 paragraphs), dashboard sort order (score descending), report length target (250-350 lines), weekly focus Priority 1 daily breakdown (Mon-Tue / Wed-Thu / Fri).

**Variables:** All variables from BLOCKs 1-2 assembled into 8 report sections.

**Ingress:** Receive all computed values: `prospect_data[]`, `score_distribution`, `pipeline_health_metrics`, `health_rating`, `top_prospects[]`, `action_items[]`, `weekly_focus[]`, `outreach_status[]`, `report_date`. Validate: all 8 sections have sufficient data to render (partial data is acceptable with annotation).

**Middle:**

Assemble SALES-REPORT.md content in exact section order:

1. **Executive Summary** (3-5 paragraphs): Total prospect count, score distribution overview, top opportunity highlight (highest-scoring prospect and why), biggest risk or gap, one-sentence recommendation for immediate focus.
2. **Pipeline Dashboard**: Full prospect table sorted by score descending with columns: #, Company, Score, Grade, Stage, Key Pain Point, Next Action, Est. Value. Include ALL prospects -- no omissions.
3. **Score Distribution**: Grade band table with columns: Grade, Count, % of Pipeline, Avg Score, Prospects. Add commentary on distribution health -- top-heavy vs. bottom-heavy, ideal vs. current, improvement actions.
4. **Top 5 Prospects** (detailed snapshots per prospect): Why they score well (2-3 sentences), component score table (5 dimensions with score and one-line assessment), key contacts, primary pain point, recommended approach, risk factors.
5. **Action Items**: Three timeframes (Immediate / Short-Term / Pipeline Building). Each item: company name, specific action, urgency rationale. Specific enough to execute -- not "follow up" but "send personalized email to [Name] referencing [topic]."
6. **Outreach Status**: Tracking table with columns: Company, Outreach Created, Sequence Type, First Touch, Status, Response. Guidance on which prospects need sequences, which are ready to execute, recommended outreach order.
7. **Pipeline Health Metrics**: Dashboard table (8 metrics with value and assessment) + Pipeline Health Assessment paragraph: overall rating, key strengths, key gaps, specific recommendations.
8. **Weekly Focus**: Top 3 prospects with actions. Priority 1: why focus now, Mon-Tue actions, Wed-Thu actions, Fri review. Priority 2-3: why focus now, key action.

Append Methodology footer: 5 component weights with descriptions. Report generation attribution.

**Egress:** Complete SALES-REPORT.md content string validated against 8-section structure. Length within 250-350 lines of substantive content.

**Go/No-Go:** All 8 sections must be present. Dashboard must include every prospect. No section may be empty (use "No data available" annotation if source data is insufficient). Report length within target range.

---

### BLOCK 4: Output Assembly & Delivery

**Governed by: CTB**

**Constants:** Output file name (`SALES-REPORT.md`), report header format (title, generated date, prospect count, average score).

**Variables:** Complete report content from BLOCK 3, `report_date`, `total_prospects`, `average_score`, `health_rating`.

**Ingress:** Receive final report content from BLOCK 3. Validate: content is non-empty and contains all 8 section headers.

**Middle:**

1. **Write SALES-REPORT.md** to current working directory using Write tool. Header format:
   ```
   # Sales Pipeline Report
   > Generated on [date] | Prospects Analyzed: [count] | Average Score: [X]/100
   ```
2. **Verify completeness:** Confirm file was written, all 8 sections present, no truncation.
3. **Report summary to user** in terminal: total prospects, average score, health rating, top prospect name and score, single most important next action. Confirm file location.
4. **Handle large pipelines:** If more than 20 prospects, include all but note that segmentation (by stage, grade, or industry) would improve focus.

**Egress:** SALES-REPORT.md written to disk. Terminal summary displayed. No further mutations.

**Go/No-Go:** File must be writable. If write fails, display full report in terminal as fallback. Terminal summary must render without error.

---

## Rules

1. Never write the report before reading ALL prospect files -- full scan must complete before any output.
2. Never exclude a prospect -- every prospect found must appear in the Pipeline Dashboard.
3. Never fabricate scores, contacts, pain points, or any data -- use only what exists in prospect files; mark absence as "N/A."
4. Never sugarcoat a weak pipeline -- if the pipeline is full of C-grade prospects, say so with honest assessment.
5. Never write generic action items -- every action must name a specific company and be executable without further research.
6. Never sort tables by anything other than score descending (highest first).
7. Never silently drop malformed prospect files -- include them with missing-data annotation.
8. Never exceed 350 lines or fall below 250 lines of substantive report content.
9. Never use LLM judgment to override grade band assignment, health rating, or stage classification -- all are mechanical lookups.
10. Never modify methodology weights at runtime -- weights are Constants.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Prospect analysis skill | `skills/sales-prospect/SKILL.md` |
| Company research skill | `skills/sales-research/SKILL.md` |
| Contact intelligence skill | `skills/sales-contacts/SKILL.md` |
| Lead qualification skill | `skills/sales-qualify/SKILL.md` |
| Outreach strategy skill | `skills/sales-outreach/SKILL.md` |
| Competitive intelligence skill | `skills/sales-competitors/SKILL.md` |
| Architecture doctrine | `templates/doctrine/ARCHITECTURE.md` |
| Tool doctrine | `templates/integrations/TOOLS.md` |
