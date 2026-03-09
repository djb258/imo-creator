# Skills System — Master Toolbox & Car-Specific Skills

## Format

Every skill — master or car-specific — is a skill-creator-compliant SKILL.md. Same YAML
frontmatter. Same trigger description. Same progressive disclosure via references/. The
skill-creator reads them identically. There is ONE skill format.

## Two Tiers, Same Format

1. **Master Skills** (`IMO-Creator/skills/`) — Platform-level knowledge. What each
   platform CAN do: capabilities, limits, pricing gates, integration patterns. These
   are the Snap-On chest. They never change per-project.

2. **Car-Specific Skills** (`<child-repo>/skills/`) — Repo-specific configuration.
   For THIS repo: which tools, what config, which tables, which endpoints. These are
   the work order for this specific car.

Both are proper skills with YAML frontmatter and trigger descriptions. The skill-creator
built the masters. The skill-creator (or its template) builds the car skills. Same animal.

## How Claude Code Uses Them

When Claude Code opens a child repo:

1. Read `<repo>/skills/` — find car-specific skills
2. Car skill body says exactly what's configured for this repo
3. Car skill header references a master skill by name
4. If Claude Code needs platform limits or capabilities → read the master skill
5. Car skill + master skill = complete picture for any build decision

## Directory Layout

```
IMO-Creator/skills/              ← MASTER TOOLBOX
├── SKILLS_SYSTEM.md             ← This file (governance)
├── cloudflare/
│   ├── SKILL.md                 ← Platform capabilities & constraints
│   └── references/
├── neon/
│   ├── SKILL.md                 ← Platform capabilities & constraints
│   └── references/
├── lovable/
│   ├── SKILL.md                 ← Platform capabilities & constraints
│   └── references/
├── bootstrap/                   ← (existing skill)
├── process-creator/             ← (existing skill)
└── skill-creator/               ← (existing skill)

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

Use `templates/skills/CAR_SKILL_TEMPLATE.md` — it produces a skill-creator-compliant
SKILL.md skeleton. Fill in the repo-specific details.

For master skills: use the skill-creator skill directly (`skills/skill-creator/SKILL.md`).

## Rules

1. One format. Master and car skills are the same format. Skill-creator reads both.
2. Master skills describe PLATFORMS. Car skills describe USAGE.
3. Master skills live only in IMO-Creator. Car skills live only in child repos.
4. Car skills reference masters by name at the top. Never duplicate master content.
5. If a platform constraint affects a build decision, the master skill is authoritative.
6. Skills are NOT doctrine. They do not override CLAUDE.md, CONSTITUTION.md, or any
   locked file. Skills inform build decisions within doctrine's boundaries.
