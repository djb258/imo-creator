---
role: workbench_db
version: 1.0.0
altitude: 5k
driver: firebase
status: active
---

# Workbench DB ORT Manual

## Overview

**Role**: WORKBENCH_DB
**Purpose**: Staging database for active operations, validation queues, temporary data processing
**Altitude**: 5k ft (Data Layer)
**Current Driver**: Firebase Realtime Database

## Operate

### Normal Operations

**Health Check**:
```bash
# Check workbench status
ts-node /manual/scripts/status_check.ts

# Expected: {"workbench_db": {"status": "healthy", "latency_ms": 60}}
```

**Daily Operations**:
1. Monitor document count and storage usage
2. Review validation queue backlog
3. Check promotion flow to vault_db
4. Verify gatekeeper integration

### Data Flow

```
Input → Workbench (staging) → Gatekeeper (validation) → Vault (production)
```

## Repair

### Failure Mode 1: Connection Timeout

**Symptoms**: Status "disconnected", timeout errors

**Repair**:
1. Verify Firebase credentials in `.env`
2. Check network connectivity
3. Verify Firebase project status
4. Restart MCP server

**Resolution**: 5-10 minutes

### Failure Mode 2: Validation Queue Backlog

**Symptoms**: High document count, slow promotions

**Repair**:
1. Check gatekeeper performance
2. Review validation rules complexity
3. Scale Firebase resources if needed
4. Consider batch processing

**Resolution**: 15-30 minutes

## Build

**Setup**:
```bash
# Install Firebase SDK
npm install firebase-admin

# Configure
export FIREBASE_PROJECT_ID=your-project
export FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Test connection
node test-firebase-connection.js
```

## Train

**Key Concepts**:
- Staging memory with HEIR/ORBT tracking
- Validation queue management
- Promotion flow to vault_db
- Gatekeeper integration

**Practice**: Simulate validation backlog and recovery

---

**Driver Manifest**: `/drivers/workbench_db/driver_manifest.json`
**Status**: `/manual/troubleshooting/system_diagnostics.json#workbench_db`
