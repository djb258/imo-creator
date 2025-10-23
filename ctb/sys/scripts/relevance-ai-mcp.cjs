#!/usr/bin/env node

/**
 * Relevance.ai MCP Server Integration
 * Custom implementation for Relevance.ai API access through MCP protocol
 *
 * Credentials:
 * - Authorization: 0fad06c6-ed27-47ae-a0ff-727b110caa5a:sk-ZmE0MDRkYjgtZTZiZi00NDY0LTg0ZDUtMjIyZGMwZjRiYzVk
 * - Region: bcbe5a
 * - Project: 0fad06c6-ed27-47ae-a0ff-727b110caa5a
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

class RelevanceAIMCP {
    constructor() {
        this.config = {
            authToken: '0fad06c6-ed27-47ae-a0ff-727b110caa5a:sk-ZmE0MDRkYjgtZTZiZi00NDY0LTg0ZDUtMjIyZGMwZjRiYzVk',
            region: 'bcbe5a',
            projectId: '0fad06c6-ed27-47ae-a0ff-727b110caa5a',
            baseUrl: 'https://api-bcbe5a.stack.tryrelevance.com'
        };

        this.tools = {
            'relevance_list_datasets': {
                description: 'List all datasets in Relevance.ai project',
                parameters: {}
            },
            'relevance_create_dataset': {
                description: 'Create a new dataset in Relevance.ai',
                parameters: {
                    dataset_id: { type: 'string', required: true },
                    schema: { type: 'object', required: false }
                }
            },
            'relevance_insert_documents': {
                description: 'Insert documents into a Relevance.ai dataset',
                parameters: {
                    dataset_id: { type: 'string', required: true },
                    documents: { type: 'array', required: true }
                }
            },
            'relevance_search': {
                description: 'Perform vector search in Relevance.ai dataset',
                parameters: {
                    dataset_id: { type: 'string', required: true },
                    query: { type: 'string', required: true },
                    vector_field: { type: 'string', required: false, default: 'text_vector_' },
                    page_size: { type: 'number', required: false, default: 10 }
                }
            },
            'relevance_list_workflows': {
                description: 'List all workflows in Relevance.ai project',
                parameters: {}
            },
            'relevance_trigger_workflow': {
                description: 'Trigger a workflow execution in Relevance.ai',
                parameters: {
                    workflow_id: { type: 'string', required: true },
                    params: { type: 'object', required: false }
                }
            },
            'relevance_get_workflow_status': {
                description: 'Get the status of a workflow execution',
                parameters: {
                    execution_id: { type: 'string', required: true }
                }
            }
        };
    }

    async makeRequest(endpoint, method = 'GET', body = null) {
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint, this.config.baseUrl);

            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.config.authToken}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'IMO-Creator-MCP/1.0'
                }
            };

            if (body) {
                const bodyString = JSON.stringify(body);
                options.headers['Content-Length'] = Buffer.byteLength(bodyString);
            }

            console.log(`🔗 Making request to: ${url.toString()}`);

            const req = https.request(options, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    try {
                        const data = responseBody ? JSON.parse(responseBody) : {};

                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve({
                                success: true,
                                data: data,
                                status: res.statusCode
                            });
                        } else {
                            resolve({
                                success: false,
                                error: `Relevance.ai API Error: ${res.statusCode} - ${data.message || responseBody || 'Unknown error'}`,
                                status: res.statusCode,
                                responseBody: responseBody
                            });
                        }
                    } catch (parseError) {
                        resolve({
                            success: false,
                            error: `JSON Parse Error: ${parseError.message}, Response: ${responseBody}`,
                            status: res.statusCode,
                            responseBody: responseBody
                        });
                    }
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: `Request Error: ${error.message}`,
                    status: 500
                });
            });

            if (body) {
                req.write(JSON.stringify(body));
            }

            req.end();
        });
    }

    async executeTool(toolName, params = {}) {
        const timestamp = new Date().toISOString();

        try {
            let result;

            switch (toolName) {
                case 'relevance_list_datasets':
                    result = await this.makeRequest(`/v1/projects/${this.config.projectId}/datasets`);
                    break;

                case 'relevance_create_dataset':
                    result = await this.makeRequest(`/v1/projects/${this.config.projectId}/datasets`, 'POST', {
                        dataset_id: params.dataset_id,
                        schema: params.schema || {}
                    });
                    break;

                case 'relevance_insert_documents':
                    result = await this.makeRequest(`/v1/projects/${this.config.projectId}/datasets/${params.dataset_id}/documents/bulk_insert`, 'POST', {
                        documents: params.documents
                    });
                    break;

                case 'relevance_search':
                    result = await this.makeRequest(`/v1/projects/${this.config.projectId}/datasets/${params.dataset_id}/documents/search`, 'POST', {
                        text: params.query,
                        vector_field: params.vector_field || 'text_vector_',
                        page_size: params.page_size || 10
                    });
                    break;

                case 'relevance_list_workflows':
                    result = await this.makeRequest(`/v1/projects/${this.config.projectId}/workflows`);
                    break;

                case 'relevance_trigger_workflow':
                    result = await this.makeRequest(`/v1/projects/${this.config.projectId}/workflows/${params.workflow_id}/trigger`, 'POST',
                        params.params || {}
                    );
                    break;

                case 'relevance_get_workflow_status':
                    result = await this.makeRequest(`/v1/projects/${this.config.projectId}/workflows/executions/${params.execution_id}`);
                    break;

                default:
                    throw new Error(`Unknown tool: ${toolName}`);
            }

            return {
                success: result.success,
                result: result.data,
                tool: toolName,
                timestamp: timestamp,
                relevance_tracking: {
                    project_id: this.config.projectId,
                    region: this.config.region,
                    tool_executed: toolName,
                    execution_time: timestamp
                }
            };

        } catch (error) {
            console.error(`❌ Tool execution error for ${toolName}:`, error);
            return {
                success: false,
                error: error.message,
                errorDetails: result ? result.error : 'Unknown error during tool execution',
                tool: toolName,
                timestamp: timestamp,
                relevance_tracking: {
                    project_id: this.config.projectId,
                    region: this.config.region,
                    tool_executed: toolName,
                    error_occurred: true,
                    execution_time: timestamp
                }
            };
        }
    }

    async handleRequest(req, res) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.method === 'POST' && req.url === '/tool') {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const payload = JSON.parse(body);
                    const { tool, data = {} } = payload;

                    console.log(`🎯 Executing Relevance.ai tool: ${tool}`);

                    const result = await this.executeTool(tool, data);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));

                } catch (error) {
                    console.error('❌ Request processing error:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    }));
                }
            });

        } else if (req.method === 'GET' && req.url === '/tools') {
            // Return available tools
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                tools: this.tools,
                config: {
                    region: this.config.region,
                    project_id: this.config.projectId,
                    base_url: this.config.baseUrl
                }
            }));

        } else if (req.method === 'GET' && req.url === '/health') {
            // Health check
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'healthy',
                service: 'Relevance.ai MCP Server',
                timestamp: new Date().toISOString(),
                project_id: this.config.projectId,
                region: this.config.region
            }));

        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Not Found',
                available_endpoints: ['/tool', '/tools', '/health']
            }));
        }
    }

    start(port = 3002) {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(port, () => {
            console.log('🚀 Relevance.ai MCP Server started!');
            console.log(`📡 Server running on http://localhost:${port}`);
            console.log(`🎯 Project: ${this.config.projectId}`);
            console.log(`🌍 Region: ${this.config.region}`);
            console.log(`🔧 Available tools: ${Object.keys(this.tools).length}`);
            console.log('\n📋 Available endpoints:');
            console.log('  POST /tool - Execute Relevance.ai tools');
            console.log('  GET /tools - List available tools');
            console.log('  GET /health - Health check');
            console.log('\n✅ Ready to process Relevance.ai requests!');
        });

        return server;
    }
}

// Start server if called directly
if (require.main === module) {
    const mcpServer = new RelevanceAIMCP();
    mcpServer.start(3002);
}

module.exports = RelevanceAIMCP;