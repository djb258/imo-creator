/**
 * N8NMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * N8N MCP Tool Handler
 */
class N8NMCPTool extends SimpleMCPTool {
    constructor() {
        super('n8n-workflow-manager', {
            version: '1.0.0',
            orbtLayer: 4, // Workflow/Automation level
            systemCode: 'N8NWFL'
        });
        
        this.apiKey = process.env.N8N_API_KEY;
        this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678/api/v1';
        this.webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';
        
        if (!this.apiKey) {
            console.warn('⚠️  N8N_API_KEY not set - some features will be limited');
        }
        if (!process.env.N8N_BASE_URL) {
            console.warn('⚠️  N8N_BASE_URL not set - using localhost default');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, workflowId, executionId, webhookPath, options = {} } = params;
        
        // Validate operation type
        const allowedOperations = [
            'list_workflows', 'get_workflow', 'create_workflow', 'update_workflow',
            'execute_workflow', 'activate_workflow', 'deactivate_workflow',
            'list_executions', 'get_execution', 'trigger_webhook',
            'get_credentials', 'test_workflow'
        ];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        let result;
        switch (operation) {
            case 'list_workflows':
                result = await this.listWorkflows(options);
                break;
            case 'get_workflow':
                result = await this.getWorkflow(workflowId);
                break;
            case 'create_workflow':
                result = await this.createWorkflow(options);
                break;
            case 'update_workflow':
                result = await this.updateWorkflow(workflowId, options);
                break;
            case 'execute_workflow':
                result = await this.executeWorkflow(workflowId, options);
                break;
            case 'activate_workflow':
                result = await this.activateWorkflow(workflowId);
                break;
            case 'deactivate_workflow':
                result = await this.deactivateWorkflow(workflowId);
                break;
            case 'list_executions':
                result = await this.listExecutions(workflowId, options);
                break;
            case 'get_execution':
                result = await this.getExecution(executionId);
                break;
            case 'trigger_webhook':
                result = await this.triggerWebhook(webhookPath, options);
                break;
            case 'get_credentials':
                result = await this.getCredentials(options);
                break;
            case 'test_workflow':
                result = await this.testWorkflow(workflowId, options);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        };
    }

    

    /**
     * Health check implementation
     */
    async healthCheck() {
        try {
            const startTime = Date.now();
            
            // Test API connectivity
            let apiConnected = false;
            let workflowCount = 0;
            
            if (this.apiKey) {
                try {
                    const response = await this.makeRequest('GET', '/workflows', {
                        params: { limit: 1 }
                    });
                    apiConnected = true;
                    workflowCount = response.data.data?.length || 0;
                } catch (error) {
                    // API test failed but server is still healthy
                }
            }

            const responseTime = Date.now() - startTime;

            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'healthy',
                api_connected: apiConnected,
                api_key_configured: !!this.apiKey,
                base_url_configured: !!process.env.N8N_BASE_URL,
                webhook_url_configured: !!process.env.N8N_WEBHOOK_URL,
                workflow_count: workflowCount,
                response_time_ms: responseTime,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = { N8NMCPTool };