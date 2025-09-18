#!/usr/bin/env node

/**
 * GitHub + Composio Setup Script
 *
 * This script helps set up GitHub integration with Composio,
 * including authentication and connection configuration.
 */

const { Composio } = require('@composio/core');
const readline = require('readline');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to prompt user
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

// Initialize Composio
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn',
});

async function setupGitHubAuth() {
  console.log('🔧 GitHub + Composio Authentication Setup\n');
  console.log('=' .repeat(50));

  try {
    // Step 1: Check existing GitHub connections
    console.log('\n📋 Step 1: Checking existing GitHub connections...');

    const connectedAccounts = await composio.connectedAccounts.list({
      toolkit: 'github',
    });

    if (connectedAccounts.items && connectedAccounts.items.length > 0) {
      console.log(`✅ Found ${connectedAccounts.items.length} existing GitHub connection(s):`);
      connectedAccounts.items.forEach((account, index) => {
        console.log(`   ${index + 1}. ${account.id} - ${account.status}`);
      });

      const useExisting = await prompt('\nDo you want to use an existing connection? (yes/no): ');
      if (useExisting.toLowerCase() === 'yes') {
        console.log('✅ Using existing GitHub connection');
        return connectedAccounts.items[0];
      }
    } else {
      console.log('ℹ️  No existing GitHub connections found');
    }

    // Step 2: Create new GitHub connection
    console.log('\n📝 Step 2: Creating new GitHub connection...');

    const userId = await prompt('Enter a user ID for this connection (e.g., "user-123"): ');

    // Step 3: Generate authorization URL
    console.log('\n🔗 Step 3: Generating authorization URL...');

    const connectionRequest = await composio.connectionRequest.initiate({
      userId: userId || 'default-user',
      toolkitSlug: 'github',
      authConfig: {
        scopes: [
          'repo',           // Full control of repositories
          'workflow',       // Update GitHub Actions workflows
          'write:packages', // Upload packages to GitHub Package Registry
          'read:org',       // Read org and team membership
          'admin:repo_hook', // Manage repository hooks
          'notifications',  // Access notifications
          'user',          // Update user information
          'delete_repo',   // Delete repositories
        ],
      },
    });

    console.log('\n🌐 Authorization URL generated!');
    console.log('\n' + '=' .repeat(50));
    console.log('Please visit the following URL to authorize GitHub access:');
    console.log('\n' + connectionRequest.redirectUrl);
    console.log('=' .repeat(50));

    // Step 4: Wait for authorization
    console.log('\n⏳ Waiting for authorization...');
    console.log('After authorizing, press Enter to continue...');
    await prompt('');

    // Step 5: Verify connection
    console.log('\n✔️ Step 5: Verifying connection...');

    const updatedAccounts = await composio.connectedAccounts.list({
      toolkit: 'github',
      userId: userId || 'default-user',
    });

    if (updatedAccounts.items && updatedAccounts.items.length > 0) {
      const newAccount = updatedAccounts.items[0];
      console.log('✅ GitHub connection established successfully!');
      console.log(`   Account ID: ${newAccount.id}`);
      console.log(`   Status: ${newAccount.status}`);

      return newAccount;
    } else {
      console.log('⚠️ Connection not found. Please ensure you completed the authorization.');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Ensure your Composio API key is valid');
    console.error('2. Check your internet connection');
    console.error('3. Make sure you have appropriate GitHub permissions');
  }
}

async function testGitHubConnection() {
  console.log('\n🧪 Testing GitHub Connection...\n');
  console.log('=' .repeat(50));

  try {
    // Test 1: Get authenticated user
    console.log('📋 Test 1: Getting authenticated user info...');
    const userResult = await composio.tools.execute('GITHUB_GET_AUTHENTICATED_USER', {
      userId: 'mcp-user',
      arguments: {},
    });

    if (userResult.successful) {
      const userData = userResult.data;
      console.log('✅ User authenticated successfully!');
      console.log(`   - Username: ${userData.login}`);
      console.log(`   - Name: ${userData.name}`);
      console.log(`   - Email: ${userData.email}`);
      console.log(`   - Public Repos: ${userData.public_repos}`);
      console.log(`   - Followers: ${userData.followers}`);
    } else {
      console.log('❌ Failed to get user info:', userResult.error);
    }

    // Test 2: List repositories
    console.log('\n📂 Test 2: Listing repositories...');
    const reposResult = await composio.tools.execute('GITHUB_LIST_REPOS_FOR_AUTHENTICATED_USER', {
      userId: 'mcp-user',
      arguments: {
        per_page: 5,
        sort: 'updated',
      },
    });

    if (reposResult.successful) {
      const repos = reposResult.data || [];
      console.log(`✅ Found ${repos.length} repositories:`);
      repos.forEach((repo, index) => {
        console.log(`   ${index + 1}. ${repo.full_name}`);
        console.log(`      - ${repo.description || 'No description'}`);
        console.log(`      - Language: ${repo.language || 'N/A'}`);
        console.log(`      - Stars: ${repo.stargazers_count}`);
      });
    } else {
      console.log('❌ Failed to list repositories:', reposResult.error);
    }

    // Test 3: Available GitHub tools
    console.log('\n🔧 Test 3: Available GitHub tools...');
    const tools = await composio.tools.list({
      toolkits: ['github'],
      limit: 10,
    });

    console.log(`✅ Found ${tools.items?.length || 0} GitHub tools available`);
    if (tools.items && tools.items.length > 0) {
      console.log('Sample tools:');
      tools.items.slice(0, 5).forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.slug}`);
        console.log(`      ${tool.description || tool.name}`);
      });
      console.log(`   ... and ${Math.max(0, tools.items.length - 5)} more tools`);
    }

    console.log('\n🎉 GitHub integration is ready!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function saveConfiguration(account) {
  console.log('\n💾 Saving configuration...\n');

  const configPath = path.join(__dirname, '..', 'config', 'github-config.json');
  const config = {
    githubAccount: {
      id: account.id,
      userId: account.userId,
      status: account.status,
      createdAt: new Date().toISOString(),
    },
    composio: {
      apiKey: process.env.COMPOSIO_API_KEY,
      toolkit: 'github',
    },
    mcp: {
      serverPath: 'mcp-servers/github-composio-server.js',
      enabled: true,
    },
  };

  try {
    // Ensure config directory exists
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Write configuration
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ Configuration saved to: ${configPath}`);

    // Update .env file if needed
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    if (!envContent.includes('GITHUB_CONNECTED_ACCOUNT_ID')) {
      envContent += `\n# GitHub Integration (via Composio)\nGITHUB_CONNECTED_ACCOUNT_ID=${account.id}\n`;
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env file with GitHub account ID');
    }

  } catch (error) {
    console.error('⚠️ Failed to save configuration:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 GitHub + Composio Integration Setup\n');
  console.log('This script will help you set up GitHub integration through Composio');
  console.log('for use with the MCP server and AI-powered automation.\n');

  try {
    // Check Composio API key
    if (!process.env.COMPOSIO_API_KEY) {
      console.error('❌ COMPOSIO_API_KEY not found in environment variables');
      console.log('Please add COMPOSIO_API_KEY to your .env file');
      process.exit(1);
    }

    // Setup or verify GitHub authentication
    const account = await setupGitHubAuth();

    if (account) {
      // Test the connection
      const testResult = await testGitHubConnection();

      if (testResult) {
        // Save configuration
        await saveConfiguration(account);

        console.log('\n' + '=' .repeat(50));
        console.log('🎯 Setup Complete!');
        console.log('\nYou can now:');
        console.log('1. Start the MCP server: node mcp-servers/github-composio-server.js');
        console.log('2. Run examples: node examples/github-composio-example.js');
        console.log('3. Use GitHub tools in your AI applications');
      }
    }

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Export for use as module
module.exports = {
  setupGitHubAuth,
  testGitHubConnection,
  saveConfiguration,
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}