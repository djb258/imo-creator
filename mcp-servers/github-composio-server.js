#!/usr/bin/env node

/**
 * GitHub Composio MCP Server
 *
 * This MCP server provides integration with GitHub through Composio's
 * built-in GitHub toolkit, offering repository management, issues, PRs,
 * and workflow automation capabilities.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { Composio } = require('@composio/core');

// Initialize Composio client
const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY || 'ak_t-F0AbvfZHUZSUrqAGNn',
});

// Initialize MCP server
const server = new Server(
  {
    name: 'github-composio-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Store for GitHub tools
let githubTools = [];
let isInitialized = false;

// Initialize GitHub tools from Composio
async function initializeGitHubTools() {
  if (isInitialized) return;

  try {
    console.error('Initializing GitHub tools from Composio...');

    // Get GitHub toolkit tools
    const tools = await composio.tools.list({
      toolkits: ['github'],
      limit: 100,
    });

    githubTools = tools.items || [];
    isInitialized = true;

    console.error(`Loaded ${githubTools.length} GitHub tools from Composio`);
  } catch (error) {
    console.error('Failed to initialize GitHub tools:', error);
    githubTools = [];
  }
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  await initializeGitHubTools();

  // Convert Composio tools to MCP format
  const mcpTools = githubTools.map(tool => ({
    name: tool.slug,
    description: tool.description || `GitHub operation: ${tool.name}`,
    inputSchema: {
      type: 'object',
      properties: tool.inputParams || {},
      required: tool.requiredParams || [],
    },
  }));

  // Add custom convenience tools
  const customTools = [
    {
      name: 'github_quick_search',
      description: 'Quick search across repositories, issues, and pull requests',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query',
          },
          type: {
            type: 'string',
            enum: ['repos', 'issues', 'prs', 'code', 'users'],
            description: 'Type of search',
          },
          limit: {
            type: 'number',
            description: 'Maximum results to return',
            default: 10,
          },
        },
        required: ['query', 'type'],
      },
    },
    {
      name: 'github_repo_summary',
      description: 'Get comprehensive summary of a repository',
      inputSchema: {
        type: 'object',
        properties: {
          owner: {
            type: 'string',
            description: 'Repository owner',
          },
          repo: {
            type: 'string',
            description: 'Repository name',
          },
        },
        required: ['owner', 'repo'],
      },
    },
    {
      name: 'github_pr_review',
      description: 'Review and comment on a pull request',
      inputSchema: {
        type: 'object',
        properties: {
          owner: {
            type: 'string',
            description: 'Repository owner',
          },
          repo: {
            type: 'string',
            description: 'Repository name',
          },
          pr_number: {
            type: 'number',
            description: 'Pull request number',
          },
          review_body: {
            type: 'string',
            description: 'Review comment',
          },
          event: {
            type: 'string',
            enum: ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'],
            description: 'Type of review',
          },
        },
        required: ['owner', 'repo', 'pr_number', 'review_body'],
      },
    },
    {
      name: 'github_workflow_dispatch',
      description: 'Trigger a GitHub Actions workflow',
      inputSchema: {
        type: 'object',
        properties: {
          owner: {
            type: 'string',
            description: 'Repository owner',
          },
          repo: {
            type: 'string',
            description: 'Repository name',
          },
          workflow_id: {
            type: 'string',
            description: 'Workflow ID or filename',
          },
          ref: {
            type: 'string',
            description: 'Git ref (branch, tag, or SHA)',
            default: 'main',
          },
          inputs: {
            type: 'object',
            description: 'Workflow input parameters',
          },
        },
        required: ['owner', 'repo', 'workflow_id'],
      },
    },
    {
      name: 'github_create_branch',
      description: 'Create a new branch in a repository',
      inputSchema: {
        type: 'object',
        properties: {
          owner: {
            type: 'string',
            description: 'Repository owner',
          },
          repo: {
            type: 'string',
            description: 'Repository name',
          },
          branch_name: {
            type: 'string',
            description: 'Name for the new branch',
          },
          from_branch: {
            type: 'string',
            description: 'Source branch to create from',
            default: 'main',
          },
        },
        required: ['owner', 'repo', 'branch_name'],
      },
    },
  ];

  return {
    tools: [...mcpTools, ...customTools],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    await initializeGitHubTools();

    // Handle custom tools
    switch (name) {
      case 'github_quick_search':
        const searchTool = `GITHUB_SEARCH_${args.type.toUpperCase()}`;
        const searchResult = await composio.tools.execute(searchTool, {
          userId: 'mcp-user',
          arguments: {
            q: args.query,
            per_page: args.limit || 10,
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(searchResult.data, null, 2),
            },
          ],
        };

      case 'github_repo_summary':
        // Get repo info
        const repoInfo = await composio.tools.execute('GITHUB_GET_REPO', {
          userId: 'mcp-user',
          arguments: {
            owner: args.owner,
            repo: args.repo,
          },
        });

        // Get recent issues
        const issues = await composio.tools.execute('GITHUB_LIST_ISSUES_FOR_REPO', {
          userId: 'mcp-user',
          arguments: {
            owner: args.owner,
            repo: args.repo,
            state: 'open',
            per_page: 5,
          },
        });

        // Get recent PRs
        const prs = await composio.tools.execute('GITHUB_LIST_PULL_REQUESTS', {
          userId: 'mcp-user',
          arguments: {
            owner: args.owner,
            repo: args.repo,
            state: 'open',
            per_page: 5,
          },
        });

        const summary = {
          repository: repoInfo.data,
          recentIssues: issues.data,
          recentPullRequests: prs.data,
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };

      case 'github_pr_review':
        const reviewResult = await composio.tools.execute('GITHUB_CREATE_REVIEW_FOR_PULL_REQUEST', {
          userId: 'mcp-user',
          arguments: {
            owner: args.owner,
            repo: args.repo,
            pull_number: args.pr_number,
            body: args.review_body,
            event: args.event || 'COMMENT',
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: `Review submitted: ${JSON.stringify(reviewResult.data, null, 2)}`,
            },
          ],
        };

      case 'github_workflow_dispatch':
        const workflowResult = await composio.tools.execute('GITHUB_TRIGGER_WORKFLOW', {
          userId: 'mcp-user',
          arguments: {
            owner: args.owner,
            repo: args.repo,
            workflow_id: args.workflow_id,
            ref: args.ref || 'main',
            inputs: args.inputs || {},
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: `Workflow triggered: ${JSON.stringify(workflowResult.data, null, 2)}`,
            },
          ],
        };

      case 'github_create_branch':
        // First get the SHA of the source branch
        const refResult = await composio.tools.execute('GITHUB_GET_REF', {
          userId: 'mcp-user',
          arguments: {
            owner: args.owner,
            repo: args.repo,
            ref: `heads/${args.from_branch || 'main'}`,
          },
        });

        const sha = refResult.data?.object?.sha;
        if (!sha) {
          throw new Error(`Could not find source branch: ${args.from_branch || 'main'}`);
        }

        // Create the new branch
        const createResult = await composio.tools.execute('GITHUB_CREATE_REF', {
          userId: 'mcp-user',
          arguments: {
            owner: args.owner,
            repo: args.repo,
            ref: `refs/heads/${args.branch_name}`,
            sha: sha,
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: `Branch created: ${JSON.stringify(createResult.data, null, 2)}`,
            },
          ],
        };

      default:
        // Try to execute as a Composio GitHub tool
        const tool = githubTools.find(t => t.slug === name);
        if (!tool) {
          throw new Error(`Unknown tool: ${name}`);
        }

        const result = await composio.tools.execute(name, {
          userId: 'mcp-user',
          arguments: args,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data || result, null, 2),
            },
          ],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub Composio MCP server running on stdio');

  // Pre-initialize GitHub tools
  await initializeGitHubTools();
}

main().catch(console.error);