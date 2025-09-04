#!/usr/bin/env node

/**
 * Lovable MCP Server
 * 
 * A minimal, production-ready MCP server that wraps Lovable.dev API
 * to enable Claude to build UI pages from prompts and CTB/Altitude specs.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { config } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });
config({ path: resolve(__dirname, '../../../.env') });

// Lovable API configuration
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;
const LOVABLE_BASE_URL = 'https://api.lovable.dev/v1';

// Input validation schemas
const CreateProjectSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  projectType: z.string().optional().default('react'),
  repo: z.string().optional(),
  visibility: z.enum(['public', 'private']).optional().default('private'),
  context: z.string().optional(),
});

const ProjectIdSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
});

const ScaffoldAltitudeSchema = z.object({
  specPath: z.string().optional(),
});

class LovableAPI {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = LOVABLE_BASE_URL) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async createProject(params: z.infer<typeof CreateProjectSchema>) {
    try {
      const response = await axios.post(
        `${this.baseURL}/projects`,
        {
          prompt: params.prompt,
          project_type: params.projectType,
          repository: params.repo,
          visibility: params.visibility,
          context: params.context,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Lovable API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getProjectStatus(projectId: string) {
    try {
      const response = await axios.get(
        `${this.baseURL}/projects/${projectId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Lovable API error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getProjectDetails(projectId: string) {
    try {
      const response = await axios.get(
        `${this.baseURL}/projects/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Lovable API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

class ComposioFallback {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createProject(params: z.infer<typeof CreateProjectSchema>) {
    try {
      // This is a fallback implementation using Composio
      // In a real implementation, you'd use Composio's SDK
      const response = await axios.post(
        'https://api.composio.dev/v1/actions/execute',
        {
          action: 'lovable.createProject',
          params: {
            prompt: params.prompt,
            projectType: params.projectType,
            repo: params.repo,
            visibility: params.visibility,
            context: params.context,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Composio fallback error: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Helper function to read CTB/Altitude specs
function readCTBSpecs(specPath?: string): string {
  const projectRoot = resolve(__dirname, '../../..');
  
  // Try to read from specified path or default locations
  const possiblePaths = [
    specPath && resolve(projectRoot, specPath),
    resolve(projectRoot, 'docs/altitude/30k.md'),
    resolve(projectRoot, 'docs/altitude/20k.md'),
    resolve(projectRoot, 'docs/altitude/10k.md'),
    resolve(projectRoot, 'docs/altitude/5k.md'),
    resolve(projectRoot, 'docs/ctb_horiz.md'),
    resolve(projectRoot, 'docs/catalog.md'),
    resolve(projectRoot, 'docs/flows.md'),
    resolve(projectRoot, 'spec/process_map.yaml'),
    resolve(projectRoot, 'spec/process_map.json'),
  ].filter(Boolean) as string[];

  let combinedContent = '';
  let foundFiles: string[] = [];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, 'utf-8');
        combinedContent += `\n## ${path.split('/').pop()}\n\n${content}\n`;
        foundFiles.push(path);
      } catch (error) {
        // Skip files that can't be read
        continue;
      }
    }
  }

  if (foundFiles.length === 0) {
    throw new Error('No CTB/Altitude specification files found. Expected files: docs/altitude/*.md, docs/ctb_horiz.md, spec/process_map.*');
  }

  return `# CTB/Altitude Specification\n\nFound ${foundFiles.length} specification files:\n${foundFiles.map(f => `- ${f.split('/').pop()}`).join('\n')}\n${combinedContent}`;
}

// Create the server
const server = new Server(
  {
    name: 'lovable-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const tools: Tool[] = [
  {
    name: 'create_project',
    description: 'Create a new Lovable.dev project from a prompt, optionally with additional context',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The main prompt describing what UI/app to build',
        },
        projectType: {
          type: 'string',
          description: 'Type of project (react, vue, etc.)',
          default: 'react',
        },
        repo: {
          type: 'string',
          description: 'Optional repository URL to connect to',
        },
        visibility: {
          type: 'string',
          enum: ['public', 'private'],
          description: 'Project visibility',
          default: 'private',
        },
        context: {
          type: 'string',
          description: 'Additional context or requirements for the project',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'check_project_status',
    description: 'Check the status of a Lovable.dev project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The project ID to check',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'get_project_details',
    description: 'Get detailed information about a Lovable.dev project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'The project ID to get details for',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'scaffold_altitude_ui',
    description: 'Create Lovable.dev UI scaffolding based on CTB/Altitude specifications from this repository',
    inputSchema: {
      type: 'object',
      properties: {
        specPath: {
          type: 'string',
          description: 'Optional path to specific spec file. If not provided, will read from docs/altitude/*.md and spec/process_map.*',
        },
      },
      required: [],
    },
  },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_project': {
        const params = CreateProjectSchema.parse(args);
        
        if (LOVABLE_API_KEY) {
          const lovable = new LovableAPI(LOVABLE_API_KEY);
          const result = await lovable.createProject(params);
          
          return {
            content: [
              {
                type: 'text',
                text: `✅ Project created successfully!\n\nProject ID: ${result.id || result.projectId || 'N/A'}\nStatus: ${result.status || 'Created'}\nURL: ${result.url || result.projectUrl || 'N/A'}\n\nPrompt: ${params.prompt}\nType: ${params.projectType}\nVisibility: ${params.visibility}`,
              },
            ],
          };
        } else if (COMPOSIO_API_KEY) {
          const composio = new ComposioFallback(COMPOSIO_API_KEY);
          const result = await composio.createProject(params);
          
          return {
            content: [
              {
                type: 'text',
                text: `✅ Project created via Composio fallback!\n\nResult: ${JSON.stringify(result, null, 2)}`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: '❌ No API keys configured. Please set LOVABLE_API_KEY or COMPOSIO_API_KEY in your .env file.',
              },
            ],
          };
        }
      }

      case 'check_project_status': {
        const params = ProjectIdSchema.parse(args);
        
        if (!LOVABLE_API_KEY) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ LOVABLE_API_KEY not configured. Cannot check project status.',
              },
            ],
          };
        }

        const lovable = new LovableAPI(LOVABLE_API_KEY);
        const result = await lovable.getProjectStatus(params.projectId);
        
        return {
          content: [
            {
              type: 'text',
              text: `📊 Project Status for ${params.projectId}:\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'get_project_details': {
        const params = ProjectIdSchema.parse(args);
        
        if (!LOVABLE_API_KEY) {
          return {
            content: [
              {
                type: 'text',
                text: '❌ LOVABLE_API_KEY not configured. Cannot get project details.',
              },
            ],
          };
        }

        const lovable = new LovableAPI(LOVABLE_API_KEY);
        const result = await lovable.getProjectDetails(params.projectId);
        
        return {
          content: [
            {
              type: 'text',
              text: `📋 Project Details for ${params.projectId}:\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'scaffold_altitude_ui': {
        const params = ScaffoldAltitudeSchema.parse(args);
        
        try {
          const ctbSpecs = readCTBSpecs(params.specPath);
          
          const scaffoldPrompt = `Create a comprehensive UI application based on this CTB (Christmas Tree Backbone) and Altitude specification:

${ctbSpecs}

Please create:
1. A strategic overview dashboard (30k altitude)
2. Operational pages for each major process (20k altitude)
3. Tactical forms and detailed views (10k altitude)
4. Execution-level components and APIs (5k altitude)
5. Navigation that follows the CTB flow structure
6. Data visualization for the catalog items
7. Information flow indicators between components

Make it modern, responsive, and professional. Use React with appropriate UI libraries like Tailwind CSS or Material-UI.`;

          if (LOVABLE_API_KEY) {
            const lovable = new LovableAPI(LOVABLE_API_KEY);
            const result = await lovable.createProject({
              prompt: scaffoldPrompt,
              projectType: 'react',
              visibility: 'private',
              context: 'CTB/Altitude UI scaffolding project',
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: `🏗️ CTB/Altitude UI Scaffold Created!\n\nProject ID: ${result.id || result.projectId || 'N/A'}\nStatus: ${result.status || 'Created'}\nURL: ${result.url || result.projectUrl || 'N/A'}\n\n📋 Scaffolded based on your CTB/Altitude specs:\n${ctbSpecs.substring(0, 500)}...`,
                },
              ],
            };
          } else if (COMPOSIO_API_KEY) {
            const composio = new ComposioFallback(COMPOSIO_API_KEY);
            const result = await composio.createProject({
              prompt: scaffoldPrompt,
              projectType: 'react',
              visibility: 'private',
              context: 'CTB/Altitude UI scaffolding project',
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: `🏗️ CTB/Altitude UI Scaffold Created via Composio!\n\n${JSON.stringify(result, null, 2)}`,
                },
              ],
            };
          } else {
            return {
              content: [
                {
                  type: 'text',
                  text: `📋 CTB/Altitude UI Scaffold Plan:\n\n${ctbSpecs}\n\n❌ No API keys configured. To actually create the project, please set LOVABLE_API_KEY or COMPOSIO_API_KEY in your .env file.\n\n💡 The above specification would be used to generate a comprehensive UI application with strategic, operational, tactical, and execution-level components.`,
                },
              ],
            };
          }
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error reading CTB/Altitude specs: ${error.message}`,
              },
            ],
          };
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${error.message}`,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lovable MCP Server running on stdio');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}