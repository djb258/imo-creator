---
name: claude-code-setup
description: Analyze a codebase and recommend doctrine-compliant Claude Code automations (hooks, subagents, skills, plugins, MCP servers). Use when user asks for automation recommendations, wants to optimize their Claude Code setup, mentions improving Claude Code workflows, asks how to first set up Claude Code for a project, or wants to know what Claude Code features they should use.
---

# Claude Code Setup — Doctrine-Native Automation Recommender

**Authority:** CC-01 (Sovereign). This skill replaces the Anthropic claude-code-setup plugin with a doctrine-native version. All tool recommendations pass through the SNAP_ON_TOOLBOX.yaml authority gate.

**Source of truth:** `/Users/employeeai/Documents/IMO-Creator/templates/SNAP_ON_TOOLBOX.yaml`

---

## IMO — Ingress / Middle / Egress

**Ingress (Trigger):** User requests Claude Code automation recommendations for a codebase, or asks how to set up Claude Code for a project.

**Middle (Processing):**
- Analyze codebase signals (language, framework, dependencies, structure, existing config)
- Map detected signals to the 5 automation categories (MCP servers, Skills, Hooks, Subagents, Plugins)
- Run every tool recommendation through the Tool Authority Gate (SNAP_ON_TOOLBOX.yaml)
- Separate constants (structural facts about the codebase) from variables (configurable recommendations)
- Produce a ranked recommendation report: 1-2 per category, expandable to 3-5 on request

**Egress (Output):** A read-only recommendation report. This skill analyzes and reports. It NEVER creates or modifies files.

**Go/No-Go Gate:** Do not produce recommendations until codebase analysis is complete and at least one automation category has a signal match.

---

## Constants — What Is Fixed About This Skill

1. This skill is read-only. It never creates, modifies, or deletes files.
2. Every tool recommendation passes through the Tool Authority Gate before output.
3. The recommendation report always includes a Codebase Profile section before recommendations.
4. Output is 1-2 recommendations per category by default. 3-5 only when the user asks for more in a specific category.
5. Categories with no signal matches are omitted from the report.
6. The 5 automation categories are: MCP Servers, Skills, Hooks, Subagents, Plugins.
7. The Tool Authority Gate source of truth is `/Users/employeeai/Documents/IMO-Creator/templates/SNAP_ON_TOOLBOX.yaml`.
8. Deterministic analysis first. Pattern matching drives recommendations, not LLM intuition.

---

## Variables — What Changes Per Invocation

| Variable | What It Is | Who Sets It |
|----------|-----------|-------------|
| `target_codebase` | The project directory being analyzed | Working directory or user specification |
| `detected_signals` | Language, framework, dependencies, structure found | Phase 1 analysis |
| `matched_recommendations` | Automation recommendations that passed signal matching | Phase 2 processing |
| `tool_authority_results` | SNAP_ON_TOOLBOX.yaml gate check results per recommendation | Phase 2 processing |
| `user_focus` | Specific category the user wants deeper recommendations for | User request (optional) |

---

## Hub-and-Spoke Configuration

The recommendation process is a wheel. The hub is the recommendation report. Each spoke is an analysis or processing phase that feeds the hub.

| Spoke | Input | Output | Interface to Hub |
|-------|-------|--------|-----------------|
| Codebase Analysis | Project directory | Signal inventory | Go/No-Go: at least one signal detected |
| Tool Authority Gate | Candidate recommendations | Approved/flagged/blocked list | Go/No-Go: every recommendation has a gate status |
| MCP Server Matching | Signals + gate results | MCP recommendations | Feeds hub report section |
| Skills Matching | Signals + gate results | Skills recommendations | Feeds hub report section |
| Hooks Matching | Signals + gate results | Hooks recommendations | Feeds hub report section |
| Subagent Matching | Signals + gate results | Subagent recommendations | Feeds hub report section |
| Plugin Matching | Signals + gate results | Plugin recommendations | Feeds hub report section |
| Report Assembly | All matched recommendations | Final report | Egress |

**Hub rule:** The hub (recommendation report) is the only output. Spokes do not call other spokes. Each spoke completes its job and hands off to the hub.

---

## Phase Failure Handling

**Constants:**
- Silent retry is never the response to a phase failure.
- A three-field log is always produced before escalation: (1) which phase failed, (2) what was attempted, (3) what was returned.
- The user decides whether to retry, narrow scope, or abort.

**Variables:**
- The specific phase that failed.
- The specific error or unexpected output.

**OTHER path:** If the failure cannot be classified (e.g., unrecognized project structure, no manifest files, empty directory), log it with `phase_failed`, `attempted_action`, and `raw_output`. Report to the user: "This codebase does not match any known project patterns. Provide additional context about the project type."

---

## Rules — What This Skill Never Does

- Never creates or modifies files. This is a read-only analysis skill. The user implements recommendations separately.
- Never recommends a banned tool. If a signal maps to a banned tool, state the ban reason and suggest the approved alternative from SNAP_ON_TOOLBOX.yaml.
- Never recommends a tool not in SNAP_ON_TOOLBOX.yaml without flagging it. Unknown tools get the status "requires ADR review" in the report.
- Never uses LLM intuition as the primary recommendation driver. Signals detected in the codebase drive recommendations. Pattern match first, interpret second.
- Never overwhelms. 1-2 recommendations per category unless the user asks for more.
- Never skips the Tool Authority Gate. Every tool, library, and vendor recommendation is checked against SNAP_ON_TOOLBOX.yaml before appearing in the report.

---

## Architectural Awareness

### Altitude Model

| Layer | Relevance to This Skill |
|-------|------------------------|
| CC-01 (Sovereign) | SNAP_ON_TOOLBOX.yaml lives here. This skill reads it. |
| CC-02 (Hub) | Recommendations target hub-level automation setup |
| CC-03 (Context) | Some recommendations (hooks, subagents) operate at context level |
| CC-04 (Process) | Individual automation invocations are process-level |

### Two-Table Pattern

Recommendations that produce persisted output follow the CANONICAL + ERROR pattern. If a recommended subagent or hook produces output, that output maps to CANONICAL (validated) or ERROR (failed/unclassified). This skill does not produce persisted output itself — it is advisory.

### CTB Backbone

When recommending where automation config lives in a doctrine-compliant repo:

| Config Type | CTB Branch |
|-------------|-----------|
| Hooks, settings | `sys/` (infrastructure/config) |
| Subagent prompts | `ai/` (agents, prompts) |
| Skills | `ai/` or project `.claude/` directory |
| MCP server config | `sys/` or `.mcp.json` at repo root |

---

## Workflow

### Phase 1 — Codebase Analysis (Spoke 1)

**Constants for this phase:**
- Analysis always checks: manifest files, dependency lists, directory structure, existing Claude Code config.
- Analysis never modifies the filesystem.

**Variables for this phase:**
- The specific project directory.
- Which manifest files exist.
- Which signals are detected.

**Execute:**

Gather project context by running these detection checks:

```bash
# Detect project type — manifest files
ls -la package.json pyproject.toml Cargo.toml go.mod pom.xml Gemfile 2>/dev/null

# Read primary manifest for dependency signals
cat package.json 2>/dev/null | head -80
cat pyproject.toml 2>/dev/null | head -80

# Check for existing Claude Code config
ls -la .claude/ CLAUDE.md .mcp.json 2>/dev/null

# Analyze project structure
ls -la src/ app/ lib/ tests/ components/ pages/ api/ data/ ai/ sys/ ui/ 2>/dev/null

# Check for config files that signal hook opportunities
ls -la .prettierrc* .eslintrc* eslint.config.* tsconfig.json ruff.toml mypy.ini .env* 2>/dev/null

# Check for CI/CD and DevOps signals
ls -la .github/ docker-compose* Dockerfile 2>/dev/null
```

**Key signal categories to capture:**

| Category | What to Detect | Informs |
|----------|---------------|---------|
| Language/Runtime | package.json, pyproject.toml, go.mod, Cargo.toml | All categories |
| Frontend framework | React, Vue, Angular, Next.js in deps | MCP, Skills, Plugins |
| Backend framework | Express, FastAPI, Django in deps | MCP, Skills |
| Database | CF D1 (working), Neon (vault), Prisma, raw SQL, migrations dir | MCP, Skills |
| External APIs | Stripe, AWS SDK, vendor SDKs in deps | MCP, Tool Authority Gate |
| Testing | Jest, pytest, Playwright configs, test dirs | Hooks, Subagents |
| CI/CD | GitHub Actions, workflow files | MCP, Hooks |
| Formatting/Linting | Prettier, ESLint, Ruff, Black configs | Hooks |
| CTB structure | `src/sys/`, `src/data/`, `src/app/`, `src/ai/`, `src/ui/` | Architectural compliance |
| Doctrine files | CLAUDE.md, FLEET_REGISTRY.yaml, SNAP_ON_TOOLBOX.yaml | Tool Authority Gate |

**Go/No-Go:** Can you list at least one detected signal? If yes, proceed. If no, report to user and ask for project context.

### Phase 2 — Tool Authority Gate (Spoke 2)

**Constants for this phase:**
- Every tool recommendation is checked against SNAP_ON_TOOLBOX.yaml before output.
- The evaluation order is: (1) Check BANNED, (2) Check TIER 0, (3) Check TIER 1, (4) Check TIER 2, (5) If not listed, flag.
- Banned tools are never recommended. The ban reason and approved alternative are stated instead.

**Variables for this phase:**
- The specific tools being evaluated.
- The gate status of each tool (approved, banned, requires-ADR-review).

**Execute:**

Read the toolbox registry:

```bash
cat /Users/employeeai/Documents/IMO-Creator/templates/SNAP_ON_TOOLBOX.yaml
```

For each candidate tool or vendor in the recommendation set:

1. **Check `banned.vendors`** — If the tool vendor appears here, STOP. Note the ban reason. Suggest the approved alternative.
2. **Check `banned.libraries`** — If the library appears here, STOP. Note the ban reason and alternative (e.g., selenium is banned, use playwright).
3. **Check `banned.patterns`** — If the recommendation pattern appears here (e.g., bulk_enrichment, llm_as_spine), STOP.
4. **Check `tools`** — If the tool appears in the registry, note its tier and status. It is approved.
5. **Check `infrastructure`** — If the tool is listed as infrastructure, it is approved platform-level.
6. **If not found anywhere** — Flag as "requires ADR review" in the output. The tool may be valid but needs formal evaluation.

**Gate status labels for the report:**

| Status | Meaning |
|--------|---------|
| APPROVED (Tier N) | Listed in SNAP_ON_TOOLBOX.yaml, cleared for use |
| APPROVED (Infrastructure) | Listed as platform infrastructure |
| BANNED | Listed in banned section, must not use |
| REQUIRES ADR REVIEW | Not listed anywhere, needs formal evaluation |
| N/A | Claude Code native feature, no external tool involved |

Most Claude Code automations (hooks, skills, subagents, plugins) are native features and get status N/A. The gate matters when recommending MCP servers that connect to external services, or when skills reference external tools/libraries.

**Go/No-Go:** Has every candidate recommendation been assigned a gate status? If yes, proceed. If no, re-check.

### Phase 3 — Generate Recommendations (Spoke 3)

**Constants for this phase:**
- Recommendations are driven by signal-to-recommendation mapping tables, not by LLM inference.
- Each recommendation states: what it is, why it fits this codebase (citing the detected signal), and how to install/configure it.
- Banned tools are reported as warnings, not recommendations.

**Variables for this phase:**
- Which signals matched which recommendations.
- How many recommendations per category (1-2 default, 3-5 if user requested more).

**Execute — Signal-to-Recommendation Mapping:**

**A. MCP Servers** (external integrations):

| Codebase Signal | Recommended MCP Server | Gate Check |
|-----------------|------------------------|-----------|
| Popular libraries (React, Express, etc.) | context7 — live docs | Check vendor status |
| Frontend with UI testing | Playwright MCP | Check: playwright not banned (selenium is) |
| Cloudflare D1/KV/R2 | Cloudflare MCP / Wrangler | APPROVED (Working layer — BAR-100) |
| PostgreSQL / Neon | Database MCP / Neon MCP | APPROVED (Vault-only — BAR-100) |
| GitHub repository | GitHub MCP | Check vendor status |
| Linear for issues | Linear MCP | Check vendor status |
| AWS SDK in deps | AWS MCP | Check vendor status |
| Slack workspace | Slack MCP | Check vendor status |
| Sentry in deps | Sentry MCP | Check vendor status |
| Docker files present | Docker MCP | Check vendor status |

**B. Hooks** (automatic actions on tool events):

| Codebase Signal | Recommended Hook |
|-----------------|------------------|
| Prettier config exists | PostToolUse: auto-format on Edit/Write |
| ESLint config exists | PostToolUse: auto-lint on Edit/Write |
| Ruff/Black config exists | PostToolUse: auto-format Python |
| tsconfig.json exists | PostToolUse: type-check on Edit |
| Test directory exists | PostToolUse: run related tests |
| .env files present | PreToolUse: block .env edits |
| Lock files present | PreToolUse: block lock file edits |
| go.mod exists | PostToolUse: gofmt on Edit |
| Cargo.toml exists | PostToolUse: rustfmt on Edit |

**C. Skills** (packaged expertise):

| Codebase Signal | Skill | Invocation |
|-----------------|-------|-----------|
| API routes | api-doc (with OpenAPI template) | User-only |
| Database project | create-migration (with validation) | User-only |
| Test suite exists | gen-test (with project examples) | User-only |
| Component library | new-component (with templates) | User-only |
| PR workflow | pr-check (with checklist) | User-only |
| Git workflow | commit (via commit-commands plugin) | Both |
| Code style patterns | project-conventions | Claude-only |

**D. Subagents** (parallel specialized review):

| Codebase Signal | Recommended Subagent |
|-----------------|---------------------|
| Large codebase (>500 files) | code-reviewer |
| Auth/payment code patterns | security-reviewer |
| API routes present | api-documenter |
| Few tests vs source files | test-writer |
| Frontend components | ui-reviewer |
| Database-heavy code | performance-analyzer |

**E. Plugins** (bundled skill collections):

| Codebase Signal | Recommended Plugin |
|-----------------|-------------------|
| TypeScript project | typescript-lsp |
| Python project | pyright-lsp |
| Go project | gopls-lsp |
| Rust project | rust-analyzer-lsp |
| PR-based workflow | pr-review-toolkit |
| React/Vue/Angular | frontend-design |
| Git commits | commit-commands |
| Building plugins | plugin-dev |
| Security-sensitive | security-guidance |

**Go/No-Go:** Does every recommendation cite a detected codebase signal? Does every recommendation have a Tool Authority Gate status? If yes, proceed. If no, remove unsupported recommendations.

### Phase 4 — Report Assembly (Spoke 4)

**Constants for this phase:**
- The report follows a fixed structure: Codebase Profile, then each category with recommendations.
- Each recommendation states: name, why (citing signal), install command or path, and gate status.
- The report ends with an expansion prompt and implementation offer.
- Categories with no matches are omitted entirely.

**Variables for this phase:**
- Which categories have matches.
- The specific recommendations and their gate statuses.

**Execute — Assemble the report in this format:**

```
## Claude Code Automation Recommendations

I analyzed your codebase and identified the top automations for each category.

### Codebase Profile
- **Language/Runtime**: [detected]
- **Framework**: [detected]
- **Key Dependencies**: [relevant ones]
- **CTB Structure**: [if doctrine-compliant structure detected]
- **Existing Claude Config**: [if .claude/ or CLAUDE.md found]

---

### MCP Servers

#### [server name]
**Why**: [specific signal detected]
**Install**: `claude mcp add [name]` or config snippet
**Tool Authority**: [APPROVED (Tier N) | REQUIRES ADR REVIEW | N/A]

---

### Hooks

#### [hook name]
**Why**: [config file detected]
**Where**: `.claude/settings.json`
**Tool Authority**: N/A (native Claude Code feature)

---

### Skills

#### [skill name]
**Why**: [signal detected]
**Create**: `.claude/skills/[name]/SKILL.md`
**Invocation**: User-only / Both / Claude-only
**Tool Authority**: N/A (native Claude Code feature)

---

### Subagents

#### [agent name]
**Why**: [signal detected]
**Where**: `.claude/agents/[name].md`
**Tool Authority**: N/A (native Claude Code feature)

---

### Plugins

#### [plugin name]
**Why**: [signal detected]
**Install**: `/plugin install [name]`
**Tool Authority**: N/A (native Claude Code feature)

---

### Tool Authority Warnings

[If any banned tools were considered, list them here with ban reason and alternative.]
[If any tools require ADR review, list them here.]

---

Want more? Ask for additional recommendations for any specific category.
Want help implementing any of these? Just ask.
```

**Go/No-Go:** Does the report include only signal-backed recommendations with gate statuses? Does it omit empty categories? If yes, deliver. If no, revise.

---

## CTB Backbone Mapping

This skill produces no persisted artifacts. Its output is an ephemeral recommendation report delivered to the user in the conversation. No CANONICAL or ERROR table writes. No file system changes.

If the analyzed codebase is doctrine-compliant (has CTB structure under `src/`), the report notes this in the Codebase Profile and factors it into recommendations (e.g., recommending hooks that respect CTB branch boundaries).

---

## Constant-First Principle

The signal-to-recommendation mapping tables are constants. They do not change per invocation. What changes is which signals are detected in the target codebase (variables). The skill's value comes from the constant mapping tables being comprehensive and accurate. If a codebase signal frequently produces no recommendation match, a mapping entry is missing — update the mapping table, not the analysis logic.

The Tool Authority Gate is a constant. It always runs. It always checks the same file. The variable is which tools are being checked and what their status turns out to be.

---

## Iteration

After using this skill on real codebases:

1. Notice which codebase signals produce no recommendation matches — add mapping entries.
2. Notice which recommendations are consistently unhelpful — remove or refine them.
3. Notice which tools get flagged as "requires ADR review" repeatedly — submit ADRs to add them to SNAP_ON_TOOLBOX.yaml or ban them.
4. Update this skill, re-validate, re-deliver.

---

## Installation Targets

This skill is installed globally:
- **Global:** `~/.claude/commands/claude-code-setup.md` (all projects)

It replaces the Anthropic `claude-code-setup` plugin. To disable the plugin after installing this command, remove it via `/plugin uninstall claude-code-setup`.

## Reference Paths

| Reference | Path | Load When |
|-----------|------|-----------|
| SNAP_ON_TOOLBOX.yaml | `/Users/employeeai/Documents/IMO-Creator/templates/SNAP_ON_TOOLBOX.yaml` | Phase 2 — Tool Authority Gate |
| TOOLS.md | `/Users/employeeai/Documents/IMO-Creator/templates/integrations/TOOLS.md` | When evaluating tool doctrine compliance |
| ARCHITECTURE.md | `/Users/employeeai/Documents/IMO-Creator/templates/doctrine/ARCHITECTURE.md` | When checking CTB structure compliance |
