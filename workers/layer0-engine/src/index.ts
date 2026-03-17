/**
 * Layer 0 Engine — CF Worker entry point (the hub).
 *
 * Routes:
 *   POST /api/sessions         — Start a new extraction session
 *   GET  /api/sessions         — List all sessions
 *   GET  /api/sessions/:id     — Get session details + results
 *   GET  /                     — Serve Pages (input form)
 *   GET  /dashboard            — Serve Pages (results dashboard)
 */

import type { Env } from "./gate-engine";
import {
  createSession,
  runExtraction,
  getGateResults,
  getLockedConstants,
  listSessions,
} from "./gate-engine";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for Pages ↔ Worker communication
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Health check
      if (path === "/health") {
        return Response.json({ status: "ok", engine: "layer0", version: env.DOCTRINE_VERSION }, { headers: corsHeaders });
      }

      // API routes
      if (path === "/api/sessions" && request.method === "POST") {
        return await handleCreateSession(request, env, corsHeaders);
      }

      if (path === "/api/sessions" && request.method === "GET") {
        return await handleListSessions(env, corsHeaders);
      }

      if (path.match(/^\/api\/sessions\/[^/]+\/gates$/) && request.method === "GET") {
        const sessionId = path.split("/api/sessions/")[1].replace("/gates", "");
        return await handleGetSessionGates(env, sessionId, corsHeaders);
      }

      if (path.match(/^\/api\/sessions\/[^/]+\/backprop$/) && request.method === "GET") {
        const sessionId = path.split("/api/sessions/")[1].replace("/backprop", "");
        return await handleGetBackProp(env, sessionId, corsHeaders);
      }

      if (path.match(/^\/api\/sessions\/[^/]+\/variables$/) && request.method === "GET") {
        const sessionId = path.split("/api/sessions/")[1].replace("/variables", "");
        return await handleGetVariables(env, sessionId, corsHeaders);
      }

      if (path.startsWith("/api/sessions/") && request.method === "GET") {
        const sessionId = path.split("/api/sessions/")[1];
        return await handleGetSession(env, sessionId, corsHeaders);
      }

      if (path === "/api/constants" && request.method === "GET") {
        const sessionId = url.searchParams.get("session_id");
        return await handleGetConstants(env, sessionId, corsHeaders);
      }

      // Static pages — serve from site bucket (wrangler handles this via [site])
      // For non-API routes, return a simple fallback or let wrangler serve static
      return new Response("Layer 0 Engine — API at /api/sessions", {
        headers: { "Content-Type": "text/plain", ...corsHeaders },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return Response.json({ error: message }, { status: 500, headers: corsHeaders });
    }
  },
};

async function handleCreateSession(
  request: Request,
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  const body = (await request.json()) as {
    domainName?: string;
    domainDescription?: string;
    sigmaTolerance?: number;
    maxGates?: number;
  };

  if (!body.domainName || !body.domainDescription) {
    return Response.json(
      { error: "domainName and domainDescription are required" },
      { status: 400, headers },
    );
  }

  // Create session
  const session = await createSession(env, body.domainName, body.domainDescription);

  // Run extraction (this is the long-running part)
  const result = await runExtraction(env, session.id, body.domainName, body.domainDescription, {
    sigmaTolerance: body.sigmaTolerance,
    maxGates: body.maxGates,
  });

  return Response.json(result, { headers });
}

async function handleListSessions(
  env: Env,
  headers: Record<string, string>,
): Promise<Response> {
  const sessions = await listSessions(env);
  return Response.json({ sessions }, { headers });
}

async function handleGetSession(
  env: Env,
  sessionId: string,
  headers: Record<string, string>,
): Promise<Response> {
  const gates = await getGateResults(env, sessionId);
  const constants = await getLockedConstants(env, sessionId);

  return Response.json({ gates, constants }, { headers });
}

async function handleGetSessionGates(
  env: Env,
  sessionId: string,
  headers: Record<string, string>,
): Promise<Response> {
  const gates = await getGateResults(env, sessionId);
  return Response.json({ gates }, { headers });
}

async function handleGetBackProp(
  env: Env,
  sessionId: string,
  headers: Record<string, string>,
): Promise<Response> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM back_propagation_log WHERE session_id = ? ORDER BY created_at",
  ).bind(sessionId).all();
  return Response.json({ backprop: results }, { headers });
}

async function handleGetVariables(
  env: Env,
  sessionId: string,
  headers: Record<string, string>,
): Promise<Response> {
  const { results } = await env.DB.prepare(
    "SELECT * FROM isolated_variables WHERE session_id = ? ORDER BY created_at",
  ).bind(sessionId).all();
  return Response.json({ variables: results }, { headers });
}

async function handleGetConstants(
  env: Env,
  sessionId: string | null,
  headers: Record<string, string>,
): Promise<Response> {
  if (sessionId) {
    const constants = await getLockedConstants(env, sessionId);
    return Response.json({ constants }, { headers });
  }
  // All constants across all sessions
  const { results } = await env.DB.prepare(
    "SELECT * FROM locked_constants ORDER BY created_at DESC",
  ).all();
  return Response.json({ constants: results, total: results.length }, { headers });
}
