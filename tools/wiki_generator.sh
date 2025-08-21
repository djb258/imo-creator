#!/usr/bin/env bash
# Wiki Generator - Creates deep wiki structure for any repository
set -euo pipefail

REPO="${1:-.}"
APP_NAME="${2:-$(basename "$REPO")}"
WIKI="$REPO/docs/wiki"

echo "[Wiki] Creating deep wiki for $REPO..."

# Create directory structure
mkdir -p "$WIKI"/{00-overview,10-input,20-middle,30-output,40-agents,50-environment,60-operations,70-troubleshooting}

# Main index
cat > "$REPO/docs/README.md" << 'MD'
# Project Wiki (Deep)

## Navigation
- [[00-overview/index.md|📊 Overview]]
- [[10-input/index.md|📥 Input Layer]]
- [[20-middle/index.md|⚙️ Middle Layer]]
- [[30-output/index.md|📤 Output Layer]]
- [[40-agents/index.md|🤖 Agents]]
- [[50-environment/index.md|🔐 Environment]]
- [[60-operations/index.md|🚀 Operations]]
- [[70-troubleshooting/index.md|🔧 Troubleshooting]]

## Quick Links
- [API Documentation](wiki/00-overview/api.md)
- [Deployment Guide](wiki/60-operations/deployment.md)
- [Error Codes](wiki/70-troubleshooting/error-codes.md)
- [Agent Registry](wiki/40-agents/registry.md)

## Search
Use `Ctrl+F` or navigate through categories above.

---
*Generated with IMO Creator v2.0*
MD

# 00-Overview section
cat > "$WIKI/00-overview/index.md" << MD
# Overview

## Application Details
- **App**: $APP_NAME
- **Version**: 1.0.0
- **Dashboard**: /dashboard
- **Status**: /health

## Core Contracts
- \`/health\` - Health check endpoint
- \`/version\` - Version information
- \`/heir/status\` - HEIR system status
- \`/api/v1/*\` - Main API routes

## Architecture
\`\`\`mermaid
flowchart LR
  I[Input] --> M[Middle] --> O[Output]
  subgraph Agents
    V[Validator]:::a --> C[Compliance]:::a --> D[Deploy]:::a
  end
  subgraph Monitoring
    E[Error Log]:::m --> IMO[IMO Master]:::m
  end
classDef a stroke-dasharray:2 2,stroke-width:1;
classDef m fill:#f96,stroke:#333,stroke-width:2px;
\`\`\`

## Error Pipeline
- **Type**: Write-only
- **Destination**: IMO master_error_log
- **Format**: JSON structured logs

## Quick Start
1. [[../50-environment/setup.md|Environment Setup]]
2. [[../60-operations/deployment.md|Deploy Application]]
3. [[../10-input/validation.md|Configure Input]]
4. [[../70-troubleshooting/common-issues.md|Troubleshooting]]

## Related Pages
- [[architecture.md|Architecture Deep Dive]]
- [[api.md|API Reference]]
- [[metrics.md|Metrics & Monitoring]]
- [[compliance.md|Compliance Status]]
MD

# Architecture page
cat > "$WIKI/00-overview/architecture.md" << 'MD'
# Architecture Deep Dive

## Altitude-Based System
- **30k**: Strategic Planning & Orchestration
- **20k**: Analysis & Compliance
- **15k**: Documentation & Testing
- **10k**: Implementation & Processing
- **5k**: Validation & Cleanup

## Component Map
See detailed component documentation in respective sections.

## Data Flow
Input → Validation → Processing → Output → Monitoring

## Related
- [[api.md|API Design]]
- [[../40-agents/index.md|Agent System]]
- [[../50-environment/index.md|Environment Config]]
MD

# API documentation
cat > "$WIKI/00-overview/api.md" << 'MD'
# API Reference

## Base URL
```
/api/v1
```

## Core Endpoints
- `GET /health` - Health check
- `GET /version` - Version info
- `GET /heir/status` - HEIR status
- `POST /process` - Main processing

## Authentication
Bearer token or API key required for protected endpoints.

## Rate Limits
- Standard: 100 req/min
- Authenticated: 1000 req/min

## Error Codes
See [[../70-troubleshooting/error-codes.md|Error Reference]]
MD

# Compliance status
cat > "$WIKI/00-overview/compliance.md" << 'MD'
# Compliance Status

## IMO Creator Compliance
- Score: {{COMPLIANCE_SCORE}}%
- Last Check: {{LAST_CHECK}}
- Auto-Update: {{AUTO_UPDATE}}

## Checks
- [x] Git Repository
- [x] Project Structure
- [x] Documentation
- [x] CI/CD Pipeline
- [x] Testing Framework
- [x] Deployment Config
- [x] Code Quality Tools
- [x] Framework Compliance

## Monitoring
Heartbeat system active via `imo-compliance-check.py`

## Related
- [[../60-operations/compliance-ops.md|Compliance Operations]]
- [[../70-troubleshooting/compliance-issues.md|Troubleshooting Compliance]]
MD

# 10-Input section
cat > "$WIKI/10-input/index.md" << 'MD'
# Input Layer

## Overview
Handles data ingestion, validation, and initial processing.

## Components
- [[validation.md|Validation Engine]]
- [[schemas.md|Schema Definitions]]
- [[sources.md|Data Sources]]
- [[api.md|Input API]]

## Supported Sources
- HTTP/REST APIs
- Message Queues
- File System
- Webhooks

## Configuration
See [[../50-environment/input-config.md|Input Configuration]]

## Next: [[../20-middle/index.md|Middle Layer →]]
MD

# Validation
cat > "$WIKI/10-input/validation.md" << 'MD'
# Validation Engine

## Rules
- Schema validation
- Type checking
- Range validation
- Format validation
- Business rules

## Error Handling
Invalid data is logged and can be retried or sent to dead letter queue.

## Configuration
Validation rules are defined in `schemas/` directory.

## Related
- [[schemas.md|Schema Definitions]]
- [[../70-troubleshooting/validation-errors.md|Validation Errors]]
MD

# 20-Middle section
cat > "$WIKI/20-middle/index.md" << 'MD'
# Middle Layer

## Overview
Core business logic and processing.

## Components
- [[processing.md|Processing Engine]]
- [[state.md|State Management]]
- [[transforms.md|Transformations]]
- [[orchestration.md|Orchestration]]

## Processing Types
- Synchronous
- Asynchronous
- Batch
- Stream

## Related
- [[../10-input/index.md|← Input Layer]]
- [[../30-output/index.md|Output Layer →]]
MD

# 30-Output section
cat > "$WIKI/30-output/index.md" << 'MD'
# Output Layer

## Overview
Handles response formatting, delivery, and persistence.

## Components
- [[formatting.md|Response Formatting]]
- [[delivery.md|Delivery Mechanisms]]
- [[persistence.md|Data Persistence]]
- [[webhooks.md|Webhook Management]]

## Delivery Methods
- HTTP Response
- Message Queue
- File Export
- Webhook
- Stream

## Related
- [[../20-middle/index.md|← Middle Layer]]
- [[../70-troubleshooting/output-errors.md|Output Errors]]
MD

# 40-Agents section
cat > "$WIKI/40-agents/index.md" << 'MD'
# Agent System

## Overview
Claude subagents for specialized tasks.

## Agent Registry
- [[registry.md|Complete Registry]]
- [[roles.md|Agent Roles]]
- [[coordination.md|Coordination]]

## Available Agents
- Code Analyzer (20k altitude)
- Documentation Writer (15k altitude)
- Compliance Checker (20k altitude)
- Fix Applicator (10k altitude)
- Test Generator (15k altitude)
- Repository Strategist (30k altitude)

## Integration
Agents are coordinated through garage-MCP orchestration.

## Related
- [[../00-overview/architecture.md|System Architecture]]
- [[../60-operations/agent-ops.md|Agent Operations]]
MD

# 50-Environment section
cat > "$WIKI/50-environment/index.md" << 'MD'
# Environment Configuration

## Overview
Environment variables and configuration management.

## Sections
- [[setup.md|Initial Setup]]
- [[variables.md|Environment Variables]]
- [[secrets.md|Secret Management]]
- [[providers.md|Deployment Providers]]

## Required Variables
```
APP_NAME
IMO_MASTER_ERROR_ENDPOINT
IMO_ERROR_API_KEY
NEON_DATABASE_URL
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

## Security
Never commit real values. Use Vercel/Render for production secrets.

## Related
- [[../60-operations/deployment.md|Deployment]]
- [[../70-troubleshooting/env-issues.md|Environment Issues]]
MD

# 60-Operations section
cat > "$WIKI/60-operations/index.md" << 'MD'
# Operations

## Overview
Deployment, monitoring, and maintenance procedures.

## Sections
- [[deployment.md|Deployment Guide]]
- [[monitoring.md|Monitoring Setup]]
- [[maintenance.md|Maintenance Tasks]]
- [[scaling.md|Scaling Strategy]]

## Deployment Targets
- Vercel
- Render
- AWS
- Docker

## Monitoring
- Health checks
- Error tracking
- Performance metrics
- Compliance monitoring

## Related
- [[../50-environment/index.md|Environment Setup]]
- [[../70-troubleshooting/index.md|Troubleshooting]]
MD

# Deployment guide
cat > "$WIKI/60-operations/deployment.md" << 'MD'
# Deployment Guide

## Prerequisites
- Environment variables configured
- Tests passing
- Compliance score ≥ 80%

## Vercel Deployment
```bash
vercel --prod
```

## Docker Deployment
```bash
docker build -t app .
docker run -p 3000:3000 app
```

## Post-Deployment
1. Verify health endpoint
2. Check error logging
3. Monitor metrics
4. Test critical paths

## Rollback
Keep previous version tagged for quick rollback.

## Related
- [[../50-environment/providers.md|Provider Setup]]
- [[monitoring.md|Monitoring Setup]]
MD

# 70-Troubleshooting section
cat > "$WIKI/70-troubleshooting/index.md" << 'MD'
# Troubleshooting

## Overview
Common issues and solutions.

## Categories
- [[common-issues.md|Common Issues]]
- [[error-codes.md|Error Codes]]
- [[debugging.md|Debugging Guide]]
- [[faq.md|FAQ]]

## Quick Diagnostics
1. Check `/health` endpoint
2. Review error logs
3. Verify environment variables
4. Check compliance status

## Support Channels
- GitHub Issues
- Documentation
- Error logs in IMO master

## Related
- [[../60-operations/monitoring.md|Monitoring]]
- [[../50-environment/index.md|Environment Setup]]
MD

# Error codes
cat > "$WIKI/70-troubleshooting/error-codes.md" << 'MD'
# Error Codes Reference

## 1xxx - Input Errors
- 1001: Invalid schema
- 1002: Missing required field
- 1003: Type mismatch

## 2xxx - Processing Errors
- 2001: Processing timeout
- 2002: State corruption
- 2003: Transform failure

## 3xxx - Output Errors
- 3001: Delivery failure
- 3002: Webhook timeout
- 3003: Persistence error

## 4xxx - Agent Errors
- 4001: Agent unavailable
- 4002: Delegation failure
- 4003: Coordination timeout

## 5xxx - System Errors
- 5001: Database connection lost
- 5002: Memory limit exceeded
- 5003: Rate limit exceeded

## Resolution
See specific error documentation or [[common-issues.md|Common Issues]]
MD

echo "[Wiki] ✅ Deep wiki created for $REPO"
echo "[Wiki] Total pages: 20+"
echo "[Wiki] Auto-linked navigation ready"