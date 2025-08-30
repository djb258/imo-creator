const logToMantis = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  console.log(JSON.stringify({
    type: 'MCP_REQUEST',
    timestamp: new Date().toISOString(),
    unique_id: req.body.unique_id,
    process_id: req.body.process_id,
    tool: req.body.tool,
    orbt_layer: req.body.orbt_layer,
    server: 'twilio-mcp',
    communication_type: req.body.tool === 'send_sms' ? 'sms' : 'voice'
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
      server: 'twilio-mcp',
      twilio_sid: body.result?.sid || null
    }));
    
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = logToMantis;