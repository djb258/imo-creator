# Doppler Sovereign Vault — Operations Registry

## Overview

All fleet secrets are centralized in the **imo-creator** Doppler project (sovereign vault). Child repos receive secrets via push-down sync. Authority flows downward only (CC-01 → children).

---

## Vault Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 imo-creator (CC-01)                      │
│              Doppler Project: imo-creator                │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  SOVEREIGN   │  │    GLOBAL    │  │ CHILD-SCOPED │  │
│  │  (no prefix) │  │  (GLOBAL_*)  │  │ (PREFIX_*)   │  │
│  │              │  │              │  │              │  │
│  │ DATABASE_URL │  │ COMPOSIO_..  │  │ OUTREACH_*   │  │
│  │ GARAGE_..    │  │ GEMINI_..    │  │ CL_*         │  │
│  │              │  │ GOOGLE_..    │  │ CLIENT_*     │  │
│  │              │  │              │  │ SALES_*      │  │
│  │              │  │              │  │ STORAGE_*    │  │
│  │              │  │              │  │ RESEARCH_*   │  │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘  │
│                           │                  │          │
│  Config branches:         │                  │          │
│  dev (root) ──────────────┤                  │          │
│  dev_outreach             │                  │          │
│  dev_cl                   │                  │          │
│  dev_client               │                  │          │
│  dev_sales                │                  │          │
│  dev_storage              │                  │          │
│  dev_research             │                  │          │
└───────────────────────────┼──────────────────┼──────────┘
                            │ push-down        │ push-down
          ┌─────────────────┴─────────────────────────────┐
          │                                               │
  ┌───────┴─────┐ ┌────────┐ ┌────────┐ ┌───────┐ ┌──────┴──┐ ┌────────┐
  │ outreach    │ │  cl    │ │ client │ │ sales │ │ storage │ │research│
  │ ep-ancient- │ │ep-empty│ │ep-frost│ │ep-oran│ │ep-rapid-│ │ep-young│
  │ waterfall   │ │-queen  │ │y-brook │ │ge-pine│ │dream    │ │-block  │
  │             │ │        │ │        │ │       │ │         │ │        │
  │ Marketing   │ │ neondb │ │ neondb │ │neondb │ │ neondb  │ │ neondb │
  │ DB          │ │        │ │        │ │       │ │         │ │        │
  └─────────────┘ └────────┘ └────────┘ └───────┘ └─────────┘ └────────┘
                                                         (6 children)
```

---

## Secret Categories

### SOVEREIGN (never pushed to children)

| Vault Name | Description | Status |
|------------|-------------|--------|
| `DATABASE_URL` | Sovereign Neon DB (Garage command database) | ACTIVE |
| `GARAGE_SIGNING_KEY` | Garage artifact signing key | PENDING |
| `SUPADATA_API_KEY` | Supadata API key (transcript/social data) | ACTIVE |

### GLOBAL (shared, pushed to children that need them)

| Vault Name | Child Name | Push To | Vault Status |
|------------|------------|---------|-------------|
| `GLOBAL_ANTHROPIC_API_KEY` | `ANTHROPIC_API_KEY` | outreach | NOT PROVISIONED |
| `GLOBAL_OPENAI_API_KEY` | `OPENAI_API_KEY` | outreach | NOT PROVISIONED |
| `GLOBAL_GEMINI_API_KEY` | `GEMINI_API_KEY` | outreach | SET |
| `GLOBAL_GITHUB_TOKEN` | `GITHUB_TOKEN` | outreach | NOT PROVISIONED |
| `GLOBAL_COMPOSIO_API_KEY` | `COMPOSIO_API_KEY` | outreach, sales | SET |
| `GLOBAL_COMPOSIO_API_URL` | `COMPOSIO_API_URL` | outreach, sales | SET |
| `GLOBAL_COMPOSIO_MCP_URL` | `COMPOSIO_MCP_URL` | outreach, sales | SET |
| `GLOBAL_GOOGLE_API_KEY` | `GOOGLE_API_KEY` | outreach, storage | SET |
| `GLOBAL_FIRECRAWL_API_KEY` | `FIRECRAWL_API_KEY` | outreach | NOT PROVISIONED |
| `GLOBAL_APIFY_API_KEY` | `APIFY_API_KEY` | outreach | NOT PROVISIONED |

### CHILD-SCOPED (per-child, prefixed in vault)

| Child | Prefix | Doppler Project | Config Branch | Secret Count | Neon Host |
|-------|--------|-----------------|---------------|-------------|-----------|
| barton-outreach-core | `OUTREACH_` | barton-outreach-core | dev_outreach | 32 | ep-ancient-waterfall (Marketing DB) |
| company-lifecycle-cl | `CL_` | company-lifecycle-cl | dev_cl | 6 | ep-empty-queen |
| client-subhive | `CLIENT_` | client-subhive | dev_client | 7 | ep-frosty-brook |
| sales-navigator | `SALES_` | sales-navigator | dev_sales | 8 | ep-orange-pine |
| barton-storage | `STORAGE_` | barton-storage | dev_storage | 10 | ep-rapid-dream |
| research | `RESEARCH_` | research | dev_research | 5 | ep-young-block |

---

## Config Branch Structure

All branches live under the `dev` environment in the `imo-creator` Doppler project:

| Config | Purpose |
|--------|---------|
| `dev` | Root vault — all 69 secrets live here |
| `dev_outreach` | Branch for barton-outreach-core |
| `dev_cl` | Branch for company-lifecycle-cl |
| `dev_client` | Branch for client-subhive |
| `dev_sales` | Branch for sales-navigator |
| `dev_storage` | Branch for barton-storage |
| `dev_research` | Branch for research |
| `stg` | Staging (future use) |
| `prd` | Production (future use) |

---

## Naming Convention

| Category | Pattern | Examples |
|----------|---------|----------|
| Sovereign | `KEY_NAME` (no prefix) | `DATABASE_URL`, `GARAGE_SIGNING_KEY` |
| Global | `GLOBAL_KEY_NAME` | `GLOBAL_COMPOSIO_API_KEY` |
| Outreach | `OUTREACH_KEY_NAME` | `OUTREACH_DATABASE_URL`, `OUTREACH_NEON_HOST` |
| CL | `CL_KEY_NAME` | `CL_DATABASE_URL`, `CL_HUB_ID` |
| Client | `CLIENT_KEY_NAME` | `CLIENT_DATABASE_URL`, `CLIENT_HUB_ID` |
| Sales | `SALES_KEY_NAME` | `SALES_DATABASE_URL`, `SALES_HUB_ID` |
| Storage | `STORAGE_KEY_NAME` | `STORAGE_DATABASE_URL`, `STORAGE_CENSUS_API_KEY` |
| Research | `RESEARCH_KEY_NAME` | `RESEARCH_DATABASE_URL`, `RESEARCH_NEON_HOST` |

**Auto-managed keys** (excluded from vault — Doppler injects automatically):
- `DOPPLER_CONFIG`, `DOPPLER_ENVIRONMENT`, `DOPPLER_PROJECT`

---

## Neon Database Registry

All 7 databases verified connected on 2026-03-02.

| Owner | Vault Prefix | Neon Host | Database | Region |
|-------|-------------|-----------|----------|--------|
| Sovereign (Garage) | — | ep-round-bird-a4a7s49a | neondb | us-east-1 |
| barton-outreach-core | `OUTREACH_` | ep-ancient-waterfall-a42vy0du | Marketing DB | us-east-1 |
| company-lifecycle-cl | `CL_` | ep-empty-queen-ai0gmyqg | neondb | us-east-1 |
| client-subhive | `CLIENT_` | ep-frosty-brook-ad6wval6 | neondb | us-east-1 |
| sales-navigator | `SALES_` | ep-orange-pine-aiffwvhb | neondb | us-east-1 |
| barton-storage | `STORAGE_` | ep-rapid-dream-aelbcqxw | neondb | us-east-2 |
| research | `RESEARCH_` | ep-young-block-aii5nj6b | neondb | us-east-1 |

**Isolation rule**: Each child has its own dedicated Neon project. No database sharing.

---

## Sync Process

### Push from vault to children (routine)

```bash
# Dry run — see what would change
./scripts/fleet-secrets-sync.sh --dry-run --verbose

# Apply changes to all children
./scripts/fleet-secrets-sync.sh --apply

# Sync single child
./scripts/fleet-secrets-sync.sh --apply --child=client-subhive
```

### Add a new secret

1. Set the secret in the vault with the correct prefix:
   ```bash
   doppler secrets set OUTREACH_NEW_KEY=value --project imo-creator --config dev
   ```
2. Add the entry to `FLEET_SECRETS_MANIFEST.yaml` under the appropriate child
3. Run sync to push to child:
   ```bash
   ./scripts/fleet-secrets-sync.sh --apply --child=barton-outreach-core
   ```

### Add a new global secret

1. Set in vault with `GLOBAL_` prefix:
   ```bash
   doppler secrets set GLOBAL_NEW_KEY=value --project imo-creator --config dev
   ```
2. Add to `FLEET_SECRETS_MANIFEST.yaml` under `global.secrets` with `push_to` list
3. Run sync

### Rotate a secret

1. Update the value in the vault:
   ```bash
   doppler secrets set GLOBAL_ANTHROPIC_API_KEY=new_value --project imo-creator --config dev
   ```
2. Run sync to push new value to all children:
   ```bash
   ./scripts/fleet-secrets-sync.sh --apply
   ```
3. Verify:
   ```bash
   ./scripts/fleet-secrets-sync.sh --dry-run --verbose
   ```

---

## GARAGE_SIGNING_KEY

| Field | Value |
|-------|-------|
| Status | PENDING |
| Vault Name | `GARAGE_SIGNING_KEY` |
| Category | SOVEREIGN |
| Current Value | `PENDING_HUMAN_GENERATES` |

### Generation Instructions

1. Generate a 256-bit signing key:
   ```bash
   openssl rand -base64 32
   ```
2. Set in Doppler:
   ```bash
   doppler secrets set GARAGE_SIGNING_KEY=<generated_value> --project imo-creator --config dev
   ```
3. Update `FLEET_SECRETS_MANIFEST.yaml`: change `status: "PENDING"` to `status: "ACTIVE"`
4. This key is SOVEREIGN — it is never pushed to children

---

## Rotation Schedule

Per `templates/integrations/DOPPLER.md` and `engine_contract.json`:

| Secret Type | Rotation Frequency |
|-------------|-------------------|
| API Keys | 90 days |
| Tokens | 30 days |
| Passwords | 90 days |
| Signing Keys | 90 days (quarterly) |

### Quarterly Rotation Checklist

- [ ] Rotate all API keys older than 90 days
- [ ] Rotate all tokens older than 30 days
- [ ] Rotate GARAGE_SIGNING_KEY
- [ ] Run `fleet-secrets-sync.sh --apply` to push rotated values
- [ ] Verify all children current: `fleet-secrets-sync.sh --dry-run --verbose`
- [ ] Update rotation dates in operational log

---

## Compliance Checklist

- [x] `doppler.yaml` exists at imo-creator root
- [x] `imo-creator` project created in Doppler dashboard
- [x] dev/stg/prd configs created
- [x] Config branches created for all children
- [x] All child secrets ingested with correct prefix convention
- [x] `FLEET_SECRETS_MANIFEST.yaml` maps every secret
- [x] `fleet-secrets-sync.sh` and `.ps1` scripts operational
- [ ] GARAGE_SIGNING_KEY generated (PENDING — human action)
- [ ] Rotation schedule activated (first rotation: Q2 2026)
- [ ] CI/CD updated to use sovereign vault tokens

---

## Document Control

| Field | Value |
|-------|-------|
| Created | 2026-03-02 |
| Last Modified | 2026-03-02 |
| Authority | Operations (Human + AI) |
| Related Files | `FLEET_SECRETS_MANIFEST.yaml`, `doppler.yaml`, `scripts/fleet-secrets-sync.sh` |
