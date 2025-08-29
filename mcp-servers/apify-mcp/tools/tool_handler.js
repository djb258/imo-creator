/**
 * ApifyMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * Apify MCP Tool Handler
 */
class ApifyMCPTool extends SimpleMCPTool {
    constructor() {
        super('apify-scraper', {
            version: '1.3.2',
            orbtLayer: 5, // Developer level for external APIs
            systemCode: 'APFYSC'
        });
        
        this.apiKey = process.env.APIFY_API_KEY;
        this.baseUrl = 'https://api.apify.com/v2';
        
        if (!this.apiKey) {
            console.warn('⚠️  APIFY_API_KEY not set - some features will be limited');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, actorId, input, url, runOptions = {} } = params;
        
        // Validate operation type
        const allowedOperations = ['run_actor', 'scrape_url', 'get_dataset', 'list_actors'];
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        // Security validation
        if (url && !url.startsWith('https://')) {
            throw new Error('Only HTTPS URLs are allowed for security');
        }

        let result;
        switch (operation) {
            case 'run_actor':
                result = await this.runActor(actorId, input, runOptions);
                break;
            case 'scrape_url':
                result = await this.scrapeUrl(url, runOptions);
                break;
            case 'get_dataset':
                result = await this.getDataset(params.datasetId, params.limit);
                break;
            case 'list_actors':
                result = await this.listActors();
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            rate_limit_info: this.rateLimitInfo
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
            let actorCount = 0;
            
            if (this.apiKey) {
                try {
                    const response = await axios.get(
                        `${this.baseUrl}/acts`,
                        {
                            headers: { 'Authorization': `Bearer ${this.apiKey}` },
                            params: { limit: 1 },
                            timeout: 5000
                        }
                    );
                    apiConnected = true;
                    actorCount = response.data.total || 0;
                    this.updateRateLimitInfo(response.headers);
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
                available_actors: actorCount,
                response_time_ms: responseTime,
                rate_limit: this.rateLimitInfo || null,
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

module.exports = { ApifyMCPTool };