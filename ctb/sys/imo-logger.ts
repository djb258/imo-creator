/**
 * Doctrine Spec:
 * - Barton ID: 03.02.01.07.10000.007
 * - Altitude: 10000 (Execution Layer)
 * - Purpose: IMO logging utility
 * - Input: log messages and metadata
 * - Output: formatted log entries
 * - MCP: N/A
 */
import { fetch } from 'undici';

interface ErrorContext {
  phase?: string;
  component?: string;
  altitude?: number;
  compliance_score?: number;
  [key: string]: any;
}

export async function logError(e: unknown, ctx: ErrorContext = {}) {
  const endpoint = process.env.IMO_MASTER_ERROR_ENDPOINT;
  const key = process.env.IMO_ERROR_API_KEY;
  
  if (!endpoint || !key) {
    // Fail quietly by design - don't break app if logging not configured
    console.error('[imo-logger] Error logging not configured (missing endpoint/key)');
    return;
  }
  
  const body = {
    level: "error",
    ts: new Date().toISOString(),
    app: process.env.APP_NAME || "unknown-app",
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    ctx,
    err: e instanceof Error ? {
      message: e.message,
      stack: e.stack,
      name: e.name
    } : String(e)
  };
  
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "X-IMO-Key": key 
      },
      body: JSON.stringify(body)
    });
  } catch (fetchError) {
    // Log to console but don't throw - error logging should never break the app
    console.error('[imo-logger] Failed to send error to master log:', fetchError);
  }
}

export async function logInfo(message: string, ctx: ErrorContext = {}) {
  const endpoint = process.env.IMO_MASTER_ERROR_ENDPOINT;
  const key = process.env.IMO_ERROR_API_KEY;
  
  if (!endpoint || !key) return;
  
  const body = {
    level: "info",
    ts: new Date().toISOString(),
    app: process.env.APP_NAME || "unknown-app",
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    message,
    ctx
  };
  
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "X-IMO-Key": key 
      },
      body: JSON.stringify(body)
    });
  } catch {}
}

export function createHealthCheck() {
  return {
    ok: true,
    app: process.env.APP_NAME || "unknown",
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    compliance: {
      monitoring: !!process.env.IMO_MASTER_ERROR_ENDPOINT,
      database: !!process.env.NEON_DATABASE_URL,
      firebase: !!process.env.FIREBASE_PROJECT_ID
    }
  };
}