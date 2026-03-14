# Skills System — Master Toolbox & Car-Specific Skills

## Format

Every skill — master or car-specific — is a skill-creator-compliant SKILL.md. Same YAML
frontmatter. Same trigger description. Same progressive disclosure via references/. The
skill-creator reads them identically. There is ONE skill format.

## Three Tiers, Same Format

1. **Agent Skills** (`factory/agents/agent-*/`) — Garage Control Plane agents
   converted to skill format. Orchestrator, Planner, Builder, Auditor, DB Agent.
   These define the execution pipeline. They never change per-project. They are
   Garage-exclusive — child repos must not contain agent skills.

2. **Master Skills** (`factory/agents/`) — Platform-level knowledge. What each
   platform CAN do: capabilities, limits, pricing gates, integration patterns. These
   are the Snap-On chest. They never change per-project.

3. **Car-Specific Skills** (`<child-repo>/skills/`) — Repo-specific configuration.
   For THIS repo: which tools, what config, which tables, which endpoints. These are
   the work order for this specific car.

All three tiers are proper skills with YAML frontmatter and trigger descriptions. The
skill-creator built the masters and agents. The skill-creator (or its template) builds
the car skills. Same animal.

## How Claude Code Uses Them

When Claude Code opens a child repo:

1. Read `<repo>/skills/` — find car-specific skills
2. Car skill body says exactly what's configured for this repo
3. Car skill header references a master skill by name
4. If Claude Code needs platform limits or capabilities → read the master skill
5. Car skill + master skill = complete picture for any build decision

## Directory Layout

```
IMO-Creator/factory/              ← FACTORY
├── SKILLS_SYSTEM.md             ← This file (governance)
├── agents/                      ← MASTER TOOLBOX + AGENTS
│   ├── agent-orchestrator/      ← Garage agent: intake + ID mint + ORBT classify
│   │   ├── SKILL.md
│   │   └── references/
│   ├── agent-planner/           ← Garage agent: WORK_PACKET generation + lane routing
│   │   ├── SKILL.md
│   │   └── references/
│   ├── agent-builder/           ← Garage agent: execution across all lanes
│   │   ├── SKILL.md
│   │   └── references/
│   ├── agent-auditor/           ← Garage agent: compliance evaluation + certification
│   │   ├── SKILL.md
│   │   └── references/
│   ├── agent-db/                ← Garage agent: DB governance + DB_CHANGESET production
│   │   ├── SKILL.md
│   │   └── references/
│   ├── cloudflare/
│   │   ├── SKILL.md             ← Platform capabilities & constraints
│   │   └── references/
│   ├── neon/
│   │   ├── SKILL.md             ← Platform capabilities & constraints
│   │   └── references/
│   ├── lovable/
│   │   ├── SKILL.md             ← Platform capabilities & constraints
│   │   └── references/
│   ├── bootstrap/               ← (existing skill)
│   ├── process-creator/         ← (existing skill)
│   └── skill-creator/           ← (existing skill)

<child-repo>/skills/             ← CAR-SPECIFIC
├── <repo>-neon/
│   ├── SKILL.md                 ← This repo's Neon config
│   └── references/
│       └── schema.md            ← Full DDL
├── <repo>-cloudflare/
│   ├── SKILL.md                 ← This repo's Worker config
│   └── references/
│       └── wrangler.md          ← Full wrangler.toml breakdown
└── <repo>-pipeline/
    └── SKILL.md                 ← Repo-specific pipeline patterns
```

## Creating New Skills

Use `fleet/car-template/skills/CAR_SKILL_TEMPLATE.md` — it produces a skill-creator-compliant
SKILL.md skeleton. Fill in the repo-specific details.

For master skills: use the skill-creator skill directly (`factory/agents/skill-creator/SKILL.md`).

## Rules

1. One format. Agent, master, and car skills are the same format. Skill-creator reads all.
2. Agent skills describe PIPELINE AGENTS. Master skills describe PLATFORMS. Car skills describe USAGE.
3. Agent skills and master skills live only in IMO-Creator. Car skills live only in child repos.
4. Agent skills are Garage-exclusive — child repos must not contain them.
5. Car skills reference masters by name at the top. Never duplicate master content.
6. If a platform constraint affects a build decision, the master skill is authoritative.
7. Skills are NOT doctrine. They do not override CLAUDE.md, CONSTITUTION.md, or any
   locked file. Skills inform build decisions within doctrine's boundaries.

## Layer 0 Governance

All skills — agent, master, and car — conform to Layer 0 Doctrine (law/doctrine/LAYER0_DOCTRINE.md).
The skill-creator is domain-agnostic. Domain content is always the variable, never embedded
in the tool. If you can look at the skill-creator SKILL.md and determine what domain it's
being used for, it's broken.
