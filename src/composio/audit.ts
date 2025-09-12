import { Client } from 'pg';
import * as crypto from 'crypto';

interface CallLogEntry {
  user_uuid: string;
  tool: string;
  status: 'success' | 'error' | 'timeout';
  request_id: string;
  latency_ms: number;
  payload_hash: string;
  error_message?: string;
}

// Database connection singleton
let dbClient: Client | null = null;

async function getDbClient(): Promise<Client> {
  if (!dbClient) {
    const connectionString = process.env.NEON_DATABASE_URL;
    if (!connectionString) {
      throw new Error('NEON_DATABASE_URL not found in environment');
    }

    dbClient = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for Neon
      }
    });

    await dbClient.connect();
  }
  return dbClient;
}

/**
 * Initialize audit logging table
 */
export async function initializeAuditTable(): Promise<void> {
  const client = await getDbClient();
  
  try {
    // Create schema if not exists
    await client.query('CREATE SCHEMA IF NOT EXISTS shq');
    
    // Create audit table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS shq.composio_call_log (
        id SERIAL PRIMARY KEY,
        ts TIMESTAMPTZ DEFAULT NOW(),
        user_uuid UUID,
        tool TEXT NOT NULL,
        status TEXT NOT NULL,
        request_id TEXT NOT NULL,
        latency_ms INTEGER,
        payload_hash TEXT,
        error_message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    await client.query(createTableQuery);
    
    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_composio_call_log_tool 
      ON shq.composio_call_log(tool);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_composio_call_log_user_uuid 
      ON shq.composio_call_log(user_uuid);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_composio_call_log_ts 
      ON shq.composio_call_log(ts DESC);
    `);
    
    console.log('[AUDIT] Composio call log table initialized successfully');
    
  } catch (error) {
    console.error('[AUDIT] Failed to initialize audit table:', error);
    throw error;
  }
}

/**
 * Log a tool execution call
 */
export async function logToolCall(entry: CallLogEntry): Promise<void> {
  try {
    const client = await getDbClient();
    
    const insertQuery = `
      INSERT INTO shq.composio_call_log 
      (user_uuid, tool, status, request_id, latency_ms, payload_hash, error_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    await client.query(insertQuery, [
      entry.user_uuid,
      entry.tool,
      entry.status,
      entry.request_id,
      entry.latency_ms,
      entry.payload_hash,
      entry.error_message || null
    ]);
    
  } catch (error) {
    // Don't throw here to avoid breaking the main flow
    console.error('[AUDIT] Failed to log tool call:', error);
  }
}

/**
 * Create a hash of the payload for audit purposes (without exposing sensitive data)
 */
export function createPayloadHash(payload: any): string {
  try {
    const payloadStr = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto.createHash('sha256').update(payloadStr).digest('hex').substring(0, 16);
  } catch {
    return 'hash_error';
  }
}

/**
 * Check if Instantly tools are disabled by kill switch
 */
export function isInstantlyDisabled(): boolean {
  return process.env.MCP_DISABLE_INSTANTLY === 'true';
}

/**
 * Get audit statistics for a user
 */
export async function getAuditStats(userUuid?: string): Promise<{
  total_calls: number;
  success_rate: number;
  avg_latency_ms: number;
  top_tools: Array<{ tool: string; count: number }>;
}> {
  try {
    const client = await getDbClient();
    
    const whereClause = userUuid ? 'WHERE user_uuid = $1' : '';
    const params = userUuid ? [userUuid] : [];
    
    // Get basic stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total_calls,
        AVG(CASE WHEN status = 'success' THEN 1.0 ELSE 0.0 END) as success_rate,
        AVG(latency_ms) as avg_latency_ms
      FROM shq.composio_call_log
      ${whereClause}
    `;
    
    const statsResult = await client.query(statsQuery, params);
    
    // Get top tools
    const toolsQuery = `
      SELECT tool, COUNT(*) as count
      FROM shq.composio_call_log
      ${whereClause}
      GROUP BY tool
      ORDER BY count DESC
      LIMIT 10
    `;
    
    const toolsResult = await client.query(toolsQuery, params);
    
    return {
      total_calls: parseInt(statsResult.rows[0]?.total_calls || '0'),
      success_rate: parseFloat(statsResult.rows[0]?.success_rate || '0'),
      avg_latency_ms: parseFloat(statsResult.rows[0]?.avg_latency_ms || '0'),
      top_tools: toolsResult.rows.map(row => ({
        tool: row.tool,
        count: parseInt(row.count)
      }))
    };
    
  } catch (error) {
    console.error('[AUDIT] Failed to get audit stats:', error);
    return {
      total_calls: 0,
      success_rate: 0,
      avg_latency_ms: 0,
      top_tools: []
    };
  }
}

/**
 * Clean up old audit logs (keep last 30 days)
 */
export async function cleanupAuditLogs(): Promise<number> {
  try {
    const client = await getDbClient();
    
    const cleanupQuery = `
      DELETE FROM shq.composio_call_log
      WHERE ts < NOW() - INTERVAL '30 days'
    `;
    
    const result = await client.query(cleanupQuery);
    const deletedCount = result.rowCount || 0;
    
    if (deletedCount > 0) {
      console.log(`[AUDIT] Cleaned up ${deletedCount} old audit log entries`);
    }
    
    return deletedCount;
    
  } catch (error) {
    console.error('[AUDIT] Failed to cleanup audit logs:', error);
    return 0;
  }
}