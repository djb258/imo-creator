#!/usr/bin/env node

/**
 * GitHub Direct MCP Server
 *
 * This MCP server provides direct GitHub API integration without Composio,
 * using your GitHub personal access token for authentication.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

// Initialize GitHub client
class GitHubClient {
  constructor(token) {
    this.token = token;
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'IMO-Creator-MCP-Server/1.0',
    };
  }

  async request(method, endpoint, data = null) {
    try {
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
      const statusCode = error.response?.status || 'Unknown';
      const message = error.response?.data?.message || error.message;
      throw new Error(`GitHub API ${statusCode}: ${message}`);
    }
  }

  // User operations
  async getAuthenticatedUser() {
    return await this.request('GET', '/user');
  }

  // Repository operations
  async listRepos(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request('GET', `/user/repos?${queryParams}`);
  }

  async getRepo(owner, repo) {
    return await this.request('GET', `/repos/${owner}/${repo}`);
  }

  async createRepo(repoData) {
    return await this.request('POST', '/user/repos', repoData);
  }

  async updateRepo(owner, repo, repoData) {
    return await this.request('PATCH', `/repos/${owner}/${repo}`, repoData);
  }

  async deleteRepo(owner, repo) {
    return await this.request('DELETE', `/repos/${owner}/${repo}`);
  }

  // Issue operations
  async listIssues(owner, repo, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request('GET', `/repos/${owner}/${repo}/issues?${queryParams}`);
  }

  async getIssue(owner, repo, issueNumber) {
    return await this.request('GET', `/repos/${owner}/${repo}/issues/${issueNumber}`);
  }

  async createIssue(owner, repo, issueData) {
    return await this.request('POST', `/repos/${owner}/${repo}/issues`, issueData);
  }

  async updateIssue(owner, repo, issueNumber, issueData) {
    return await this.request('PATCH', `/repos/${owner}/${repo}/issues/${issueNumber}`, issueData);
  }

  // Pull Request operations
  async listPullRequests(owner, repo, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request('GET', `/repos/${owner}/${repo}/pulls?${queryParams}`);
  }

  async createPullRequest(owner, repo, prData) {
    return await this.request('POST', `/repos/${owner}/${repo}/pulls`, prData);
  }

  async mergePullRequest(owner, repo, pullNumber, mergeData) {
    return await this.request('PUT', `/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, mergeData);
  }

  // Search operations
  async searchRepos(query, params = {}) {
    const queryParams = new URLSearchParams({ q: query, ...params }).toString();
    return await this.request('GET', `/search/repositories?${queryParams}`);
  }

  async searchCode(query, params = {}) {
    const queryParams = new URLSearchParams({ q: query, ...params }).toString();
    return await this.request('GET', `/search/code?${queryParams}`);
  }

  // Workflow operations
  async listWorkflows(owner, repo) {
    return await this.request('GET', `/repos/${owner}/${repo}/actions/workflows`);
  }

  async triggerWorkflow(owner, repo, workflowId, ref, inputs = {}) {
    return await this.request('POST', `/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
      ref,
      inputs,
    });
  }
}

// Initialize MCP server
const server = new Server(
  {
    name: 'github-direct-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize GitHub client
const github = new GitHubClient(process.env.GITHUB_API_TOKEN);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'github_get_user',
        description: 'Get authenticated user information',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'github_list_repos',
        description: 'List repositories for the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['all', 'owner', 'public', 'private', 'member'],
              description: 'Type of repositories to list',
            },
            sort: {
              type: 'string',
              enum: ['created', 'updated', 'pushed', 'full_name'],
              description: 'Sort repositories by',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page (max 100)',
              default: 30,
            },
          },
        },
      },
      {
        name: 'github_get_repo',
        description: 'Get detailed information about a repository',
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
        name: 'github_create_repo',
        description: 'Create a new repository',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Repository name',
            },
            description: {
              type: 'string',
              description: 'Repository description',
            },
            private: {
              type: 'boolean',
              description: 'Make repository private',
              default: false,
            },
            auto_init: {
              type: 'boolean',
              description: 'Initialize with README',
              default: true,
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'github_list_issues',
        description: 'List issues in a repository',
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
            state: {
              type: 'string',
              enum: ['open', 'closed', 'all'],
              description: 'Issue state',
              default: 'open',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page',
              default: 30,
            },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'github_create_issue',
        description: 'Create a new issue',
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
            title: {
              type: 'string',
              description: 'Issue title',
            },
            body: {
              type: 'string',
              description: 'Issue body',
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Issue labels',
            },
          },
          required: ['owner', 'repo', 'title'],
        },
      },
      {
        name: 'github_search_repos',
        description: 'Search for repositories',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            sort: {
              type: 'string',
              enum: ['stars', 'forks', 'help-wanted-issues', 'updated'],
              description: 'Sort results by',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page',
              default: 30,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'github_search_code',
        description: 'Search for code',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            sort: {
              type: 'string',
              enum: ['indexed'],
              description: 'Sort results by',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page',
              default: 30,
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'github_get_user':
        result = await github.getAuthenticatedUser();
        break;

      case 'github_list_repos':
        result = await github.listRepos({
          type: args.type || 'all',
          sort: args.sort || 'updated',
          per_page: args.per_page || 30,
        });
        break;

      case 'github_get_repo':
        result = await github.getRepo(args.owner, args.repo);
        break;

      case 'github_create_repo':
        result = await github.createRepo({
          name: args.name,
          description: args.description,
          private: args.private || false,
          auto_init: args.auto_init !== false,
        });
        break;

      case 'github_list_issues':
        result = await github.listIssues(args.owner, args.repo, {
          state: args.state || 'open',
          per_page: args.per_page || 30,
        });
        break;

      case 'github_create_issue':
        result = await github.createIssue(args.owner, args.repo, {
          title: args.title,
          body: args.body,
          labels: args.labels,
        });
        break;

      case 'github_search_repos':
        result = await github.searchRepos(args.query, {
          sort: args.sort,
          per_page: args.per_page || 30,
        });
        break;

      case 'github_search_code':
        result = await github.searchCode(args.query, {
          sort: args.sort,
          per_page: args.per_page || 30,
        });
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
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
  console.error('GitHub Direct MCP server running on stdio');
}

main().catch(console.error);