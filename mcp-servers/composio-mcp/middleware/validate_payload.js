const validatePayload = (req, res, next) => {
  const required = ['unique_id', 'process_id', 'orbt_layer', 'blueprint_version'];
  const missing = required.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required HEIR/ORBT fields',
      missing_fields: missing,
      server: 'composio-mcp',
      composio_integration: true
    });
  }
  
  if (req.body.orbt_layer > 5) {
    return res.status(403).json({
      error: 'ORBT Layer 5 maximum exceeded',
      server: 'composio-mcp',
      composio_integration: true
    });
  }
  
  // Validate Composio-specific fields
  if (req.body.tool === 'execute_composio_tool') {
    const composioRequired = ['toolkit', 'tool', 'arguments'];
    const composioMissing = composioRequired.filter(field => !req.body.data?.[field]);
    
    if (composioMissing.length > 0) {
      return res.status(400).json({
        error: 'Missing required Composio tool fields',
        missing_fields: composioMissing,
        server: 'composio-mcp'
      });
    }
  }
  
  next();
};

module.exports = validatePayload;