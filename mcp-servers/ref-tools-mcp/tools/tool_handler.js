const https = require('https');
const http = require('http');
const { URL } = require('url');

class RefToolsHandler {
  constructor() {
    this.apiKey = process.env.REF_API_KEY || 'ref-a8d6be8baf228c5a68c2';
    this.baseURL = 'https://api.ref.tools';
    this.sessionCache = new Map(); // Cache for session deduplication
    this.rateLimiter = new Map(); // Simple rate limiting
  }

  async search_documentation(payload) {
    try {
      const { query, max_results = 5, include_code_examples = true } = payload.data;
      
      console.log(`🔍 Searching documentation: "${query}"`);
      
      // Check session cache for duplicate searches
      const cacheKey = `search:${query}:${max_results}`;
      if (this.sessionCache.has(cacheKey)) {
        console.log('📈 Documentation search cache HIT');
        const cached = this.sessionCache.get(cacheKey);
        return this.wrapSuccessResponse(cached, payload, 'search_documentation');
      }

      // Rate limiting check
      if (this.isRateLimited(payload.process_id)) {
        throw new Error('Rate limit exceeded - too many requests');
      }

      // Make API call to Ref tools
      const searchResults = await this.makeRefAPICall('/search', {
        query: query,
        max_results: max_results,
        include_code: include_code_examples
      });

      // Process and optimize results
      const processedResults = this.processSearchResults(searchResults, query);
      
      // Cache results for session deduplication
      this.sessionCache.set(cacheKey, processedResults);
      
      return this.wrapSuccessResponse(processedResults, payload, 'search_documentation');

    } catch (error) {
      console.error('Ref documentation search error:', error.message);
      return this.wrapErrorResponse(error, payload, 'search_documentation');
    }
  }

  async read_documentation_url(payload) {
    try {
      const { url, extract_code_blocks = true, max_content_length = 5000 } = payload.data;
      
      console.log(`📖 Reading documentation URL: ${url}`);
      
      // Validate URL
      try {
        new URL(url);
      } catch {
        throw new Error('Invalid URL provided');
      }

      // Check cache first
      const cacheKey = `read:${url}:${max_content_length}`;
      if (this.sessionCache.has(cacheKey)) {
        console.log('📈 Documentation read cache HIT');
        const cached = this.sessionCache.get(cacheKey);
        return this.wrapSuccessResponse(cached, payload, 'read_documentation_url');
      }

      // Rate limiting check
      if (this.isRateLimited(payload.process_id)) {
        throw new Error('Rate limit exceeded - too many requests');
      }

      // Make API call to read URL
      const content = await this.makeRefAPICall('/read', {
        url: url,
        extract_code: extract_code_blocks,
        max_length: max_content_length
      });

      // Process content with session-aware dropout
      const processedContent = this.processDocumentationContent(
        content, 
        payload.process_id,
        max_content_length
      );

      // Cache processed content
      this.sessionCache.set(cacheKey, processedContent);

      return this.wrapSuccessResponse(processedContent, payload, 'read_documentation_url');

    } catch (error) {
      console.error('Ref documentation read error:', error.message);
      return this.wrapErrorResponse(error, payload, 'read_documentation_url');
    }
  }

  async get_api_reference(payload) {
    try {
      const { api_name, endpoint_or_method, include_examples = true } = payload.data;
      
      console.log(`📋 Getting API reference: ${api_name} - ${endpoint_or_method}`);

      // Construct targeted search query for API references
      const apiQuery = `${api_name} ${endpoint_or_method} API reference documentation`;
      
      // Use search_documentation for API references with targeted query
      const searchPayload = {
        ...payload,
        data: {
          query: apiQuery,
          max_results: 3, // Focused results for API refs
          include_code_examples: include_examples
        }
      };

      const searchResults = await this.search_documentation(searchPayload);
      
      if (!searchResults.success) {
        return searchResults;
      }

      // Enhance results with API-specific formatting
      const apiReference = this.formatAPIReference(
        searchResults.result,
        api_name,
        endpoint_or_method
      );

      return this.wrapSuccessResponse(apiReference, payload, 'get_api_reference');

    } catch (error) {
      console.error('Ref API reference error:', error.message);
      return this.wrapErrorResponse(error, payload, 'get_api_reference');
    }
  }

  async search_github_repos(payload) {
    try {
      const { query, language, max_repos = 10 } = payload.data;
      
      console.log(`🐙 Searching GitHub repos: "${query}"${language ? ` (${language})` : ''}`);

      // Construct GitHub-specific search
      let githubQuery = `${query} site:github.com`;
      if (language) {
        githubQuery += ` language:${language}`;
      }

      // Use general search but filter for GitHub
      const searchResults = await this.makeRefAPICall('/search', {
        query: githubQuery,
        max_results: max_repos,
        include_code: true,
        filter: 'github'
      });

      const processedRepos = this.processGitHubResults(searchResults, query, language);

      return this.wrapSuccessResponse(processedRepos, payload, 'search_github_repos');

    } catch (error) {
      console.error('Ref GitHub search error:', error.message);
      return this.wrapErrorResponse(error, payload, 'search_github_repos');
    }
  }

  // Helper Methods

  async makeRefAPICall(endpoint, params) {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        apiKey: this.apiKey,
        ...params
      });

      const options = {
        hostname: 'api.ref.tools',
        port: 443,
        path: `${endpoint}?${queryParams}`,
        method: 'GET',
        headers: {
          'User-Agent': 'ref-tools-mcp/1.0.0',
          'Accept': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error(`Invalid JSON response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`API request failed: ${error.message}`));
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('API request timeout'));
      });

      req.end();
    });
  }

  processSearchResults(results, query) {
    // Token-efficient processing with relevance scoring
    return {
      query: query,
      results: (results.results || []).map((result, index) => ({
        title: result.title || 'Untitled',
        url: result.url || '',
        snippet: this.truncateSnippet(result.snippet || '', 200),
        source: this.extractSource(result.url),
        relevance_score: this.calculateRelevance(result, query, index),
        code_examples: result.code_blocks || []
      })),
      total_results: results.total || 0,
      search_time_ms: results.search_time || 0,
      token_optimized: true,
      session_deduplicated: true
    };
  }

  processDocumentationContent(content, sessionId, maxLength) {
    // Session-aware content dropout for token efficiency
    const sessionHistory = this.getSessionHistory(sessionId);
    
    let processedContent = {
      title: content.title || 'Documentation',
      url: content.url || '',
      content: this.optimizeContent(content.content || '', sessionHistory, maxLength),
      code_blocks: content.code_blocks || [],
      extracted_at: new Date().toISOString(),
      token_optimized: true,
      content_length: 0
    };

    processedContent.content_length = processedContent.content.length;
    return processedContent;
  }

  formatAPIReference(searchResults, apiName, endpoint) {
    return {
      api_name: apiName,
      endpoint_or_method: endpoint,
      documentation_results: searchResults.results,
      api_specific_formatting: true,
      search_metadata: {
        query_used: searchResults.query,
        results_found: searchResults.total_results
      }
    };
  }

  processGitHubResults(results, query, language) {
    return {
      query: query,
      language_filter: language,
      repositories: (results.results || []).map(result => ({
        name: this.extractRepoName(result.url),
        url: result.url,
        description: result.snippet,
        stars: result.stars || 'unknown',
        language: language || 'mixed',
        relevance: this.calculateRelevance(result, query, 0)
      })),
      total_repos: results.total || 0
    };
  }

  // Utility Methods

  truncateSnippet(snippet, maxLength) {
    if (snippet.length <= maxLength) return snippet;
    return snippet.substring(0, maxLength - 3) + '...';
  }

  extractSource(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch {
      return 'unknown';
    }
  }

  extractRepoName(url) {
    try {
      const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
      return match ? match[1] : 'unknown';
    } catch {
      return 'unknown';
    }
  }

  calculateRelevance(result, query, index) {
    // Simple relevance scoring based on position and query matching
    let score = 1.0 - (index * 0.1); // Position-based scoring
    
    const title = (result.title || '').toLowerCase();
    const snippet = (result.snippet || '').toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Boost for query terms in title
    if (title.includes(queryLower)) score += 0.3;
    
    // Boost for query terms in snippet
    if (snippet.includes(queryLower)) score += 0.2;
    
    return Math.max(0, Math.min(1, score));
  }

  optimizeContent(content, sessionHistory, maxLength) {
    // Token-efficient content optimization
    if (content.length <= maxLength) return content;
    
    // Simple truncation with attempt to preserve code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = content.match(codeBlockRegex) || [];
    
    let optimized = content.substring(0, maxLength);
    
    // Try to include at least one code block if present
    if (codeBlocks.length > 0 && optimized.indexOf('```') === -1) {
      const firstCodeBlock = codeBlocks[0];
      if (firstCodeBlock.length < maxLength / 2) {
        optimized = content.substring(0, maxLength - firstCodeBlock.length) + '\n\n' + firstCodeBlock;
      }
    }
    
    return optimized;
  }

  getSessionHistory(sessionId) {
    // Placeholder for session history tracking
    return [];
  }

  isRateLimited(processId) {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 30; // 30 requests per minute
    
    if (!this.rateLimiter.has(processId)) {
      this.rateLimiter.set(processId, []);
    }
    
    const requests = this.rateLimiter.get(processId);
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return true;
    }
    
    recentRequests.push(now);
    this.rateLimiter.set(processId, recentRequests);
    return false;
  }

  wrapSuccessResponse(result, payload, operation) {
    return {
      success: true,
      result: result,
      heir_tracking: {
        unique_id: payload.unique_id,
        process_lineage: [payload.process_id],
        operation: operation,
        ref_tools_integration: true,
        documentation_access: true,
        token_optimized: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  wrapErrorResponse(error, payload, operation) {
    return {
      success: false,
      error: error.message,
      error_type: 'ref_tools_error',
      heir_tracking: {
        unique_id: payload.unique_id,
        process_lineage: [payload.process_id],
        error_occurred: true,
        operation: operation,
        ref_tools_integration: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  async handleToolCall(payload) {
    // Validate API key
    if (!this.apiKey) {
      return {
        success: false,
        error: 'REF_API_KEY not configured',
        configuration_required: 'Set REF_API_KEY environment variable'
      };
    }

    switch (payload.tool) {
      case 'search_documentation':
        return await this.search_documentation(payload);
      case 'read_documentation_url':
        return await this.read_documentation_url(payload);
      case 'get_api_reference':
        return await this.get_api_reference(payload);
      case 'search_github_repos':
        return await this.search_github_repos(payload);
      default:
        return {
          success: false,
          error: `Unknown tool: ${payload.tool}`,
          available_tools: [
            'search_documentation',
            'read_documentation_url', 
            'get_api_reference',
            'search_github_repos'
          ]
        };
    }
  }
}

module.exports = new RefToolsHandler();