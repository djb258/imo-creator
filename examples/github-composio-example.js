#!/usr/bin/env node

/**
 * GitHub + Composio Integration Examples
 *
 * This example demonstrates how to use GitHub with Composio MCP
 * for repository management, issue tracking, PR automation, and more.
 */

const { Composio } = require('@composio/core');
const { AnthropicProvider } = require('@composio/anthropic');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Composio
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn',
});

// Example 1: Repository Management
async function demonstrateRepoManagement() {
  console.log('\n📂 Repository Management Examples\n');
  console.log('=' .repeat(50));

  try {
    // List user's repositories
    console.log('1️⃣ Listing your repositories...');
    const reposResult = await composio.tools.execute('GITHUB_LIST_REPOS_FOR_AUTHENTICATED_USER', {
      userId: 'mcp-user',
      arguments: {
        sort: 'updated',
        per_page: 5,
      },
    });

    if (reposResult.successful) {
      const repos = reposResult.data || [];
      console.log(`✅ Found ${repos.length} repositories:`);
      repos.forEach((repo, index) => {
        console.log(`   ${index + 1}. ${repo.full_name}`);
        console.log(`      - ${repo.description || 'No description'}`);
        console.log(`      - Language: ${repo.language || 'N/A'}`);
        console.log(`      - ⭐ Stars: ${repo.stargazers_count}`);
        console.log(`      - 🔗 URL: ${repo.html_url}`);
      });
    }

    // Get specific repository details
    if (reposResult.successful && reposResult.data?.length > 0) {
      const firstRepo = reposResult.data[0];
      const [owner, repoName] = firstRepo.full_name.split('/');

      console.log(`\n2️⃣ Getting details for "${firstRepo.full_name}"...`);
      const repoDetails = await composio.tools.execute('GITHUB_GET_REPO', {
        userId: 'mcp-user',
        arguments: {
          owner: owner,
          repo: repoName,
        },
      });

      if (repoDetails.successful) {
        const repo = repoDetails.data;
        console.log('✅ Repository details:');
        console.log(`   - Created: ${new Date(repo.created_at).toLocaleDateString()}`);
        console.log(`   - Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
        console.log(`   - Size: ${repo.size} KB`);
        console.log(`   - Open Issues: ${repo.open_issues_count}`);
        console.log(`   - Forks: ${repo.forks_count}`);
        console.log(`   - Default Branch: ${repo.default_branch}`);
        console.log(`   - Private: ${repo.private ? 'Yes' : 'No'}`);
      }
    }

  } catch (error) {
    console.error('❌ Repository management failed:', error.message);
  }
}

// Example 2: Issue Management
async function demonstrateIssueManagement() {
  console.log('\n🐛 Issue Management Examples\n');
  console.log('=' .repeat(50));

  try {
    // For this example, we'll use the imo-creator repo
    const owner = 'djb258';
    const repo = 'imo-creator';

    // List issues
    console.log(`1️⃣ Listing issues for ${owner}/${repo}...`);
    const issuesResult = await composio.tools.execute('GITHUB_LIST_ISSUES_FOR_REPO', {
      userId: 'mcp-user',
      arguments: {
        owner: owner,
        repo: repo,
        state: 'all',
        per_page: 5,
      },
    });

    if (issuesResult.successful) {
      const issues = issuesResult.data || [];
      if (issues.length > 0) {
        console.log(`✅ Found ${issues.length} issues:`);
        issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. #${issue.number}: ${issue.title}`);
          console.log(`      - State: ${issue.state}`);
          console.log(`      - Created: ${new Date(issue.created_at).toLocaleDateString()}`);
          console.log(`      - Labels: ${issue.labels.map(l => l.name).join(', ') || 'None'}`);
        });
      } else {
        console.log('ℹ️  No issues found in this repository');
      }
    }

    // Create a new issue (optional - uncomment to test)
    /*
    console.log('\n2️⃣ Creating a new issue...');
    const newIssue = await composio.tools.execute('GITHUB_CREATE_ISSUE', {
      userId: 'mcp-user',
      arguments: {
        owner: owner,
        repo: repo,
        title: 'Test Issue from Composio Integration',
        body: 'This is a test issue created by the GitHub + Composio integration example.\n\n- Created at: ' + new Date().toISOString(),
        labels: ['enhancement', 'documentation'],
      },
    });

    if (newIssue.successful) {
      console.log('✅ Issue created successfully!');
      console.log(`   - Issue #${newIssue.data.number}: ${newIssue.data.title}`);
      console.log(`   - URL: ${newIssue.data.html_url}`);
    }
    */

  } catch (error) {
    console.error('❌ Issue management failed:', error.message);
  }
}

// Example 3: Pull Request Automation
async function demonstratePRAutomation() {
  console.log('\n🔄 Pull Request Automation Examples\n');
  console.log('=' .repeat(50));

  try {
    const owner = 'djb258';
    const repo = 'imo-creator';

    // List pull requests
    console.log(`1️⃣ Listing pull requests for ${owner}/${repo}...`);
    const prsResult = await composio.tools.execute('GITHUB_LIST_PULL_REQUESTS', {
      userId: 'mcp-user',
      arguments: {
        owner: owner,
        repo: repo,
        state: 'all',
        per_page: 5,
      },
    });

    if (prsResult.successful) {
      const prs = prsResult.data || [];
      if (prs.length > 0) {
        console.log(`✅ Found ${prs.length} pull requests:`);
        prs.forEach((pr, index) => {
          console.log(`   ${index + 1}. PR #${pr.number}: ${pr.title}`);
          console.log(`      - State: ${pr.state}`);
          console.log(`      - Author: ${pr.user.login}`);
          console.log(`      - Created: ${new Date(pr.created_at).toLocaleDateString()}`);
          console.log(`      - Base: ${pr.base.ref} <- ${pr.head.ref}`);
        });
      } else {
        console.log('ℹ️  No pull requests found in this repository');
      }
    }

  } catch (error) {
    console.error('❌ PR automation failed:', error.message);
  }
}

// Example 4: GitHub Actions Workflow
async function demonstrateWorkflowAutomation() {
  console.log('\n⚙️ GitHub Actions Workflow Examples\n');
  console.log('=' .repeat(50));

  try {
    const owner = 'djb258';
    const repo = 'imo-creator';

    // List workflows
    console.log(`1️⃣ Listing workflows for ${owner}/${repo}...`);
    const workflowsResult = await composio.tools.execute('GITHUB_LIST_WORKFLOWS', {
      userId: 'mcp-user',
      arguments: {
        owner: owner,
        repo: repo,
        per_page: 10,
      },
    });

    if (workflowsResult.successful) {
      const workflows = workflowsResult.data?.workflows || [];
      if (workflows.length > 0) {
        console.log(`✅ Found ${workflows.length} workflows:`);
        workflows.forEach((workflow, index) => {
          console.log(`   ${index + 1}. ${workflow.name}`);
          console.log(`      - ID: ${workflow.id}`);
          console.log(`      - State: ${workflow.state}`);
          console.log(`      - Path: ${workflow.path}`);
        });
      } else {
        console.log('ℹ️  No workflows found in this repository');
      }
    }

  } catch (error) {
    console.error('❌ Workflow automation failed:', error.message);
  }
}

// Example 5: Code Search
async function demonstrateCodeSearch() {
  console.log('\n🔍 Code Search Examples\n');
  console.log('=' .repeat(50));

  try {
    // Search for code
    console.log('1️⃣ Searching for "smartsheet" in your repositories...');
    const searchResult = await composio.tools.execute('GITHUB_SEARCH_CODE', {
      userId: 'mcp-user',
      arguments: {
        q: 'smartsheet user:djb258',
        per_page: 5,
      },
    });

    if (searchResult.successful) {
      const items = searchResult.data?.items || [];
      console.log(`✅ Found ${items.length} code matches:`);
      items.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
        console.log(`      - Repository: ${item.repository.full_name}`);
        console.log(`      - Path: ${item.path}`);
        console.log(`      - URL: ${item.html_url}`);
      });
    }

    // Search for repositories
    console.log('\n2️⃣ Searching for repositories with "mcp"...');
    const repoSearchResult = await composio.tools.execute('GITHUB_SEARCH_REPOS', {
      userId: 'mcp-user',
      arguments: {
        q: 'mcp user:djb258',
        per_page: 5,
      },
    });

    if (repoSearchResult.successful) {
      const repos = repoSearchResult.data?.items || [];
      console.log(`✅ Found ${repos.length} repository matches:`);
      repos.forEach((repo, index) => {
        console.log(`   ${index + 1}. ${repo.full_name}`);
        console.log(`      - ${repo.description || 'No description'}`);
        console.log(`      - ⭐ Stars: ${repo.stargazers_count}`);
      });
    }

  } catch (error) {
    console.error('❌ Code search failed:', error.message);
  }
}

// Example 6: Creating MCP Server for AI Integration
async function createGitHubMCPServer() {
  console.log('\n🤖 Creating GitHub MCP Server with Composio\n');
  console.log('=' .repeat(50));

  // Initialize Composio with Anthropic provider
  const composioWithProvider = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
    provider: new AnthropicProvider({ cacheTools: true }),
  });

  try {
    // Create MCP server with GitHub integration
    const mcpServer = await composioWithProvider.mcp.create(
      `github-mcp-${Date.now()}`,
      [
        {
          toolkit: 'github',
          allowedTools: [
            'GITHUB_GET_AUTHENTICATED_USER',
            'GITHUB_LIST_REPOS_FOR_AUTHENTICATED_USER',
            'GITHUB_CREATE_REPO',
            'GITHUB_GET_REPO',
            'GITHUB_LIST_ISSUES_FOR_REPO',
            'GITHUB_CREATE_ISSUE',
            'GITHUB_UPDATE_ISSUE',
            'GITHUB_LIST_PULL_REQUESTS',
            'GITHUB_CREATE_PULL_REQUEST',
            'GITHUB_MERGE_PULL_REQUEST',
            'GITHUB_CREATE_BRANCH',
            'GITHUB_CREATE_FILE',
            'GITHUB_UPDATE_FILE',
            'GITHUB_SEARCH_CODE',
            'GITHUB_SEARCH_REPOS',
          ],
        },
      ],
      { isChatAuth: false }
    );

    console.log('✅ MCP Server created successfully!');
    console.log(`📋 Server ID: ${mcpServer.id}`);
    console.log(`🔧 Available toolkits: ${mcpServer.toolkits.join(', ')}`);
    console.log('\nThis server can now be used with AI providers like Anthropic Claude');
    console.log('for intelligent GitHub automation and management.');

    return mcpServer;

  } catch (error) {
    console.error('❌ Failed to create MCP server:', error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🎯 GitHub + Composio Integration Examples\n');
  console.log('This demonstrates various GitHub operations through Composio');
  console.log('=' .repeat(60));

  // Check environment variables
  if (!process.env.COMPOSIO_API_KEY) {
    console.error('❌ COMPOSIO_API_KEY not found in environment variables');
    console.log('Please add COMPOSIO_API_KEY to your .env file');
    process.exit(1);
  }

  try {
    // Run examples based on command line arguments
    const args = process.argv.slice(2);

    if (args.includes('--repos') || args.length === 0) {
      await demonstrateRepoManagement();
    }

    if (args.includes('--issues') || args.length === 0) {
      await demonstrateIssueManagement();
    }

    if (args.includes('--prs') || args.length === 0) {
      await demonstratePRAutomation();
    }

    if (args.includes('--workflows') || args.length === 0) {
      await demonstrateWorkflowAutomation();
    }

    if (args.includes('--search') || args.length === 0) {
      await demonstrateCodeSearch();
    }

    if (args.includes('--create-mcp')) {
      await createGitHubMCPServer();
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎉 All examples completed!');
    console.log('\nAvailable options:');
    console.log('  --repos      Show repository management');
    console.log('  --issues     Show issue management');
    console.log('  --prs        Show pull request automation');
    console.log('  --workflows  Show GitHub Actions workflows');
    console.log('  --search     Show code search');
    console.log('  --create-mcp Create MCP server for AI integration');
    console.log('\nRun with no options to see all examples.');

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = {
  demonstrateRepoManagement,
  demonstrateIssueManagement,
  demonstratePRAutomation,
  demonstrateWorkflowAutomation,
  demonstrateCodeSearch,
  createGitHubMCPServer,
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}