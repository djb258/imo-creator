# COMPLETE: Neon Database Deployment — PSB Libraries

| Field | Value |
|-------|-------|
| **Date Created** | 2026-03-01 |
| **Date Completed** | 2026-03-02 |
| **Status** | COMPLETE |
| **ADR** | ADR-023 |
| **Doppler Project** | imo-creator (config: dev) |
| **Neon Instance** | ep-round-bird-a4a7s49a-pooler.us-east-1.aws.neon.tech |

---

## What Needs to Run

Four migrations need to be executed against the Neon instance, in order:

```bash
# 1. Set DATABASE_URL from Doppler
export DATABASE_URL=$(doppler secrets get DATABASE_URL --plain)

# 2. Run migrations in order
psql "$DATABASE_URL" -f templates/migrations/012_psb_prompt_registry.sql
psql "$DATABASE_URL" -f templates/migrations/013_psb_reverse_prompt_index.sql
psql "$DATABASE_URL" -f templates/migrations/014_psb_skill_registry.sql
psql "$DATABASE_URL" -f templates/migrations/015_psb_egress_views.sql
```

## What Gets Created

| Migration | Schema | Tables/Views Created |
|-----------|--------|---------------------|
| 012 | `psb` (new schema) | `psb.prompt_registry` (CONFIG), `psb.prompt_versions` (EVENT) |
| 013 | `psb` | `psb.reverse_prompt_index` (CONFIG) |
| 014 | `psb` | `psb.skill_registry` (CONFIG), `psb.skill_versions` (EVENT), `psb.prompt_skill_binding` (CONFIG) |
| 015 | `psb` | Views: `prompts_active`, `reverse_lookup`, `skills_active`, `skill_dependency_tree`, `prompt_skill_map` + function `resolve_skill_dependencies()` |

## Triggers Installed

- `prompt_versions` — INSERT-only (EVENT immutability)
- `prompt_registry` — forward-only status transitions, no DELETE, auto-versioning
- `skill_versions` — INSERT-only (EVENT immutability)
- `skill_registry` — forward-only status transitions, no DELETE, auto-versioning
- `reverse_prompt_index` — no DELETE

## Post-Deployment Verification

```bash
# Verify schema exists
psql "$DATABASE_URL" -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'psb';"

# Verify table count (6 tables)
psql "$DATABASE_URL" -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'psb';"

# Verify view count (5 views)
psql "$DATABASE_URL" -c "SELECT count(*) FROM information_schema.views WHERE table_schema = 'psb';"

# Verify triggers
psql "$DATABASE_URL" -c "SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'psb';"
```

## After Deployment

1. ~~Seed the 15 existing prompts from `templates/claude/*.prompt.md` into `psb.prompt_registry`~~ DONE (2026-03-02)
2. ~~Seed the 5 agent definitions from `ai/agents/` into `psb.skill_registry`~~ DONE (2026-03-02, 5 core + 3 claude agents = 8 total)
3. Create reverse prompt index entries for each prompt — PENDING (requires manual classification of output categories per prompt)
4. Create prompt-skill bindings — PENDING (requires manual mapping of which skills use which prompts)
5. ~~Mark this file status as COMPLETE~~ DONE

## Deployment Log (2026-03-02)

- Doppler project `imo-creator` created with DATABASE_URL for sovereign Neon instance
- Migrations 012-015 executed via Node.js pg driver (psql not installed on deployment machine)
- Verification: 1 schema, 6 tables, 5 views, 7 trigger functions, 8 functions — all confirmed
- Seed: 15 prompts inserted (all DRAFT status), 8 skills inserted (5 core agents + 3 parallel agents, all DRAFT status)
- Auto-versioning triggers fired: 23 version records created in prompt_versions and skill_versions
