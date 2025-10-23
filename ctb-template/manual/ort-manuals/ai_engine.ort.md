---
role: ai_engine
version: 1.0.0
altitude: 20k
driver: gemini
status: active
---

# AI Engine ORT Manual

## Overview

**Role**: AI_ENGINE
**Purpose**: Handles reasoning, orchestration, and LLM execution
**Altitude**: 20k ft (Orchestration Layer)
**Current Driver**: Gemini (Google AI)

## Operate

### Normal Operations

**Startup**:
```bash
# Verify API key configuration
echo $GOOGLE_API_KEY

# Test connection
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "gemini_status"}'
```

**Monitoring**:
- Check `/manual/troubleshooting/system_diagnostics.json#ai_engine`
- Expected latency: < 300ms
- Status should be: "connected"

**Daily Operations**:
1. Monitor token usage and rate limits
2. Check response latency trends
3. Review HEIR/ORBT tracking logs
4. Validate model version consistency

### Health Check Procedure

```bash
# Run status check
ts-node /manual/scripts/status_check.ts

# Expected output:
# {
#   "ai_engine": {
#     "status": "connected",
#     "latency_ms": 220,
#     "driver": "gemini",
#     "model": "gemini-2.5-flash"
#   }
# }
```

## Repair

### Common Failure Modes

#### 1. API Connection Failure

**Symptoms**:
- Status: "disconnected"
- Latency: N/A
- Error: "ECONNREFUSED" or "API_KEY_INVALID"

**Diagnosis**:
```bash
# Check API key
echo $GOOGLE_API_KEY

# Test direct API connection
curl https://generativelanguage.googleapis.com/v1beta/models?key=$GOOGLE_API_KEY
```

**Repair Steps**:
1. Verify API key is set and valid
2. Check network connectivity
3. Verify Google AI API status
4. Restart MCP server if needed
5. Check rate limits and quotas

**Resolution Time**: 5-15 minutes

#### 2. High Latency

**Symptoms**:
- Status: "connected"
- Latency: > 1000ms
- Slow response times

**Diagnosis**:
```bash
# Check response cache
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "gemini_status"}'

# Review recent request logs
tail -f logs/mcp_server.log | grep "gemini"
```

**Repair Steps**:
1. Clear response cache: `{"tool": "gemini_clear_cache"}`
2. Switch to faster model (flash vs pro)
3. Reduce max_tokens in requests
4. Check Google AI service status
5. Consider fallback to alternative driver

**Resolution Time**: 2-5 minutes

#### 3. Model Deprecation

**Symptoms**:
- Error: "Model not found" or 404
- Status: "error"

**Diagnosis**:
```bash
# List available models
node tools/gemini-cli/gemini.js models
```

**Repair Steps**:
1. Update `driver_manifest.json` with current model
2. Update `.env` with `GEMINI_MODEL=gemini-2.5-flash`
3. Restart services
4. Test with new model

**Resolution Time**: 10-20 minutes

## Build

### Initial Setup

**Prerequisites**:
- Node.js >= 18.0.0
- Google AI API key
- Composio MCP server running

**Installation**:
```bash
# Install dependencies
npm install @google/generative-ai

# Configure environment
cp .env.example .env
echo "GOOGLE_API_KEY=your-key-here" >> .env
echo "GEMINI_MODEL=gemini-2.5-flash" >> .env

# Initialize driver
cd drivers/ai_engine
cat driver_manifest.json
```

**Verification**:
```bash
# Test standalone CLI
node tools/gemini-cli/gemini.js test

# Test via Composio MCP
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "gemini_generate", "data": {"prompt": "Hello"}}'
```

### Driver Switching

**To switch from Gemini to Claude**:

1. Update `driver_manifest.json`:
```json
{
  "current_driver": "claude",
  "supported_drivers": [...]
}
```

2. Update environment:
```bash
echo "ANTHROPIC_API_KEY=your-key" >> .env
```

3. Update MCP server routing in `tools/tool_handler.js`

4. Restart services and test

## Train

### For Operators

**Training Checklist**:
- [ ] Understand HEIR/ORBT tracking requirements
- [ ] Know how to read `/manual/troubleshooting/system_diagnostics.json`
- [ ] Practice switching models (flash vs pro)
- [ ] Understand rate limits and quotas
- [ ] Know how to clear cache

**Practice Scenarios**:
1. Simulate API key expiration
2. Handle high-latency responses
3. Switch between drivers
4. Interpret error messages

### For Developers

**Development Setup**:
```bash
# Clone repo
git clone https://github.com/djb258/imo-creator.git
cd imo-creator

# Install dependencies
npm install

# Set up local environment
cp .env.example .env.local

# Run in development mode
npm run dev
```

**Testing**:
```bash
# Unit tests
npm run test:ai_engine

# Integration tests
npm run test:integration
```

## Reference

**Driver Manifest**: `/drivers/ai_engine/driver_manifest.json`
**Status Endpoint**: `/manual/troubleshooting/system_diagnostics.json#ai_engine`
**System Map**: `/manual/system-map/ctb_system_map.json`
**Supported Drivers**: Gemini, Claude, GPT

**Related Documentation**:
- [Gemini CLI README](../../tools/gemini-cli/README.md)
- [Composio Integration Guide](../../docs/COMPOSIO_GEMINI_INTEGRATION.md)
- [MCP Registry](../../config/mcp_registry.json)

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Maintainer**: Barton Doctrine Authority
