#!/usr/bin/env node

/**
 * Smartsheet MCP Server
 *
 * This MCP server provides integration with Smartsheet API for managing
 * sheets, rows, columns, and other Smartsheet operations.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

// Initialize Smartsheet client
class SmartsheetClient {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseURL = 'https://api.smartsheet.com/2.0';
    this.headers = {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
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
      throw new Error(`Smartsheet API error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Sheet operations
  async listSheets() {
    return await this.request('GET', '/sheets');
  }

  async getSheet(sheetId, include = null) {
    const params = include ? `?include=${include}` : '';
    return await this.request('GET', `/sheets/${sheetId}${params}`);
  }

  async createSheet(sheetData) {
    return await this.request('POST', '/sheets', sheetData);
  }

  async updateSheet(sheetId, sheetData) {
    return await this.request('PUT', `/sheets/${sheetId}`, sheetData);
  }

  async deleteSheet(sheetId) {
    return await this.request('DELETE', `/sheets/${sheetId}`);
  }

  // Row operations
  async addRows(sheetId, rowData) {
    return await this.request('POST', `/sheets/${sheetId}/rows`, rowData);
  }

  async updateRows(sheetId, rowData) {
    return await this.request('PUT', `/sheets/${sheetId}/rows`, rowData);
  }

  async deleteRows(sheetId, rowIds) {
    const params = rowIds.map(id => `ids=${id}`).join('&');
    return await this.request('DELETE', `/sheets/${sheetId}/rows?${params}`);
  }

  // Column operations
  async addColumns(sheetId, columnData) {
    return await this.request('POST', `/sheets/${sheetId}/columns`, columnData);
  }

  async updateColumn(sheetId, columnId, columnData) {
    return await this.request('PUT', `/sheets/${sheetId}/columns/${columnId}`, columnData);
  }

  async deleteColumn(sheetId, columnId) {
    return await this.request('DELETE', `/sheets/${sheetId}/columns/${columnId}`);
  }

  // Search operations
  async searchSheets(query) {
    return await this.request('GET', `/search/sheets?query=${encodeURIComponent(query)}`);
  }

  // Workspace operations
  async listWorkspaces() {
    return await this.request('GET', '/workspaces');
  }

  async getWorkspace(workspaceId) {
    return await this.request('GET', `/workspaces/${workspaceId}`);
  }
}

// Initialize MCP server
const server = new Server(
  {
    name: 'smartsheet-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Smartsheet client
const smartsheet = new SmartsheetClient(process.env.SMARTSHEET_API_TOKEN);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'smartsheet_list_sheets',
        description: 'List all sheets accessible to the user',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'smartsheet_get_sheet',
        description: 'Get detailed information about a specific sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'The ID of the sheet to retrieve',
            },
            include: {
              type: 'string',
              description: 'Optional: comma-separated list of additional data to include (e.g., "attachments,discussions")',
            },
          },
          required: ['sheetId'],
        },
      },
      {
        name: 'smartsheet_create_sheet',
        description: 'Create a new sheet',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the new sheet',
            },
            columns: {
              type: 'array',
              description: 'Array of column definitions',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  type: { type: 'string', enum: ['TEXT_NUMBER', 'DATE', 'DROPDOWN', 'CHECKBOX', 'CONTACT_LIST'] },
                  primary: { type: 'boolean' },
                },
                required: ['title', 'type'],
              },
            },
          },
          required: ['name', 'columns'],
        },
      },
      {
        name: 'smartsheet_add_rows',
        description: 'Add new rows to a sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'The ID of the sheet',
            },
            rows: {
              type: 'array',
              description: 'Array of row data',
              items: {
                type: 'object',
                properties: {
                  cells: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        columnId: { type: 'string' },
                        value: { type: 'string' },
                      },
                      required: ['columnId', 'value'],
                    },
                  },
                },
                required: ['cells'],
              },
            },
            toTop: {
              type: 'boolean',
              description: 'Whether to add rows to the top of the sheet',
            },
          },
          required: ['sheetId', 'rows'],
        },
      },
      {
        name: 'smartsheet_update_rows',
        description: 'Update existing rows in a sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'The ID of the sheet',
            },
            rows: {
              type: 'array',
              description: 'Array of row updates',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  cells: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        columnId: { type: 'string' },
                        value: { type: 'string' },
                      },
                      required: ['columnId', 'value'],
                    },
                  },
                },
                required: ['id', 'cells'],
              },
            },
          },
          required: ['sheetId', 'rows'],
        },
      },
      {
        name: 'smartsheet_delete_rows',
        description: 'Delete rows from a sheet',
        inputSchema: {
          type: 'object',
          properties: {
            sheetId: {
              type: 'string',
              description: 'The ID of the sheet',
            },
            rowIds: {
              type: 'array',
              description: 'Array of row IDs to delete',
              items: { type: 'string' },
            },
          },
          required: ['sheetId', 'rowIds'],
        },
      },
      {
        name: 'smartsheet_search_sheets',
        description: 'Search for sheets containing specific text',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query text',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'smartsheet_list_workspaces',
        description: 'List all workspaces accessible to the user',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'smartsheet_get_workspace',
        description: 'Get detailed information about a specific workspace',
        inputSchema: {
          type: 'object',
          properties: {
            workspaceId: {
              type: 'string',
              description: 'The ID of the workspace to retrieve',
            },
          },
          required: ['workspaceId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'smartsheet_list_sheets':
        const sheets = await smartsheet.listSheets();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(sheets, null, 2),
            },
          ],
        };

      case 'smartsheet_get_sheet':
        const sheet = await smartsheet.getSheet(args.sheetId, args.include);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(sheet, null, 2),
            },
          ],
        };

      case 'smartsheet_create_sheet':
        const newSheet = await smartsheet.createSheet({
          name: args.name,
          columns: args.columns,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Sheet created successfully: ${JSON.stringify(newSheet, null, 2)}`,
            },
          ],
        };

      case 'smartsheet_add_rows':
        const addResult = await smartsheet.addRows(args.sheetId, {
          rows: args.rows,
          toTop: args.toTop || false,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Rows added successfully: ${JSON.stringify(addResult, null, 2)}`,
            },
          ],
        };

      case 'smartsheet_update_rows':
        const updateResult = await smartsheet.updateRows(args.sheetId, {
          rows: args.rows,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Rows updated successfully: ${JSON.stringify(updateResult, null, 2)}`,
            },
          ],
        };

      case 'smartsheet_delete_rows':
        const deleteResult = await smartsheet.deleteRows(args.sheetId, args.rowIds);
        return {
          content: [
            {
              type: 'text',
              text: `Rows deleted successfully: ${JSON.stringify(deleteResult, null, 2)}`,
            },
          ],
        };

      case 'smartsheet_search_sheets':
        const searchResults = await smartsheet.searchSheets(args.query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(searchResults, null, 2),
            },
          ],
        };

      case 'smartsheet_list_workspaces':
        const workspaces = await smartsheet.listWorkspaces();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(workspaces, null, 2),
            },
          ],
        };

      case 'smartsheet_get_workspace':
        const workspace = await smartsheet.getWorkspace(args.workspaceId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(workspace, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
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
  console.error('Smartsheet MCP server running on stdio');
}

main().catch(console.error);