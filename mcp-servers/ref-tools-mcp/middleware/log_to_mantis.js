const logToMantis = (req, res, next) => {
  const startTime = Date.now();
  
  // Enhanced logging for documentation access
  console.log(JSON.stringify({
    type: 'MCP_REQUEST',
    timestamp: new Date().toISOString(),
    unique_id: req.body.unique_id,
    process_id: req.body.process_id,
    tool: req.body.tool,
    orbt_layer: req.body.orbt_layer,
    server: 'ref-tools-mcp',
    documentation_access: true,
    ref_tools_integration: true,
    search_query: req.body.data?.query || null,
    documentation_url: req.body.data?.url || null,
    api_reference: req.body.data?.api_name || null,
    token_optimization_enabled: true
  }));
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - startTime;
    
    console.log(JSON.stringify({
      type: 'MCP_RESPONSE', 
      timestamp: new Date().toISOString(),
      unique_id: req.body.unique_id,
      duration_ms: duration,
      success: !body.error,
      server: 'ref-tools-mcp',
      documentation_access: true,
      ref_tools_integration: true,
      results_count: body.result?.results?.length || body.result?.total_results || 0,
      token_optimized: body.result?.token_optimized || false,
      session_deduplicated: body.result?.session_deduplicated || false,
      content_length: body.result?.content_length || 0
    }));
    
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = logToMantis;