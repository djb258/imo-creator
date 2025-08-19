# IMO Creator HEIR/MCP Quickstart

This guide helps you get started with the HEIR (Hierarchical Error-handling, ID management, and Reporting) and MCP (Model Context Protocol) integration.

## Prerequisites

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

## Service Architecture

IMO Creator runs three services for full HEIR/MCP functionality:

- **Main API** (`:7002`): Blueprint management and LLM endpoints
- **MCP Server** (`:7001`): HEIR validation endpoint `/heir/check`  
- **Sidecar Server** (`:8000`): Event logging to `./logs/sidecar.ndjson`

## Quick Start

### 1. Start Services

```bash
# Terminal 1: Start Sidecar event logger
make run-sidecar

# Terminal 2: Start MCP server  
make run-mcp

# Terminal 3: Start main API (optional)
make run-api
```

### 2. Verify Services

```bash
# Check service health
curl http://localhost:8000/health  # Sidecar
curl http://localhost:7001/health  # MCP
curl http://localhost:7002/        # Main API
```

### 3. Run Demo Client

```bash
# Run comprehensive demo
python tools/demo_client.py
```

## Manual Testing

### HEIR Validation

```bash
# Test HEIR compliance check
curl -X POST http://localhost:7001/heir/check \
  -H "Content-Type: application/json" \
  -d '{
    "ssot": {
      "meta": {"app_name": "imo-creator"},
      "doctrine": {"schema_version": "HEIR/1.0"}
    }
  }'

# Expected response:
# {"ok": true, "details": {...}}
```

### Event Logging

```bash
# Log a telemetry event
curl -X POST http://localhost:8000/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "action.invoked",
    "payload": {"action": "test", "result": "success"},
    "tags": {
      "unique_id": "test-123",
      "process_id": "test-process"
    }
  }'

# View recent events
curl http://localhost:8000/events/recent?limit=5
```

### Environment Variables

The system uses these environment variables from `.env`:

```bash
# HEIR/MCP Integration
IMOCREATOR_MCP_URL=http://localhost:7001
IMOCREATOR_SIDECAR_URL=http://localhost:8000
IMOCREATOR_BEARER_TOKEN=local-dev-token

# Example with environment variable expansion
export UNIQUE_ID="demo-$(date +%s)"
export PROCESS_ID="quickstart-process"

# Log event with environment variables
curl -X POST "$IMOCREATOR_SIDECAR_URL/events" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"action.invoked\",
    \"payload\": {\"demo\": true},
    \"tags\": {
      \"unique_id\": \"$UNIQUE_ID\",
      \"process_id\": \"$PROCESS_ID\"
    }
  }"
```

## Event Types

The system supports these standard event types:

- `app.start` - Application startup
- `blueprint.validated` - Blueprint validation completed
- `action.invoked` - Action/operation invoked
- `heir.check` - HEIR validation check performed
- `error` - Error occurred

## Log Files

Events are stored in structured NDJSON format:

```bash
# View sidecar logs
tail -f ./logs/sidecar.ndjson

# Parse with jq
cat ./logs/sidecar.ndjson | jq '.type'
cat ./logs/sidecar.ndjson | jq 'select(.type == "blueprint.validated")'
```

## Validation

Run the HEIR compliance checker:

```bash
# Validate HEIR compliance
make check
# or
python -m packages.heir.checks
```

## Troubleshooting

### Services Won't Start

```bash
# Check port availability
netstat -an | grep :7001  # MCP port
netstat -an | grep :8000  # Sidecar port
netstat -an | grep :7002  # Main API port

# Kill processes if needed
pkill -f "uvicorn.*mcp_server"
pkill -f "uvicorn.*sidecar_server" 
```

### Events Not Logging

```bash
# Check sidecar service is running
curl http://localhost:8000/health

# Check logs directory exists and is writable
ls -la ./logs/
touch ./logs/test.txt && rm ./logs/test.txt
```

### HEIR Checks Failing

```bash
# Validate doctrine file exists
ls -la heir.doctrine.yaml

# Check doctrine syntax
python -c "import yaml; yaml.safe_load(open('heir.doctrine.yaml'))"

# Run validation with verbose output
python -m packages.heir.checks
```

## Next Steps

1. **Integration**: Wire the services into your application lifecycle
2. **Monitoring**: Set up log aggregation for `./logs/sidecar.ndjson`  
3. **Production**: Configure proper authentication and error handling
4. **CI/CD**: The GitHub Actions workflow automatically validates HEIR compliance

For more details, see the main [README.md](../README.md) and [HEIR doctrine](../heir.doctrine.yaml).