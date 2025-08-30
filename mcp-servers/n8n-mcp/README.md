# N8N-MCP Server

## 🧱 Barton Doctrine Compliant

This MCP server follows the Primary System Doctrine: "AI helps build the system. Old school runs the system."

## 📋 Available Tools

### trigger_workflow
- **Description**: Triggers an n8n workflow
- **Required Inputs**: workflow_id
- **Optional Inputs**: data

### get_workflow_status
- **Description**: Gets workflow execution status
- **Required Inputs**: execution_id
- **Optional Inputs**: None


## 🔧 Usage Examples

```javascript
const response = await fetch('http://localhost:3003/tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    unique_id: 'HEIR-2024-12-N8N-001',
    process_id: 'PRC-TEST0001-' + Date.now(),
    tool: 'trigger_workflow',
    ...params
  })
});
```

## 🚀 Health Check

```bash
curl http://localhost:3003/health
```

## 📊 Compliance

- ✅ HEIR/ORBT compliant
- ✅ Tool manifest validated
- ✅ Mock infrastructure ready
- ✅ Middleware separation complete
- ✅ Kill switch enabled
- ✅ Mantis logging integrated

## 🔒 Security

- Rate limiting: 100 requests/15 minutes
- Input validation: JSON schema enforced
- HEIR ID required for all operations
- Emergency kill switch available

## 📝 Environment Variables

```env
N8N_MCP_API_KEY=your_api_key_here
NODE_ENV=development
MCP_KILL_SWITCH=false
```

## 🔧 Operations

### Startup Sequence
1. Environment validation
2. Database connection (if applicable)
3. Middleware initialization
4. Tool handler registration
5. Health check endpoint activation
6. Kill switch arming

### Runtime Operations
- All operations flow through MCP tool handlers
- HEIR/ORBT compliance enforced on every request
- Automatic logging via Mantis integration
- Rate limiting per ORBT Layer 5 policies

### Shutdown Sequence
1. Kill switch activation
2. Request queue drainage
3. Database connection cleanup
4. Graceful process termination

## 📋 Compliance Documentation

### Barton Doctrine Compliance
- ✅ **AI Blueprint Phase**: LLM used only during development
- ✅ **Runtime Execution**: MCP-only, no AI decision making
- ✅ **Process Definition**: Complete tool manifest with schemas
- ✅ **HEIR/ORBT Standards**: Full compliance with tracking IDs
- ✅ **Emergency Controls**: Kill switch and rollback capabilities

### HEIR Compliance Details
- **Unique ID Format**: `HEIR-YYYY-MM-SYSTEM-MODE-VN`
- **Process Tracking**: `PRC-SYSTCODE-EPOCHTIMESTAMP`
- **Layer Authorization**: ORBT Layer 5 operations
- **Blueprint Versioning**: Git hash-based versioning

### Audit Trail
- All operations logged to Mantis system
- Request/response payloads captured
- Error conditions and mitigation recorded
- Compliance violations automatically flagged

### Security Constraints
- Input validation via JSON schema
- Rate limiting: 100 requests/15 minutes
- Domain allowlisting for external calls
- PII scrubbing mandatory
- Data retention: 7 days maximum

## 🔒 HEIR/ORBT Compliance

This server is fully compliant with HEIR/ORBT standards:

### HEIR (Hierarchical Event Identity Registry)
- **Unique ID Format**: `HEIR-YYYY-MM-SYSTEM-MODE-VN`
- **Process Tracking**: `PRC-SYSTCODE-EPOCHTIMESTAMP`
- **Blueprint Versioning**: Git hash-based versioning
- **Event Lineage**: Full audit trail maintained

### ORBT (Operations & Resource Blueprint Tracking)
- **Layer Authorization**: Layer 5 operations
- **Resource Constraints**: Rate limiting and connection pools
- **Security Policies**: Input validation and sanitization
- **Emergency Protocols**: Kill switch and graceful degradation

### Compliance Features
- ✅ Structured logging via Mantis integration
- ✅ Request/response payload validation
- ✅ Error conditions tracked and reported
- ✅ Rate limiting per ORBT policies
- ✅ Emergency shutdown capabilities
- ✅ Data retention policies enforced
- ✅ PII scrubbing mandatory

### Audit Trail
All operations are logged with:
- Request timestamp and unique identifier
- Process lineage and blueprint version
- Input validation results
- Execution time and resource usage
- Error conditions and recovery actions
- Compliance status and violations
