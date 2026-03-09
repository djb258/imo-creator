# Neon Pricing Reference

## Plan Comparison (Post-Databricks, Aug 2025)

### Free Plan
- Projects: up to 100
- Compute: 100 CU-hours/project/month
  - 0.25 CU (1 vCPU, 4GB RAM) runs for 400 hours on this budget
  - That's ~16.6 hours/day — enough for dev if you have scale-to-zero working
- Storage: 0.5 GB per project, 5 GB aggregate across account
- Egress: 5 GB/month
- Branches: unlimited within compute allocation
- History retention: 24 hours
- No credit card. Commercial use allowed.

### Launch Plan (no monthly minimum)
- Compute: $0.106/CU-hour
- Storage: $0.30/GB-month (first 50-100 GB), $0.15/GB-month after
- Branches: 10 included/project, extra at $0.002/branch-hour
- Max autoscaling: 16 CU (16 vCPU, 64 GB RAM)
- No SLA

### Scale Plan (production-grade)
- Compute: $0.222/CU-hour
- Storage: same tiers as Launch
- Max CU: 56 (56 vCPU, 224 GB RAM). Fixed computes above 16 CU available
- Includes: Private Link, 99.95% SLA, SOC2 Type 2, HIPAA, SSO, dedicated support

### Agent Plan
- Custom resource limits and credits for AI agent platforms provisioning thousands of DBs

## Compute Unit (CU) Explained

1 CU ≈ 4 GB RAM + proportional CPU + local SSD

| CU | RAM | Approximate vCPU |
|----|-----|-------------------|
| 0.25 | 1 GB | 0.25 |
| 0.50 | 2 GB | 0.5 |
| 1 | 4 GB | 1 |
| 2 | 8 GB | 2 |
| 4 | 16 GB | 4 |
| 8 | 32 GB | 8 |
| 16 | 64 GB | 16 |

## Cost Examples

### Small dev database (Free plan fits)
- 0.25 CU, runs 6 hours/day with scale-to-zero
- Monthly compute: 0.25 CU × 6 hr × 30 days = 45 CU-hours (under 100 limit)
- Storage: 200 MB (under 0.5 GB limit)
- Cost: $0

### Production app (Launch plan)
- 1 CU average, runs 24/7 (no scale-to-zero in production)
- Monthly compute: 1 CU × 720 hours = 720 CU-hours × $0.106 = $76.32
- Storage: 5 GB × $0.30 = $1.50
- Total: ~$78/month

### High-traffic app (Scale plan)
- 4 CU average, autoscaling to 8 CU during peaks
- Monthly compute: ~4,000 CU-hours × $0.222 = $888
- Storage: 50 GB × $0.30 = $15
- Total: ~$900/month

## Storage Billing Details

Storage is measured hourly, summed monthly as GB-months. Two components:
1. **Data size**: actual data in your tables
2. **Change history**: retained for Time Travel (configurable retention period)

Longer history = more storage cost. Default retention is 24 hours on free, longer on paid.

### Branch Storage
- Child branches start at zero storage
- Billed for minimum of (accumulated changes since branch) or (logical data size)
- Setting TTL on dev/preview branches prevents storage creep
- Example: Launch plan, 2 extra branches for 5 hours each = 10 branch-hours × $0.002 = $0.02

## Neon Auth
Included at no cost up to 1M monthly active users (paid plans) or 60K MAU (free plan).
Based on Better Auth with one-click install.

## Cost Control Strategies

1. **Set max autoscaling limit**: e.g., max 2 CU means you never exceed 2 CU-hours/hour
2. **Scale-to-zero on dev/staging**: no connections = no compute bill
3. **Branch TTL**: auto-delete dev branches after N hours
4. **Index aggressively**: unindexed queries waste compute on full scans
5. **Use pooled connections**: reduces compute pressure from connection overhead
6. **Monitor CU-hours**: Neon console shows real-time usage
