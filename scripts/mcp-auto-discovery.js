#!/usr/bin/env node

/**
 * MCP Auto-Discovery Tool
 * Automatically finds and documents all available MCP servers
 * Creates real-time documentation for Claude
 */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class MCPDiscoveryService {
  constructor() {
    this.discoveredServers = [];
    this.scanPorts = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009];
    this.endpoints = ['/mcp/docs', '/mcp/health', '/mcp/capabilities'];
  }

  async scanPort(port) {
    for (const endpoint of this.endpoints) {
      try {
        const response = await fetch(`http://localhost:${port}${endpoint}`, {
          timeout: 2000
        });
        
        if (response.ok) {
          const data = await response.json();
          return {
            port,
            endpoint,
            server: data.server || `unknown-${port}`,
            data
          };
        }
      } catch (error) {
        // Silent fail - server not running on this port/endpoint
      }
    }
    return null;
  }

  async discoverServers() {
    log('\n🔍 Discovering MCP servers...', 'bright');
    log('=' .repeat(40), 'blue');

    const results = await Promise.all(
      this.scanPorts.map(port => this.scanPort(port))
    );

    this.discoveredServers = results
      .filter(result => result !== null)
      .reduce((acc, result) => {
        // Group by server name
        const existing = acc.find(s => s.server === result.server);
        if (existing) {
          existing.endpoints[result.endpoint] = result.data;
        } else {
          acc.push({
            server: result.server,
            port: result.port,
            base_url: `http://localhost:${result.port}`,
            endpoints: {
              [result.endpoint]: result.data
            }
          });
        }
        return acc;
      }, []);

    return this.discoveredServers;
  }

  generateClaudeDocumentation() {
    const claudeConfig = {
      mcp_servers: {},
      discovery: {
        last_scan: new Date().toISOString(),
        auto_refresh: true,
        scan_interval: "5m"
      },
      usage_instructions: {
        tool_execution: "Use fetch() to call MCP servers with proper HEIR/ORBT payloads",
        error_handling: "Check server health if tools fail, re-read docs for updates",
        best_practices: [
          "Always include unique_id in HEIR format",
          "Use appropriate orbt_layer (1-5)",
          "Include process_id for tracking",
          "Check tool_status for real vs mock implementations"
        ]
      }
    };

    this.discoveredServers.forEach(server => {
      const docs = server.endpoints['/mcp/docs'];
      const health = server.endpoints['/mcp/health'];
      const capabilities = server.endpoints['/mcp/capabilities'];

      claudeConfig.mcp_servers[server.server] = {
        base_url: server.base_url,
        status: health?.status || 'unknown',
        description: docs?.description || capabilities?.description || 'No description',
        
        // Connection info
        connection: docs?.connection || {
          endpoint: '/tool',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        },

        // Available tools with examples
        tools: docs?.available_tools || [],
        usage_examples: docs?.usage_examples || {},
        
        // Tool status (real vs mock)
        tool_status: docs?.tool_status || {},
        
        // Health and docs endpoints
        docs_url: `${server.base_url}/mcp/docs`,
        health_url: `${server.base_url}/mcp/health`,
        
        // Last updated
        last_updated: docs?.last_updated || new Date().toISOString()
      };
    });

    return claudeConfig;
  }

  async saveConfiguration() {
    const config = this.generateClaudeDocumentation();
    
    // Save to .claude directory
    const claudeDir = path.join(process.cwd(), '.claude');
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    const configPath = path.join(claudeDir, 'mcp_servers.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    log(`\n📝 Saved configuration: ${configPath}`, 'green');
    return configPath;
  }

  generateReport() {
    log('\n📊 Discovery Report', 'bright');
    log('=' .repeat(30), 'blue');

    if (this.discoveredServers.length === 0) {
      log('❌ No MCP servers found', 'red');
      log('💡 Start some MCP servers and try again', 'yellow');
      return;
    }

    this.discoveredServers.forEach(server => {
      log(`\n🚀 ${server.server}`, 'cyan');
      log(`   Port: ${server.port}`, 'blue');
      log(`   Base URL: ${server.base_url}`, 'blue');
      
      const availableEndpoints = Object.keys(server.endpoints);
      log(`   Endpoints: ${availableEndpoints.join(', ')}`, 'green');

      // Show tool count if available
      const docs = server.endpoints['/mcp/docs'];
      if (docs && docs.available_tools) {
        log(`   Tools: ${docs.available_tools.length} available`, 'green');
        const realTools = docs.tool_status?.real_integrations?.length || 0;
        const mockTools = docs.tool_status?.mock_implementations?.length || 0;
        log(`   Status: ${realTools} real, ${mockTools} mock`, 'yellow');
      }
    });

    log('\n✨ Claude can now auto-discover these servers!', 'green');
  }

  async generateTestScript() {
    const testScript = `#!/usr/bin/env node

/**
 * Auto-generated MCP Test Script
 * Generated on: ${new Date().toISOString()}
 */

const fetch = require('node-fetch');

const servers = ${JSON.stringify(this.discoveredServers, null, 2)};

async function testAllServers() {
  console.log('🧪 Testing discovered MCP servers...');
  
  for (const server of servers) {
    console.log(\`\\n📡 Testing \${server.server}\`);
    
    try {
      const response = await fetch(\`\${server.base_url}/mcp/health\`);
      const health = await response.json();
      console.log(\`   Status: \${health.status}\`);
    } catch (error) {
      console.log(\`   ❌ Error: \${error.message}\`);
    }
  }
}

testAllServers();
`;

    const scriptPath = path.join(process.cwd(), 'scripts', 'test-discovered-servers.js');
    fs.writeFileSync(scriptPath, testScript);
    fs.chmodSync(scriptPath, 0o755);
    
    log(`\n🧪 Generated test script: ${scriptPath}`, 'green');
  }
}

async function main() {
  const discovery = new MCPDiscoveryService();
  
  await discovery.discoverServers();
  discovery.generateReport();
  
  if (discovery.discoveredServers.length > 0) {
    await discovery.saveConfiguration();
    await discovery.generateTestScript();
    
    log('\n💡 Next steps:', 'bright');
    log('1. Check .claude/mcp_servers.json for Claude configuration', 'blue');
    log('2. Run: node scripts/test-discovered-servers.js', 'blue');
    log('3. Claude will auto-load this configuration on startup', 'blue');
  }
}

if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Discovery failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = MCPDiscoveryService;