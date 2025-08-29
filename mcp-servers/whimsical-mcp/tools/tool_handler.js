/**
 * WhimsicalMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * Whimsical MCP Tool Handler
 */
class WhimsicalMCPTool extends SimpleMCPTool {
    constructor() {
        super('whimsical-updater', {
            version: '1.1.0',
            orbtLayer: 5, // Developer level for external APIs
            systemCode: 'WHMSUP'
        });
        
        this.apiKey = process.env.WHIMSICAL_API_KEY;
        this.baseUrl = 'https://whimsical.com/api/v1';
        
        if (!this.apiKey) {
            console.warn('⚠️  WHIMSICAL_API_KEY not set - using mock responses');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, workspaceId, boardId, diagramData, boardType = 'mindmap' } = params;
        
        // Validate operation type
        const allowedOperations = ['create_board', 'update_board', 'get_board', 'list_workspaces', 'create_mindmap', 'update_ctb_diagram'];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        let result;
        switch (operation) {
            case 'create_board':
                result = await this.createBoard(workspaceId, diagramData, boardType);
                break;
            case 'update_board':
                result = await this.updateBoard(boardId, diagramData);
                break;
            case 'get_board':
                result = await this.getBoard(boardId);
                break;
            case 'list_workspaces':
                result = await this.listWorkspaces();
                break;
            case 'create_mindmap':
                result = await this.createMindmap(workspaceId, diagramData);
                break;
            case 'update_ctb_diagram':
                result = await this.updateCTBDiagram(boardId, params.ctbStructure);
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
            
            let apiConnected = false;
            let workspaceCount = 0;
            
            if (this.apiKey) {
                try {
                    const response = await this.listWorkspaces();
                    apiConnected = !response.mock;
                    workspaceCount = response.workspaces?.length || 0;
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
                available_workspaces: workspaceCount,
                response_time_ms: responseTime,
                mock_mode: !this.apiKey,
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

module.exports = { WhimsicalMCPTool };