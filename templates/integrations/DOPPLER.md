# Secrets Management Integration Template

## Conformance

| Field | Value |
|-------|-------|
| **Doctrine Version** | |
| **CC Layer** | CC-03 (Spoke Interface) |

---

## Hub Identity (CC-02)

| Field | Value |
|-------|-------|
| **Sovereign ID** | |
| **Hub Name** | |
| **Hub ID** | |
| **Secrets Project** | |

---

## Overview

All hubs MUST use centralized secrets management.

**No exceptions. No local `.env` files in production.**

This template defines the interface for secrets management spokes (CC-03).

---

## Required Configuration

### doppler.yaml

Every hub MUST have a `doppler.yaml` at the root:

```yaml
setup:
  project: <hub-name>
  config: dev
```

### Environment Configs

| Config | Purpose | Sync Target |
|--------|---------|-------------|
| `dev` | Local development | Local machine |
| `stg` | Staging environment | Staging server |
| `prd` | Production environment | Production server |

---

## Required Secrets (All Hubs)

| Secret | Description | CC Layer | Required |
|--------|-------------|----------|----------|
| `HUB_ID` | Unique hub identifier | CC-02 | Yes |
| `<SECRET_NAME>` | _Description_ | _CC Layer_ | _Yes/No_ |

**Note:** Define secrets based on your hub's specific integrations. Reference CC layers for scope.

---

## Setup Commands

```bash
# Install Doppler CLI
brew install dopplerhq/cli/doppler  # macOS
# or
curl -Ls https://cli.doppler.com/install.sh | sh  # Linux

# Login
doppler login

# Setup project
doppler setup

# Run with secrets
doppler run -- <your-command>

# Example: Run Node.js app
doppler run -- node src/server/main.js

# Example: Run Python app
doppler run -- python main.py
```

---

## Local Development

For local development, create a `.env` file from Doppler:

```bash
# Export secrets to .env (dev only)
doppler secrets download --no-file --format env > .env

# Or run directly with Doppler
doppler run -- npm start
```

**Never commit `.env` files.** They are gitignored.

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Install Doppler CLI
  uses: dopplerhq/cli-action@v3

- name: Run with Doppler
  run: doppler run -- npm run build
  env:
    DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

### Vercel

```bash
# Sync to Vercel
doppler secrets download --no-file --format env | vercel env add
```

---

## Secret Rotation

| Secret Type | Rotation Frequency |
|-------------|-------------------|
| API Keys | 90 days |
| Tokens | 30 days |
| Passwords | 90 days |

---

## Compliance Checklist

- [ ] `doppler.yaml` exists at hub root
- [ ] Project created in Doppler dashboard
- [ ] dev/stg/prd configs created
- [ ] All secrets stored in Doppler
- [ ] No secrets in code or `.env` committed
- [ ] CI/CD uses Doppler token
- [ ] Rotation schedule documented

---

## Traceability

| Artifact | Reference |
|----------|-----------|
| Canonical Doctrine | CANONICAL_ARCHITECTURE_DOCTRINE.md |
| PRD | |
| ADR | |
| Work Item | |
