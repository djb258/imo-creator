/**
 * PlasmicMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * Plasmic MCP Tool Handler
 */
class PlasmicMCPTool extends SimpleMCPTool {
    constructor() {
        super('plasmic-component-manager', {
            version: '1.0.0',
            orbtLayer: 4, // UI/Frontend level
            systemCode: 'PLSMIC'
        });
        
        this.apiKey = process.env.PLASMIC_API_KEY;
        this.projectId = process.env.PLASMIC_PROJECT_ID;
        this.baseUrl = 'https://codegen.plasmic.app/api/v1';
        
        if (!this.apiKey) {
            console.warn('⚠️  PLASMIC_API_KEY not set - some features will be limited');
        }
        if (!this.projectId) {
            console.warn('⚠️  PLASMIC_PROJECT_ID not set - using default project operations');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, componentName, componentId, projectId, options = {} } = params;
        
        // Validate operation type
        const allowedOperations = ['sync_components', 'get_component', 'list_components', 'generate_code', 'update_component'];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        let result;
        switch (operation) {
            case 'sync_components':
                result = await this.syncComponents(projectId || this.projectId, options);
                break;
            case 'get_component':
                result = await this.getComponent(componentId, componentName);
                break;
            case 'list_components':
                result = await this.listComponents(projectId || this.projectId);
                break;
            case 'generate_code':
                result = await this.generateCode(componentId, options);
                break;
            case 'update_component':
                result = await this.updateComponent(componentId, options);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            project_id: projectId || this.projectId
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
            let projectAccess = false;
            
            if (this.apiKey) {
                try {
                    const response = await axios.get(
                        `${this.baseUrl}/user`,
                        {
                            headers: { 'Authorization': `Bearer ${this.apiKey}` },
                            timeout: 5000
                        }
                    );
                    apiConnected = true;
                    
                    // Test project access if project ID is set
                    if (this.projectId) {
                        try {
                            await axios.get(
                                `${this.baseUrl}/projects/${this.projectId}`,
                                {
                                    headers: { 'Authorization': `Bearer ${this.apiKey}` },
                                    timeout: 3000
                                }
                            );
                            projectAccess = true;
                        } catch (error) {
                            // Project access failed but API is still healthy
                        }
                    }
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
                project_id_configured: !!this.projectId,
                project_access: projectAccess,
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

module.exports = { PlasmicMCPTool };