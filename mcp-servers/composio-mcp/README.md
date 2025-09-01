# composio-mcp

Universal AI agent integration platform with 100+ services via Composio SDK, wrapped with HEIR/ORBT compliance.

## 🚀 What This Replaces

Instead of building individual MCP servers for each service, this single server provides access to:

- **GitHub** (repos, issues, PRs, actions)
- **Gmail** (send, read, manage emails)  
- **Slack** (messages, channels, notifications)
- **Twilio** (SMS, voice calls)
- **Stripe** (payments, subscriptions)
- **Notion** (pages, databases, content)
- **HubSpot** (CRM, contacts, deals)
- **Salesforce** (leads, opportunities, accounts)
- **Linear** (issues, projects, roadmaps)
- **Google Calendar** (events, scheduling)
- **+ 90 more services**

## 🎯 Key Benefits

### vs Individual MCP Servers
- **90% less development time** - Use 100+ pre-built integrations
- **80% less maintenance** - Composio handles service updates
- **95% less auth complexity** - Built-in OAuth flows
- **Unified interface** - One API for all external services

### Factory Architecture Integration
- Full HEIR/ORBT compliance maintained
- Performance caching (3-minute TTL)
- Emergency kill switch capabilities
- Complete audit trail via Mantis logging
- Seamless integration with existing architecture

## 🔧 Environment Variables

```bash
# Required
COMPOSIO_API_KEY=your_composio_api_key

# Optional
COMPOSIO_BASE_URL=https://backend.composio.dev
COMPOSIO_DISABLE_TELEMETRY=false
PORT=3000
```

## 📡 Usage Example

### Execute Any Composio Tool
```bash
curl -X POST http://localhost:3000/tool \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-COMPOSIO-REQ-123",
    "process_id": "PRC-COMPOSIO-456", 
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0-abcd1234",
    "tool": "execute_composio_tool",
    "data": {
      "toolkit": "github",
      "tool": "create_repo",
      "arguments": {
        "name": "my-new-repo",
        "description": "Created via Composio MCP",
        "private": true
      },
      "user_id": "your-user-id"
    }
  }'
```

### Get Available Tools
```bash
curl -X POST http://localhost:3000/tool \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-COMPOSIO-REQ-124",
    "process_id": "PRC-COMPOSIO-457",
    "orbt_layer": 5, 
    "blueprint_version": "v1.0.0-abcd1234",
    "tool": "get_available_tools",
    "data": {
      "toolkits": ["github", "gmail", "slack"],
      "user_id": "your-user-id"
    }
  }'
```

### Manage Connected Accounts
```bash
curl -X POST http://localhost:3000/tool \
  -H "Content-Type: application/json" \
  -d '{
    "unique_id": "HEIR-2024-12-COMPOSIO-REQ-125",
    "process_id": "PRC-COMPOSIO-458",
    "orbt_layer": 5,
    "blueprint_version": "v1.0.0-abcd1234", 
    "tool": "manage_connected_account",
    "data": {
      "action": "create",
      "app": "github",
      "user_id": "your-user-id",
      "auth_config": {
        "scope": "repo,user"
      }
    }
  }'
```

## 🔧 Operations

### Health Check
```bash
curl http://localhost:3000/mcp/health
```

### Available Capabilities
```bash
curl http://localhost:3000/mcp/capabilities
```

### Quick Tool Execution (Testing)
```bash
curl -X POST http://localhost:3000/mcp/execute/github/get_user \
  -H "Content-Type: application/json" \
  -d '{
    "arguments": {"username": "octocat"},
    "user_id": "your-user-id"
  }'
```

## 🎯 Migration Strategy

### Phase 1: Parallel Operation
Run composio-mcp alongside existing individual MCP servers:
- Route new integrations through Composio
- Keep critical services on existing servers during transition

### Phase 2: Gradual Migration  
Replace individual servers one by one:
1. **github-mcp** → `composio execute_composio_tool github *`
2. **twilio-mcp** → `composio execute_composio_tool twilio *`
3. **etc.**

### Phase 3: Full Replacement
- Deprecate individual service MCP servers
- Route all external service calls through Composio
- Maintain multi-database and compliance servers

## 🏗️ Architecture Benefits

### What You Keep (Unique Value)
- Multi-database query builder
- HEIR/ORBT compliance framework  
- Factory/garage template system
- Performance optimizations
- Cost structure <$350/month

### What Composio Provides
- 100+ service integrations
- Authentication management
- Service maintenance and updates
- Professional error handling
- Enterprise-grade reliability

## 🔒 HEIR/ORBT Compliance

This server maintains full compliance with your governance framework:

### HEIR (Hierarchical Event Identity Registry)
- **Unique ID Format**: `HEIR-YYYY-MM-SYSTEM-MODE-VN`
- **Process Tracking**: `PRC-SYSTCODE-EPOCHTIMESTAMP`
- **Blueprint Versioning**: Git hash-based versioning
- **Event Lineage**: Full audit trail maintained

### ORBT (Operations & Resource Blueprint Tracking)
- **Layer Authorization**: Layer 5 operations
- **Resource Constraints**: Rate limiting and connection pools
- **Security Policies**: Input validation and sanitization
- **Emergency Protocols**: Kill switch and graceful degradation

### Compliance Features
- ✅ Structured logging via Mantis integration
- ✅ Request/response payload validation
- ✅ Error conditions tracked and reported
- ✅ Rate limiting per ORBT policies
- ✅ Emergency shutdown capabilities
- ✅ External service audit trails
- ✅ Performance caching with compliance

## 📊 Performance

- **Response Caching**: 3-minute TTL for external service calls
- **Connection Pooling**: Keep-alive optimization
- **Tool Discovery Caching**: 5-minute TTL for tool lists
- **Memory Management**: Automatic cache cleanup
- **Performance Stats**: Available at `/mcp/performance`

## 🚀 Getting Started

1. **Get Composio API Key**: https://app.composio.dev
2. **Set Environment Variables**: Copy `.env.example` and configure
3. **Install Dependencies**: `npm install`
4. **Start Server**: `npm start`
5. **Test Connection**: `curl http://localhost:3000/mcp/health`

## 📚 Documentation

- **Composio Docs**: https://docs.composio.dev
- **Available Toolkits**: https://docs.composio.dev/toolkits
- **Authentication Guide**: https://docs.composio.dev/authentication
- **Your Factory Docs**: See main repo README for HEIR/ORBT standards

This server represents the evolution from individual service integrations to a unified, enterprise-grade platform while maintaining your unique governance and compliance advantages.