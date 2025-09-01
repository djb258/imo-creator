const logToMantis = (req, res, next) => {
  const startTime = Date.now();
  
  // Enhanced logging for external service calls
  console.log(JSON.stringify({
    type: 'MCP_REQUEST',
    timestamp: new Date().toISOString(),
    unique_id: req.body.unique_id,
    process_id: req.body.process_id,
    tool: req.body.tool,
    orbt_layer: req.body.orbt_layer,
    server: 'composio-mcp',
    composio_integration: true,
    external_service_call: true,
    composio_toolkit: req.body.data?.toolkit || null,
    composio_tool: req.body.data?.tool || null,
    user_context: req.body.data?.user_id || null
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
      server: 'composio-mcp',
      composio_integration: true,
      external_service_call: true,
      composio_toolkit: req.body.data?.toolkit || null,
      composio_tool_executed: body.result?.composio_metadata?.tool_name || null,
      external_service_success: body.success || false
    }));
    
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = logToMantis;