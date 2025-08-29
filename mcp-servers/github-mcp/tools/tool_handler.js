/**
 * GitHubMCPTool - Tool Logic Handler
 * Extracted from server.js for better separation of concerns
 */

const { SimpleMCPTool } = require('../../../mcp-doctrine-layer/templates/simple_mcp_tool');
const axios = require('axios');

/**
 * GitHub MCP Tool Handler
 */
class GitHubMCPTool extends SimpleMCPTool {
    constructor() {
        super('github-analyzer', {
            version: '1.2.0',
            orbtLayer: 4, // Senior developer level for repo operations
            systemCode: 'GHBANAL'
        });
        
        this.token = process.env.GITHUB_TOKEN;
        this.webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
        this.baseUrl = 'https://api.github.com';
        
        if (!this.token) {
            console.warn('⚠️  GITHUB_TOKEN not set - using public API only');
        }
    }

    /**
     * Main business logic - extracted from server.js
     */
    async doWork(params) {
        const { operation, owner, repo, path, branch = 'main', query } = params;
        
        // Validate operation type
        const allowedOperations = [
            'get_repo_info', 'list_files', 'get_file_content', 'search_code',
            'get_commits', 'analyze_structure', 'get_issues', 'webhook_handler'
        ];
        
        if (!allowedOperations.includes(operation)) {
            throw new Error(`Invalid operation: ${operation}. Allowed: ${allowedOperations.join(', ')}`);
        }

        let result;
        switch (operation) {
            case 'get_repo_info':
                result = await this.getRepoInfo(owner, repo);
                break;
            case 'list_files':
                result = await this.listFiles(owner, repo, path, branch);
                break;
            case 'get_file_content':
                result = await this.getFileContent(owner, repo, path, branch);
                break;
            case 'search_code':
                result = await this.searchCode(query, owner, repo);
                break;
            case 'get_commits':
                result = await this.getCommits(owner, repo, branch, params.limit);
                break;
            case 'analyze_structure':
                result = await this.analyzeRepoStructure(owner, repo, branch);
                break;
            case 'get_issues':
                result = await this.getIssues(owner, repo, params.state);
                break;
            case 'webhook_handler':
                result = await this.handleWebhook(params.headers, params.payload);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        return {
            operation,
            repository: `${owner}/${repo}`,
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
            let rateLimit = null;
            
            try {
                const response = await axios.get(
                    `${this.baseUrl}/rate_limit`,
                    {
                        headers: this.token ? { 'Authorization': `token ${this.token}` } : {},
                        timeout: 5000
                    }
                );
                
                apiConnected = true;
                rateLimit = {
                    limit: response.data.rate.limit,
                    remaining: response.data.rate.remaining,
                    reset: new Date(response.data.rate.reset * 1000).toISOString()
                };
            } catch (error) {
                // API test failed but server is still healthy
            }

            const responseTime = Date.now() - startTime;

            return {
                tool_name: this.toolName,
                version: this.version,
                status: 'healthy',
                api_connected: apiConnected,
                token_configured: !!this.token,
                webhook_secret_configured: !!this.webhookSecret,
                rate_limit: rateLimit,
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

module.exports = { GitHubMCPTool };