---
name: car-skill-template
description: >
  Template for creating car-specific (repo-specific) skills that conform to the
  skill-creator format. Use this template whenever creating a new skill for a child
  repo that needs to reference specific platform configurations, schemas, endpoints,
  or tool setups. This template produces a skill-creator-compliant SKILL.md with
  YAML frontmatter, trigger description, and progressive disclosure via references/.
  Trigger when someone says "create a skill for this repo", "write a car skill",
  or needs to document how a specific repo uses a platform tool.
---

# Car-Specific Skill Template

This template produces skills for child repos (cars) that follow the exact same
skill-creator format as the master platform skills in IMO-Creator. The skill-creator
reads these identically — same YAML frontmatter, same body structure, same references/
pattern.

## What Makes a Car Skill Different From a Master Skill

| | Master Skill (IMO-Creator) | Car Skill (Child Repo) |
|---|---|---|
| **Scope** | Platform capabilities and limits | This repo's specific usage of that platform |
| **Lives in** | `IMO-Creator/skills/<platform>/` | `<child-repo>/skills/<repo>-<platform>/` |
| **Answers** | "What CAN this platform do?" | "What DOES this repo do with this platform?" |
| **Contains** | Limits, pricing, gates, integration patterns | Connection strings, table names, endpoints, bindings, schemas |
| **Changes when** | Platform updates capabilities/pricing | Repo config changes |
| **Format** | skill-creator compliant SKILL.md | skill-creator compliant SKILL.md (identical format) |

Both are full skills. Both have YAML frontmatter with pushy descriptions. Both use
references/ for heavy detail. The skill-creator treats them identically.

## Template: Car Skill SKILL.md

Copy this skeleton, fill in the blanks for your specific repo:

```markdown
---
name: <repo>-<platform>
description: >
  Repo-specific configuration, schemas, endpoints, and operational patterns for
  how <REPO NAME> uses <PLATFORM>. Use this skill whenever working in the
  <REPO NAME> repo and the task involves <PLATFORM> — querying, deploying,
  debugging, migrating, or modifying any <PLATFORM> component. Trigger on any
  reference to <specific table names, endpoint names, binding names, or
  project-specific terms>. Also consult the master <platform> skill in
  IMO-Creator/skills/<platform>/ for platform-level limits and capabilities.
---

# <REPO NAME> — <PLATFORM> Configuration

Master skill reference: `IMO-Creator/skills/<platform>/SKILL.md`
(Read master for platform limits, pricing, and capabilities. This skill covers
how THIS repo uses the platform.)

## What This Repo Uses

<!-- List the specific platform services this repo consumes -->

## Connection Configuration

<!-- Exact connection patterns, environment variable names, pooling setup -->

## Schema / Data Model

<!-- Tables, columns, indexes that matter. Platform-specific schema details. -->

## Endpoints / Routes

<!-- Platform-specific endpoints, routes, or key queries. -->

## Operational Patterns

<!-- How this repo specifically uses the platform. Message queue table design,
     cron schedules, data flow patterns, retry logic -->

## Known Issues in This Repo

<!-- Repo-specific bugs, workarounds, or quirks related to this platform -->

## Cost Profile

<!-- What this repo's usage actually costs monthly on this platform -->
```

## Template: Car Skill references/ Files

Heavy detail (full schema DDL, complete wrangler.toml, large query library) goes in
`references/` following the same progressive disclosure pattern:

```
<repo>-<platform>/
├── SKILL.md                    ← Lean body (<500 lines)
└── references/
    ├── schema.md               ← Full DDL, table definitions
    ├── queries.md              ← Key queries with explanations
    └── config.md               ← Full wrangler.toml or connection config
```

## Naming Convention

Car skills follow this naming pattern:
- Directory: `<repo-shortname>-<platform>/`
- Examples: `barton-neon/`, `barton-cloudflare/`, `ple-neon/`, `ut-cloudflare/`

## How Claude Code Uses This

1. Opens child repo
2. Reads `<repo>/skills/` directory — finds car-specific skills
3. Car skill body tells Claude Code exactly what's configured for this repo
4. If Claude Code needs to check a platform limit or capability → reads the master
   skill referenced at the top of the car skill
5. Car skill + master skill together = complete picture for build decisions
