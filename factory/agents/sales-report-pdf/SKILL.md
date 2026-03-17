---
name: sales-report-pdf
description: >
  Professional Sales Report PDF Generator — reads SALES-REPORT.md and prospect files from the
  current directory, assembles a structured JSON payload, and invokes a Python/reportlab script
  to produce a polished, multi-section PDF (cover page, score charts, comparison table, top
  prospects detail, action plan, methodology). Generic engine: PDF layout, sections, color
  scheme, and JSON schema are constants. Company names, scores, and prospect data are variables.
weight: 1.00
tier: master
---

# Professional Sales Report PDF Generator

## Tier 0 Doctrine

- **Tier:** Master (standalone skill; depends on `/sales report` output for SALES-REPORT.md input)
- **Authority:** Invoked via `/sales report-pdf`; reads SALES-REPORT.md + prospect files from current directory; produces dated PDF
- **Determinism first:** PDF layout, section structure, color scheme, page spec, and JSON schema are locked constants. The Python script renders deterministically from JSON input. No LLM interpretation of layout or scores.
- **No fabrication:** Every data point in the PDF originates from SALES-REPORT.md or prospect files. Missing fields are marked "N/A", never invented. Scores pass through unmodified.

---

## IMO (Top-Level)

| Layer | Responsibility |
|-------|---------------|
| **Ingress** | SALES-REPORT.md existence check, Python 3 availability, reportlab presence, script path resolution (schema validation only) |
| **Middle** | Parse SALES-REPORT.md + prospect files; extract pipeline data, prospect data, actions, health metrics; assemble _pdf_input.json; invoke Python script; verify output |
| **Egress** | SALES-REPORT-{YYYY-MM-DD}.pdf written to disk; file path, size, page count reported to user — read-only structured output |

---

## Constants

| Constant | Value | Authority |
|----------|-------|-----------|
| Invocation | `/sales report-pdf` | Locked |
| Input Source | SALES-REPORT.md + prospect files in current directory | Fixed |
| Output File Pattern | `SALES-REPORT-{YYYY-MM-DD}.pdf` | Fixed |
| Temp File | `_pdf_input.json` (cleaned on success, kept on failure) | Fixed |
| Dependencies | Python 3, `reportlab` library, `scripts/generate_pdf_report.py` | Fixed |
| PDF Sections (6) | 1. Cover Page, 2. Score Breakdown, 3. Prospect Comparison Table, 4. Top Prospects Detail, 5. Action Plan, 6. Methodology | Fixed; 6 sections |
| Section 1: Cover Page | Title, date, gauge 0-100, health rating, quick stats (total prospects, avg score, top grade count) | Fixed |
| Section 2: Score Breakdown | Horizontal bar chart by grade band, color-coded, each bar labeled with count + percentage | Fixed |
| Section 3: Comparison Table | Full prospect table with alternating row colors, grade column color-coded, sorted by score descending | Fixed |
| Section 4: Top Prospects | Component score chart per prospect, key contacts, pain points, risks (top 5) | Fixed |
| Section 5: Action Plan | Numbered list grouped by timeframe: Immediate, Short-Term, Pipeline Building | Fixed |
| Section 6: Methodology | Scoring explanation, weight percentages, grade band definitions, disclaimer | Fixed |
| Color Scheme: Grades | A+ = dark green, A = green, B = blue, C = orange, D = red | Fixed |
| Color Scheme: Theme | Professional blues and grays with color-coded score indicators | Fixed |
| Page Size | Letter (8.5" x 11") | Fixed |
| Orientation | Portrait; landscape for wide tables if needed | Fixed |
| Font | Helvetica or similar sans-serif | Fixed |
| Margins | 0.75 inch all sides | Fixed |
| Expected Length | 4-8 pages | Fixed |
| Script Search Order | 1. ai-sales-team-claude project dir, 2. current working dir, 3. one level up | Fixed; 3-step |
| JSON Root Schema | `title`, `date`, `overall_pipeline_score`, `health_rating`, `total_prospects`, `prospects[]`, `top_prospects[]`, `action_items[]`, `pipeline_health{}`, `score_distribution{}`, `weekly_focus[]`, `methodology{}` | Fixed |
| Prospect JSON Schema | `name`, `url`, `score`, `grade`, `stage`, `next_action`, `est_value`, `component_scores{}`, `key_pain_point`, `key_contact`, `risk_factors` | Fixed |
| Component Score Keys | `company_fit`, `contact_access`, `opportunity_quality`, `competitive_position`, `outreach_readiness` | Fixed; 5 keys |
| Methodology Weights | company_fit 25%, contact_access 20%, opportunity_quality 20%, competitive_position 15%, outreach_readiness 20% | Fixed |
| Action Item Schema | `priority`, `company`, `action`, `urgency`, `reason` | Fixed |
| Score Distribution Schema | Per grade band: `count`, `pct`, `prospects[]` | Fixed |
| Weekly Focus Schema | `rank`, `company`, `score`, `reason`, `actions[]` | Fixed |

---

## Variables

| Variable | Source | Runtime |
|----------|--------|---------|
| `report_source` | SALES-REPORT.md file content | Per-run |
| `prospect_files` | Glob scan for PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, etc. | Discovered |
| `report_date` | System date at invocation | Per-run |
| `pipeline_data` | Extracted pipeline overview from report | Computed |
| `prospect_data[]` | Per-prospect structured data extracted from report + files | Computed |
| `top_prospects_data` | Top 5 prospects with full detail | Computed |
| `action_items` | Prioritized action list from report | Computed |
| `pipeline_health` | Health metrics (totals, averages, grade counts, score range) | Computed |
| `score_distribution` | Grade band breakdown with counts, percentages, prospect lists | Computed |
| `json_input` | Assembled _pdf_input.json content | Computed |
| `pdf_output_path` | Final PDF file path (SALES-REPORT-{date}.pdf) | Computed |
| `python3_available` | Boolean: Python 3 accessible on PATH | Discovered |
| `reportlab_available` | Boolean: reportlab importable | Discovered |
| `script_path` | Resolved location of generate_pdf_report.py | Discovered |

---

## Workflow

### BLOCK 1: Prerequisite Verification
**Governed by: C&V**

**Constants:** Input source (SALES-REPORT.md), dependencies (Python 3, reportlab, script), script search order (3-step)
**Variables:** `report_source`, `python3_available`, `reportlab_available`, `script_path`

**IMO:**
- **Ingress:** Check current directory for SALES-REPORT.md existence; validate file is non-empty
- **Middle:**
  - If SALES-REPORT.md does not exist: inform user "No SALES-REPORT.md found. Run `/sales report` first to generate the pipeline report, then run `/sales report-pdf` to create the PDF version." — halt
  - If SALES-REPORT.md exists: read contents into `report_source`; scan for additional prospect files (PROSPECT-ANALYSIS.md, COMPANY-RESEARCH.md, etc.) via Glob
  - Check Python 3 availability: `python3 --version` — if unavailable, inform user "Python 3 is required for PDF generation. Please install Python 3 and then run: `pip install reportlab`" — halt
  - Check reportlab: `python3 -c "import reportlab; print(reportlab.Version)"` — if not installed, inform user and offer to run `pip install reportlab`; after install, continue
  - Locate script: search 3-step order (ai-sales-team-claude project dir, current working dir, one level up) for `scripts/generate_pdf_report.py` — if not found, inform user "The PDF generation script was not found at `scripts/generate_pdf_report.py`. Please ensure the project is properly installed." — halt
- **Egress:** Confirmed: `report_source` loaded, `python3_available` = true, `reportlab_available` = true, `script_path` resolved

**Go/No-Go:** All four prerequisites must pass. Any single failure halts with a specific error message. No partial execution.

---

### BLOCK 2: Data Extraction & JSON Assembly
**Governed by: IMO**

**Constants:** JSON root schema, prospect JSON schema, component score keys, action item schema, score distribution schema, weekly focus schema, methodology weights
**Variables:** `pipeline_data`, `prospect_data[]`, `top_prospects_data`, `action_items`, `pipeline_health`, `score_distribution`, `json_input`, `report_date`

**IMO:**
- **Ingress:** `report_source` content + any discovered prospect files from Block 1
- **Middle:**
  - Set `report_date` from system date
  - Parse SALES-REPORT.md to extract:
    - Pipeline overview: total prospects, average score, overall health rating
    - Per-prospect data: name, url, score, grade, stage, next_action, est_value, component_scores (5 keys), key_pain_point, key_contact, risk_factors — missing fields default to "N/A"
    - Top 5 prospects with full component score breakdown, contacts, pain points, approach, risks
    - Action items: priority, company, action, urgency, reason — grouped by timeframe
    - Pipeline health metrics: total, average, grade counts + percentages, highest/lowest scores, health rating
    - Score distribution: per grade band (A+, A, B, C, D) with count, percentage, prospect names
    - Weekly focus: ranked prospects with score, reason, actions list
  - Enrich prospect data from any additional prospect files found in Block 1
  - Assemble methodology block from constant weights
  - Build complete JSON object matching root schema
  - Validate JSON is well-formed before writing
  - Write `_pdf_input.json` to current working directory
- **Egress:** `_pdf_input.json` file on disk; `json_input` validated

**Go/No-Go:** JSON must be valid and match root schema. If SALES-REPORT.md parsing yields zero prospects, include an empty prospects array and note in pipeline_health. Proceed unconditionally — partial data is acceptable with "N/A" markers.

---

### BLOCK 3: PDF Generation & Validation
**Governed by: Circle**

**Constants:** PDF sections (6), page size, orientation, font, margins, expected length, color scheme (grades + theme), script command pattern
**Variables:** `pdf_output_path`, `script_path`, `report_date`

**IMO:**
- **Ingress:** `_pdf_input.json` on disk + resolved `script_path` from Block 1
- **Middle:**
  - Compute output filename: `SALES-REPORT-{YYYY-MM-DD}.pdf` using `report_date`
  - Execute: `python3 {script_path} _pdf_input.json "SALES-REPORT-{date}.pdf"`
  - Capture stdout and stderr from script execution
  - If script exits non-zero: capture full error output, check for common issues (invalid JSON, file permissions, disk space, reportlab version incompatibility), report specific error with suggested fix — do NOT delete _pdf_input.json — halt
  - If script exits zero: verify PDF file exists at expected path
  - Check file size > 0 bytes
  - Check page count is within expected range (4-8 pages nominal; warn if outside but do not fail)
- **Egress:** `pdf_output_path` confirmed on disk; file size and page count recorded

**Go/No-Go:** PDF file must exist and have size > 0. Script non-zero exit halts pipeline. Page count outside 4-8 range triggers warning but does not block.

---

### BLOCK 4: Cleanup & Delivery
**Governed by: CTB**

**Constants:** Temp file (_pdf_input.json), cleanup rule (delete on success, keep on failure)
**Variables:** `pdf_output_path`, `json_input`

**IMO:**
- **Ingress:** PDF generation status from Block 3 (success or failure)
- **Middle:**
  - If Block 3 succeeded:
    - Delete `_pdf_input.json` from current directory
    - Compute final file size (human-readable: KB or MB)
    - Read page count from PDF metadata if available
  - If Block 3 failed:
    - Keep `_pdf_input.json` intact for debugging
    - Report failure details from Block 3 error capture
- **Egress:** Report to user: PDF file name, location, file size, page count, brief summary of contents

**Go/No-Go:** Always produces output — either success report (file path + size + pages) or failure report (error details + preserved _pdf_input.json path for debugging).

---

## Rules

1. **Never** generate a PDF without SALES-REPORT.md present in the current directory — direct user to run `/sales report` first.
2. **Never** run the PDF script without checking for reportlab — provide install instructions (`pip install reportlab`) if missing.
3. **Never** delete `_pdf_input.json` on failure — keep for debugging.
4. **Never** modify the original SALES-REPORT.md during PDF generation.
5. **Never** generate a PDF from scratch without the markdown report — the report is the single source of truth.
6. **Never** fail silently — provide full error output from the Python script for debugging.
7. **Never** skip file size and page count verification after generation.
8. **Never** omit incomplete prospect data — mark missing fields as "N/A" rather than failing or fabricating.

---

## Reference Pointers

| Reference | Location |
|-----------|----------|
| Report generator skill | `skills/sales-report/SKILL.md` |
| Prospect orchestrator | `skills/sales-prospect/SKILL.md` |
| PDF generation script | `scripts/generate_pdf_report.py` |
| Doctrine | `templates/doctrine/ARCHITECTURE.md` (IMO, Hub-Spoke, CTB) |
| Skill creation rules | `skills/skill-creator/SKILL.md` |
