# Google Gemini Tool

**Tool Type**: AI Model
**Provider**: Google AI
**Governance**: Composio MCP
**Doctrine Scope**: Tool (not core CTB doctrine)

## Overview

Gemini is registered as a **Composio MCP tool** and is **not part of the CTB doctrine structure**.

All MCP-level AI models (Claude, GPT, Gemini, etc.) are governed under `/sys/composio-mcp/tools/` registry and are classified as **tools**, not doctrine components.

## Reclassification Note

**Previous Classification**: CTB Doctrine Element (doctrine_id: 04.04.12)
**Current Classification**: Composio MCP Tool
**Reclassified**: 2025-10-23 (CTB Doctrine Patch 1.3.3a)

**Reason**: Gemini is an AI model integration, not a structural CTB component. CTB doctrine governs repository architecture (sys, data, apps, ai, docs, tests), not individual tool integrations.

## Integration Points

### 1. Composio MCP Server
```bash
# Via Composio MCP endpoint
POST http://localhost:3001/tool
{
  "tool": "gemini_generate",
  "data": {
    "prompt": "Your prompt here",
    "model": "gemini-2.5-flash"
  }
}
```

### 2. Standalone CLI
```bash
# Direct CLI usage
node tools/gemini-cli/gemini.js generate "Your prompt"
node tools/gemini-cli/gemini.js chat
node tools/gemini-cli/gemini.js analyze code.js
```

### 3. Direct API
```bash
# Direct Google Gemini API
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
{
  "contents": [{
    "parts": [{
      "text": "Your prompt"
    }]
  }]
}
```

## Capabilities

- ✅ Text generation
- ✅ Interactive chat
- ✅ Code analysis
- ✅ Content analysis
- ✅ Multi-model support (Gemini 2.5 series)
- ✅ Response caching (10 min expiry)

## Barton Doctrine Compliance

- **Composio MCP Required**: ✅ Yes (all external AI models must go through Composio)
- **HEIR/ORBT Tracking**: ✅ Yes (all API calls tracked with unique_id, process_id)
- **Gatekeeper Validation**: ❌ No (AI model calls bypass gatekeeper, validated by Composio)

## Configuration

### Required Environment Variables
```bash
GOOGLE_API_KEY=your-api-key
# OR
GEMINI_API_KEY=your-api-key
```

### Optional Environment Variables
```bash
GEMINI_MODEL=gemini-2.5-flash  # Default model
```

## Available Models

- `gemini-2.5-flash` (default, stable)
- `gemini-2.5-flash-preview-05-20`
- `gemini-2.5-pro-preview-03-25`
- `gemini-2.5-pro-preview-05-06`
- `gemini-2.5-flash-lite-preview-06-17`

## Documentation

- [Full Integration Guide](../../../../docs/COMPOSIO_GEMINI_INTEGRATION.md)
- [CLI Documentation](../../../../tools/gemini-cli/README.md)
- [Connection Guide](../../../../COMPOSIO_GEMINI_CONNECTION.md)

## Tool Manifest

See `tool_manifest.json` in this directory for complete tool metadata.

---

**Important**: Gemini and all similar AI models (Claude, GPT, Perplexity, etc.) belong under `/sys/composio-mcp/tools/` registry, **not** in CTB doctrine.

**Governance**: All AI model integrations are governed by Composio MCP policies, not CTB structural doctrine.
