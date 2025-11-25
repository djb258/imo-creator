---
title: "5,000ft - Ops"
aliases: [ops, 5k, operations, deployment]
tags:
  - altitude/5k
  - doctrine/master
created: 2025-11-25
updated: 2025-11-25
---

# 5,000ft - Ops

> **Altitude**: Operational / How it runs in production
> **Audience**: DevOps, SRE, on-call engineers

---

## Deployment Model

### Infrastructure

| Component | Platform | Region | Scaling |
|-----------|----------|--------|---------|
| Web Frontend | Vercel | Edge (global) | Auto |
| Backend API | Render | US-East | Manual (1 instance) |
| MCP Server | Render | US-East | Manual (1 instance) |
| Sidecar Logger | Render | US-East | Manual (1 instance) |
| Database | Neon | US-East | Serverless |
| Object Storage | Backblaze B2 | US-West | Unlimited |

### Deployment Pipeline

```
Push to main
     │
     ├──▶ Vercel (auto-deploy frontend)
     │
     └──▶ GitHub Actions
              │
              ├──▶ Run tests
              ├──▶ HEIR compliance check
              └──▶ Render deploy (backend)
```

---

## Service Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `COMPOSIO_API_KEY` | Yes | Composio auth |
| `ANTHROPIC_API_KEY` | Yes | Claude API |
| `OPENAI_API_KEY` | Yes | OpenAI API |
| `VERCEL_TOKEN` | Yes | Vercel deploy |
| `RENDER_TOKEN` | Yes | Render deploy |
| `B2_KEY_ID` | Yes | Backblaze B2 |
| `B2_APPLICATION_KEY` | Yes | Backblaze B2 |
| `POSTGRES_URL` | Optional | Neon connection |

### Config Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment config |
| `render.yaml` | Render services config |
| `.env.template` | Environment template |
| `heir.doctrine.yaml` | HEIR compliance config |
| `config/mcp_registry.json` | MCP tool registry |

---

## Scheduled Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| GitIngest | Weekly (Sunday 2am) | Update search indexes |
| Diagram Gen | On push to main | Update architecture diagrams |
| Summary Gen | Daily (6am) | Update narrative summaries |
| DLQ Cleanup | Weekly (Monday 3am) | Purge old DLQ items |
| Health Check | Every 5 min | Monitor service health |

---

## Health Checks

| Endpoint | Expected | Alert Threshold |
|----------|----------|-----------------|
| `/health` | 200 OK | > 2 failures in 5 min |
| `/api/health/composio` | 200 OK | > 1 failure |
| `/api/health/mcp` | 200 OK | > 1 failure |
| Neon connection | Connected | Any failure |
| B2 connection | Connected | Any failure |

---

## SLAs

| Metric | Target | Current |
|--------|--------|---------|
| Uptime | 99.5% | - |
| API Response (p50) | < 500ms | - |
| API Response (p99) | < 2s | - |
| Scaffold Time | < 30s | - |
| Diagram Gen Time | < 60s | - |

**Note**: Solo dev operation - no formal SLA, best effort.

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 | Service completely down | Immediate |
| P2 | Major feature broken | < 4 hours |
| P3 | Minor issue, workaround exists | < 24 hours |
| P4 | Enhancement request | Backlog |

### Runbooks

| Incident | Runbook |
|----------|---------|
| Vercel deploy failed | Check build logs, rollback if needed |
| Render service down | Check Render dashboard, restart service |
| Composio unreachable | Fallback spokes should activate automatically |
| DB connection failed | Check Neon status, verify connection string |
| B2 upload failed | Check B2 status, verify credentials |

---

## Monitoring

### Logs

| Source | Location |
|--------|----------|
| Vercel | Vercel dashboard |
| Render | Render logs |
| Sidecar | Sidecar log stream |
| GitHub Actions | Actions tab |

### Metrics

| Metric | Source |
|--------|--------|
| Request count | Vercel analytics |
| Error rate | Sidecar events |
| Latency | Vercel/Render metrics |
| DLQ depth | B2 object count |

### Alerts

| Alert | Condition | Channel |
|-------|-----------|---------|
| Service down | Health check fails | Email |
| High error rate | > 5% errors in 10 min | Email |
| DLQ growing | > 100 items | Email |

---

## Backup & Recovery

| Data | Backup | Recovery |
|------|--------|----------|
| Neon DB | Auto (Neon feature) | Point-in-time restore |
| B2 objects | None (source of truth) | N/A |
| Config | Git repo | Git checkout |
| Secrets | Local .env | Manual restore |

---

## Cost Model

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Free/Pro | $0-20 |
| Render | Starter | $7 |
| Neon | Free | $0 |
| Backblaze B2 | Pay-as-you-go | ~$5 |
| OpenAI | Pay-as-you-go | Variable |
| Anthropic | Pay-as-you-go | Variable |

**Estimated monthly**: $15-50 (excluding LLM usage)

---

## Related Docs

- [render.yaml](../../render.yaml) - Render config
- [vercel.json](../../vercel.json) - Vercel config
- [BACKBLAZE_B2_SETUP.md](../BACKBLAZE_B2_SETUP.md) - B2 setup
- [.env.template](../../.env.template) - Environment template
