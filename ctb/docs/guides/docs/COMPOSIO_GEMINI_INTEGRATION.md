<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:39.939399
# CTB Version: 1.3.3
# Division: Documentation
# Category: guides
# Compliance: 100%
# HEIR ID: HEIR-2025-10-DOC-GUIDES-01

-->

# Composio + Gemini AI Integration

Complete integration guide for using Google Gemini AI through the Composio MCP server in the IMO Creator ecosystem.

## Overview

This integration brings Google's Gemini AI models into the IMO Creator workflow through the Composio MCP server, providing:

- **Unified API**: Access Gemini through the same Composio interface as 100+ other services
- **HEIR/ORBT Tracking**: Full compliance with CTB Doctrine tracking patterns
- **Caching**: Built-in response caching for improved performance
- **Multiple Models**: Support for gemini-pro, gemini-1.5-pro, and gemini-1.5-flash
- **Composio Integration**: Seamless integration with existing Composio workflows

## Architecture

```
┌─────────────────────┐
│   IMO Creator App   │
│   (Your Code)       │
└──────────┬──────────┘
           │
           │ HTTP POST /tool
           │
┌──────────▼──────────┐
│  Composio MCP       │
│  Server (port 3001) │
│                     │
│  ┌───────────────┐  │
│  │ Tool Handler  │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │ Gemini        │  │
│  │ Handler       │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │
           │ @google/generative-ai SDK
           │
┌──────────▼──────────┐
│  Google Gemini API  │
│  (Gemini Models)    │
└─────────────────────┘
```

## Installation

### Prerequisites

1. **Google AI API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Composio MCP Server**: Should already be running on port 3001

### Setup Steps

1. **Set Environment Variables**:

```bash
# In your .env file or environment
export GOOGLE_API_KEY=your_google_ai_api_key_here

# Alternative variable name also supported
export GEMINI_API_KEY=your_google_ai_api_key_here

# Optional: Set default model
export GEMINI_MODEL=gemini-pro
```

2. **Verify Installation**:

The Composio MCP server automatically loads the Gemini handler on startup. Check the logs:

```bash
cd "C:\Users\CUSTOM PC\Desktop\Cursor Builds\scraping-tool\imo-creator\mcp-servers\composio-mcp"
npm start
```

Look for:
```
✅ Gemini AI initialized successfully
```

If not configured:
```
⚠️  GOOGLE_API_KEY not configured - Gemini tools will not be available
```

## Available Tools

### 1. `gemini_generate` - Text Generation

Generate text from a prompt using Gemini AI.

**Request Format**:
```json
{
  "tool": "gemini_generate",
  "data": {
    "prompt": "Explain quantum computing in simple terms",
    "model": "gemini-pro",
    "max_tokens": 2048,
    "temperature": 0.7,
    "system_instruction": "You are a helpful assistant"
  },
  "unique_id": "HEIR-2025-10-GEM-001",
  "process_id": "PRC-GEM-001",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

**Parameters**:
- `prompt` (required): Text prompt for generation
- `model` (optional): Model name (default: `gemini-pro`)
- `max_tokens` (optional): Maximum output tokens (default: `2048`)
- `temperature` (optional): Generation temperature 0-1 (default: `0.7`)
- `system_instruction` (optional): System instruction for the model

**Response Format**:
```json
{
  "success": true,
  "result": {
    "text": "Quantum computing is...",
    "model": "gemini-pro",
    "usage": {
      "prompt_tokens": 12,
      "completion_tokens": 450,
      "total_tokens": 462
    },
    "performance": {
      "generation_time_ms": 1523,
      "tokens_per_second": 295
    },
    "gemini_metadata": {
      "model": "gemini-pro",
      "temperature": 0.7,
      "max_tokens": 2048,
      "generated_at": "2025-10-22T14:30:00Z"
    }
  },
  "heir_tracking": {
    "unique_id": "HEIR-2025-10-GEM-001",
    "process_lineage": ["PRC-GEM-001"],
    "operation": "gemini_generate",
    "orbt_layer": 2,
    "ai_provider": "google",
    "ai_model": "gemini-pro",
    "external_service_integration": true,
    "timestamp": "2025-10-22T14:30:00Z"
  }
}
```

### 2. `gemini_chat` - Interactive Chat

Start or continue a chat conversation with Gemini.

**Request Format**:
```json
{
  "tool": "gemini_chat",
  "data": {
    "message": "What is the capital of France?",
    "model": "gemini-pro",
    "history": [
      {
        "role": "user",
        "content": "Hello!"
      },
      {
        "role": "assistant",
        "content": "Hi! How can I help you today?"
      }
    ],
    "max_tokens": 2048
  },
  "unique_id": "HEIR-2025-10-CHAT-001",
  "process_id": "PRC-CHAT-001",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

**Parameters**:
- `message` (required): Message to send
- `model` (optional): Model name (default: `gemini-pro`)
- `history` (optional): Previous chat history array
- `max_tokens` (optional): Maximum output tokens (default: `2048`)

**Response Format**:
```json
{
  "success": true,
  "result": {
    "message": "The capital of France is Paris.",
    "model": "gemini-pro",
    "chat_metadata": {
      "history_length": 2,
      "total_messages": 3,
      "model": "gemini-pro"
    },
    "performance": {
      "response_time_ms": 892
    },
    "generated_at": "2025-10-22T14:30:00Z"
  },
  "heir_tracking": {
    "unique_id": "HEIR-2025-10-CHAT-001",
    "process_lineage": ["PRC-CHAT-001"],
    "operation": "gemini_chat",
    "orbt_layer": 2,
    "ai_provider": "google",
    "ai_model": "gemini-pro",
    "external_service_integration": true,
    "timestamp": "2025-10-22T14:30:00Z"
  }
}
```

### 3. `gemini_analyze` - Content Analysis

Analyze code, text, or other content using Gemini.

**Request Format**:
```json
{
  "tool": "gemini_analyze",
  "data": {
    "content": "function hello() { console.log('Hello'); }",
    "analysis_type": "code",
    "model": "gemini-pro",
    "max_tokens": 2048
  },
  "unique_id": "HEIR-2025-10-ANALYZE-001",
  "process_id": "PRC-ANALYZE-001",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

**Parameters**:
- `content` (required): Content to analyze
- `analysis_type` (optional): Type of analysis - `code`, `security`, `documentation`, `general` (default: `general`)
- `model` (optional): Model name (default: `gemini-pro`)
- `max_tokens` (optional): Maximum output tokens (default: `2048`)

**Analysis Types**:
- **code**: Code quality, bugs, performance improvements, best practices
- **security**: Security vulnerabilities, exploits, security best practices
- **documentation**: Generate comprehensive documentation
- **general**: General analysis and explanation

**Response Format**:
```json
{
  "success": true,
  "result": {
    "text": "This function...",
    "analysis_type": "code",
    "content_length": 45,
    "model": "gemini-pro",
    "usage": {
      "prompt_tokens": 50,
      "completion_tokens": 300,
      "total_tokens": 350
    },
    "gemini_metadata": {
      "model": "gemini-pro",
      "generated_at": "2025-10-22T14:30:00Z"
    }
  },
  "heir_tracking": {
    "unique_id": "HEIR-2025-10-ANALYZE-001",
    "process_lineage": ["PRC-ANALYZE-001"],
    "operation": "gemini_analyze",
    "analysis_type": "code",
    "orbt_layer": 2,
    "ai_provider": "google",
    "ai_model": "gemini-pro",
    "external_service_integration": true,
    "timestamp": "2025-10-22T14:30:00Z"
  }
}
```

### 4. `gemini_status` - Service Status

Check Gemini integration status and configuration.

**Request Format**:
```json
{
  "tool": "gemini_status",
  "data": {},
  "unique_id": "HEIR-2025-10-STATUS-001",
  "process_id": "PRC-STATUS-001"
}
```

**Response Format**:
```json
{
  "success": true,
  "result": {
    "configured": true,
    "api_key_set": true,
    "available_models": [
      "gemini-pro",
      "gemini-pro-vision",
      "gemini-1.5-pro",
      "gemini-1.5-flash"
    ],
    "default_model": "gemini-pro",
    "cache_size": 15,
    "cache_expiry_minutes": 10,
    "status": "operational"
  },
  "heir_tracking": {
    "unique_id": "HEIR-2025-10-STATUS-001",
    "process_lineage": ["PRC-STATUS-001"],
    "operation": "gemini_status",
    "timestamp": "2025-10-22T14:30:00Z"
  }
}
```

### 5. `gemini_clear_cache` - Clear Response Cache

Clear Gemini's response cache.

**Request Format**:
```json
{
  "tool": "gemini_clear_cache",
  "data": {},
  "unique_id": "HEIR-2025-10-CLEAR-001",
  "process_id": "PRC-CLEAR-001"
}
```

**Response Format**:
```json
{
  "success": true,
  "result": {
    "cleared_entries": 15,
    "cache_size": 0,
    "cleared_at": "2025-10-22T14:30:00Z"
  },
  "heir_tracking": {
    "unique_id": "HEIR-2025-10-CLEAR-001",
    "process_lineage": ["PRC-CLEAR-001"],
    "operation": "gemini_clear_cache",
    "timestamp": "2025-10-22T14:30:00Z"
  }
}
```

## Usage Examples

### Example 1: Basic Text Generation

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "gemini_generate",
    "data": {
      "prompt": "Write a haiku about programming"
    },
    "unique_id": "HEIR-2025-10-GEM-001",
    "process_id": "PRC-GEM-001",
    "orbt_layer": 2,
    "blueprint_version": "1.0"
  }'
```

### Example 2: Code Analysis

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "gemini_analyze",
    "data": {
      "content": "const add = (a, b) => a + b;",
      "analysis_type": "code"
    },
    "unique_id": "HEIR-2025-10-ANALYZE-001",
    "process_id": "PRC-ANALYZE-001"
  }'
```

### Example 3: Interactive Chat

```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "gemini_chat",
    "data": {
      "message": "What is HEIR/ORBT?",
      "history": []
    },
    "unique_id": "HEIR-2025-10-CHAT-001",
    "process_id": "PRC-CHAT-001"
  }'
```

## Integration with DeepWiki and ChartDB

Gemini can be used to power DeepWiki documentation generation and ChartDB schema analysis.

### DeepWiki Integration

Update `deepwiki/.env`:
```bash
GOOGLE_API_KEY=your_google_ai_api_key_here
DEEPWIKI_EMBEDDER_TYPE=google
```

The DeepWiki automation will automatically use Gemini when configured.

### ChartDB Integration

Future enhancement: Use Gemini to generate natural language descriptions of database schemas.

## Performance and Caching

The Gemini handler includes intelligent caching:

- **Cache Duration**: 10 minutes
- **Cache Key**: Based on model + prompt hash
- **Cache Hit**: Returns cached result with `cached: true` flag
- **Manual Clear**: Use `gemini_clear_cache` tool

## Error Handling

All Gemini tools return consistent error format:

```json
{
  "success": false,
  "error": "Error message here",
  "error_type": "gemini_generation_error",
  "error_details": {
    "gemini_error_code": "ERROR_CODE",
    "gemini_error_type": "ERROR_TYPE",
    "model": "gemini-pro"
  },
  "heir_tracking": {
    "unique_id": "HEIR-2025-10-GEM-001",
    "process_lineage": ["PRC-GEM-001"],
    "error_occurred": true,
    "operation": "gemini_generate",
    "timestamp": "2025-10-22T14:30:00Z"
  }
}
```

## Troubleshooting

### API Key Not Configured

**Error**: `Gemini AI not configured. Set GOOGLE_API_KEY environment variable.`

**Solution**:
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` file or environment:
   ```bash
   GOOGLE_API_KEY=your_key_here
   ```
3. Restart Composio MCP server

### Rate Limiting

**Error**: `429 Too Many Requests`

**Solution**:
- Wait before retrying
- Implement exponential backoff
- Consider upgrading Google AI quota
- Use caching to reduce API calls

### Model Not Available

**Error**: `Model gemini-xyz not found`

**Solution**:
- Check available models with `gemini_status` tool
- Use one of the supported models:
  - `gemini-pro`
  - `gemini-pro-vision`
  - `gemini-1.5-pro`
  - `gemini-1.5-flash`

## CTB Doctrine Compliance

This integration follows CTB Doctrine patterns:

- **Doctrine ID**: 04.04.12 (Gemini AI Integration)
- **Altitude**: 40k ft (System Infrastructure)
- **HEIR Tracking**: All operations include HEIR tracking metadata
- **ORBT Layers**: Supports multi-layer processing
- **External Service**: Flagged as `external_service_integration: true`

## Security Considerations

1. **API Key Protection**: Never commit API keys to git
2. **Environment Variables**: Store keys in `.env` files (gitignored)
3. **MCP Vault**: Consider using MCP vault for production deployments
4. **Rate Limiting**: Implement rate limiting for production use
5. **Input Validation**: Always validate user input before sending to Gemini

## Version History

- **v1.0.0** (2025-10-22) - Initial release
  - Basic text generation
  - Interactive chat
  - Content analysis
  - Status checking
  - Cache management

## Related Documentation

- [Composio Integration](../COMPOSIO_INTEGRATION.md)
- [Gemini CLI Tool](../tools/gemini-cli/README.md)
- [Global Configuration](../global-config/global_manifest.yaml)
- [CTB Doctrine](../global-config/CTB_DOCTRINE.md)
- [Google AI Documentation](https://ai.google.dev/docs)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Composio MCP server logs
3. Test with `gemini_status` tool
4. Verify API key configuration
5. Check Google AI Studio quota/limits
