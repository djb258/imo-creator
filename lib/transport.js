const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs').promises;

class TransportManager {
  constructor(config = {}) {
    this.type = config.transport || process.env.TRANSPORT_TYPE || 'rest';
    this.mcpServers = config.mcpServers || {};
    this.restEndpoints = config.restEndpoints || {};
    
    // Initialize JSON schema validator
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
  }

  async call(service, payload) {
    if (this.type === 'rest') {
      return this.callRest(service, payload);
    } else if (this.type === 'mcp') {
      return this.callMcp(service, payload);
    } else {
      throw new Error(`Unknown transport type: ${this.type}`);
    }
  }

  async callRest(service, payload) {
    // Mock REST implementation - replace with actual HTTP calls
    const endpoint = this.restEndpoints[service];
    if (!endpoint) {
      throw new Error(`No REST endpoint configured for service: ${service}`);
    }

    // Simulate REST call with mock data
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    return {
      success: true,
      data: payload.data,
      metadata: {
        transport: 'rest',
        service: service,
        endpoint: endpoint
      }
    };
  }

  async callMcp(service, payload) {
    // Mock MCP implementation - replace with actual MCP server calls
    const serverConfig = this.mcpServers[service];
    if (!serverConfig) {
      throw new Error(`No MCP server configured for service: ${service}`);
    }

    // Simulate MCP call with mock data
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));
    
    return {
      success: true,
      data: payload.data,
      metadata: {
        transport: 'mcp',
        service: service,
        server: serverConfig.url || `http://localhost:${serverConfig.port}`
      }
    };
  }

  setTransportType(type) {
    if (!['rest', 'mcp'].includes(type)) {
      throw new Error(`Invalid transport type: ${type}. Must be 'rest' or 'mcp'`);
    }
    this.type = type;
  }

  getTransportType() {
    return this.type;
  }
}

async function validateContract(contractPath, section, data) {
  try {
    const contractData = await fs.readFile(contractPath, 'utf8');
    const contract = JSON.parse(contractData);
    
    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    
    const schema = contract.properties[section];
    if (!schema) {
      throw new Error(`Section '${section}' not found in contract`);
    }
    
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (!valid) {
      const errors = validate.errors.map(error => 
        `${error.instancePath || 'root'}: ${error.message}`
      ).join(', ');
      throw new Error(`Contract validation failed for ${section}: ${errors}`);
    }
    
    return data;
  } catch (error) {
    throw new Error(`Contract validation error: ${error.message}`);
  }
}

module.exports = {
  TransportManager,
  validateContract
};