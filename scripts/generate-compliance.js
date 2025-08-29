#!/usr/bin/env node

/**
 * MCP Compliance Generator - Solo Developer Edition
 * Automatically generates all compliance components for MCP servers
 */

const fs = require('fs');
const path = require('path');

const MCP_SERVERS_DIR = path.join(__dirname, '..', 'mcp-servers');

// Server metadata extracted from existing implementations
const serverMetadata = {
  'apify-mcp': {
    toolName: 'apify-scraper',
    version: '1.3.2',
    orbtLayer: 5,
    systemCode: 'APFYSC',
    description: 'Web scraping and data extraction using Apify platform',
    port: 3002,
    operations: ['run_actor', 'scrape_url', 'get_dataset', 'list_actors'],
    envVars: ['APIFY_API_KEY']
  },
  'ctb-parser': {
    toolName: 'ctb-parser',
    version: '1.0.0', 
    orbtLayer: 4,
    systemCode: 'CTBPSR',
    description: 'CTB (Component Tree Blueprint) structure parsing and validation',
    port: 3003,
    operations: ['parse_ctb', 'validate_ctb', 'convert_ctb', 'generate_blueprint'],
    envVars: []
  },
  'email-validator': {
    toolName: 'email-validator',
    version: '1.0.0',
    orbtLayer: 6,
    systemCode: 'EMLVLD',
    description: 'Email validation and verification services',
    port: 3004,
    operations: ['validate_email', 'validate_domain', 'bulk_validate', 'get_mx_records'],
    envVars: []
  },
  'github-mcp': {
    toolName: 'github-manager',
    version: '1.0.0',
    orbtLayer: 3,
    systemCode: 'GHUBMC',
    description: 'GitHub repository management and operations',
    port: 3005,
    operations: ['get_repository', 'list_commits', 'create_issue', 'get_pull_requests', 'get_file_content'],
    envVars: ['GITHUB_TOKEN']
  },
  'neon-mcp': {
    toolName: 'neon-db-manager',
    version: '1.0.0',
    orbtLayer: 2,
    systemCode: 'NEONDB',
    description: 'Neon PostgreSQL database operations',
    port: 3001,
    operations: ['execute_query', 'create_table', 'insert_data', 'get_schema', 'backup_data'],
    envVars: ['NEON_DATABASE_URL']
  },
  'whimsical-mcp': {
    toolName: 'whimsical-diagram-manager',
    version: '1.0.0',
    orbtLayer: 4,
    systemCode: 'WHMSCL',
    description: 'Whimsical diagram and flowchart management',
    port: 3000,
    operations: ['create_flowchart', 'update_diagram', 'export_diagram', 'list_workspaces'],
    envVars: ['WHIMSICAL_API_KEY']
  },
  'plasmic-mcp': {
    toolName: 'plasmic-component-manager',
    version: '1.0.0',
    orbtLayer: 4,
    systemCode: 'PLSMIC',
    description: 'Plasmic UI component management and code generation',
    port: 3006,
    operations: ['sync_components', 'get_component', 'generate_code', 'list_components'],
    envVars: ['PLASMIC_API_KEY', 'PLASMIC_PROJECT_ID']
  },
  'vercel-mcp': {
    toolName: 'vercel-deployment-manager',
    version: '1.0.0',
    orbtLayer: 3,
    systemCode: 'VRCLMC',
    description: 'Vercel deployment and infrastructure management',
    port: 3007,
    operations: ['deploy_project', 'list_deployments', 'set_env_vars', 'add_domain'],
    envVars: ['VERCEL_TOKEN', 'VERCEL_TEAM_ID']
  },
  'render-mcp': {
    toolName: 'render-infrastructure-manager',
    version: '1.0.0',
    orbtLayer: 3,
    systemCode: 'RDRMC',
    description: 'Render cloud infrastructure management',
    port: 3008,
    operations: ['list_services', 'create_service', 'deploy_service', 'get_logs', 'scale_service'],
    envVars: ['RENDER_API_KEY']
  },
  'n8n-mcp': {
    toolName: 'n8n-workflow-manager',
    version: '1.0.0',
    orbtLayer: 4,
    systemCode: 'N8NWFL',
    description: 'N8N workflow automation management',
    port: 3009,
    operations: ['list_workflows', 'execute_workflow', 'activate_workflow', 'trigger_webhook'],
    envVars: ['N8N_API_KEY', 'N8N_BASE_URL', 'N8N_WEBHOOK_URL']
  },
  'fire-crawl-mcp': {
    toolName: 'fire-crawl-scraper',
    version: '1.0.0',
    orbtLayer: 5,
    systemCode: 'FRCWL',
    description: 'Advanced web scraping and data extraction using FireCrawl',
    port: 3010,
    operations: ['scrape_single', 'crawl_website', 'batch_scrape', 'extract_data', 'get_credits'],
    envVars: ['FIRECRAWL_API_KEY']
  }
};

function generateToolManifest(serverName, metadata) {
  const manifest = {
    tool_name: metadata.toolName,
    version: metadata.version,
    classification: "mcp_server_operation",
    heir_compliance: "v2.1",
    orbt_policy: `layer_${metadata.orbtLayer}_operations`,
    
    manifest: {
      required_fields: {
        unique_id: {
          type: "string",
          pattern: "^HEIR-[0-9]{4}-[0-9]{2}-[A-Z]{3,8}-[A-Z]{2,6}-[0-9]{2}$",
          description: "HEIR-compliant unique identifier"
        },
        process_id: {
          type: "string", 
          pattern: "^PRC-[A-Z0-9]{8}-[0-9]{13}$",
          description: "ORBT process tracking identifier"
        },
        orbt_layer: {
          type: "integer",
          minimum: 1,
          maximum: 7,
          default: metadata.orbtLayer,
          description: `ORBT policy layer ${metadata.orbtLayer} operations`
        },
        blueprint_version: {
          type: "string",
          pattern: "^v[0-9]+\\.[0-9]+\\.[0-9]+-[a-f0-9]{8}$",
          description: "Versioned blueprint hash"
        }
      },
      
      tool_specific_fields: {
        operation: {
          type: "string",
          enum: metadata.operations,
          description: "Specific operation to execute",
          required: true
        }
      },
      
      security_constraints: {
        rate_limit: metadata.orbtLayer >= 5 ? "5_per_minute" : "10_per_minute",
        concurrent_limit: metadata.orbtLayer >= 4 ? 2 : 3,
        data_retention: "7_days",
        pii_scrubbing: metadata.orbtLayer >= 4 ? "mandatory" : "optional",
        domain_allowlist: metadata.orbtLayer >= 5 ? "enforced" : "optional"
      },
      
      fallback_behavior: {
        on_rate_limit: "queue_with_exponential_backoff",
        on_timeout: "log_and_retry_once", 
        on_failure: "log_and_abort",
        on_compliance_violation: "immediate_abort"
      },
      
      logging_schema: {
        pre_execution: [
          "unique_id", "process_id", "operation", "timestamp", 
          "orbt_layer", "rate_limit_status"
        ],
        during_execution: [
          "status", "progress_percent", "memory_usage"
        ],
        post_execution: [
          "result_status", "execution_time", "compliance_status"
        ],
        error_conditions: [
          "error_type", "error_code", "retry_count", 
          "fallback_triggered", "mitigation_action"
        ]
      }
    },
    
    compliance_checklist: {
      heir_unique_id_format: "validated",
      orbt_process_lineage: "tracked", 
      blueprint_version_consistency: "enforced",
      rate_limits: "respected",
      pii_scrubbing: metadata.orbtLayer >= 4 ? "mandatory" : "optional",
      data_retention_policy: "enforced",
      mantis_logging_integration: "enabled", 
      kill_switch_registration: "armed"
    },
    
    orbt_escalation_matrix: {
      [`layer_${metadata.orbtLayer}`]: metadata.description
    }
  };
  
  return JSON.stringify(manifest, null, 2);
}

function generateSamplePayload(serverName, metadata) {
  const basePayload = {
    unique_id: `HEIR-2024-12-${metadata.systemCode}-EXEC-01`,
    process_id: `PRC-${metadata.systemCode.padEnd(8, '0')}-${Date.now()}`,
    orbt_layer: metadata.orbtLayer,
    blueprint_version: `v1.0.0-${Math.random().toString(16).substr(2, 8)}`,
    operation: metadata.operations[0] // Use first operation as example
  };
  
  return JSON.stringify(basePayload, null, 2);
}

function generateMockResponse(serverName, metadata) {
  const mockResponse = {
    success: true,
    data: {
      message: `Mock response for ${metadata.toolName}`,
      operation: metadata.operations[0],
      timestamp: new Date().toISOString(),
      mock_mode: true
    },
    unique_id: `HEIR-2024-12-${metadata.systemCode}-EXEC-01`,
    execution_time_ms: Math.floor(Math.random() * 1000) + 100,
    compliance_status: "COMPLIANT"
  };
  
  return JSON.stringify(mockResponse, null, 2);
}

function generateREADME(serverName, metadata) {
  return `# ${serverName.charAt(0).toUpperCase() + serverName.slice(1)} MCP Server

${metadata.description}

## Overview

**Tool Name**: ${metadata.toolName}  
**Version**: ${metadata.version}  
**ORBT Layer**: ${metadata.orbtLayer}  
**System Code**: ${metadata.systemCode}  
**Port**: ${metadata.port}

## Operations

${metadata.operations.map(op => `- \`${op}\` - ${op.replace(/_/g, ' ')}`).join('\n')}

## Environment Variables

${metadata.envVars.length > 0 ? 
  metadata.envVars.map(env => `- \`${env}\` - Required for ${env.includes('API') ? 'API authentication' : 'configuration'}`).join('\n') :
  'No environment variables required.'
}

## Usage Example

\`\`\`json
{
  "operation": "${metadata.operations[0]}",
  "unique_id": "HEIR-2024-12-${metadata.systemCode}-EXEC-01",
  "process_id": "PRC-${metadata.systemCode.padEnd(8, '0')}-${Date.now()}",
  "orbt_layer": ${metadata.orbtLayer},
  "blueprint_version": "v1.0.0-abcd1234"
}
\`\`\`

## Health Check

- **Endpoint**: \`GET /mcp/health\`
- **Status Page**: \`GET /mcp/status\`
- **Kill Switch**: \`POST /mcp/kill-switch/activate\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Start server
npm start

# Start with hot reload
npm run dev

# Run in mock mode
USE_MOCK=true npm start
\`\`\`

## HEIR/ORBT Compliance

✅ Kill switch integration  
✅ Mantis logging  
✅ HEIR unique ID generation  
✅ ORBT layer ${metadata.orbtLayer} authorization  
✅ Blueprint version tracking  

## Architecture

- **Server**: \`server.js\` - Express server setup
- **Tool Logic**: \`tools/tool_handler.js\` - Core business logic
- **Middleware**: \`middleware/\` - Validation, logging, kill switch
- **Manifests**: \`manifests/tool_manifest.json\` - Schema definitions
- **Mocks**: \`mock/\` - Sample payloads and responses

Last updated: ${new Date().toISOString()}
`;
}

async function createServerCompliance(serverName) {
  const metadata = serverMetadata[serverName];
  if (!metadata) {
    console.log(`❌ No metadata found for ${serverName}`);
    return;
  }

  const serverDir = path.join(MCP_SERVERS_DIR, serverName);
  if (!fs.existsSync(serverDir)) {
    console.log(`❌ Server directory not found: ${serverName}`);
    return;
  }

  console.log(`🔧 Creating compliance structure for ${serverName}...`);

  // Create directory structure
  const dirs = ['manifests', 'mock', 'middleware', 'tools'];
  dirs.forEach(dir => {
    const dirPath = path.join(serverDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Generate tool manifest
  const manifestPath = path.join(serverDir, 'manifests', 'tool_manifest.json');
  fs.writeFileSync(manifestPath, generateToolManifest(serverName, metadata));

  // Generate mock files
  const samplePayloadPath = path.join(serverDir, 'mock', 'sample_payload.json');
  const mockResponsePath = path.join(serverDir, 'mock', 'mock_response.json');
  fs.writeFileSync(samplePayloadPath, generateSamplePayload(serverName, metadata));
  fs.writeFileSync(mockResponsePath, generateMockResponse(serverName, metadata));

  // Generate README if it doesn't exist
  const readmePath = path.join(serverDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, generateREADME(serverName, metadata));
  }

  console.log(`✅ Compliance structure created for ${serverName}`);
}

async function main() {
  console.log('🚀 MCP Compliance Generator Starting...\n');

  // Get all MCP server directories
  const servers = fs.readdirSync(MCP_SERVERS_DIR)
    .filter(dir => {
      const serverDir = path.join(MCP_SERVERS_DIR, dir);
      return fs.statSync(serverDir).isDirectory() && 
             dir !== 'shared' && 
             serverMetadata[dir]; // Only process servers we have metadata for
    });

  console.log(`Found ${servers.length} servers to process:\n${servers.map(s => `  - ${s}`).join('\n')}\n`);

  // Process each server
  for (const server of servers) {
    await createServerCompliance(server);
  }

  console.log('\n✅ MCP Compliance Generation Complete!');
  console.log('\nGenerated:');
  console.log('  - Tool manifests with schema validation');
  console.log('  - Mock payloads and responses');
  console.log('  - README documentation');
  console.log('  - Directory structure for middleware');
  console.log('\nNext steps:');
  console.log('  - Run: node scripts/extract-middleware.js');
  console.log('  - Run: node scripts/extract-tool-logic.js');
  console.log('  - Run: node scripts/compliance-check.js');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createServerCompliance, generateToolManifest, serverMetadata };