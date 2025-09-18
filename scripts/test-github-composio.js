#!/usr/bin/env node

/**
 * GitHub + Composio Connection Test
 *
 * This script tests the GitHub integration through Composio
 * to verify that everything is working correctly.
 */

const { Composio } = require('@composio/core');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Composio
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn',
});

async function testGitHubConnection() {
  console.log('🧪 Testing GitHub + Composio Connection\n');
  console.log('=' .repeat(50));

  const results = {
    toolkit: false,
    tools: false,
    connection: false,
    userInfo: null,
    repos: null,
  };

  try {
    // Test 1: Check if GitHub toolkit is available
    console.log('📋 Test 1: Checking GitHub toolkit availability...');
    try {
      const toolkits = await composio.toolkits.list();
      const githubToolkit = toolkits.items?.find(tk => tk.slug === 'github');

      if (githubToolkit) {
        console.log('✅ GitHub toolkit is available!');
        console.log(`   - Name: ${githubToolkit.name}`);
        console.log(`   - Description: ${githubToolkit.description}`);
        results.toolkit = true;
      } else {
        console.log('❌ GitHub toolkit not found in available toolkits');
      }
    } catch (error) {
      console.log('❌ Failed to check toolkits:', error.message);
    }

    // Test 2: List available GitHub tools
    console.log('\n🔧 Test 2: Listing available GitHub tools...');
    try {
      const tools = await composio.tools.list({
        toolkits: ['github'],
        limit: 10,
      });

      if (tools.items && tools.items.length > 0) {
        console.log(`✅ Found ${tools.items.length} GitHub tools available`);
        console.log('Sample tools:');
        tools.items.slice(0, 5).forEach((tool, index) => {
          console.log(`   ${index + 1}. ${tool.slug}`);
          console.log(`      ${tool.description || tool.name}`);
        });
        results.tools = true;
      } else {
        console.log('❌ No GitHub tools found');
      }
    } catch (error) {
      console.log('❌ Failed to list tools:', error.message);
    }

    // Test 3: Check connected accounts
    console.log('\n🔗 Test 3: Checking GitHub connected accounts...');
    try {
      const accounts = await composio.connectedAccounts.list({
        toolkit: 'github',
      });

      if (accounts.items && accounts.items.length > 0) {
        console.log(`✅ Found ${accounts.items.length} GitHub connection(s):`);
        accounts.items.forEach((account, index) => {
          console.log(`   ${index + 1}. Account ID: ${account.id}`);
          console.log(`      - Status: ${account.status}`);
          console.log(`      - User ID: ${account.userId}`);
        });
        results.connection = true;
      } else {
        console.log('⚠️  No GitHub accounts connected');
        console.log('You need to connect your GitHub account first.');
        console.log('Run: node scripts/setup-github-composio.js');
      }
    } catch (error) {
      console.log('❌ Failed to check connected accounts:', error.message);
    }

    // Test 4: Try to get authenticated user info (if connected)
    if (results.connection) {
      console.log('\n👤 Test 4: Getting authenticated user info...');
      try {
        const userResult = await composio.tools.execute('GITHUB_GET_AUTHENTICATED_USER', {
          userId: 'mcp-user',
          arguments: {},
        });

        if (userResult.successful) {
          const userData = userResult.data;
          console.log('✅ Successfully authenticated with GitHub!');
          console.log(`   - Username: ${userData.login}`);
          console.log(`   - Name: ${userData.name || 'Not set'}`);
          console.log(`   - Email: ${userData.email || 'Not public'}`);
          console.log(`   - Company: ${userData.company || 'Not set'}`);
          console.log(`   - Public Repos: ${userData.public_repos}`);
          console.log(`   - Followers: ${userData.followers}`);
          console.log(`   - Following: ${userData.following}`);
          console.log(`   - Account Created: ${new Date(userData.created_at).toLocaleDateString()}`);
          results.userInfo = userData;
        } else {
          console.log('❌ Failed to get user info:', userResult.error);
          console.log('\nYou may need to reconnect your GitHub account:');
          console.log('Run: node scripts/setup-github-composio.js');
        }
      } catch (error) {
        console.log('❌ Failed to execute GitHub tool:', error.message);
      }
    }

    // Test 5: List repositories (if authenticated)
    if (results.userInfo) {
      console.log('\n📂 Test 5: Listing your repositories...');
      try {
        const reposResult = await composio.tools.execute('GITHUB_LIST_REPOS_FOR_AUTHENTICATED_USER', {
          userId: 'mcp-user',
          arguments: {
            sort: 'updated',
            per_page: 5,
          },
        });

        if (reposResult.successful) {
          const repos = reposResult.data || [];
          console.log(`✅ Successfully retrieved ${repos.length} repositories:`);
          repos.forEach((repo, index) => {
            console.log(`   ${index + 1}. ${repo.full_name}`);
            console.log(`      - ${repo.description || 'No description'}`);
            console.log(`      - Language: ${repo.language || 'N/A'}`);
            console.log(`      - ⭐ Stars: ${repo.stargazers_count}`);
            console.log(`      - Private: ${repo.private ? 'Yes' : 'No'}`);
            console.log(`      - Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
          });
          results.repos = repos;
        } else {
          console.log('❌ Failed to list repositories:', reposResult.error);
        }
      } catch (error) {
        console.log('❌ Failed to list repos:', error.message);
      }
    }

    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 Test Summary:');
    console.log(`   GitHub Toolkit: ${results.toolkit ? '✅ Available' : '❌ Not Available'}`);
    console.log(`   GitHub Tools: ${results.tools ? '✅ Available' : '❌ Not Available'}`);
    console.log(`   GitHub Connection: ${results.connection ? '✅ Connected' : '❌ Not Connected'}`);
    console.log(`   Authentication: ${results.userInfo ? '✅ Authenticated' : '❌ Not Authenticated'}`);
    console.log(`   API Access: ${results.repos ? '✅ Working' : '❌ Not Working'}`);

    if (results.userInfo) {
      console.log('\n🎉 GitHub integration is fully operational!');
      console.log('You can now use GitHub tools with the MCP server.');
    } else if (results.toolkit && results.tools) {
      console.log('\n⚠️  GitHub toolkit is available but not connected.');
      console.log('To connect your GitHub account, run:');
      console.log('   node scripts/setup-github-composio.js');
    } else {
      console.log('\n❌ GitHub integration needs setup.');
      console.log('Please check your Composio API key and configuration.');
    }

    return results;

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    return results;
  }
}

// Main execution
async function main() {
  console.log('🚀 GitHub + Composio Integration Test\n');

  // Check environment
  if (!process.env.COMPOSIO_API_KEY) {
    console.error('❌ COMPOSIO_API_KEY not found in environment variables');
    console.log('Please add COMPOSIO_API_KEY to your .env file');
    process.exit(1);
  }

  const results = await testGitHubConnection();

  // Exit code based on results
  if (results.userInfo && results.repos) {
    process.exit(0); // Success
  } else if (results.toolkit && results.tools) {
    process.exit(1); // Partial success - needs connection
  } else {
    process.exit(2); // Failed
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testGitHubConnection };