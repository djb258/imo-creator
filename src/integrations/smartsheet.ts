/**
 * Smartsheet Integration for IMO Creator
 *
 * This module provides integration with Smartsheet API through Composio
 * for managing sheets, rows, columns, and workspace operations.
 */

import { Composio } from '@composio/core';
import axios, { AxiosResponse } from 'axios';

interface SmartsheetConfig {
  apiToken: string;
  baseURL?: string;
}

interface SheetColumn {
  id?: string;
  title: string;
  type: 'TEXT_NUMBER' | 'DATE' | 'DROPDOWN' | 'CHECKBOX' | 'CONTACT_LIST';
  primary?: boolean;
  options?: string[];
}

interface SheetRow {
  id?: string;
  cells: Array<{
    columnId: string;
    value: any;
    displayValue?: string;
  }>;
}

interface Sheet {
  id: string;
  name: string;
  columns: SheetColumn[];
  rows: SheetRow[];
  accessLevel: string;
  permalink: string;
  createdAt: string;
  modifiedAt: string;
}

export class SmartsheetIntegration {
  private config: SmartsheetConfig;
  private composio: Composio;
  private headers: Record<string, string>;

  constructor(config: SmartsheetConfig, composio?: Composio) {
    this.config = {
      baseURL: 'https://api.smartsheet.com/2.0',
      ...config,
    };

    this.headers = {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
      'User-Agent': 'IMO-Creator/1.0',
    };

    if (composio) {
      this.composio = composio;
    }
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        method,
        url: `${this.config.baseURL}${endpoint}`,
        headers: this.headers,
        data,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Smartsheet API Error: ${errorMessage}`);
    }
  }

  // Sheet Management
  async listSheets(): Promise<{ data: Sheet[] }> {
    return this.makeRequest('GET', '/sheets');
  }

  async getSheet(sheetId: string, include?: string[]): Promise<Sheet> {
    const includeParam = include ? `?include=${include.join(',')}` : '';
    return this.makeRequest('GET', `/sheets/${sheetId}${includeParam}`);
  }

  async createSheet(name: string, columns: SheetColumn[]): Promise<{ result: Sheet }> {
    const payload = {
      name,
      columns: columns.map(col => ({
        title: col.title,
        type: col.type,
        primary: col.primary || false,
        options: col.options,
      })),
    };

    return this.makeRequest('POST', '/sheets', payload);
  }

  async updateSheet(sheetId: string, updates: Partial<Sheet>): Promise<{ result: Sheet }> {
    return this.makeRequest('PUT', `/sheets/${sheetId}`, updates);
  }

  async deleteSheet(sheetId: string): Promise<{ message: string }> {
    return this.makeRequest('DELETE', `/sheets/${sheetId}`);
  }

  // Row Operations
  async addRows(sheetId: string, rows: SheetRow[], toTop = false): Promise<{ result: SheetRow[] }> {
    const payload = {
      toTop,
      rows: rows.map(row => ({
        cells: row.cells,
      })),
    };

    return this.makeRequest('POST', `/sheets/${sheetId}/rows`, payload);
  }

  async updateRows(sheetId: string, rows: SheetRow[]): Promise<{ result: SheetRow[] }> {
    const payload = {
      rows: rows.map(row => ({
        id: row.id,
        cells: row.cells,
      })),
    };

    return this.makeRequest('PUT', `/sheets/${sheetId}/rows`, payload);
  }

  async deleteRows(sheetId: string, rowIds: string[]): Promise<{ message: string }> {
    const idsParam = rowIds.map(id => `ids=${id}`).join('&');
    return this.makeRequest('DELETE', `/sheets/${sheetId}/rows?${idsParam}`);
  }

  // Column Operations
  async addColumn(sheetId: string, column: SheetColumn, index?: number): Promise<{ result: SheetColumn }> {
    const payload = {
      title: column.title,
      type: column.type,
      index,
      options: column.options,
    };

    return this.makeRequest('POST', `/sheets/${sheetId}/columns`, payload);
  }

  async updateColumn(sheetId: string, columnId: string, updates: Partial<SheetColumn>): Promise<{ result: SheetColumn }> {
    return this.makeRequest('PUT', `/sheets/${sheetId}/columns/${columnId}`, updates);
  }

  async deleteColumn(sheetId: string, columnId: string): Promise<{ message: string }> {
    return this.makeRequest('DELETE', `/sheets/${sheetId}/columns/${columnId}`);
  }

  // Search Operations
  async searchSheets(query: string): Promise<{ results: Array<{ objectType: string; objectId: string; text: string }> }> {
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest('GET', `/search/sheets?query=${encodedQuery}`);
  }

  // Workspace Operations
  async listWorkspaces(): Promise<{ data: Array<{ id: string; name: string; accessLevel: string }> }> {
    return this.makeRequest('GET', '/workspaces');
  }

  async getWorkspace(workspaceId: string): Promise<{ id: string; name: string; sheets: Sheet[] }> {
    return this.makeRequest('GET', `/workspaces/${workspaceId}`);
  }

  // Utility Methods
  async validateConnection(): Promise<boolean> {
    try {
      await this.makeRequest('GET', '/users/me');
      return true;
    } catch (error) {
      console.error('Smartsheet connection validation failed:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<{ id: string; email: string; firstName: string; lastName: string }> {
    return this.makeRequest('GET', '/users/me');
  }

  // Integration with Composio (if available)
  async setupComposioIntegration(): Promise<void> {
    if (!this.composio) {
      throw new Error('Composio instance not provided');
    }

    try {
      // Create a custom tool for Smartsheet operations
      await this.composio.tools.createCustomTool({
        name: 'Smartsheet Operations',
        description: 'Manage Smartsheet sheets, rows, and columns',
        slug: 'SMARTSHEET_OPERATIONS',
        inputParams: {
          operation: {
            type: 'string',
            description: 'The operation to perform (list_sheets, get_sheet, create_sheet, etc.)',
            enum: ['list_sheets', 'get_sheet', 'create_sheet', 'add_rows', 'update_rows', 'delete_rows'],
          },
          sheetId: {
            type: 'string',
            description: 'Sheet ID (required for sheet-specific operations)',
            required: false,
          },
          data: {
            type: 'object',
            description: 'Operation-specific data',
            required: false,
          },
        },
        execute: async (input: any) => {
          try {
            switch (input.operation) {
              case 'list_sheets':
                const sheets = await this.listSheets();
                return {
                  data: sheets,
                  error: null,
                  successful: true,
                };

              case 'get_sheet':
                if (!input.sheetId) throw new Error('sheetId is required');
                const sheet = await this.getSheet(input.sheetId);
                return {
                  data: sheet,
                  error: null,
                  successful: true,
                };

              case 'create_sheet':
                if (!input.data?.name || !input.data?.columns) {
                  throw new Error('name and columns are required');
                }
                const newSheet = await this.createSheet(input.data.name, input.data.columns);
                return {
                  data: newSheet,
                  error: null,
                  successful: true,
                };

              case 'add_rows':
                if (!input.sheetId || !input.data?.rows) {
                  throw new Error('sheetId and rows are required');
                }
                const addResult = await this.addRows(input.sheetId, input.data.rows, input.data.toTop);
                return {
                  data: addResult,
                  error: null,
                  successful: true,
                };

              default:
                throw new Error(`Unsupported operation: ${input.operation}`);
            }
          } catch (error: any) {
            return {
              data: null,
              error: error.message,
              successful: false,
            };
          }
        },
      });

      console.log('Smartsheet integration with Composio setup completed');
    } catch (error) {
      console.error('Failed to setup Composio integration:', error);
      throw error;
    }
  }
}

// Factory function for easy initialization
export function createSmartsheetIntegration(apiToken: string, composio?: Composio): SmartsheetIntegration {
  return new SmartsheetIntegration({ apiToken }, composio);
}

// Export types for external use
export type { SmartsheetConfig, Sheet, SheetColumn, SheetRow };