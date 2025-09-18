#!/usr/bin/env node

/**
 * Smartsheet Connection Test Script
 *
 * This script tests the Smartsheet API connection and basic operations
 * using the configured API token.
 */

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

class SmartsheetTester {
  constructor() {
    this.apiToken = process.env.SMARTSHEET_API_TOKEN;
    this.baseURL = process.env.SMARTSHEET_BASE_URL || 'https://api.smartsheet.com/2.0';

    if (!this.apiToken) {
      throw new Error('SMARTSHEET_API_TOKEN not found in environment variables');
    }

    this.headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'IMO-Creator-Test/1.0',
    };
  }

  async makeRequest(method, endpoint, data = null) {
    try {
      console.log(`Making ${method} request to: ${this.baseURL}${endpoint}`);

      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: this.headers,
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      const statusCode = error.response?.status || 'Unknown';
      throw new Error(`HTTP ${statusCode}: ${errorMsg}`);
    }
  }

  async testConnection() {
    console.log('🔍 Testing Smartsheet API connection...\n');

    try {
      // Test 1: Get current user info
      console.log('📋 Test 1: Getting current user information...');
      const userInfo = await this.makeRequest('GET', '/users/me');
      console.log('✅ Success! User info retrieved:');
      console.log(`   - Name: ${userInfo.firstName} ${userInfo.lastName}`);
      console.log(`   - Email: ${userInfo.email}`);
      console.log(`   - Account: ${userInfo.account?.name || 'N/A'}`);
      console.log('');

      // Test 2: List sheets
      console.log('📊 Test 2: Listing accessible sheets...');
      const sheetsResponse = await this.makeRequest('GET', '/sheets');
      const sheets = sheetsResponse.data || [];
      console.log(`✅ Success! Found ${sheets.length} sheets:`);

      if (sheets.length > 0) {
        sheets.slice(0, 5).forEach((sheet, index) => {
          console.log(`   ${index + 1}. ${sheet.name} (ID: ${sheet.id})`);
        });
        if (sheets.length > 5) {
          console.log(`   ... and ${sheets.length - 5} more sheets`);
        }
      } else {
        console.log('   No sheets found. You may need to create some sheets first.');
      }
      console.log('');

      // Test 3: List workspaces
      console.log('🏢 Test 3: Listing accessible workspaces...');
      const workspacesResponse = await this.makeRequest('GET', '/workspaces');
      const workspaces = workspacesResponse.data || [];
      console.log(`✅ Success! Found ${workspaces.length} workspaces:`);

      if (workspaces.length > 0) {
        workspaces.slice(0, 3).forEach((workspace, index) => {
          console.log(`   ${index + 1}. ${workspace.name} (ID: ${workspace.id})`);
        });
        if (workspaces.length > 3) {
          console.log(`   ... and ${workspaces.length - 3} more workspaces`);
        }
      } else {
        console.log('   No workspaces found.');
      }
      console.log('');

      // Test 4: Get detailed info for first sheet (if available)
      if (sheets.length > 0) {
        const firstSheet = sheets[0];
        console.log(`📄 Test 4: Getting detailed info for sheet "${firstSheet.name}"...`);

        try {
          const sheetDetails = await this.makeRequest('GET', `/sheets/${firstSheet.id}`);
          console.log('✅ Success! Sheet details retrieved:');
          console.log(`   - Columns: ${sheetDetails.columns?.length || 0}`);
          console.log(`   - Rows: ${sheetDetails.rows?.length || 0}`);
          console.log(`   - Access Level: ${sheetDetails.accessLevel || 'N/A'}`);
          console.log(`   - Created: ${sheetDetails.createdAt || 'N/A'}`);
          console.log(`   - Modified: ${sheetDetails.modifiedAt || 'N/A'}`);

          if (sheetDetails.columns && sheetDetails.columns.length > 0) {
            console.log('   - Column names:');
            sheetDetails.columns.slice(0, 5).forEach(col => {
              console.log(`     • ${col.title} (${col.type})`);
            });
          }
        } catch (error) {
          console.log(`⚠️  Could not get sheet details: ${error.message}`);
        }
        console.log('');
      }

      // Summary
      console.log('🎉 All tests completed successfully!');
      console.log('\nSmartsheet Integration Summary:');
      console.log(`✅ API Connection: Working`);
      console.log(`✅ User Authentication: Valid`);
      console.log(`✅ Sheets Access: ${sheets.length} sheets available`);
      console.log(`✅ Workspaces Access: ${workspaces.length} workspaces available`);

      return {
        success: true,
        userInfo,
        sheetsCount: sheets.length,
        workspacesCount: workspaces.length,
        sampleSheet: sheets.length > 0 ? sheets[0] : null,
      };

    } catch (error) {
      console.log(`❌ Test failed: ${error.message}\n`);

      // Provide helpful troubleshooting info
      console.log('🔧 Troubleshooting Tips:');
      console.log('1. Verify your API token is correct');
      console.log('2. Check that the token has not expired');
      console.log('3. Ensure you have appropriate permissions');
      console.log('4. Verify your internet connection');
      console.log('5. Check Smartsheet API status: https://status.smartsheet.com/');

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async testCreateSheet() {
    console.log('\n🆕 Testing sheet creation...');

    const testSheetName = `IMO Creator Test Sheet - ${new Date().toISOString().split('T')[0]}`;

    try {
      const newSheet = await this.makeRequest('POST', '/sheets', {
        name: testSheetName,
        columns: [
          {
            title: 'Task',
            type: 'TEXT_NUMBER',
            primary: true,
          },
          {
            title: 'Status',
            type: 'DROPDOWN',
            options: ['Not Started', 'In Progress', 'Completed'],
          },
          {
            title: 'Due Date',
            type: 'DATE',
          },
          {
            title: 'Completed',
            type: 'CHECKBOX',
          },
        ],
      });

      console.log(`✅ Test sheet created successfully!`);
      console.log(`   - Name: ${newSheet.result.name}`);
      console.log(`   - ID: ${newSheet.result.id}`);
      console.log(`   - Permalink: ${newSheet.result.permalink}`);

      return newSheet.result;

    } catch (error) {
      console.log(`❌ Sheet creation failed: ${error.message}`);
      return null;
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Smartsheet Integration Tests\n');
  console.log('=' .repeat(50));

  try {
    const tester = new SmartsheetTester();

    // Run connection tests
    const result = await tester.testConnection();

    if (result.success) {
      console.log('\n' + '=' .repeat(50));

      // Optionally test sheet creation
      const shouldCreateTestSheet = process.argv.includes('--create-test-sheet');
      if (shouldCreateTestSheet) {
        const testSheet = await tester.testCreateSheet();
        if (testSheet) {
          console.log('\n⚠️  Remember to delete the test sheet when you\'re done!');
        }
      } else {
        console.log('\nTo test sheet creation, run: node test-smartsheet.js --create-test-sheet');
      }

      console.log('\n🎯 Smartsheet is ready for integration with IMO Creator!');
    }

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SmartsheetTester };