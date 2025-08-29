/**
 * VercelMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * Vercel MCP Tool Handler
 */
class VercelMCPTool extends SimpleMCPTool {
    constructor() {
        super('vercel-deployment-manager', {
            version: '1.0.0',
            orbtLayer: 3, // Infrastructure level
            systemCode: 'VRCLMC'
        });
        
        this.apiToken = process.env.VERCEL_TOKEN;
        this.teamId = process.env.VERCEL_TEAM_ID;
        this.baseUrl = 'https://api.vercel.com';
        
        if (!this.apiToken) {
            console.warn('⚠️  VERCEL_TOKEN not set - some features will be limited');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, projectName, deploymentId, domain, options = {} } = params;
        
        // Validate operation type
        const allowedOperations = [
            'deploy_project', 'list_deployments', 'get_deployment', 
            'list_projects', 'get_project', 'set_env_vars', 
            'add_domain', 'list_domains', 'get_logs'
        ];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        let result;
        switch (operation) {
            case 'deploy_project':
                result = await this.deployProject(projectName, options);
                break;
            case 'list_deployments':
                result = await this.listDeployments(projectName, options);
                break;
            case 'get_deployment':
                result = await this.getDeployment(deploymentId);
                break;
            case 'list_projects':
                result = await this.listProjects(options);
                break;
            case 'get_project':
                result = await this.getProject(projectName);
                break;
            case 'set_env_vars':
                result = await this.setEnvironmentVariables(projectName, options.variables);
                break;
            case 'add_domain':
                result = await this.addDomain(projectName, domain, options);
                break;
            case 'list_domains':
                result = await this.listDomains(projectName);
                break;
            case 'get_logs':
                result = await this.getLogs(deploymentId, options);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            team_id: this.teamId
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
            let projectCount = 0;
            let teamAccess = false;
            
            if (this.apiToken) {
                try {
                    const response = await axios.get(
                        `${this.baseUrl}/v9/projects`,
                        {
                            headers: { 'Authorization': `Bearer ${this.apiToken}` },
                            params: { 
                                limit: 1,
                                ...(this.teamId && { teamId: this.teamId })
                            },
                            timeout: 5000
                        }
                    );
                    apiConnected = true;
                    projectCount = response.data.pagination?.count || 0;
                    teamAccess = !!this.teamId;
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
                api_token_configured: !!this.apiToken,
                team_id_configured: !!this.teamId,
                team_access: teamAccess,
                project_count: projectCount,
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

module.exports = { VercelMCPTool };