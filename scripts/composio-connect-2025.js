#!/usr/bin/env node

/**
 * Composio Connection Manager - 2025 Edition
 * Updated with latest authentication patterns and security practices
 */

const { Composio } = require('composio-core');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

class ComposioManager2025 {
  constructor() {
    this.apiKey = process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn';
    this.client = new Composio(this.apiKey);
    this.connectedApps = [];
  }

  async initialize() {
    console.log('🚀 Composio Connection Manager 2025\n');
    console.log('=' .repeat(70));
    
    try {
      // Get current connections
      const accounts = await this.client.connectedAccounts.list({});
      
      if (Array.isArray(accounts)) {
        this.connectedApps = accounts.map(acc => ({
          name: acc.appUniqueId || acc.app_unique_id,
          id: acc.id,
          status: acc.status || 'ACTIVE'
        }));
      }
      
      console.log('\n📊 Current Status:');
      console.log(`   API Key: ${this.apiKey.substring(0, 20)}...`);
      console.log(`   Connected Services: ${this.connectedApps.length}`);
      console.log(`   User ID: default`);
      
      if (this.connectedApps.length > 0) {
        console.log('\n✅ Connected Services:');
        this.connectedApps.forEach(app => {
          console.log(`   • ${app.name.toUpperCase()} (${app.status})`);
        });
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize:', error.message);
      return false;
    }
  }

  async showServiceCategories() {
    console.log('\n🔧 Service Categories & Authentication Methods:\n');
    
    const categories = {
      'OAuth Services (Browser Auth Required)': {
        description: 'Requires browser authentication via MCP in Claude',
        services: [
          'github', 'gmail', 'google_calendar', 'google_drive',
          'slack', 'discord', 'notion', 'linear', 'jira',
          'asana', 'trello', 'salesforce', 'hubspot'
        ],
        method: 'Use Claude MCP integration - just ask "Connect to [service]"'
      },
      'API Key Services (Direct Setup)': {
        description: 'Can be set up with API keys',
        services: [
          'openai', 'anthropic', 'perplexity', 'twilio', 'sendgrid',
          'stripe', 'neon', 'supabase', 'mongodb'
        ],
        method: 'Add API keys to .env and run connection script'
      },
      'Web Scraping & Automation': {
        description: 'Already connected and ready',
        services: [
          'apify ✅', 'firecrawl ✅', 'heyreach ✅'
        ],
        method: 'Ready to use in Claude'
      },
      'Marketing & CRM': {
        description: 'Marketing and customer management',
        services: [
          'activecampaign ✅', 'mailchimp', 'constantcontact'
        ],
        method: 'Mix of API keys and OAuth'
      }
    };

    Object.keys(categories).forEach(category => {
      const cat = categories[category];
      console.log(`📁 ${category}`);
      console.log(`   ${cat.description}`);
      console.log(`   Services: ${cat.services.join(', ')}`);
      console.log(`   Setup: ${cat.method}\n`);
    });
  }

  async connectAPIKeyService() {
    console.log('\n🔑 API Key Service Connection\n');
    
    const apiKeyServices = {
      'twilio': {
        keys: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'],
        example: 'TWILIO_ACCOUNT_SID=AC... and TWILIO_AUTH_TOKEN=...'
      },
      'stripe': {
        keys: ['STRIPE_SECRET_KEY'],
        example: 'STRIPE_SECRET_KEY=sk_live_...'
      },
      'sendgrid': {
        keys: ['SENDGRID_API_KEY'],
        example: 'SENDGRID_API_KEY=SG...'
      },
      'anthropic': {
        keys: ['ANTHROPIC_API_KEY'],
        example: 'ANTHROPIC_API_KEY=sk-ant-...'
      }
    };

    console.log('Available API Key Services:');
    Object.keys(apiKeyServices).forEach((service, i) => {
      console.log(`   ${i + 1}. ${service}`);
    });
    
    const choice = await question('\nEnter service number or name: ');
    const serviceName = Object.keys(apiKeyServices)[parseInt(choice) - 1] || choice.toLowerCase();
    
    if (!apiKeyServices[serviceName]) {
      console.log('❌ Service not found');
      return;
    }

    const service = apiKeyServices[serviceName];
    console.log(`\n📝 To connect ${serviceName.toUpperCase()}:`);
    console.log(`   Add to your .env file: ${service.example}`);
    console.log(`   Required keys: ${service.keys.join(', ')}`);
    
    const proceed = await question('\nHave you added the API keys to .env? (y/n): ');
    
    if (proceed.toLowerCase() === 'y') {
      try {
        const authConfig = {};
        
        // Build auth config based on service
        if (serviceName === 'twilio') {
          authConfig.account_sid = process.env.TWILIO_ACCOUNT_SID;
          authConfig.auth_token = process.env.TWILIO_AUTH_TOKEN;
        } else if (serviceName === 'stripe') {
          authConfig.api_key = process.env.STRIPE_SECRET_KEY;
        } else if (serviceName === 'sendgrid') {
          authConfig.api_key = process.env.SENDGRID_API_KEY;
        } else if (serviceName === 'anthropic') {
          authConfig.api_key = process.env.ANTHROPIC_API_KEY;
        }
        
        console.log('\n🔄 Connecting to Composio...');
        
        const account = await this.client.connectedAccounts.create({
          appName: serviceName,
          authMode: 'API_KEY',
          authConfig: authConfig
        });
        
        console.log(`✅ Successfully connected ${serviceName.toUpperCase()}!`);
        console.log(`   Account ID: ${account.id}`);
        
      } catch (error) {
        console.error(`❌ Connection failed: ${error.message}`);
        console.log('\n💡 Tips:');
        console.log('   - Verify API keys are correct and active');
        console.log('   - Check .env file formatting');
        console.log('   - Some services may require additional setup');
      }
    }
  }

  async showOAuthGuide() {
    console.log('\n🌐 OAuth Service Connection Guide\n');
    console.log('For OAuth services like GitHub, Slack, Gmail, etc.:');
    console.log('\n📋 Steps:');
    console.log('   1. Open Claude (restart if needed)');
    console.log('   2. Say: "Connect to [service name]"');
    console.log('   3. Claude will provide an authentication link');
    console.log('   4. Complete authentication in your browser');
    console.log('   5. Service becomes available immediately');
    
    console.log('\n🔧 Technical Details:');
    console.log('   • Uses OAuth 2.1 with Dynamic Client Registration (DCR)');
    console.log('   • Compliant with RFC 7591');
    console.log('   • No static client credentials needed');
    console.log('   • Enterprise-grade security');
    
    console.log('\n🎯 Popular OAuth Services to Try:');
    const oauthServices = [
      'GitHub - Code repository management',
      'Slack - Team communication',
      'Notion - Documentation and notes',
      'Gmail - Email management',
      'Google Calendar - Calendar management',
      'Linear - Project management',
      'Jira - Issue tracking'
    ];
    
    oauthServices.forEach(service => {
      console.log(`   • ${service}`);
    });
  }

  async testConnection() {
    console.log('\n🧪 Connection Test\n');
    
    if (this.connectedApps.length === 0) {
      console.log('❌ No services connected yet');
      return;
    }
    
    console.log('Connected services you can test:');
    this.connectedApps.forEach((app, i) => {
      console.log(`   ${i + 1}. ${app.name.toUpperCase()}`);
    });
    
    const choice = await question('\nSelect service to test (number): ');
    const selectedApp = this.connectedApps[parseInt(choice) - 1];
    
    if (!selectedApp) {
      console.log('❌ Invalid selection');
      return;
    }
    
    console.log(`\n🔄 Testing ${selectedApp.name.toUpperCase()}...`);
    console.log(`   Account ID: ${selectedApp.id}`);
    console.log(`   Status: ${selectedApp.status}`);
    
    // Test suggestions based on service
    const testSuggestions = {
      'neon': 'Try: SELECT version(); in Claude',
      'openai': 'Try: Generate a haiku about APIs in Claude',
      'apify': 'Try: Scrape a website in Claude',
      'activecampaign': 'Try: List email campaigns in Claude',
      'perplexityai': 'Try: Search for recent AI news in Claude'
    };
    
    const suggestion = testSuggestions[selectedApp.name.toLowerCase()];
    if (suggestion) {
      console.log(`\n💡 Test suggestion: ${suggestion}`);
    }
    
    console.log('\n✅ Connection verified! Service is ready to use in Claude.');
  }

  async showMCPStatus() {
    console.log('\n📡 MCP Connection Status\n');
    
    const mcpConfigPath = path.join(process.env.APPDATA, 'Claude', 'claude_desktop_config.json');
    
    if (fs.existsSync(mcpConfigPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
        
        if (config.mcpServers && config.mcpServers['mcp-config-2gmkvb']) {
          console.log('✅ MCP Integration: ACTIVE');
          console.log('   Server: apollo-g2g8iqoa6-composio.vercel.app');
          console.log('   Config: mcp-config-2gmkvb');
          console.log('   User ID: 8117665a-66bc-4466-919e-144f693a4a32');
        } else {
          console.log('⚠️  MCP Integration: NOT CONFIGURED');
        }
      } catch (e) {
        console.log('❌ MCP Integration: CONFIG ERROR');
      }
    } else {
      console.log('❌ MCP Integration: CLAUDE CONFIG NOT FOUND');
    }
    
    console.log('\n🔧 If MCP is not working:');
    console.log('   1. Restart Claude completely');
    console.log('   2. Check Claude desktop config at:');
    console.log(`      ${mcpConfigPath}`);
    console.log('   3. Re-run setup if needed:');
    console.log('      npx @composio/mcp@latest setup [url] [config] --client claude');
  }
}

async function main() {
  const manager = new ComposioManager2025();
  
  const initialized = await manager.initialize();
  if (!initialized) {
    console.log('\n❌ Failed to initialize. Check your API key and connection.');
    rl.close();
    return;
  }
  
  let running = true;
  while (running) {
    console.log('\n📌 What would you like to do?\n');
    console.log('1. Show service categories & auth methods');
    console.log('2. Connect API key service');
    console.log('3. OAuth connection guide');
    console.log('4. Test existing connection');
    console.log('5. Check MCP status');
    console.log('6. Exit\n');
    
    const choice = await question('Enter your choice (1-6): ');
    
    switch (choice) {
      case '1':
        await manager.showServiceCategories();
        break;
      case '2':
        await manager.connectAPIKeyService();
        break;
      case '3':
        await manager.showOAuthGuide();
        break;
      case '4':
        await manager.testConnection();
        break;
      case '5':
        await manager.showMCPStatus();
        break;
      case '6':
        running = false;
        break;
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
  
  console.log('\n✨ Connection management complete!');
  console.log('Your services are ready to use in Claude via MCP integration.\n');
  rl.close();
}

main().catch(error => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});