# 🚀 Claude Bootstrap Guide - IMO Creator Repository

## 📋 INSTANT REPO OVERVIEW

**Repository Name**: IMO Creator
**Primary Purpose**: AI-powered interface creation tool with Google Workspace integration
**Deployment**: Render + Vercel hybrid architecture
**Integration Hub**: Composio MCP server (port 3001) managing 100+ services

## 🎯 CRITICAL PATHS & COMMANDS

### Immediate Startup Sequence
```bash
# 1. Start Composio MCP Server (MANDATORY)
cd "C:\Users\CUSTOM PC\Desktop\Cursor Builds\scraping-tool\imo-creator\mcp-servers\composio-mcp"
node server.js

# 2. Start FastAPI server
cd "C:\Users\CUSTOM PC\Desktop\Cursor Builds\imo-creator"
python main.py

# 3. Test integrations
curl -X POST http://localhost:3001/tool -H "Content-Type: application/json" -d '{"tool": "get_composio_stats", "data": {}, "unique_id": "HEIR-2025-09-BOOT-01", "process_id": "PRC-BOOT-001", "orbt_layer": 2, "blueprint_version": "1.0"}'
```

## 📁 REPOSITORY STRUCTURE MAP

```
imo-creator/
├── 🔥 COMPOSIO_INTEGRATION.md    # CRITICAL: Read first for all API integrations
├── 🚀 CLAUDE.md                  # This bootstrap file
├── main.py                       # FastAPI entry point (Render deployment)
├── Procfile                      # Render process definition
├── render.yaml                   # Render configuration
├── runtime.txt                   # Python version (3.11.9)
├── requirements.txt              # Python dependencies
├── firebase_mcp.js               # Firebase MCP server with Barton Doctrine
├── src/
│   └── server/
│       └── main.py              # Core FastAPI application
└── docs/
    └── composio_connection.md   # Additional Composio documentation

Related Repositories:
├── scraping-tool/               # Contains Composio MCP server
│   └── imo-creator/
│       └── mcp-servers/
│           └── composio-mcp/    # **CRITICAL**: Main integration hub
```

## ✅ VERIFIED INTEGRATIONS STATUS

### Google Workspace (via Composio MCP)
- **Gmail**: 3 accounts (service@svg.agency, djb258@gmail.com, dbarton@svg.agency)
- **Google Drive**: 3 accounts (all active with full API access)
- **Google Calendar**: 1 account (service@svg.agency)
- **Google Sheets**: 1 account (service@svg.agency)

### Infrastructure
- **Render**: Active deployment environment
- **Firebase**: MCP server ready with Barton Doctrine compliance
- **Composio**: 100+ services available via MCP on port 3001

## 🚨 NEVER DO THESE THINGS

❌ **NEVER** create custom Google API integrations - use Composio MCP
❌ **NEVER** set up individual OAuth flows - all handled by Composio
❌ **NEVER** use environment variables for Google services - use MCP interface
❌ **NEVER** ignore the HEIR/ORBT payload format for Composio calls
❌ **NEVER** attempt to deploy without testing MCP server first

## 🎯 COMMON TASK PATTERNS

### For Google Service Operations
1. Verify Composio MCP server is running on port 3001
2. Use HEIR/ORBT payload format for ALL calls
3. Reference connected account IDs from COMPOSIO_INTEGRATION.md
4. Test with curl before implementing in code

### For Development Work
1. Always read COMPOSIO_INTEGRATION.md first
2. Start required servers (MCP + FastAPI)
3. Test integrations before building features
4. Follow Barton Doctrine for ID generation

### For Deployment Tasks
1. Check render.yaml configuration
2. Verify Procfile points to correct entry point
3. Test locally before pushing to Render
4. Monitor deployment logs for issues

## 🔧 DEBUGGING QUICK REFERENCE

### MCP Server Issues
```bash
# Check if Composio MCP is running
curl http://localhost:3001/mcp/health

# List all connected accounts
curl -X POST http://localhost:3001/tool -H "Content-Type: application/json" -d '{"tool": "manage_connected_account", "data": {"action": "list"}, "unique_id": "HEIR-2025-09-DEBUG-01", "process_id": "PRC-DEBUG-001", "orbt_layer": 2, "blueprint_version": "1.0"}'
```

### FastAPI Server Issues
```bash
# Check server status
curl http://localhost:8000/health

# View logs
python main.py
```

### Google Services Issues
1. Verify account connection in Composio dashboard
2. Check token expiration status
3. Test with simple API calls first
4. Reference COMPOSIO_INTEGRATION.md for working examples

## 📖 ESSENTIAL DOCUMENTATION FILES

1. **COMPOSIO_INTEGRATION.md** - Primary integration guide (ALWAYS READ FIRST)
2. **docs/composio_connection.md** - Additional connection details
3. **render.yaml** - Deployment configuration
4. **firebase_mcp.js** - Firebase integration patterns

## 🔄 TYPICAL WORKFLOW

1. **Start Session**: Read this CLAUDE.md + COMPOSIO_INTEGRATION.md
2. **Verify Services**: Start MCP server, test connections
3. **Development**: Build features using verified integrations
4. **Testing**: Use curl commands to verify API functionality
5. **Deployment**: Push to Render after local verification

## 💡 OPTIMIZATION TIPS

- Use Task tool for complex multi-file operations
- Batch curl commands for parallel testing
- Reference existing working examples before creating new patterns
- Keep MCP server running throughout development session

## 🆘 EMERGENCY CONTACTS & RESOURCES

- **Composio Docs**: https://docs.composio.dev
- **MCP Specification**: https://modelcontextprotocol.io
- **Render Support**: Check render.yaml configuration first
- **Firebase Issues**: Reference firebase_mcp.js implementation

---

**🎯 REMEMBER**: This repository has everything pre-configured and tested. Don't reinvent - use the existing verified patterns!

**Last Updated**: 2025-09-28
**Status**: All systems verified and operational