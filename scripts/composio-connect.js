#!/usr/bin/env node

/**
 * Composio Connection and Tool Setup Script
 * 
 * This script helps you:
 * 1. Connect to Composio using your API key
 * 2. List available tools
 * 3. Authenticate with specific services (GitHub, Gmail, etc.)
 * 4. Test tool execution
 */

const { Composio } = require('composio-core');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

class ComposioSetup {
  constructor() {
    // Use API key from environment or master.env
    this.apiKey = process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn';
    this.client = null;
  }

  async initialize() {
    console.log('🚀 Initializing Composio connection...\n');
    
    try {
      // Initialize Composio client
      this.client = new Composio(this.apiKey);
      
      console.log('✅ Connected to Composio successfully!');
      console.log(`📍 API Key: ${this.apiKey.substring(0, 10)}...`);
      
      // Test the connection
      const apps = await this.client.apps.list();
      console.log(`\n📱 Found ${apps.length} available apps in Composio\n`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Composio:', error.message);
      return false;
    }
  }

  async listAvailableTools() {
    console.log('\n📋 Available Composio Tools:\n');
    console.log('=' .repeat(60));
    
    const popularApps = [
      'github', 'gmail', 'slack', 'twilio', 'notion',
      'hubspot', 'salesforce', 'discord', 'linear', 'jira',
      'asana', 'trello', 'zendesk', 'intercom'
    ];
    
    for (const app of popularApps) {
      try {
        const tools = await this.client.tools.list({ apps: [app] });
        if (tools && tools.length > 0) {
          console.log(`\n🔧 ${app.toUpperCase()}: ${tools.length} tools available`);
          // Show first 3 tools as examples
          tools.slice(0, 3).forEach(tool => {
            console.log(`   - ${tool.name}: ${tool.description || 'No description'}`);
          });
          if (tools.length > 3) {
            console.log(`   ... and ${tools.length - 3} more`);
          }
        }
      } catch (error) {
        // App might not be available, skip silently
      }
    }
    
    console.log('\n' + '=' .repeat(60));
  }

  async setupAuthentication(appName) {
    console.log(`\n🔐 Setting up authentication for ${appName}...`);
    
    try {
      // Check if already connected
      const connections = await this.client.connectedAccounts.list();
      const existing = connections.find(c => c.appUniqueId === appName);
      
      if (existing) {
        console.log(`✅ ${appName} is already connected!`);
        console.log(`   Account ID: ${existing.id}`);
        return existing.id;
      }
      
      // Create new connection
      console.log(`\n📝 To connect ${appName}, you'll need to:`);
      console.log('   1. Get an authentication URL');
      console.log('   2. Complete authentication in your browser');
      console.log('   3. The connection will be saved automatically\n');
      
      const shouldConnect = await question(`Do you want to connect ${appName} now? (y/n): `);
      
      if (shouldConnect.toLowerCase() === 'y') {
        // Generate auth URL
        const authRequest = await this.client.connectedAccounts.initiateConnection({
          appName: appName,
          authMode: 'OAUTH2', // or API_KEY depending on the app
          authConfig: {}
        });
        
        console.log(`\n🌐 Authentication URL: ${authRequest.redirectUrl}`);
        console.log('\nPlease visit this URL to complete authentication.');
        console.log('Once done, press Enter to continue...');
        await question('');
        
        // Check connection status
        const updatedConnections = await this.client.connectedAccounts.list();
        const newConnection = updatedConnections.find(c => c.appUniqueId === appName);
        
        if (newConnection) {
          console.log(`✅ Successfully connected ${appName}!`);
          return newConnection.id;
        } else {
          console.log(`⚠️  Connection pending. You may need to complete authentication.`);
        }
      }
    } catch (error) {
      console.error(`❌ Error setting up ${appName}:`, error.message);
    }
    
    return null;
  }

  async testToolExecution(appName, toolName) {
    console.log(`\n🧪 Testing ${appName}.${toolName}...`);
    
    try {
      // Get connected account
      const connections = await this.client.connectedAccounts.list();
      const account = connections.find(c => c.appUniqueId === appName);
      
      if (!account) {
        console.log(`❌ No connected account found for ${appName}`);
        console.log(`   Run authentication setup first!`);
        return;
      }
      
      // Execute tool with sample data
      const testData = this.getTestData(appName, toolName);
      
      console.log('\n📤 Executing with test data:', JSON.stringify(testData, null, 2));
      
      const result = await this.client.tools.execute({
        connectedAccountId: account.id,
        toolName: toolName,
        input: testData
      });
      
      console.log('\n✅ Tool executed successfully!');
      console.log('📥 Result:', JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.error('❌ Tool execution failed:', error.message);
    }
  }

  getTestData(appName, toolName) {
    // Return appropriate test data based on the tool
    const testDataMap = {
      'github.issues_list': { repo: 'octocat/Hello-World', state: 'open' },
      'gmail.send_email': { to: 'test@example.com', subject: 'Test', body: 'Test email' },
      'slack.send_message': { channel: 'general', text: 'Test message' },
      'twilio.send_sms': { to: '+1234567890', body: 'Test SMS' }
    };
    
    return testDataMap[`${appName}.${toolName}`] || {};
  }

  async saveConfiguration() {
    console.log('\n💾 Saving configuration...');
    
    const envPath = path.join(process.cwd(), '.env');
    const envContent = `
# Composio Configuration
COMPOSIO_API_KEY=${this.apiKey}
COMPOSIO_BASE_URL=https://backend.composio.dev
`;
    
    // Append to existing .env or create new
    if (fs.existsSync(envPath)) {
      const existing = fs.readFileSync(envPath, 'utf8');
      if (!existing.includes('COMPOSIO_API_KEY')) {
        fs.appendFileSync(envPath, envContent);
        console.log('✅ Added Composio configuration to .env');
      } else {
        console.log('ℹ️  Composio configuration already exists in .env');
      }
    } else {
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Created .env with Composio configuration');
    }
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           COMPOSIO TOOL CONNECTION SETUP                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  const setup = new ComposioSetup();
  
  // Initialize connection
  const connected = await setup.initialize();
  if (!connected) {
    console.log('\n❌ Could not connect to Composio. Please check your API key.');
    rl.close();
    return;
  }
  
  // Main menu loop
  let running = true;
  while (running) {
    console.log('\n📌 What would you like to do?\n');
    console.log('1. List available tools');
    console.log('2. Setup authentication for an app');
    console.log('3. Test a tool');
    console.log('4. Save configuration');
    console.log('5. Exit\n');
    
    const choice = await question('Enter your choice (1-5): ');
    
    switch (choice) {
      case '1':
        await setup.listAvailableTools();
        break;
        
      case '2':
        const appName = await question('\nEnter app name (e.g., github, gmail, slack): ');
        await setup.setupAuthentication(appName.toLowerCase());
        break;
        
      case '3':
        const testApp = await question('\nEnter app name: ');
        const testTool = await question('Enter tool name: ');
        await setup.testToolExecution(testApp.toLowerCase(), testTool);
        break;
        
      case '4':
        await setup.saveConfiguration();
        break;
        
      case '5':
        running = false;
        break;
        
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
  
  console.log('\n👋 Goodbye!');
  rl.close();
}

// Run the setup
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});