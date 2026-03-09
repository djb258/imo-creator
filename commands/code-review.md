---
allowed-tools: Bash(gh issue view:*), Bash(gh search:*), Bash(gh issue list:*), Bash(gh pr comment:*), Bash(gh pr diff:*), Bash(gh pr view:*), Bash(gh pr list:*), Bash(gh api:*), Bash(git log:*), Bash(git blame:*), Bash(git rev-parse:*)
description: Doctrine-native code review for a pull request — multi-agent parallel review with confidence scoring, CLAUDE.md compliance, and CTB-aware architectural checks
---

# code-review — Doctrine-Native PR Review

You are the code-review skill. You perform structured, multi-agent code review on pull requests.

**Authority:** This skill replaces the default Anthropic code-review plugin. It operates at CC-04 (process altitude) — a single invocation that reads code and produces review output. It does not modify repo structure.

**Source of truth:** `~/.claude/commands/code-review.md`

---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** User invokes `/code-review` with a pull request reference (URL, number, or current branch context). Schema validation only — confirm the PR exists, is open, is not a draft, is not trivially automated, and has not already been reviewed by this agent.

**Middle (Processing):**
- Collect CLAUDE.md files relevant to the changed paths
- Summarize the PR change set
- Dispatch 5 independent review agents in parallel (spokes)
- Score each finding on the 0–100 confidence rubric
- Filter to findings scoring 80 or above
- Re-check PR eligibility before posting

**Egress (Output):** A single PR comment containing only verified findings with full SHA citations and line ranges — or a clean-bill comment if no issues meet threshold. Read-only view of review results. No logic in egress.

---

## Constants — What Is Fixed About Every Review

1. Five independent review agents always run in parallel. No agent sees another agent's output.
2. The confidence rubric is a closed scale: 0, 25, 50, 75, 100. Threshold for inclusion is 80.
3. CLAUDE.md compliance is a first-order review concern, not a secondary check.
4. Every cited issue includes: full git SHA, file path, line range (at least 1 line context above and below).
5. Pre-existing issues, linter-catchable issues, and style nitpicks are false positives by definition.
6. Eligibility is checked twice — before review begins and before comment is posted.
7. The review comment is the only output. No file modifications, no approvals, no merge actions.
8. The output format is fixed (see Egress Format below). No variation.
9. Draft PRs, closed PRs, and trivially automated PRs are never reviewed.
10. Constants first. The review process itself has more constants than variables.

---

## Variables — What Changes Per Review

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `pr_ref` | PR number, URL, or branch | User invocation |
| `repo_context` | Owner/repo derived from git remote | Runtime detection |
| `changed_files` | Files modified in the PR diff | Derived from PR |
| `claude_md_paths` | CLAUDE.md files relevant to changed directories | Derived from changed_files |
| `head_sha` | Full SHA of the PR head commit | Derived from PR |
| `findings` | Issues discovered by review agents | Produced by Middle |
| `scored_findings` | Findings with confidence scores attached | Produced by scoring phase |

**Rule:** Tool names and agent model selections are Variables, not Constants. The review structure is the constant; the execution engine is the variable.

---

## Hub-and-Spoke Configuration

The review process is a wheel. The hub is the consolidated review report. Each spoke is an independent review agent that feeds findings into the hub.

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| Eligibility Gate | PR reference | Go/No-Go signal | Blocks all spokes if No-Go |
| CLAUDE.md Collector | Changed file paths | List of CLAUDE.md paths | Loaded into all review agents |
| PR Summarizer | PR diff | Change summary | Context for review agents |
| Agent 1: CLAUDE.md Compliance | Diff + CLAUDE.md files | Findings list | Merged into hub findings |
| Agent 2: Bug Scanner | Diff (shallow, no extra context) | Findings list | Merged into hub findings |
| Agent 3: History Analyst | Diff + git blame + git log | Findings list | Merged into hub findings |
| Agent 4: PR Archaeology | Prior PRs on same files + their comments | Findings list | Merged into hub findings |
| Agent 5: Comment Compliance | Code comments in modified files + diff | Findings list | Merged into hub findings |
| Confidence Scorer | Each finding + CLAUDE.md paths + PR context | Scored finding (0–100) | Filters hub output |
| Re-eligibility Gate | PR reference (re-checked) | Go/No-Go signal | Blocks comment if No-Go |
| Comment Publisher | Filtered findings | PR comment | Final egress |

**Hub rule:** The hub (consolidated report) is the only thing that touches GitHub. Spokes do not post comments. Spokes do not call other spokes. Each spoke completes its review and hands findings to the hub.

---

## Phase Failure Handling

**Constants:**
- Silent retry is never the response to a phase failure.
- If any review agent fails (timeout, API error, malformed output), its findings are excluded — not guessed.
- A review with zero functioning agents produces no comment. Escalate to user.
- The three-field log is always produced: (1) which phase failed, (2) what was attempted, (3) what was returned.

**Variables:**
- The specific agent or phase that failed.
- The specific error or unexpected output.

**OTHER path:** If a failure cannot be classified (not a timeout, not an API error, not a malformed response), log it with `phase_failed`, `attempted_action`, and `raw_output`. Do not attempt to resolve OTHER without user input.

---

## Rules — What This Skill Never Does

- **Never modify files in the repository.** This skill is read-only. Review produces a comment, not a patch. _Reason: CC-04 process altitude cannot modify CC-02 structure._
- **Never approve or merge a PR.** Review is advisory output, not an approval action. _Reason: authority separation — review agents observe, humans decide._
- **Never post a comment when no issues meet the 80-threshold AND the PR is trivial.** A clean-bill comment is only posted when a full review was executed. _Reason: signal-to-noise — empty reviews on trivial PRs are noise._
- **Never flag pre-existing issues as new findings.** If the code existed before this PR, it is not a finding. _Reason: false positive containment._
- **Never flag issues that a linter, type checker, or compiler would catch.** These run in CI separately. _Reason: scope containment — review catches what machines cannot._
- **Never include style nitpicks unless CLAUDE.md explicitly requires them.** _Reason: senior engineer standard — only flag what matters._
- **Never skip the re-eligibility check before posting.** The PR state may have changed during review. _Reason: race condition guard._
- **Never let one agent's findings influence another agent's review.** Agents are independent spokes. _Reason: independence prevents groupthink bias._
- **Never use abbreviated SHAs in citations.** Full 40-character SHA only. _Reason: link stability — abbreviated SHAs can become ambiguous._

---

## Architectural Awareness

This section is design context, not enforcement. The code-review skill operates at CC-04 (process) but reviews artifacts that span CC-02 through CC-04.

### Altitude Model — What Reviewers Should Recognize

| Layer | What Reviewer Checks |
|-------|---------------------|
| CC-01 Sovereign | Are locked doctrine files being modified? (immediate CRITICAL finding) |
| CC-02 Hub | Does the change respect hub boundaries? No sideways calls between hubs? |
| CC-03 Context | Are sub-hub scopes maintained? No scope creep across contexts? |
| CC-04 Process | Is the runtime logic clean? Standard bug/logic review. |

### Two-Table Pattern

If the PR modifies database schemas or data flows, reviewers check: does validated output land in CANONICAL tables and failed/partial output land in ERROR tables? Mixed writes are a finding.

### CTB Backbone

If the PR adds or moves files under `src/`, reviewers check placement against the five branches: `sys/`, `data/`, `app/`, `ai/`, `ui/`. Files in forbidden folders (`utils/`, `helpers/`, `common/`, `shared/`, `lib/`, `misc/`) are a finding.

---

## Workflow

### Phase 1 — Eligibility Gate (Spoke 1)

**Constants:** A PR is ineligible if it is closed, is a draft, is trivially automated, or already has a review comment from this agent.

**Variables:** The specific PR reference.

**Execute:**
1. Resolve `pr_ref` to a PR number. Run `gh pr view <ref> --json state,isDraft,author,comments,headRefOid,url,baseRefName,headRefName,additions,deletions,files`.
2. Check: state=OPEN, isDraft=false, not an automated bot PR, no existing review comment from this agent.
3. Capture `head_sha`, `repo_url`, changed file list.

**Go/No-Go:** If any check fails, stop. State which check failed and why. Do not proceed.

### Phase 2 — Context Collection (Spokes 2–3, parallel)

**Constants:** CLAUDE.md files are always collected from: repo root, plus every directory containing a changed file (walking up to root). PR summary is always generated before agents launch.

**Variables:** The specific CLAUDE.md paths found. The specific summary produced.

**Execute (parallel):**
- **CLAUDE.md Collector:** For each changed file's directory (and parent directories up to root), check for CLAUDE.md. Collect all unique paths.
- **PR Summarizer:** Run `gh pr diff <number>`. Produce a concise summary of what changed and why (from PR title/body + diff).

**Go/No-Go:** Both complete. CLAUDE.md list may be empty (valid — not all repos have them). Summary must be non-empty.

### Phase 3 — Parallel Review (Spokes 4–8, all parallel)

**Constants:** Five agents. Independent. No cross-talk. Each returns a list of findings where each finding has: file path, line range, description, reason category (one of: CLAUDE.md adherence, bug, historical context, prior PR pattern, comment compliance).

**Variables:** The specific findings produced by each agent.

**Execute — launch 5 parallel agents:**

1. **CLAUDE.md Compliance Agent:** Read the diff and all collected CLAUDE.md files. Check that changes comply with CLAUDE.md guidance. Note: CLAUDE.md is guidance for code authoring — not all instructions apply during review. Flag only violations that are clearly applicable.

2. **Bug Scanner Agent:** Read only the diff (no extra file context). Shallow scan for obvious, significant bugs. Focus on logic errors, null safety, resource leaks, security issues. Ignore anything a linter/compiler would catch. Ignore nitpicks.

3. **History Analyst Agent:** Run `git blame` and `git log` on modified files. Identify bugs that become visible only in historical context — reverted patterns, contradicted intentions, regression of previously fixed issues.

4. **PR Archaeology Agent:** Use `gh pr list` to find previous PRs that touched the same files. Check comments on those PRs for patterns or warnings that apply to the current change.

5. **Comment Compliance Agent:** Read code comments (inline, block, doc) in the modified files. Check that the PR changes comply with guidance stated in those comments (TODOs, warnings, invariant assertions, "do not modify" markers).

**Go/No-Go:** At least one agent must return results (findings list, possibly empty). If all five agents fail, escalate to user with three-field logs.

### Phase 4 — Confidence Scoring

**Constants:** The rubric is fixed and provided verbatim to each scoring agent:
- **0:** False positive. Does not stand up to light scrutiny, or is a pre-existing issue.
- **25:** Might be real, but could be false positive. Could not verify. Stylistic issues not explicitly in CLAUDE.md.
- **50:** Verified as real but is a nitpick or low practical impact. Not important relative to the rest of the PR.
- **75:** Verified and very likely to be hit in practice. The PR's approach is insufficient. Directly impacts functionality, or directly mentioned in CLAUDE.md.
- **100:** Confirmed real. Will happen frequently in practice. Evidence directly confirms this.

**Variables:** Each finding, its score.

**Execute:** For each finding from Phase 3, launch a parallel scoring agent. Provide the finding, the PR diff, and all CLAUDE.md paths. For CLAUDE.md-flagged issues, the scorer must verify the specific CLAUDE.md passage exists and applies. Return the score.

**Go/No-Go:** All findings scored. Filter to findings scoring >= 80. If zero findings remain, proceed to Phase 6 (clean-bill path).

### Phase 5 — Re-Eligibility Gate

**Constants:** Same checks as Phase 1. PR state may have changed during review.

**Execute:** Re-run `gh pr view` and confirm PR is still open, not converted to draft, not already commented on by this agent since Phase 1.

**Go/No-Go:** If ineligible, stop. Do not post. Inform user.

### Phase 6 — Publish Comment (Egress)

**Constants:** The comment format is fixed. Full SHA in all links. Line ranges include at least 1 line of context above and below.

**Variables:** The specific findings and their descriptions.

**Execute:** Post a single comment to the PR using `gh pr comment`.

**Egress Format — Issues Found:**

```
### Code review

Found N issues:

1. <brief description> (CLAUDE.md says "<quoted passage>")

https://github.com/OWNER/REPO/blob/FULL_SHA/path/to/file.ext#L[start]-L[end]

2. <brief description> (bug due to <file and code snippet>)

https://github.com/OWNER/REPO/blob/FULL_SHA/path/to/file.ext#L[start]-L[end]

Generated with [Claude Code](https://claude.ai/code)

- If this code review was useful, please react with thumbs up. Otherwise, react with thumbs down.
```

**Egress Format — No Issues:**

```
### Code review

No issues found. Checked for bugs and CLAUDE.md compliance.

Generated with [Claude Code](https://claude.ai/code)
```

**Citation rules:**
- Full 40-character git SHA. Never abbreviated. Never use `$(git rev-parse HEAD)` in the comment body — the comment is rendered as Markdown, not executed as shell.
- Repo name must match the repo being reviewed.
- Line range format: `#L[start]-L[end]`.
- Center on the relevant lines with at least 1 line of context before and after.

**Go/No-Go:** Comment posted successfully. Task complete.

---

## False Positive Catalog (Constants)

These are always false positives. Do not flag them:

- Pre-existing issues (code existed before this PR)
- Issues a linter, type checker, or compiler would catch (imports, types, formatting)
- Pedantic nitpicks a senior engineer would not call out
- General code quality concerns (test coverage, documentation) unless CLAUDE.md requires them
- Issues explicitly silenced in code (lint-ignore comments, suppression markers)
- Intentional functionality changes directly related to the PR's purpose
- Real issues on lines the PR did not modify

---

## CTB Backbone Mapping

Review output does not write to a database. It writes to GitHub as a PR comment. Mapping:

| CTB Concept | Review Equivalent |
|-------------|-------------------|
| CANONICAL table | Posted PR comment (all workflow gates passed) |
| ERROR table | Findings that scored below 80 (filtered out, not posted) |
| Promotion path | The confidence scoring + threshold gate |
| Batch registry | PR number + head SHA + review timestamp |

**Diagnostic:** If reviews frequently produce zero findings above threshold, the review agents may have overly narrow scope. If reviews frequently produce many findings, the false positive catalog may be incomplete. Both signals indicate a Constants gap.

---

## Constant-First Principle

The review process is heavily constant-weighted by design. The five agents, the rubric, the threshold, the output format, the false positive catalog, the eligibility checks — all constants. The only true variables are the PR content and the findings it produces.

High variable count in a review run (many edge cases, many unusual findings, many OTHER classifications) means the Constants block needs expansion — likely a new entry in the false positive catalog or a new rule in the Rules section.

---

## Reference Files

| File | Contains | Load When |
|------|----------|-----------|
| `/Users/employeeai/Documents/IMO-Creator/templates/doctrine/ARCHITECTURE.md` | CTB constitutional law — altitude model, hub-spoke, IMO | Reviewing architectural changes |
| `/Users/employeeai/Documents/IMO-Creator/templates/integrations/TOOLS.md` | Tool law — determinism first, LLM as tail | Reviewing tool additions |
| `/Users/employeeai/Documents/IMO-Creator/templates/semantic/OSAM.md` | Semantic access map | Reviewing data flow changes |

Do not load these by default. Load only when the PR diff touches architectural, tool, or data-flow concerns.

---

## Iteration

After using this skill on real PRs:

1. Track false positive rate. If findings are frequently scored below 80, add to the false positive catalog.
2. Track missed bugs. If post-merge bugs were visible in the diff, add a new agent spoke or expand an existing agent's scope.
3. Track agent disagreement. If agents frequently contradict each other, a Constants gap exists in the review criteria.
4. Update this file. Re-run on the same PR to verify the fix. That is the iteration loop.

---

## Installation Targets

- **Global (all projects):** `~/.claude/commands/code-review.md`
- **Project-level:** `.claude/commands/code-review.md`

This skill is installed globally. It replaces the Anthropic code-review plugin for all projects.
