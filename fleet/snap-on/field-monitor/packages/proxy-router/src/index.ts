import { neon } from '@neondatabase/serverless';
import type { ProxyRequest, ProxyResponse } from '@field-monitor/shared';

export interface Env {
  ENVIRONMENT: string;
  DATABASE_URL: string;
  EGRESS_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      const body = await request.json() as ProxyRequest;
      const result = await evaluateProxy(body, env);
      return jsonResponse(result, 200);
    } catch (err) {
      return jsonResponse({
        allowed: false,
        egress_path: null,
        rate_state_snapshot: null,
        rate_delta: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      } satisfies ProxyResponse, 500);
    }
  },
};

async function evaluateProxy(req: ProxyRequest, env: Env): Promise<ProxyResponse> {
  const sql = neon(env.DATABASE_URL);

  // Step 1: Read rate_state for domain (READ ONLY — no writes)
  const rateRows = await sql`
    SELECT domain, window_start, window_end, request_count, max_requests
    FROM field_monitor.rate_state
    WHERE domain = ${req.domain}
      AND window_start <= now()
      AND window_end > now()
    ORDER BY window_start DESC
    LIMIT 1
  `;

  const currentRate = rateRows.length > 0 ? rateRows[0] : null;

  // Step 2: Sliding window rate check
  const requestCount = currentRate ? (currentRate.request_count as number) : 0;
  const maxRequests = currentRate ? (currentRate.max_requests as number) : 60;
  const rateDelta = maxRequests - requestCount;
  const allowed = rateDelta > 0;

  // Step 3: KV egress path lookup
  const egressPath = await env.EGRESS_KV.get(req.domain);

  if (!allowed) {
    return {
      allowed: false,
      egress_path: egressPath,
      rate_state_snapshot: currentRate ? {
        domain: currentRate.domain as string,
        window_start: currentRate.window_start as string,
        window_end: currentRate.window_end as string,
        request_count: requestCount,
        max_requests: maxRequests,
      } : null,
      rate_delta: rateDelta,
      error: `Rate limit exceeded for ${req.domain}: ${requestCount}/${maxRequests}`,
    };
  }

  return {
    allowed: true,
    egress_path: egressPath ?? 'direct',
    rate_state_snapshot: currentRate ? {
      domain: currentRate.domain as string,
      window_start: currentRate.window_start as string,
      window_end: currentRate.window_end as string,
      request_count: requestCount,
      max_requests: maxRequests,
    } : null,
    rate_delta: rateDelta,
    error: null,
  };
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
