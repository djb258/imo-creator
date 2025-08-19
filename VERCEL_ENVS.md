# Vercel Environment Variables

Configure these environment variables in Vercel → Project Settings → Environment Variables (both Production and Preview):

## Required API Keys
- `IMOCREATOR_OPENAI_API_KEY` - OpenAI API key for LLM functionality
- `IMOCREATOR_ANTHROPIC_API_KEY` - Anthropic Claude API key for LLM functionality

## LLM Configuration
- `LLM_DEFAULT_PROVIDER` - Default LLM provider (openai or anthropic)
- `ALLOW_ORIGIN` - CORS origin control

## HEIR Doctrine Settings
- `DOCTRINE_DB=shq` - Database identifier for HEIR system
- `DOCTRINE_SUBHIVE=03` - Subhive identifier (03 for IMO Creator)
- `DOCTRINE_APP=imo` - Application identifier
- `DOCTRINE_VER=1` - Version number

## Garage-MCP Integration
- `GARAGE_MCP_URL` - URL to garage-mcp instance (optional)
- `GARAGE_MCP_TOKEN` - Authentication token for garage-mcp (optional)
- `SUBAGENT_REGISTRY_PATH=/registry/subagents` - Path to subagent registry

## UI Configuration
- `NEXT_PUBLIC_SHOW_SUBAGENTS=true` - Show subagents in UI

## Notes
- API keys with `IMOCREATOR_` prefix are used by the `/llm` endpoint
- Doctrine variables are used for ID generation in SSOT processing
- Garage-MCP variables are optional - system falls back gracefully if not configured