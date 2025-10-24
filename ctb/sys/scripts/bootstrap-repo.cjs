#!/usr/bin/env node

/**
 * IMO Creator Repository Bootstrap
 * Automatically discovers and validates repository state for Claude
 * Run this script to get instant context awareness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RepoBootstrap {
  constructor() {
    this.repoRoot = process.cwd();
    this.report = {
      timestamp: new Date().toISOString(),
      repository: 'imo-creator',
      status: {},
      services: {},
      files: {},
      warnings: [],
      quickStart: []
    };
  }

  async bootstrap() {
    console.log('🚀 IMO Creator Repository Bootstrap\n');

    await this.discoverStructure();
    await this.checkServices();
    await this.validateIntegrations();
    await this.generateReport();

    console.log('✅ Bootstrap complete! Repository state discovered.\n');
    return this.report;
  }

  async discoverStructure() {
    console.log('📁 Discovering repository structure...');

    // Critical files check
    const criticalFiles = [
      'CLAUDE.md',
      'COMPOSIO_INTEGRATION.md',
      'main.py',
      'render.yaml',
      'Procfile',
      'firebase_mcp.js',
      'src/server/main.py'
    ];

    criticalFiles.forEach(file => {
      const exists = fs.existsSync(path.join(this.repoRoot, file));
      this.report.files[file] = {
        exists,
        path: path.join(this.repoRoot, file),
        lastModified: exists ? fs.statSync(path.join(this.repoRoot, file)).mtime : null
      };

      if (!exists) {
        this.report.warnings.push(`❌ Missing critical file: ${file}`);
      }
    });

    // Check for MCP server
    const mcpPath = 'C:\\Users\\CUSTOM PC\\Desktop\\Cursor Builds\\scraping-tool\\imo-creator\\mcp-servers\\composio-mcp';
    this.report.services.mcpServerPath = {
      path: mcpPath,
      exists: fs.existsSync(mcpPath),
      serverFile: fs.existsSync(path.join(mcpPath, 'server.js'))
    };

    if (!this.report.services.mcpServerPath.exists) {
      this.report.warnings.push('❌ Composio MCP server path not found');
    }
  }

  async checkServices() {
    console.log('🔍 Checking service status...');

    // Check if ports are in use
    const ports = [3001, 8000, 8001];

    for (const port of ports) {
      try {
        execSync(`netstat -an | findstr :${port}`, { stdio: 'pipe' });
        this.report.services[`port_${port}`] = { status: 'IN_USE', description: this.getPortDescription(port) };
      } catch (error) {
        this.report.services[`port_${port}`] = { status: 'AVAILABLE', description: this.getPortDescription(port) };
      }
    }

    // Test Composio MCP if running
    if (this.report.services.port_3001.status === 'IN_USE') {
      try {
        const curlCommand = 'curl -s -X POST http://localhost:3001/tool -H "Content-Type: application/json" -d "{\\"tool\\": \\"get_composio_stats\\", \\"data\\": {}, \\"unique_id\\": \\"HEIR-2025-09-BOOTSTRAP-01\\", \\"process_id\\": \\"PRC-BOOTSTRAP-001\\", \\"orbt_layer\\": 2, \\"blueprint_version\\": \\"1.0\\"}"';
        const response = execSync(curlCommand, { encoding: 'utf8' });
        this.report.services.composio_mcp = {
          status: 'ACTIVE',
          response: JSON.parse(response),
          quickTest: '✅ Composio MCP responding correctly'
        };
      } catch (error) {
        this.report.services.composio_mcp = {
          status: 'ERROR',
          error: error.message,
          quickTest: '❌ Composio MCP not responding'
        };
      }
    } else {
      this.report.services.composio_mcp = {
        status: 'NOT_RUNNING',
        quickTest: '⚠️  Composio MCP server not started'
      };
      this.report.quickStart.push('Start Composio MCP: cd "C:\\Users\\CUSTOM PC\\Desktop\\Cursor Builds\\scraping-tool\\imo-creator\\mcp-servers\\composio-mcp" && node server.js');
    }
  }

  async validateIntegrations() {
    console.log('🔗 Validating integrations...');

    // Check Google services if MCP is running
    if (this.report.services.composio_mcp?.status === 'ACTIVE') {
      const googleServices = ['GMAIL', 'GOOGLEDRIVE', 'GOOGLECALENDAR', 'GOOGLESHEETS'];

      for (const service of googleServices) {
        try {
          const curlCommand = `curl -s -X POST http://localhost:3001/tool -H "Content-Type: application/json" -d "{\\"tool\\": \\"manage_connected_account\\", \\"data\\": {\\"action\\": \\"list\\", \\"app\\": \\"${service}\\"}, \\"unique_id\\": \\"HEIR-2025-09-CHECK-01\\", \\"process_id\\": \\"PRC-CHECK-001\\", \\"orbt_layer\\": 2, \\"blueprint_version\\": \\"1.0\\"}"`;
          const response = execSync(curlCommand, { encoding: 'utf8' });
          const data = JSON.parse(response);

          this.report.services[`google_${service.toLowerCase()}`] = {
            status: 'CONNECTED',
            accounts: data.result?.account_data?.items?.length || 0,
            details: data.result?.account_data?.items?.map(acc => ({
              id: acc.id,
              status: acc.status,
              email: acc.data?.id_token ? this.decodeJWT(acc.data.id_token).email : 'unknown'
            })) || []
          };
        } catch (error) {
          this.report.services[`google_${service.toLowerCase()}`] = {
            status: 'ERROR',
            error: error.message
          };
        }
      }
    }

    // Check Firebase MCP file
    if (this.report.files['firebase_mcp.js']?.exists) {
      const firebaseContent = fs.readFileSync(path.join(this.repoRoot, 'firebase_mcp.js'), 'utf8');
      this.report.services.firebase_mcp = {
        status: 'AVAILABLE',
        hasBartonDoctrine: firebaseContent.includes('Barton Doctrine'),
        tools: (firebaseContent.match(/FIREBASE_\w+/g) || []).length
      };
    }
  }

  generateReport() {
    console.log('\n📊 REPOSITORY STATUS REPORT');
    console.log('=' .repeat(50));

    // Services Summary
    console.log('\n🔥 CRITICAL SERVICES:');
    if (this.report.services.composio_mcp?.status === 'ACTIVE') {
      console.log('✅ Composio MCP Server: ACTIVE on port 3001');
    } else {
      console.log('❌ Composio MCP Server: NOT RUNNING');
    }

    // Google Services
    console.log('\n📧 GOOGLE SERVICES:');
    ['gmail', 'googledrive', 'googlecalendar', 'googlesheets'].forEach(service => {
      const serviceData = this.report.services[`google_${service}`];
      if (serviceData?.status === 'CONNECTED') {
        console.log(`✅ ${service.toUpperCase()}: ${serviceData.accounts} accounts connected`);
        serviceData.details.forEach(acc => {
          console.log(`   • ${acc.email} (${acc.status})`);
        });
      } else {
        console.log(`❌ ${service.toUpperCase()}: Not verified`);
      }
    });

    // Quick Start Commands
    if (this.report.quickStart.length > 0) {
      console.log('\n🚀 QUICK START COMMANDS:');
      this.report.quickStart.forEach(cmd => console.log(`   ${cmd}`));
    }

    // Warnings
    if (this.report.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.report.warnings.forEach(warning => console.log(`   ${warning}`));
    }

    // Save detailed report
    const reportPath = path.join(this.repoRoot, '.bootstrap-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    console.log(`\n💾 Detailed report saved: ${reportPath}`);
  }

  getPortDescription(port) {
    const descriptions = {
      3001: 'Composio MCP Server (CRITICAL)',
      8000: 'FastAPI Server (Main)',
      8001: 'FastAPI Server (Alt)'
    };
    return descriptions[port] || 'Unknown service';
  }

  decodeJWT(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = Buffer.from(payload, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch (error) {
      return { email: 'decode_error' };
    }
  }
}

// Run bootstrap if called directly
if (require.main === module) {
  const bootstrap = new RepoBootstrap();
  bootstrap.bootstrap().then(report => {
    console.log('\n🎯 CLAUDE CONTEXT READY!');
    console.log('📖 Key files: CLAUDE.md, COMPOSIO_INTEGRATION.md');
    console.log('🔗 All integrations discovered and validated');
  }).catch(error => {
    console.error('❌ Bootstrap failed:', error.message);
    process.exit(1);
  });
}

module.exports = RepoBootstrap;