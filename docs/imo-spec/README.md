# IMO Factory + Garage Enforcement System

## Overview

This directory contains the HEIR/ORBT compliant specification and enforcement system for the IMO-Creator Factory and Garage architecture.

## 🚦 Quick Status

Run `npm run factory:check` to validate the entire system. The garage will NOT start without a passing health check.

## 📋 VIN Format Rules

All IMO systems must have a valid VIN (Vehicle Identification Number) following this format:

```
XXX-YYYY-MM-SYSTEM-MODE-VN
```

### Components:
- **XXX**: System prefix (always "IMO")
- **YYYY**: Year (4 digits)
- **MM**: Month (2 digits, zero-padded)
- **SYSTEM**: System type (`FACTORY`, `GARAGE`, `HYBRID`)
- **MODE**: Environment (`DEV`, `STAGING`, `PROD`)
- **VN**: Version number (V followed by digits)

### Example:
```
IMO-2025-01-FACTORY-GARAGE-V1
```

## 🔒 HEIR/ORBT Compliance

The system enforces three critical HEIR rules:

### 1. STAMPED (Single Truth And Manifest Protocol for Event Delivery)
- ✅ Every flow must have a unique VIN
- ✅ Metadata must be stamped with creation timestamp
- ✅ All events must have correlation IDs

### 2. SPVPET (Schema Protocol Validation for Process Event Tracking)
- ✅ JSON Schema validation for all specs
- ✅ Process state tracking through gatekeepers
- ✅ Event protocol enforcement

### 3. STACKED (Staged Tracking And Compliance Key for Event Distribution)
- ✅ Progress tracking through stages
- ✅ Compliance signatures required
- ✅ Event distribution validation

## 🚪 Gatekeepers

Three mandatory gatekeepers enforce flow control:

1. **input_gate**: Validates incoming data
2. **middle_gate**: Ensures transformation compliance
3. **output_gate**: Verifies distribution readiness

## 🎯 Validation Scripts

### Core Commands

```bash
# Run full factory check (required before garage start)
npm run factory:check

# Validate spec files only
npm run factory:validate

# Generate flow visualizations
npm run factory:diagram

# Export production artifacts (only if health check passes)
npm run factory:export

# Start garage (requires passing health check)
npm run garage:start
```

### CI Integration

```yaml
# GitHub Actions example
- name: Factory Check
  run: npm run factory:check
  
- name: Export if passed
  if: success()
  run: npm run factory:export
```

## 📊 Health Status

The system generates `health.json` with per-page status:

```json
{
  "overall": "pass|warn|fail",
  "checks": {
    "vin_format": { "status": "pass", "message": "..." },
    "schema_congruence": { "status": "pass", "message": "..." },
    "gatekeeper_presence": { "status": "pass", "message": "..." },
    "validator_status": { "status": "pass", "message": "..." },
    "telemetry_active": { "status": "pass", "message": "..." },
    "heir_compliance": { "status": "pass", "message": "..." }
  },
  "pages": {
    "overview": { "status": "pass", ... },
    "input": { "status": "pass", ... },
    "middle": { "status": "pass", ... },
    "output": { "status": "pass", ... }
  }
}
```

## 🛑 Kill Switches

Two kill switches provide emergency control:

1. **Emergency Stop**: Create `.imo/EMERGENCY_STOP` file to halt all operations
2. **Compliance Violation**: Automatic trigger on 3+ violations within 60 seconds

## 📈 Telemetry Requirements

Minimum required events:
- `flow_start`
- `page_transition`
- `validation_result`
- `flow_complete`
- `error_occurred`

All events must include:
- `timestamp`
- `event_type`
- `flow_id`
- `session_id`
- `vin`

## 🎄 Whimsical Visualization

Run `npm run factory:diagram` to generate:
1. `diagram.mmd` - Mermaid flowchart
2. `whimsical_prompt.txt` - Paste-ready prompt for Christmas tree visualization

## 🚗 Garage Entrypoint

The garage system will:
1. ❌ **REFUSE** to start without a valid `health.json`
2. ❌ **REFUSE** to start if health check failed
3. ❌ **REFUSE** to start if kill switch is active
4. ⚠️  **WARN** but proceed if health check has warnings
5. ✅ **START** only with passing HEIR compliance

## 📦 Factory Export

When `factory:check` passes, run `factory:export` to create:
- `/dist/factory-export/` - Complete validated artifacts
- `/dist/factory-export.tar.gz` - Compressed archive
- Checksums for all exported files
- Full compliance documentation

## 🔧 Development Workflow

1. **Edit specs** in `/docs/imo-spec/`
2. **Run validation**: `npm run factory:check`
3. **Fix any errors** reported
4. **Generate visuals**: `npm run factory:diagram`
5. **Start garage**: `npm run garage:start`
6. **Export for production**: `npm run factory:export`

## ⚠️ Important Notes

- Health checks expire after 24 hours
- VIN must be unique per deployment
- Gatekeepers are mandatory, not optional
- Telemetry is required for production
- HEIR compliance is non-negotiable

## 📚 Files

### Specification Files
- `flow.json` - Main flow specification
- `globals.yaml` - Global configuration
- `compliance.yaml` - HEIR/ORBT rules
- `pages/*.page.json` - Individual page specs

### Generated Files
- `health.json` - Current health status
- `diagram.mmd` - Mermaid diagram
- `whimsical_prompt.txt` - Visualization prompt

### Scripts
- `validate-spec.ts` - Zod schema validation
- `factory-check.ts` - Comprehensive health check
- `flow-to-mermaid.ts` - Diagram generation
- `factory-export.ts` - Production export
- `garage-entrypoint.ts` - Garage startup with enforcement

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run factory check
npm run factory:check

# If passed, start garage
npm run garage:start

# For production
npm run factory:export
```

---

**Remember**: The garage won't start without a GREEN health check stamped by the HEIR ruleset!