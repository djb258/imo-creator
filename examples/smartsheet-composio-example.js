#!/usr/bin/env node

/**
 * Smartsheet + Composio Integration Example
 *
 * This example demonstrates how to use Smartsheet with Composio MCP
 * for AI-powered sheet management and data operations.
 */

const { Composio } = require('@composio/core');
const { AnthropicProvider } = require('@composio/anthropic');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Example: Create an MCP server for Smartsheet operations
async function createSmartsheetMCPServer() {
  console.log('🚀 Creating Smartsheet MCP Server with Composio...\n');

  // Initialize Composio with Anthropic provider
  const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
    provider: new AnthropicProvider({ cacheTools: true }),
  });

  try {
    // Create MCP server with Smartsheet integration
    const mcpServer = await composio.mcp.create(
      `smartsheet-mcp-${Date.now()}`,
      [
        {
          toolkit: 'smartsheet',
          authConfigId: 'smartsheet-auth', // You'll need to create this in Composio dashboard
          allowedTools: [
            'SMARTSHEET_LIST_SHEETS',
            'SMARTSHEET_GET_SHEET',
            'SMARTSHEET_CREATE_SHEET',
            'SMARTSHEET_ADD_ROWS',
            'SMARTSHEET_UPDATE_ROWS',
            'SMARTSHEET_SEARCH_SHEETS',
          ]
        }
      ],
      { isChatAuth: false }
    );

    console.log('✅ MCP Server created successfully!');
    console.log(`📋 Server ID: ${mcpServer.id}`);
    console.log(`🔧 Available toolkits: ${mcpServer.toolkits.join(', ')}`);

    return mcpServer;

  } catch (error) {
    console.error('❌ Failed to create MCP server:', error.message);
    return null;
  }
}

// Example: Use Smartsheet operations with AI
async function demonstrateSmartsheetOperations() {
  console.log('\n📊 Demonstrating Smartsheet Operations...\n');

  const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
  });

  try {
    // Example 1: List all sheets
    console.log('1️⃣ Listing all accessible sheets...');
    const listResult = await composio.tools.execute('SMARTSHEET_LIST_SHEETS', {
      userId: 'user-123', // Replace with actual user ID
      arguments: {}
    });

    if (listResult.successful) {
      const sheets = listResult.data?.data || [];
      console.log(`✅ Found ${sheets.length} sheets`);

      if (sheets.length > 0) {
        console.log('First 3 sheets:');
        sheets.slice(0, 3).forEach((sheet, index) => {
          console.log(`   ${index + 1}. ${sheet.name} (ID: ${sheet.id})`);
        });
      }
    }

    // Example 2: Get detailed sheet information
    if (listResult.successful && listResult.data?.data?.length > 0) {
      const firstSheet = listResult.data.data[0];
      console.log(`\n2️⃣ Getting detailed info for "${firstSheet.name}"...`);

      const sheetResult = await composio.tools.execute('SMARTSHEET_GET_SHEET', {
        userId: 'user-123',
        arguments: {
          sheetId: firstSheet.id,
          include: 'attachments,discussions'
        }
      });

      if (sheetResult.successful) {
        const sheet = sheetResult.data;
        console.log(`✅ Sheet details retrieved:`);
        console.log(`   - Columns: ${sheet.columns?.length || 0}`);
        console.log(`   - Rows: ${sheet.rows?.length || 0}`);
        console.log(`   - Access Level: ${sheet.accessLevel}`);
      }
    }

    // Example 3: Search sheets
    console.log('\n3️⃣ Searching for sheets containing "auction"...');
    const searchResult = await composio.tools.execute('SMARTSHEET_SEARCH_SHEETS', {
      userId: 'user-123',
      arguments: {
        query: 'auction'
      }
    });

    if (searchResult.successful) {
      console.log(`✅ Search completed. Found matches in the search results.`);
    }

  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  }
}

// Example: Create a project tracking sheet
async function createProjectTrackingSheet() {
  console.log('\n🆕 Creating a new project tracking sheet...\n');

  const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
  });

  try {
    const sheetName = `IMO Creator Project - ${new Date().toISOString().split('T')[0]}`;

    const createResult = await composio.tools.execute('SMARTSHEET_CREATE_SHEET', {
      userId: 'user-123',
      arguments: {
        name: sheetName,
        columns: [
          {
            title: 'Task Name',
            type: 'TEXT_NUMBER',
            primary: true
          },
          {
            title: 'Assigned To',
            type: 'CONTACT_LIST'
          },
          {
            title: 'Status',
            type: 'DROPDOWN',
            options: ['Not Started', 'In Progress', 'Completed', 'On Hold']
          },
          {
            title: 'Priority',
            type: 'DROPDOWN',
            options: ['High', 'Medium', 'Low']
          },
          {
            title: 'Due Date',
            type: 'DATE'
          },
          {
            title: 'Completed',
            type: 'CHECKBOX'
          },
          {
            title: 'Notes',
            type: 'TEXT_NUMBER'
          }
        ]
      }
    });

    if (createResult.successful) {
      const newSheet = createResult.data.result;
      console.log('✅ Project tracking sheet created successfully!');
      console.log(`   - Name: ${newSheet.name}`);
      console.log(`   - ID: ${newSheet.id}`);
      console.log(`   - Permalink: ${newSheet.permalink}`);

      // Add initial rows
      console.log('\n📝 Adding initial project tasks...');

      const addRowsResult = await composio.tools.execute('SMARTSHEET_ADD_ROWS', {
        userId: 'user-123',
        arguments: {
          sheetId: newSheet.id,
          rows: [
            {
              cells: [
                { columnId: newSheet.columns[0].id, value: 'Set up development environment' },
                { columnId: newSheet.columns[2].id, value: 'Completed' },
                { columnId: newSheet.columns[3].id, value: 'High' },
                { columnId: newSheet.columns[5].id, value: true },
                { columnId: newSheet.columns[6].id, value: 'Docker and Smartsheet integration completed' }
              ]
            },
            {
              cells: [
                { columnId: newSheet.columns[0].id, value: 'Integrate Smartsheet with Composio' },
                { columnId: newSheet.columns[2].id, value: 'Completed' },
                { columnId: newSheet.columns[3].id, value: 'High' },
                { columnId: newSheet.columns[5].id, value: true },
                { columnId: newSheet.columns[6].id, value: 'MCP server created and tested' }
              ]
            },
            {
              cells: [
                { columnId: newSheet.columns[0].id, value: 'Build AI-powered dashboard' },
                { columnId: newSheet.columns[2].id, value: 'Not Started' },
                { columnId: newSheet.columns[3].id, value: 'Medium' },
                { columnId: newSheet.columns[5].id, value: false },
                { columnId: newSheet.columns[6].id, value: 'Next phase of development' }
              ]
            }
          ],
          toTop: false
        }
      });

      if (addRowsResult.successful) {
        console.log('✅ Initial tasks added to the project sheet!');
      }

      return newSheet;
    }

  } catch (error) {
    console.error('❌ Failed to create project sheet:', error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🎯 Smartsheet + Composio Integration Examples\n');
  console.log('=' .repeat(60));

  // Check environment variables
  if (!process.env.COMPOSIO_API_KEY) {
    console.error('❌ COMPOSIO_API_KEY not found in environment variables');
    process.exit(1);
  }

  if (!process.env.SMARTSHEET_API_TOKEN) {
    console.error('❌ SMARTSHEET_API_TOKEN not found in environment variables');
    process.exit(1);
  }

  try {
    // Example 1: Create MCP server
    // const mcpServer = await createSmartsheetMCPServer();

    // Example 2: Demonstrate basic operations
    await demonstrateSmartsheetOperations();

    // Example 3: Create a project tracking sheet
    const createNewSheet = process.argv.includes('--create-project-sheet');
    if (createNewSheet) {
      await createProjectTrackingSheet();
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 All examples completed successfully!');

    if (!createNewSheet) {
      console.log('\nTo create a project tracking sheet, run:');
      console.log('node examples/smartsheet-composio-example.js --create-project-sheet');
    }

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = {
  createSmartsheetMCPServer,
  demonstrateSmartsheetOperations,
  createProjectTrackingSheet
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}