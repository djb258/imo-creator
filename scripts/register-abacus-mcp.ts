#!/usr/bin/env ts-node

/**
 * Register Composio MCP server with Abacus.AI
 * Usage: npm run abacus:register
 */

import 'dotenv/config';
import fetch from 'node-fetch';

interface AbacusResponse {
  success?: boolean;
  message?: string;
  error?: string;
  server?: {
    id?: string;
    name?: string;
    url?: string;
    status?: string;
  };
}

async function registerMCPServer(): Promise<void> {
  const { ABACUS_API_BASE, ABACUS_API_KEY, COMPOSIO_MCP_URL } = process.env;

  // Validation
  if (!ABACUS_API_BASE || !ABACUS_API_KEY) {
    console.error('❌ Error: ABACUS_API_BASE and ABACUS_API_KEY must be set in .env');
    console.error('   Skipping automatic registration. Please import config/abacus.mcp.server.json manually in Abacus UI.');
    process.exit(1);
  }

  if (!COMPOSIO_MCP_URL) {
    console.error('❌ Error: COMPOSIO_MCP_URL must be set in .env');
    process.exit(1);
  }

  console.log('🚀 Registering Composio MCP server with Abacus.AI...');
  console.log(`   URL: ${COMPOSIO_MCP_URL}`);
  console.log(`   API: ${ABACUS_API_BASE}/mcp/servers`);

  try {
    const response = await fetch(`${ABACUS_API_BASE}/mcp/servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': ABACUS_API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: 'composio',
        url: COMPOSIO_MCP_URL,
        type: 'sse',
        description: 'Composio MCP Server - Universal tool integration',
        config: {
          headers: {
            'x-api-key': process.env.COMPOSIO_API_KEY || '',
            'x-entity-id': process.env.HIVE_USER_UUID || '6b9518ed-5771-4153-95bd-c72ce46e84ef'
          },
          capabilities: {
            tools: true,
            resources: false,
            prompts: false
          }
        }
      })
    });

    const data = await response.json() as AbacusResponse;

    if (response.status === 200 || response.status === 201) {
      console.log('✅ Successfully registered MCP server with Abacus.AI');
      if (data.server) {
        console.log('   Server Details:');
        console.log(`   - ID: ${data.server.id || 'N/A'}`);
        console.log(`   - Name: ${data.server.name || 'composio'}`);
        console.log(`   - Status: ${data.server.status || 'active'}`);
      }
      console.log('\n📝 Next steps:');
      console.log('   1. Go to Abacus → Deep Agent → MCP Servers');
      console.log('   2. Verify "composio" server is listed');
      console.log('   3. Test with: npm run smoke');
      process.exit(0);
    } else if (response.status === 409) {
      console.log('⚠️  MCP server "composio" already registered in Abacus');
      console.log('   To update, remove the existing server first in Abacus UI');
      process.exit(0);
    } else {
      console.error(`❌ Registration failed with status ${response.status}`);
      console.error('   Response:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error(`   Error: ${data.error}`);
      }
      
      console.error('\n📝 Manual registration:');
      console.error('   1. Go to Abacus → Deep Agent → MCP Servers');
      console.error('   2. Click "Add Server"');
      console.error('   3. Import config/abacus.mcp.server.json');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to register MCP server:', error.message);
    console.error('\n📝 Manual registration:');
    console.error('   1. Go to Abacus → Deep Agent → MCP Servers');
    console.error('   2. Click "Add Server"');
    console.error('   3. Import config/abacus.mcp.server.json');
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the registration
registerMCPServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});