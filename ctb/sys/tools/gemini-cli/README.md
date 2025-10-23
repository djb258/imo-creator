<!--

# CTB Metadata
# Generated: 2025-10-23T14:32:36.287062
# CTB Version: 1.3.3
# Division: System Infrastructure
# Category: tools
# Compliance: 75%
# HEIR ID: HEIR-2025-10-SYS-TOOLS-01

-->

# Gemini CLI Tool

Google Generative AI Command-Line Interface for IMO Creator ecosystem.

## Overview

This CLI tool provides direct access to Google's Gemini AI models from the command line. It's designed to work seamlessly with the IMO Creator infrastructure and integrates with Composio MCP server.

## Installation

The tool is already installed in the IMO Creator repository. Dependencies are managed at the root level.

## Configuration

### API Key Setup

You need a Google AI API key to use this tool:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set the environment variable:

```bash
export GOOGLE_API_KEY=your_api_key_here
```

Or add to your `.env` file:

```bash
GOOGLE_API_KEY=your_api_key_here
```

### Model Selection

By default, the tool uses `gemini-pro`. You can change the model:

```bash
export GEMINI_MODEL=gemini-1.5-pro
```

## Usage

### Basic Commands

```bash
# Test API connection
node gemini.js test

# Generate text from a prompt
node gemini.js generate "Explain quantum computing in simple terms"

# Start a chat session
node gemini.js chat "Hello, tell me about yourself"

# Analyze a file
node gemini.js analyze ./path/to/file.js

# List available models
node gemini.js models

# Show help
node gemini.js help
```

### Using npm Scripts

From the root directory:

```bash
# Test connection
npm run gemini:test

# Generate text
npm run gemini:generate "your prompt here"

# Start chat
npm run gemini:chat "initial message"
```

## Available Models

- **gemini-pro** (default) - General-purpose text generation
- **gemini-pro-vision** - Multimodal (text + images)
- **gemini-1.5-pro** - Latest pro model
- **gemini-1.5-flash** - Faster, lighter model

## Integration with Composio

This CLI tool is designed to work with the Composio MCP server. Once integrated, you can:

1. Call Gemini through Composio's unified API
2. Use HEIR/ORBT payload format for structured requests
3. Leverage Composio's authentication and rate limiting
4. Access Gemini alongside 100+ other integrated services

### Composio Integration Setup

See [Composio Integration Guide](../../docs/COMPOSIO_GEMINI_INTEGRATION.md) for details.

## Examples

### Code Analysis

```bash
node gemini.js analyze ./src/server/main.py
```

### Documentation Generation

```bash
node gemini.js generate "Generate API documentation for the following code: $(cat ./api.js)"
```

### Interactive Chat

```bash
node gemini.js chat "I need help debugging a Python script"
```

## Error Handling

The CLI provides clear error messages:

- **Missing API Key**: Instructions to set GOOGLE_API_KEY
- **Invalid Model**: List of available models
- **API Errors**: Detailed error information from Google AI API

## Logging

All API interactions are logged for debugging. Check logs in:
- `logs/gemini_cli.log` - General logs
- `logs/gemini_error.log` - Error logs

## Troubleshooting

### API Key Not Found

```bash
ERROR: GOOGLE_API_KEY environment variable not set
```

**Solution**: Set your API key as described in Configuration section

### Model Not Available

```bash
[ERROR] Model not found
```

**Solution**: Check available models with `node gemini.js models`

### Rate Limiting

If you hit rate limits, the CLI will display the error. Consider:
- Using a different API key
- Waiting before retrying
- Upgrading your Google AI quota

## CTB & Barton Doctrine Compliance

This tool is classified as a **Composio MCP Tool**, not a CTB doctrine component:

- **Tool Type**: Composio MCP Tool (AI Model)
- **Governance**: Composio MCP (not CTB structural doctrine)
- **Previous Doctrine ID**: 04.04.12 (reclassified in Patch 1.3.3a)
- **Tool Manifest**: ctb-template/sys/composio-mcp/tools/gemini/tool_manifest.json
- **HEIR Integration**: ✅ Supports HEIR-formatted requests
- **ORBT Layer**: ✅ Compatible with multi-layer processing
- **Composio Required**: ✅ All AI model integrations must use Composio MCP

**Note**: Gemini and all similar AI models (Claude, GPT, etc.) are **tools**, not doctrine components. CTB doctrine governs repository architecture (sys, data, apps, ai, docs, tests), not individual tool integrations.

## Contributing

This tool is part of the IMO Creator ecosystem. For contributions:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure CTB Doctrine compliance

## Version History

- **v1.0.0** (2025-10-22) - Initial release
  - Basic CLI commands (test, generate, chat, analyze)
  - Environment variable configuration
  - Multi-model support
  - Color-coded terminal output

## License

MIT License - Part of IMO Creator Project

## Related Documentation

- [Google AI Documentation](https://ai.google.dev/docs)
- [Composio Integration](../../COMPOSIO_INTEGRATION.md)
- [CTB Doctrine](../../global-config/CTB_DOCTRINE.md)
- [DeepWiki Integration](../../sys/deepwiki/deepwiki.md)
