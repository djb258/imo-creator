/**
 * RenderMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * Render MCP Tool Handler
 */
class RenderMCPTool extends SimpleMCPTool {
    constructor() {
        super('render-infrastructure-manager', {
            version: '1.0.0',
            orbtLayer: 3, // Infrastructure level
            systemCode: 'RDRMC'
        });
        
        this.apiKey = process.env.RENDER_API_KEY;
        this.baseUrl = 'https://api.render.com/v1';
        
        if (!this.apiKey) {
            console.warn('⚠️  RENDER_API_KEY not set - some features will be limited');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, serviceId, deployId, serviceName, options = {} } = params;
        
        // Validate operation type
        const allowedOperations = [
            'list_services', 'get_service', 'create_service', 'update_service',
            'deploy_service', 'list_deploys', 'get_deploy', 'get_logs',
            'scale_service', 'suspend_service', 'resume_service'
        ];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        let result;
        switch (operation) {
            case 'list_services':
                result = await this.listServices(options);
                break;
            case 'get_service':
                result = await this.getService(serviceId);
                break;
            case 'create_service':
                result = await this.createService(options);
                break;
            case 'update_service':
                result = await this.updateService(serviceId, options);
                break;
            case 'deploy_service':
                result = await this.deployService(serviceId, options);
                break;
            case 'list_deploys':
                result = await this.listDeploys(serviceId, options);
                break;
            case 'get_deploy':
                result = await this.getDeploy(deployId);
                break;
            case 'get_logs':
                result = await this.getLogs(serviceId, options);
                break;
            case 'scale_service':
                result = await this.scaleService(serviceId, options);
                break;
            case 'suspend_service':
                result = await this.suspendService(serviceId);
                break;
            case 'resume_service':
                result = await this.resumeService(serviceId);
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
            let serviceCount = 0;
            
            if (this.apiKey) {
                try {
                    const response = await axios.get(
                        `${this.baseUrl}/services`,
                        {
                            headers: { 'Authorization': `Bearer ${this.apiKey}` },
                            params: { limit: 1 },
                            timeout: 5000
                        }
                    );
                    apiConnected = true;
                    serviceCount = response.data.length || 0;
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
                service_count: serviceCount,
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

module.exports = { RenderMCPTool };