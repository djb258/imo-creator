# Workers Limits & Pricing Reference

## Full Limits Table

| Resource | Free Plan | Paid Plan ($5/mo) |
|----------|-----------|-------------------|
| Requests | 100K/day | 10M/mo included, then $0.30/M |
| CPU time | 10ms | 30s default, up to 5 min via cpu_ms |
| CPU cost | — | 30M ms included, then $0.02/M ms |
| Memory | 128MB | 128MB |
| Script size | 1MB | 10MB compressed |
| Workers/account | 100 | 500 (request increase or use Workers for Platforms) |
| Routes/zone | — | 1,000 (remote dev: 50) |
| Static assets | 20,000/version | 100,000/version (Wrangler 4.34.0+) |
| Static asset size | 25MB each | 25MB each |
| Env variables | 64, each up to 5KB | 64, each up to 5KB |
| Subrequests/invocation | 1,000 | 1,000 |
| Request body | Plan-dependent | Plan-dependent (enterprise can increase) |
| Response body | Unlimited | Unlimited |

## CPU Time Explained

CPU time = actual computation time. Waiting on network (fetch, KV, DB) does NOT count.
Average Worker: ~2.2ms. Heavy workloads (auth, SSR, parsing): 10-20ms.

When a Worker exceeds CPU limit:
- Error 1102 returned to client ("Worker exceeded resource limits")
- Dashboard shows "Exceeded CPU Time Limits" under Metrics > Errors
- Analytics: invocation outcome = `exceededCpu`

**Mitigation options:**
1. Set higher `cpu_ms` in wrangler config (up to 300,000)
2. CPU profile with DevTools to find hot spots
3. Offload to Durable Objects or chunk across multiple requests

## Builds

| Resource | Limit |
|----------|-------|
| Build timeout | Configurable |
| Concurrent builds | Account-limited |
| Env variables | 64 per Worker, each up to 5KB |

## Cost Examples

100M requests/month at 7ms avg CPU:
- Requests: (100M - 10M) × $0.30/M = $27
- CPU: (700M ms - 30M ms) × $0.02/M ms = $13.40
- Total: ~$45/month + $5 base = ~$50/month

This is cheap. The danger is unbounded CPU time on parsing/crypto workloads without
a cpu_ms cap set.

## KV Pricing Detail

| Metric | Free | Paid |
|--------|------|------|
| Reads | 100K/day | $0.50/M |
| Writes | 1K/day | $5.00/M |
| Deletes | 1K/day | $5.00/M |
| List | 1K/day | $5.00/M |
| Storage | 1GB | $0.50/GB-month |

Writes are 10x the cost of reads. Design accordingly — cache aggressively, write sparingly.
