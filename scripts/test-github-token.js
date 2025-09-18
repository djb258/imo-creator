#!/usr/bin/env node

/**
 * GitHub Token Test Script
 *
 * This script tests the GitHub API token directly to ensure it's working
 * before configuring it with Composio.
 */

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

class GitHubTokenTester {
  constructor() {
    this.token = process.env.GITHUB_API_TOKEN;
    this.baseURL = process.env.GITHUB_BASE_URL || 'https://api.github.com';

    if (!this.token) {
      throw new Error('GITHUB_API_TOKEN not found in environment variables');
    }

    this.headers = {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'IMO-Creator-GitHub-Test/1.0',
    };
  }

  async makeRequest(endpoint) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      const statusCode = error.response?.status || 'Unknown';
      const message = error.response?.data?.message || error.message;
      throw new Error(`HTTP ${statusCode}: ${message}`);
    }
  }

  async testConnection() {
    console.log('🔍 Testing GitHub API Token\n');
    console.log('=' .repeat(50));

    try {
      // Test 1: Get authenticated user
      console.log('📋 Test 1: Getting authenticated user info...');
      const user = await this.makeRequest('/user');

      console.log('✅ Success! GitHub API token is valid');
      console.log(`   - Username: ${user.login}`);
      console.log(`   - Name: ${user.name || 'Not set'}`);
      console.log(`   - Email: ${user.email || 'Not public'}`);
      console.log(`   - Company: ${user.company || 'Not set'}`);
      console.log(`   - Public Repos: ${user.public_repos}`);
      console.log(`   - Private Repos: ${user.total_private_repos}`);
      console.log(`   - Followers: ${user.followers}`);
      console.log(`   - Following: ${user.following}`);
      console.log(`   - Account Created: ${new Date(user.created_at).toLocaleDateString()}`);
      console.log(`   - Plan: ${user.plan?.name || 'Unknown'}`);

      // Test 2: Check token scopes
      console.log('\n🔐 Test 2: Checking token scopes...');
      try {
        const response = await axios.get(`${this.baseURL}/user`, {
          headers: this.headers,
        });

        const scopes = response.headers['x-oauth-scopes']?.split(', ') || [];
        const acceptedScopes = response.headers['x-accepted-oauth-scopes']?.split(', ') || [];

        console.log('✅ Token scopes verified:');
        console.log(`   - Granted scopes: ${scopes.join(', ') || 'None visible'}`);
        console.log(`   - Accepted scopes: ${acceptedScopes.join(', ') || 'None'}`);

        // Check for required scopes
        const requiredScopes = ['repo', 'workflow', 'user'];
        const hasRequiredScopes = requiredScopes.some(scope => scopes.includes(scope));

        if (hasRequiredScopes) {
          console.log('   ✅ Has required scopes for repository management');
        } else {
          console.log('   ⚠️  May need additional scopes for full functionality');
        }
      } catch (error) {
        console.log('⚠️ Could not verify scopes:', error.message);
      }

      // Test 3: List repositories
      console.log('\n📂 Test 3: Listing your repositories...');
      const repos = await this.makeRequest('/user/repos?sort=updated&per_page=5');

      console.log(`✅ Found ${repos.length} repositories (showing first 5):`);
      repos.forEach((repo, index) => {
        console.log(`   ${index + 1}. ${repo.full_name}`);
        console.log(`      - ${repo.description || 'No description'}`);
        console.log(`      - Language: ${repo.language || 'N/A'}`);
        console.log(`      - ⭐ Stars: ${repo.stargazers_count}`);
        console.log(`      - Private: ${repo.private ? 'Yes' : 'No'}`);
        console.log(`      - Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
      });

      // Test 4: Rate limit status
      console.log('\n⚡ Test 4: Checking rate limit status...');
      const rateLimit = await this.makeRequest('/rate_limit');

      console.log('✅ Rate limit status:');
      console.log(`   - Core API: ${rateLimit.resources.core.remaining}/${rateLimit.resources.core.limit} remaining`);
      console.log(`   - Search API: ${rateLimit.resources.search.remaining}/${rateLimit.resources.search.limit} remaining`);
      console.log(`   - Reset time: ${new Date(rateLimit.resources.core.reset * 1000).toLocaleTimeString()}`);

      return {
        success: true,
        user,
        repositories: repos,
        scopes: response.headers['x-oauth-scopes']?.split(', ') || [],
        rateLimit,
      };

    } catch (error) {
      console.log(`❌ Test failed: ${error.message}\n`);

      // Provide troubleshooting tips
      console.log('🔧 Troubleshooting Tips:');
      console.log('1. Check that your GitHub token is correct');
      console.log('2. Verify the token has not expired');
      console.log('3. Ensure the token has the required scopes:');
      console.log('   - repo (for repository access)');
      console.log('   - workflow (for GitHub Actions)');
      console.log('   - user (for user information)');
      console.log('4. Check GitHub API status: https://www.githubstatus.com/');

      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 GitHub Token Validation Test\n');

  try {
    const tester = new GitHubTokenTester();
    const result = await tester.testConnection();

    if (result.success) {
      console.log('\n' + '=' .repeat(50));
      console.log('🎉 GitHub token is working perfectly!');
      console.log('\nNext steps:');
      console.log('1. Token has been added to your .env files');
      console.log('2. You can now use GitHub with Composio MCP server');
      console.log('3. Start the MCP server: start-github-mcp.bat');
      console.log('4. Run examples: node examples/github-composio-example.js');

      return true;
    } else {
      console.log('\n❌ Token validation failed');
      return false;
    }
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  main().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = { GitHubTokenTester };