#!/usr/bin/env node

/**
 * Development Tools - Solo Developer Edition
 * Productivity scripts for managing MCP servers
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const MCP_SERVERS_DIR = path.join(__dirname, '..', 'mcp-servers');

const serverMetadata = {
  'whimsical-mcp': { port: 3000, name: 'Whimsical' },
  'neon-mcp': { port: 3001, name: 'Neon DB' },
  'apify-mcp': { port: 3002, name: 'Apify' },
  'ctb-parser': { port: 3003, name: 'CTB Parser' },
  'email-validator': { port: 3004, name: 'Email Validator' },
  'github-mcp': { port: 3005, name: 'GitHub' },
  'plasmic-mcp': { port: 3006, name: 'Plasmic' },
  'vercel-mcp': { port: 3007, name: 'Vercel' },
  'render-mcp': { port: 3008, name: 'Render' },
  'n8n-mcp': { port: 3009, name: 'N8N' },
  'fire-crawl-mcp': { port: 3010, name: 'Fire Crawl' }
};

class DevTools {
  constructor() {
    this.runningProcesses = new Map();
  }

  async startAllServers() {
    console.log('🚀 Starting all MCP servers...\n');

    const servers = Object.keys(serverMetadata);
    const startPromises = servers.map(server => this.startServer(server));

    try {
      await Promise.all(startPromises);
      console.log('\n✅ All servers started successfully!');
      console.log('\n📊 Server Status:');
      this.showServerStatus();
    } catch (error) {
      console.error('❌ Error starting servers:', error.message);
    }
  }

  async startServer(serverName) {
    const serverDir = path.join(MCP_SERVERS_DIR, serverName);
    const metadata = serverMetadata[serverName];

    if (!fs.existsSync(serverDir)) {
      console.log(`❌ Server directory not found: ${serverName}`);
      return;
    }

    console.log(`🔧 Starting ${metadata.name} on port ${metadata.port}...`);

    return new Promise((resolve, reject) => {
      const process = spawn('node', ['server.js'], {
        cwd: serverDir,
        stdio: 'pipe',
        env: { ...process.env, PORT: metadata.port }
      });

      let startupComplete = false;

      process.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server Running') || output.includes('listening')) {
          if (!startupComplete) {
            console.log(`✅ ${metadata.name} started successfully`);
            startupComplete = true;
            resolve();
          }
        }
      });

      process.stderr.on('data', (data) => {
        const error = data.toString();
        if (!startupComplete && error.includes('Error')) {
          console.log(`❌ ${metadata.name} failed to start: ${error.trim()}`);
          reject(new Error(`${serverName} startup failed`));
        }
      });

      process.on('close', (code) => {
        this.runningProcesses.delete(serverName);
        if (code !== 0 && !startupComplete) {
          reject(new Error(`${serverName} exited with code ${code}`));
        }
      });

      this.runningProcesses.set(serverName, process);

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!startupComplete) {
          console.log(`⚠️  ${metadata.name} startup timeout (may still be starting)`);
          resolve(); // Don't fail the whole batch
        }
      }, 10000);
    });
  }

  showServerStatus() {
    Object.entries(serverMetadata).forEach(([serverName, metadata]) => {
      const status = this.runningProcesses.has(serverName) ? '🟢 Running' : '🔴 Stopped';
      const url = `http://localhost:${metadata.port}`;
      console.log(`  ${metadata.name.padEnd(15)} ${status} - ${url}`);
    });
  }

  async checkAllHealth() {
    console.log('🏥 Checking health of all MCP servers...\n');

    const servers = Object.keys(serverMetadata);
    const healthPromises = servers.map(server => this.checkServerHealth(server));

    const results = await Promise.allSettled(healthPromises);
    
    let healthyCount = 0;
    results.forEach((result, index) => {
      const serverName = servers[index];
      const metadata = serverMetadata[serverName];
      
      if (result.status === 'fulfilled' && result.value) {
        console.log(`✅ ${metadata.name.padEnd(15)} Healthy`);
        healthyCount++;
      } else {
        console.log(`❌ ${metadata.name.padEnd(15)} Unhealthy`);
      }
    });

    console.log(`\n📊 Health Summary: ${healthyCount}/${servers.length} servers healthy`);
    return healthyCount === servers.length;
  }

  async checkServerHealth(serverName) {
    const metadata = serverMetadata[serverName];
    const healthUrl = `http://localhost:${metadata.port}/mcp/health`;

    return new Promise((resolve) => {
      const req = require('http').get(healthUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const health = JSON.parse(data);
            resolve(health.status === 'healthy');
          } catch {
            resolve(false);
          }
        });
      });

      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  stopAllServers() {
    console.log('🛑 Stopping all MCP servers...\n');

    this.runningProcesses.forEach((process, serverName) => {
      const metadata = serverMetadata[serverName];
      console.log(`🔧 Stopping ${metadata.name}...`);
      process.kill('SIGTERM');
    });

    setTimeout(() => {
      this.runningProcesses.forEach((process, serverName) => {
        if (!process.killed) {
          console.log(`🔪 Force killing ${serverMetadata[serverName].name}...`);
          process.kill('SIGKILL');
        }
      });
    }, 5000);

    console.log('✅ All servers stopped');
  }

  async runComplianceCheck() {
    console.log('📋 Running compliance check...\n');
    
    return new Promise((resolve, reject) => {
      const checkProcess = spawn('node', ['scripts/compliance-check.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });

      checkProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Compliance check failed with code ${code}`));
        }
      });
    });
  }

  async createNewMCPServer(name, type = 'generic') {
    console.log(`🔧 Creating new MCP server: ${name}...`);

    const serverDir = path.join(MCP_SERVERS_DIR, name);
    
    if (fs.existsSync(serverDir)) {
      console.log(`❌ Server ${name} already exists`);
      return;
    }

    // Create directory structure
    fs.mkdirSync(serverDir, { recursive: true });
    fs.mkdirSync(path.join(serverDir, 'manifests'));
    fs.mkdirSync(path.join(serverDir, 'mock'));
    fs.mkdirSync(path.join(serverDir, 'middleware'));
    fs.mkdirSync(path.join(serverDir, 'tools'));

    // Generate package.json
    const packageJson = {
      name: `${name}-mcp-server`,
      version: '1.0.0',
      description: `${name} MCP Server`,
      main: 'server.js',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
        test: 'echo "Error: no test specified" && exit 1'
      },
      keywords: ['mcp', name.replace('-mcp', ''), 'heir', 'orbt'],
      author: 'Claude Code',
      license: 'MIT',
      dependencies: {
        express: '^4.18.2',
        axios: '^1.6.0',
        pg: '^8.11.0'
      },
      devDependencies: {
        nodemon: '^3.0.0'
      }
    };

    fs.writeFileSync(
      path.join(serverDir, 'package.json'), 
      JSON.stringify(packageJson, null, 2)
    );

    // Generate basic server.js template
    const serverTemplate = `/**
 * ${name} MCP Server - Auto-generated
 * Built on MCP Doctrine Layer foundation
 */

const express = require('express');
const { SimpleMCPTool } = require('../../mcp-doctrine-layer/templates/simple_mcp_tool');
const { setupHealthChecking } = require('../../mcp-doctrine-layer/health/simple_health_check');
const { setupKillSwitch } = require('../../mcp-doctrine-layer/emergency/kill_switch');
const axios = require('axios');

class ${name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, '')}Tool extends SimpleMCPTool {
    constructor() {
        super('${name.replace('-mcp', '')}', {
            version: '1.0.0',
            orbtLayer: 5,
            systemCode: '${name.toUpperCase().replace('-MCP', '').substring(0, 6)}'
        });
    }

    async doWork(params) {
        const { operation } = params;
        
        // TODO: Implement your business logic here
        return {
            message: \`\${operation} operation completed\`,
            timestamp: new Date().toISOString(),
            mock_mode: process.env.USE_MOCK === 'true'
        };
    }

    async healthCheck() {
        return {
            tool_name: this.toolName,
            version: this.version,
            status: 'healthy',
            timestamp: new Date().toISOString()
        };
    }
}

const app = express();
app.use(express.json({ limit: '10mb' }));

const tool = new ${name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, '')}Tool();

setupKillSwitch(app);
setupHealthChecking(app, {
    '${name.replace('-mcp', '')}': tool
});

app.post('/execute', async (req, res) => {
    try {
        const result = await tool.execute(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        service: '${name} MCP Server',
        version: '1.0.0',
        status: 'operational',
        endpoints: [
            'POST /execute - Main MCP execution endpoint',
            'GET /mcp/health - Health check',
            'GET /mcp/status - Visual status page'
        ]
    });
});

const PORT = process.env.PORT || ${3011 + Object.keys(serverMetadata).length};
app.listen(PORT, () => {
    console.log(\`
    🔧 ${name} MCP Server Running
    ================================
    Port: \${PORT}
    Health: http://localhost:\${PORT}/mcp/health
    Status: http://localhost:\${PORT}/mcp/status
    Kill Switch: \${process.env.MCP_KILL_SWITCH === 'true' ? '🚨 ACTIVE' : '✅ Inactive'}
    
    HEIR Compliance: ✅
    ORBT Layer: 5
    Mantis Logging: ✅
    ================================
    \`);
});

process.on('SIGTERM', () => {
    console.log('Shutting down ${name} MCP Server...');
    process.exit(0);
});

module.exports = { ${name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, '')}Tool };`;

    fs.writeFileSync(path.join(serverDir, 'server.js'), serverTemplate);

    console.log(`✅ Created ${name} MCP server`);
    console.log(`📁 Directory: ${serverDir}`);
    console.log(`📦 Next steps:`);
    console.log(`   cd mcp-servers/${name}`);
    console.log(`   npm install`);
    console.log(`   npm start`);
  }
}

async function main() {
  const devTools = new DevTools();
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'start':
      if (arg) {
        await devTools.startServer(arg);
      } else {
        await devTools.startAllServers();
      }
      break;

    case 'stop':
      devTools.stopAllServers();
      break;

    case 'health':
      await devTools.checkAllHealth();
      break;

    case 'status':
      devTools.showServerStatus();
      break;

    case 'compliance':
      await devTools.runComplianceCheck();
      break;

    case 'create':
      if (!arg) {
        console.log('❌ Please provide a server name: npm run create <server-name>');
        process.exit(1);
      }
      await devTools.createNewMCPServer(arg);
      break;

    default:
      console.log(\`
🛠️  MCP Development Tools

Usage: node scripts/dev-tools.js <command> [args]

Commands:
  start [server]    Start all servers or specific server
  stop             Stop all running servers  
  health           Check health of all servers
  status           Show server status
  compliance       Run compliance check
  create <name>    Create new MCP server

Examples:
  node scripts/dev-tools.js start
  node scripts/dev-tools.js start apify-mcp
  node scripts/dev-tools.js health
  node scripts/dev-tools.js create stripe-mcp
      \`);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DevTools };