# 🔥 CRITICAL: Composio Integration Guide - IMO Creator

## ⚠️ MANDATORY READING - ALWAYS REFERENCE THIS FIRST

**This is the AUTHORITATIVE guide for Composio integration. NEVER attempt to build custom Google/API integrations - everything goes through Composio MCP server!**

## ✅ VERIFIED SYSTEM STATUS (2025-09-28)

**🚀 Composio MCP Server**: ACTIVE on port 3001
**📧 Gmail**: 3 accounts connected and verified
**📁 Google Drive**: 3 accounts connected and verified
**📅 Google Calendar**: 1 account connected and verified
**📊 Google Sheets**: 1 account connected and verified
**🔥 Firebase**: MCP server available with Barton Doctrine compliance
**🌐 100+ Services**: Available through single MCP endpoint

## 🎯 QUICK START - ESSENTIAL COMMANDS

### Start Composio MCP Server (REQUIRED)
```bash
cd "C:\Users\CUSTOM PC\Desktop\Cursor Builds\scraping-tool\imo-creator\mcp-servers\composio-mcp"
node server.js
```

### Test Server Connection
```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "get_composio_stats", "data": {}, "unique_id": "HEIR-2025-09-TEST-01", "process_id": "PRC-TEST-001", "orbt_layer": 2, "blueprint_version": "1.0"}'
```

### List Connected Google Accounts
```bash
curl -X POST http://localhost:3001/tool \
  -H "Content-Type: application/json" \
  -d '{"tool": "manage_connected_account", "data": {"action": "list", "app": "GMAIL"}, "unique_id": "HEIR-2025-09-LIST-01", "process_id": "PRC-LIST-001", "orbt_layer": 2, "blueprint_version": "1.0"}'
```

## 🔧 Verified Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IMO Creator   │───▶│  Composio MCP   │───▶│ Google Services │
│   Application   │    │ Server (3001)   │    │  & 100+ APIs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ HEIR/ORBT       │
                       │ Compliance      │
                       │ & Caching       │
                       └─────────────────┘
```

## 🚨 CRITICAL PAYLOAD FORMAT

**ALWAYS use this exact HEIR/ORBT format for ALL Composio calls:**

```json
{
  "tool": "tool_name_here",
  "data": {
    // Tool-specific parameters
  },
  "unique_id": "HEIR-YYYY-MM-SYSTEM-MODE-VN",
  "process_id": "PRC-SYSTEM-EPOCHTIMESTAMP",
  "orbt_layer": 2,
  "blueprint_version": "1.0"
}
```

## ✅ VERIFIED CONNECTED ACCOUNTS

### Gmail Accounts (3 Active)
- service@svg.agency (ca_BSkcAvhBMH92)
- djb258@gmail.com (ca_Dh-5OnHENWcG)
- dbarton@svg.agency (ca_TcSBw5YRBVbN)

### Google Drive Accounts (3 Active)
- service@svg.agency (ca_CWoInx__nXq-)
- djb258@gmail.com (ca_ovFzduXza8Ax)
- dbarton@svg.agency (ca_6XD0QaOwLDR8)

### Google Calendar Account (1 Active)
- service@svg.agency (ca_nJ2cJ6Ltzq4l)

### Google Sheets Account (1 Active)
- service@svg.agency (ca_yGbhTw96db32)

## 🌐 Connected Services for IMO Creator

### **1. GitHub (Version Control)**
- **Purpose**: Repository management, code deployment, issue tracking
- **Connection Status**: ✅ Available through Composio
- **Use Cases**:
  - Automatic repository creation
  - Code push/pull operations
  - Issue and PR management
  - Release automation

### **2. Vercel (Deployment)**
- **Purpose**: IMO Creator frontend deployment, preview environments
- **Connection Status**: ✅ Active
- **Connected Account ID**: `ca_vkXglNynIxjm`
- **Projects**:
  - `imo-creator` (ID: `prj_nOFsShEtrEMIzrgk3iXf0uUDXr08`)
  - `imo-creator2` (ID: `prj_TpPhtAsGcv5vrubNa0xjAFwPJuEi`)

### **3. OpenAI (LLM Integration)**
- **Purpose**: AI-powered content generation, code analysis
- **Connection Status**: ⚠️ Local API key configuration
- **Environment Variable**: `OPENAI_API_KEY`

### **4. Anthropic (Claude Integration)**
- **Purpose**: Advanced AI reasoning, code review, documentation
- **Connection Status**: ⚠️ Local API key configuration
- **Environment Variable**: `ANTHROPIC_API_KEY`

## 🔑 Configuration

### **Environment Variables (.env)**
```bash
# LLM Provider Configuration
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
LLM_DEFAULT_PROVIDER=openai

# HEIR/MCP Integration
IMOCREATOR_MCP_URL=http://localhost:7001
IMOCREATOR_SIDECAR_URL=http://localhost:8000
IMOCREATOR_BEARER_TOKEN=local-dev-token

# Doctrine ID Generation (Server-only)
DOCTRINE_DB=shq
DOCTRINE_SUBHIVE=03
DOCTRINE_APP=imo
DOCTRINE_VER=1

# Garage-MCP Integration (Local)
GARAGE_MCP_URL=http://localhost:7001
GARAGE_MCP_TOKEN=dev-local
SUBAGENT_REGISTRY_PATH=/registry/subagents

# CORS Configuration
ALLOW_ORIGIN=https://your-vercel-project.vercel.app
PORT=7002

# Composio Integration
COMPOSIO_API_KEY=ak_t-F0AbvfZHUZSUrqAGNn
MCP_API_URL=https://backend.composio.dev
```

## 💻 IMO Creator Specific Implementation

### **1. MCP Sidecar Integration**
```javascript
// IMO Creator uses a sidecar pattern for MCP integration
const mcpUrl = process.env.IMOCREATOR_MCP_URL || 'http://localhost:7001';
const sidecarUrl = process.env.IMOCREATOR_SIDECAR_URL || 'http://localhost:8000';

// MCP Bridge for external service integration
class IMOComposioBridge {
  constructor() {
    this.apiKey = process.env.COMPOSIO_API_KEY;
    this.baseUrl = process.env.MCP_API_URL;
  }

  async executeOperation(service, action, params) {
    // Implementation specific to IMO Creator needs
  }
}
```

### **2. Doctrine ID Generation**
```javascript
// IMO Creator follows Barton Doctrine for ID generation
function generateIMODoctrineId() {
  const db = process.env.DOCTRINE_DB || 'shq';
  const subhive = process.env.DOCTRINE_SUBHIVE || '03';
  const app = process.env.DOCTRINE_APP || 'imo';
  const ver = process.env.DOCTRINE_VER || '1';

  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${db.toUpperCase()}-${subhive}-${app.toUpperCase()}-${ver}-${timestamp}-${random}`;
}
```

### **3. Garage-MCP Integration**
```javascript
// Local MCP server for IMO Creator operations
const garageMcp = {
  url: process.env.GARAGE_MCP_URL,
  token: process.env.GARAGE_MCP_TOKEN,
  registryPath: process.env.SUBAGENT_REGISTRY_PATH
};

// Subagent registry for IMO operations
const subagentRegistry = {
  'code-generator': {
    type: 'imo-creator',
    capabilities: ['react', 'typescript', 'tailwind'],
    status: 'active'
  },
  'ui-designer': {
    type: 'imo-creator',
    capabilities: ['design', 'components', 'styling'],
    status: 'active'
  }
};
```

## 🎯 IMO Creator Workflows

### **1. Project Creation Workflow**
```javascript
// 1. Generate IMO project structure
const projectId = generateIMODoctrineId();

// 2. Create Vercel project through Composio
const vercelProject = await createVercelProject({
  name: `imo-${projectId.toLowerCase()}`,
  framework: 'nextjs',
  buildCommand: 'npm run build',
  outputDirectory: 'dist'
});

// 3. Initialize GitHub repository
const githubRepo = await createGitHubRepo({
  name: `imo-${projectId}`,
  private: false,
  autoInit: true
});

// 4. Link Vercel to GitHub
await linkVercelToGitHub(vercelProject.id, githubRepo.full_name);
```

### **2. Code Generation with MCP**
```javascript
// IMO Creator uses MCP for AI-powered code generation
async function generateComponent(specification) {
  const mcpRequest = {
    service: 'anthropic',
    action: 'generate_code',
    params: {
      specification,
      framework: 'react',
      styling: 'tailwind',
      typescript: true
    }
  };

  const result = await imoBridge.executeOperation(mcpRequest);

  // Apply Barton Doctrine metadata
  return {
    unique_id: generateIMODoctrineId(),
    process_id: 'Generate React Component',
    altitude: 5000, // Component generation level
    code: result.code,
    metadata: result.metadata
  };
}
```

### **3. Deployment Automation**
```javascript
// Automated deployment through Composio-Vercel integration
async function deployIMOProject(projectId, code) {
  // 1. Commit code to GitHub
  await commitToGitHub(projectId, code);

  // 2. Trigger Vercel deployment
  const deployment = await triggerVercelDeploy(projectId);

  // 3. Monitor deployment status
  const status = await monitorDeployment(deployment.id);

  return {
    unique_id: generateIMODoctrineId(),
    process_id: 'Deploy IMO Project',
    altitude: 1000, // Deployment level
    deployment_url: status.url,
    status: status.state
  };
}
```

## 📁 IMO Creator File Structure

```
imo-creator-fresh/
├── .env.example                   # Environment template
├── COMPOSIO_INTEGRATION.md        # This documentation
├── api/                           # Backend API
│   ├── imo-generator.js           # Core IMO generation
│   ├── mcp-bridge.js             # MCP integration
│   └── composio-client.js        # Composio API client
├── src/
│   ├── app/
│   │   ├── lib/
│   │   │   ├── mcp-client.ts     # MCP client library
│   │   │   └── doctrine.ts       # Doctrine utilities
│   │   └── components/
│   │       ├── generators/       # Code generators
│   │       └── preview/          # Live preview
├── garage-mcp/                   # Local MCP server
│   ├── packages/                 # MCP packages
│   ├── scripts/                  # Automation scripts
│   └── services/                 # MCP services
└── tools/
    └── config/
        └── .env.schema.json      # Environment schema
```

## 🧪 Testing IMO Creator Integration

### **Test MCP Connectivity**
```bash
# Test local MCP server
curl -X POST http://localhost:7001/mcp/test \
  -H "Authorization: Bearer dev-local" \
  -H "Content-Type: application/json" \
  -d '{"action": "ping"}'

# Test Composio integration
curl -X GET https://backend.composio.dev/api/v3/connected_accounts \
  -H "x-api-key: ak_t-F0AbvfZHUZSUrqAGNn"
```

### **Test Component Generation**
```javascript
// Test IMO component generation
const testSpec = {
  component: 'UserCard',
  props: ['name', 'email', 'avatar'],
  styling: 'tailwind',
  responsive: true
};

const result = await generateComponent(testSpec);
console.log('Generated component:', result);
```

## 🔄 Integration with Barton Outreach Core

### **Shared Resources**
- **Composio API Key**: Same across both projects
- **Doctrine Standards**: Consistent ID generation patterns
- **MCP Patterns**: Similar integration approaches

### **Data Flow**
```
IMO Creator → Generates UI → Deploys to Vercel → Used by Outreach Core
     ↓
Barton Doctrine Metadata → Shared audit trail → Unified logging
```

### **Cross-Project Communication**
```javascript
// IMO Creator can contribute to outreach audit trail
async function logIMOOperation(operation) {
  const auditEntry = {
    unique_id: generateIMODoctrineId(),
    process_id: `IMO ${operation.type}`,
    altitude: 5000,
    timestamp: new Date().toISOString(),
    status: operation.status,
    source: 'imo-creator',
    // IMO-specific metadata
    component_type: operation.componentType,
    framework: 'react',
    deployment_url: operation.deploymentUrl
  };

  // Post to shared audit system
  await postToSharedAudit(auditEntry);
}
```

## 🚀 Future Enhancements

### **Planned Integrations**
1. **Figma Integration** - Design import and component generation
2. **Storybook Automation** - Automatic component documentation
3. **Testing Integration** - Automated test generation
4. **AI Code Review** - Automated quality assurance

### **Advanced MCP Features**
1. **Multi-Agent Orchestration** - Coordinated AI agents for complex tasks
2. **Real-time Collaboration** - Shared editing and preview
3. **Version Control Integration** - Automated branching and merging
4. **Performance Monitoring** - Real-time metrics and optimization

## 🔒 Security & Best Practices

### **API Key Management**
- Store all keys in `.env` files (never commit)
- Use different keys for development/production
- Rotate keys regularly
- Monitor usage and costs

### **MCP Security**
- Use bearer tokens for local MCP authentication
- Implement proper CORS configuration
- Validate all MCP requests and responses
- Log security events

### **Code Generation Safety**
- Sanitize all generated code
- Implement content filters
- Review AI-generated components
- Test thoroughly before deployment

## 📞 Support Resources

### **Documentation**
- Composio Docs: https://docs.composio.dev
- MCP Specification: https://modelcontextprotocol.io
- Barton Doctrine: See main outreach core documentation

### **Troubleshooting**
1. Check MCP server status: `curl localhost:7001/health`
2. Verify environment variables are set
3. Test Composio connectivity with provided scripts
4. Review logs for specific error patterns

---

**Last Updated**: January 2025
**Version**: v1.0.0
**Maintainer**: IMO Creator Team
**Related Projects**: barton-outreach-core