import { ComposioToolSet } from 'composio-core';
import { Client } from 'pg';
import * as crypto from 'crypto';

interface ToolPolicy {
  timeoutMs?: number;
  retries?: number;
  readOnly?: boolean;
}

interface ComposioResponse {
  data?: any;
  error?: any;
  metadata?: {
    request_id?: string;
    latency_ms?: number;
    status?: string;
  };
}

// Load global policy defaults
let globalPolicy: ToolPolicy = {
  timeoutMs: 15000,
  retries: 2,
  readOnly: false
};

try {
  // Attempt to load from recipes/global.json
  globalPolicy = require('./recipes/global.json');
} catch {
  // Use defaults if file doesn't exist
}

let composioToolSet: ComposioToolSet | null = null;
let dbClient: Client | null = null;

async function getComposioToolSet(): Promise<ComposioToolSet> {
  if (!composioToolSet) {
    const apiKey = process.env.COMPOSIO_API_KEY;
    if (!apiKey) {
      throw new Error('COMPOSIO_API_KEY not found in environment');
    }
    composioToolSet = new ComposioToolSet({ 
      apiKey,
      entityId: process.env.HIVE_USER_UUID || '6b9518ed-5771-4153-95bd-c72ce46e84ef'
    });
  }
  return composioToolSet;
}

async function getDbClient(): Promise<Client | null> {
  if (!dbClient && process.env.NEON_PG_URI) {
    try {
      dbClient = new Client({
        connectionString: process.env.NEON_PG_URI,
        ssl: { rejectUnauthorized: false }
      });
      await dbClient.connect();
    } catch (error) {
      console.warn('[AUDIT] Database connection failed:', error.message);
      return null;
    }
  }
  return dbClient;
}

async function logToolCall(
  tool: string,
  status: 'success' | 'error' | 'timeout' | 'blocked',
  requestId: string,
  latencyMs: number,
  payloadHash: string,
  errorMessage?: string
): Promise<void> {
  try {
    const client = await getDbClient();
    if (!client) return;

    const query = `
      INSERT INTO shq.composio_call_log 
      (user_uuid, tool, status, request_id, latency_ms, payload_hash, error_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    await client.query(query, [
      process.env.HIVE_USER_UUID || '6b9518ed-5771-4153-95bd-c72ce46e84ef',
      tool,
      status,
      requestId,
      latencyMs,
      payloadHash,
      errorMessage || null
    ]);
  } catch (error) {
    // Don't throw - logging is best effort
    console.error('[AUDIT] Failed to log tool call:', error.message);
  }
}

function createPayloadHash(payload: any): string {
  try {
    const payloadStr = JSON.stringify(payload, Object.keys(payload || {}).sort());
    return crypto.createHash('sha256').update(payloadStr).digest('hex').substring(0, 16);
  } catch {
    return 'hash_error';
  }
}

function isToolAllowed(slug: string): boolean {
  const allowedTools = process.env.ALLOWED_TOOLS;
  if (!allowedTools || allowedTools.trim() === '') {
    return true; // No whitelist means all tools allowed
  }
  const whitelist = allowedTools.split(',').map(s => s.trim());
  return whitelist.includes(slug);
}

function isWriteOperation(slug: string, args: any): boolean {
  // Common patterns for write operations
  const writePatterns = [
    /create/i, /update/i, /delete/i, /insert/i, /modify/i,
    /write/i, /post/i, /put/i, /patch/i, /remove/i
  ];
  
  // Check slug for write patterns
  if (writePatterns.some(pattern => pattern.test(slug))) {
    return true;
  }
  
  // Check for SQL write operations
  if (args?.query && typeof args.query === 'string') {
    const sqlWritePatterns = /^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE)/i;
    if (sqlWritePatterns.test(args.query)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Execute a tool via Composio SDK with guardrails and audit logging
 * @param slug - Tool identifier (e.g., 'NEON_EXECUTE_SQL')
 * @param args - Tool arguments
 * @param policy - Optional execution policy overrides
 * @returns Tool execution result with metadata
 */
export async function runTool(
  slug: string,
  args: any = {},
  policy: ToolPolicy = {}
): Promise<ComposioResponse> {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const payloadHash = createPayloadHash(args);
  
  // Merge policies: parameter > global > defaults
  const effectivePolicy: ToolPolicy = {
    timeoutMs: policy.timeoutMs ?? globalPolicy.timeoutMs ?? 15000,
    retries: policy.retries ?? globalPolicy.retries ?? 2,
    readOnly: policy.readOnly ?? globalPolicy.readOnly ?? false
  };

  console.log(`[COMPOSIO] Executing tool: ${slug} (request_id: ${requestId})`);

  // Check if tool is allowed
  if (!isToolAllowed(slug)) {
    const error = `Tool '${slug}' is not in ALLOWED_TOOLS whitelist`;
    await logToolCall(slug, 'blocked', requestId, Date.now() - startTime, payloadHash, error);
    return {
      error: { message: error, type: 'tool_not_allowed' },
      metadata: { request_id: requestId, latency_ms: Date.now() - startTime, status: 'blocked' }
    };
  }

  // Check write operations if MCP_DISABLE_WRITE is set
  if (process.env.MCP_DISABLE_WRITE === 'true' && !effectivePolicy.readOnly) {
    if (isWriteOperation(slug, args)) {
      const error = 'Write operations are disabled by MCP_DISABLE_WRITE';
      await logToolCall(slug, 'blocked', requestId, Date.now() - startTime, payloadHash, error);
      return {
        error: { message: error, type: 'write_disabled' },
        metadata: { request_id: requestId, latency_ms: Date.now() - startTime, status: 'blocked' }
      };
    }
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= effectivePolicy.retries!; attempt++) {
    try {
      const toolSet = await getComposioToolSet();
      
      // Set up timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tool execution timeout')), effectivePolicy.timeoutMs);
      });
      
      // Execute tool with timeout
      const result = await Promise.race([
        toolSet.executeAction({
          action: slug,
          params: args
        }),
        timeoutPromise
      ]);
      
      const latency = Date.now() - startTime;
      
      // Log successful execution
      await logToolCall(slug, 'success', requestId, latency, payloadHash);
      
      return {
        data: result.data || result,
        metadata: {
          request_id: requestId,
          latency_ms: latency,
          status: 'success'
        }
      };
      
    } catch (error) {
      lastError = error as Error;
      console.error(`[COMPOSIO] Attempt ${attempt + 1} failed for ${slug}:`, lastError.message);
      
      if (error.message === 'Tool execution timeout') {
        await logToolCall(slug, 'timeout', requestId, Date.now() - startTime, payloadHash, lastError.message);
        break; // Don't retry on timeout
      }
      
      if (attempt < effectivePolicy.retries!) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  // All retries exhausted
  const finalLatency = Date.now() - startTime;
  await logToolCall(slug, 'error', requestId, finalLatency, payloadHash, lastError?.message);
  
  return {
    error: {
      message: lastError?.message || 'Unknown error',
      type: 'execution_error'
    },
    metadata: {
      request_id: requestId,
      latency_ms: finalLatency,
      status: 'error'
    }
  };
}

// Export for testing
export async function closeConnections(): Promise<void> {
  if (dbClient) {
    await dbClient.end();
    dbClient = null;
  }
}