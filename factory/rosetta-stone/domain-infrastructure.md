# Rosetta Stone — Domain 6: Infrastructure

## Tier 0 Reference: law/doctrine/TIER0_DOCTRINE.md

---

## Gate 1 (50,000 ft) — What IS infrastructure?

**Candidate Constant:** The foundational systems that provide compute, storage, and connectivity so applications can run.

| Validator | Pass/Fail | Reasoning |
|-----------|-----------|-----------|
| IMO | PASS | Regardless of what application runs, infrastructure provides the substrate. |
| CTB | PASS | From Roman aqueducts to cloud providers — the definition holds at every scale. |
| Circle | PASS | Application demand changes → scale infrastructure → demand met → monitor. The loop closes. |

**Verdict:** CONSTANT_LOCKED

---

## Gate 2 (45,000 ft) — Universal Components

**13 Root Concepts extracted and validated:**

| # | Constant | Definition | IMO | CTB | Circle | Verdict |
|---|----------|-----------|-----|-----|--------|---------|
| 1 | Server | A system that receives requests and provides services | PASS | PASS | PASS | LOCKED |
| 2 | Serverless | Abstracting the server so the developer only writes the function | PASS | PASS | PASS | LOCKED |
| 3 | Container | An isolated, portable runtime environment for an application | PASS | PASS | PASS | LOCKED |
| 4 | Deployment | The process of moving code from development to production | PASS | PASS | PASS | LOCKED |
| 5 | Environment | A distinct configuration context (dev, staging, production) | PASS | PASS | PASS | LOCKED |
| 6 | DNS | The addressing system that maps names to infrastructure locations | PASS | PASS | PASS | LOCKED |
| 7 | CDN | Distributing content to edge locations closer to users | PASS | PASS | PASS | LOCKED |
| 8 | Storage | Persistent data retention independent of compute lifecycle | PASS | PASS | PASS | LOCKED |
| 9 | Compute | Processing power that executes application logic | PASS | PASS | PASS | LOCKED |
| 10 | Edge | Processing at the closest point to the user rather than a central location | PASS | PASS | PASS | LOCKED |
| 11 | Scaling | Adjusting capacity to match demand | PASS | PASS | PASS | LOCKED |
| 12 | Monitoring | Observing system behavior to detect anomalies | PASS | PASS | PASS | LOCKED |
| 13 | Logging | Recording system events for diagnosis and audit | PASS | PASS | PASS | LOCKED |

**Back-propagation check:** Clean.

---

## Gate 3 (40,000 ft) — Process Constant (IMO)

Every infrastructure operation follows IMO:
- **Input:** Application code + configuration + traffic
- **Middle:** Infrastructure provisions, routes, scales, and serves
- **Output:** Application running, accessible, and monitored

**Verdict:** CONSTANT_LOCKED

---

## Gate 4 (35,000 ft) — Organization Constant (CTB)

Every infrastructure organizes as CTB:
- **Trunk:** The platform (the provider / the physical layer)
- **Branches:** Compute layer, storage layer, network layer
- **Leaves:** Individual services, instances, volumes, routes

**Verdict:** CONSTANT_LOCKED

---

## Gate 5 — Rosetta Stone Matrix

| Root Concept | Cloudflare | AWS | GCP | Aqueducts (Historical) | Railroads (Historical) | Power Grids (Historical) |
|-------------|-----------|-----|-----|----------------------|----------------------|------------------------|
| Server | Workers (V8 isolates) | EC2 instances | Compute Engine VMs | Cistern / reservoir | Station / depot | Power plant |
| Serverless | Workers (default) | Lambda | Cloud Functions / Cloud Run | N/A (always physical) | N/A | N/A |
| Container | N/A (V8 isolates instead) | ECS / EKS / Fargate | GKE / Cloud Run | Modular pipe sections | Standard gauge boxcar | Transformer box |
| Deployment | `wrangler deploy` | CodeDeploy / ECS deploy | Cloud Deploy / Cloud Build | New channel construction | New rail line opening | New line energizing |
| Environment | Dev/staging/prod Workers | Accounts / VPCs / stages | Projects / environments | Different aqueduct branches | Different rail lines (freight vs passenger) | Different circuits (residential vs industrial) |
| DNS | CF DNS (authoritative) | Route 53 | Cloud DNS | Road signs / markers | Station name boards | Grid naming convention |
| CDN | CF CDN (global edge) | CloudFront | Cloud CDN | Branch channels near town | Local freight yards | Substations near consumers |
| Storage | D1, KV, R2, Durable Objects | S3, EBS, EFS, DynamoDB | Cloud Storage, Persistent Disks, BigQuery | Reservoirs / cisterns | Warehouses / yards | Batteries / capacitors |
| Compute | Workers CPU time | EC2 vCPUs / Lambda duration | GCE vCPUs / Cloud Functions | Water pressure (gravitational) | Steam pressure / diesel power | Electrical generation (MW) |
| Edge | 300+ global PoPs | CloudFront edge / Lambda@Edge | Cloud CDN / edge functions | Local fountain (point of delivery) | Local station | Local transformer |
| Scaling | Auto-scales per-request | Auto Scaling Groups / Lambda concurrency | Autoscaler / Cloud Run max instances | Build more channels | Add more trains / tracks | Add more generators / lines |
| Monitoring | CF Analytics / Workers Analytics | CloudWatch | Cloud Monitoring | Inspectors walking the line | Signal system / telegraphed reports | Meters / gauges |
| Logging | Workers Logs / Logpush | CloudWatch Logs | Cloud Logging | Maintenance records | Station logbooks | Fault recorders |

---

## Gate 6 — Circle Validation (Feedback Patterns)

| Circle Pattern | Description | Universal? |
|---------------|-------------|------------|
| Scaling Circle | Traffic increases → autoscale → capacity matches demand → monitor | YES — from adding aqueduct branches to CF auto-scaling |
| Failure Circle | Service down → alert fires → restart/failover → service restored → postmortem | YES — from pipe repair to incident response |
| Cost Circle | Bill spikes → analyze usage → optimize → cost reduced | YES — from maintenance budget to cloud spend |
| Evolution Circle | Technology ages → plan migration → deploy new → decommission old | YES — from aqueduct replacement to cloud migration |

**Verdict:** All four CONSTANT_LOCKED.

---

## Gate 7 — True Variables Isolated

| Variable | Why It's a Variable |
|----------|-------------------|
| Pricing model | Pay-per-request vs reserved vs on-demand vs capital expenditure |
| CLI / management tool | wrangler vs aws-cli vs gcloud vs physical inspection |
| Region model | Anycast (CF) vs multi-region (AWS) vs multi-region (GCP) vs geographic |
| Config format | wrangler.toml vs CloudFormation YAML vs Terraform HCL |
| Isolation model | V8 isolates vs containers vs VMs vs physical separation |
| SLA guarantees | 100% (CF Enterprise) vs 99.99% (AWS) vs 99.95% (GCP) |

**Variable count:** 6 — within tolerance.

---

## Summary

| Metric | Value |
|--------|-------|
| Total gates | 7 |
| Constants locked | 13 root concepts + 3 structural + 4 circles = 20 |
| Variables isolated | 6 |
| Back-propagation events | 0 |
| Domain-agnostic check | PASS — constants hold from aqueducts to serverless edge |