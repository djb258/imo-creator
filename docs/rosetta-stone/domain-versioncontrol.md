# Rosetta Stone — Domain 8: Version Control

## Layer 0 Reference: docs/LAYER0_DOCTRINE.md

---

## Gate 1 (50,000 ft) — What IS version control?

**Candidate Constant:** Tracking changes to a body of work over time with the ability to recall any previous state.

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Regardless of what work is tracked, the system records changes and enables recall. |
| CTB | PASS | From monastic scriptoriums to Git — the definition holds at every level. |
| Circle | PASS | Bad change merged → revert to prior state → verify → continue. The loop closes. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 2 (45,000 ft) — Universal Components

**12 Root Concepts extracted and validated:**

| # | Constant | Definition | IMO | CTB | Circle | Verdict |
|---|----------|-----------|-----|-----|--------|---------|
| 1 | Repository | A container that holds the full history of a body of work | PASS | PASS | PASS | LOCKED |
| 2 | Commit | A snapshot of the work at a specific point in time | PASS | PASS | PASS | LOCKED |
| 3 | Branch | An independent line of development diverged from the main line | PASS | PASS | PASS | LOCKED |
| 4 | Merge | Combining changes from one branch into another | PASS | PASS | PASS | LOCKED |
| 5 | Conflict | Two changes that cannot be automatically combined | PASS | PASS | PASS | LOCKED |
| 6 | Diff | The specific differences between two states | PASS | PASS | PASS | LOCKED |
| 7 | Rollback | Reverting to a previous state | PASS | PASS | PASS | LOCKED |
| 8 | History | The ordered sequence of all changes | PASS | PASS | PASS | LOCKED |
| 9 | Tag | A named pointer to a specific snapshot (immutable) | PASS | PASS | PASS | LOCKED |
| 10 | Pull Request | A formal proposal to merge changes with review | PASS | PASS | PASS | LOCKED |
| 11 | Fork | A complete copy of a repository under separate ownership | PASS | PASS | PASS | LOCKED |
| 12 | Clone | A local copy of a repository with full history | PASS | PASS | PASS | LOCKED |

**Back-propagation check:** Clean.

---

## Gate 3 (40,000 ft) — Process Constant (IMO)

Every version control operation follows IMO:
- **Input:** Change made to the work (edit, add, delete)
- **Middle:** System captures, stores, compares, and manages the change
- **Output:** Change recorded with ability to recall, compare, or revert

**Verdict:** CONSTANT_LOCKED

---

## Gate 4 (35,000 ft) — Organization Constant (CTB)

Every version control system organizes as CTB:
- **Trunk:** The repository (the complete history)
- **Branches:** Individual branches (lines of work)
- **Leaves:** Commits (individual snapshots) → files → changes within files

**Verdict:** CONSTANT_LOCKED

---

## Gate 5 — Rosetta Stone Matrix

| Root Concept | Git | SVN | Monastic Scriptoriums | Legal Amendments | Engineering Revision Blocks |
|-------------|-----|-----|-----------------------|-----------------|---------------------------|
| Repository | `.git/` directory | SVN server repository | The library / scriptorium archive | The legal code (complete body of law) | The master drawing set |
| Commit | `git commit` (snapshot of staging) | `svn commit` (snapshot to server) | Completed copy of manuscript | Enacted amendment (dated, recorded) | Revision block stamped and signed |
| Branch | `git branch feature-x` | `svn copy trunk branches/x` | Separate scribe working on variant text | Proposed bill (separate from current law) | Engineering change order (separate drawing) |
| Merge | `git merge` | `svn merge` | Collating variant texts into master copy | Amendment adopted into statute | Revised drawing replaces prior revision |
| Conflict | Overlapping edits flagged | Overlapping edits flagged | Two scribes modified same passage differently | Contradictory amendments | Two engineers changed same dimension |
| Diff | `git diff` (line-by-line comparison) | `svn diff` | Comparison of manuscript variants (textual criticism) | Redline comparison of bill vs current law | Revision cloud / delta notes |
| Rollback | `git revert` / `git reset` | `svn merge -r HEAD:PREV` | Returning to earlier manuscript version | Repeal of amendment (restores prior version) | Reverting to prior revision |
| History | `git log` | `svn log` | Colophon (scribe, date, notes on each copy) | Legislative history / Hansard | Revision history block on drawing |
| Tag | `git tag v1.0.0` | `svn copy trunk tags/v1.0` | "Final fair copy" marking | Public Law number (P.L. 117-xxx) | "As-Built" stamp |
| Pull Request | GitHub/GitLab PR (review + approval → merge) | N/A (SVN is commit-directly) | Abbot reviews scribe's work before shelving | Committee review before floor vote | Review board approval before release |
| Fork | `git fork` (independent copy on GitHub) | N/A (centralized) | Monastery creates own variant tradition | Jurisdiction adopts model code with modifications | Licensee modifies design for local use |
| Clone | `git clone` (full local copy) | `svn checkout` (working copy) | Complete transcription for another library | Codification (organizing copy of current law) | Printing copies of drawing set |

---

## Gate 6 — Circle Validation (Feedback Patterns)

| Circle Pattern | Description | Universal? |
|---------------|-------------|------------|
| Fix Circle | Bug found in production → branch → fix → review → merge → deploy | YES — from Git hotfix to legal amendment process |
| Review Circle | Changes proposed → reviewed → feedback → revised → approved | YES — from PR review to monastic proofreading |
| Release Circle | Features accumulated → tagged → released → feedback gathered → next cycle | YES — from Git tags to legal codification cycle |
| Recovery Circle | Bad merge → rollback to prior state → investigate → re-apply selectively | YES — from git revert to repealing bad amendments |

**Verdict:** All four CONSTANT_LOCKED.

---

## Gate 7 — True Variables Isolated

| Variable | Why It's a Variable |
|----------|-------------------|
| Storage model | Distributed (Git) vs centralized (SVN) vs physical (manuscripts) |
| Diff algorithm | Myers diff vs patience diff vs manual comparison |
| Branching cost | Near-zero (Git pointer) vs full copy (SVN) vs full re-transcription |
| Collaboration model | Async PR-based vs lock-then-edit vs sequential access |
| Hosting platform | GitHub vs GitLab vs Bitbucket vs self-hosted vs physical archive |

**Variable count:** 5 — within tolerance.

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates | 7 |
| Constants locked | 12 root concepts + 3 structural + 4 circles = 19 |
| Variables isolated | 5 |
| Back-propagation events | 0 |
| Domain-agnostic check | PASS — constants hold from monastic scriptoriums to distributed Git |