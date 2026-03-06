import { neon } from '@neondatabase/serverless';
import type {
  CheckTask, GateResult, CheckResult,
  FetchRequest, FetchResponse,
  ParseRequest, ParseResponse,
  ProxyRequest, ProxyResponse,
} from '@field-monitor/shared';

export interface Env {
  DATABASE_URL: string;
  ENVIRONMENT: string;
  FETCHER: Fetcher;
  PARSER: Fetcher;
  PROXY: Fetcher;
}

// ═══════════════════════════════════════════════════════════════
// Entry Points
// ═══════════════════════════════════════════════════════════════

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'POST' && new URL(request.url).pathname === '/check') {
      const task = await request.json() as CheckTask;
      const result = await runSevenGateFunnel(task, env);
      return jsonResponse(result, 200);
    }

    if (request.method === 'POST' && new URL(request.url).pathname === '/batch') {
      const tasks = await request.json() as CheckTask[];
      const results = await Promise.all(tasks.map(t => runSevenGateFunnel(t, env)));
      return jsonResponse(results, 200);
    }

    return jsonResponse({ status: 'ok', worker: 'field-monitor-orchestrator' }, 200);
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    const sql = neon(env.DATABASE_URL);
    const tasks = await queryDueTasks(sql);
    for (const task of tasks) {
      await runSevenGateFunnel(task, env);
    }
  },
};

// ═══════════════════════════════════════════════════════════════
// Seven-Gate Funnel
// ═══════════════════════════════════════════════════════════════
//
// Gate 1: URL Validation    — Is the URL active in registry?
// Gate 2: Rate Check        — Does the domain have rate budget?
// Gate 3: Fetch             — Retrieve the page content
// Gate 4: Parse             — Extract the field value
// Gate 5: Change Detection  — Did the value change?
// Gate 6: State Update      — Write new state to field_state
// Gate 7: Log               — Append to check_log
//
// Each gate must pass before the next executes.
// If any gate fails, the funnel stops and records gate_reached.

async function runSevenGateFunnel(task: CheckTask, env: Env): Promise<CheckResult> {
  const start = Date.now();
  const gates: GateResult[] = [];
  const sql = neon(env.DATABASE_URL);

  let fetchedBody: string | null = null;
  let extractedValue: string | null = null;
  let oldValue: string | null = null;
  let changed = false;

  // ─── Gate 1: URL Validation ─────────────────────────────────
  const g1 = await timed('URL Validation', async () => {
    const rows = await sql`
      SELECT url_id, is_active FROM field_monitor.url_registry
      WHERE url_id = ${task.url_id}::uuid AND is_active = true
    `;
    if (rows.length === 0) throw new Error(`URL ${task.url_id} not found or inactive`);
  });
  gates.push(g1);
  if (!g1.passed) return buildResult(task, 1, gates, oldValue, extractedValue, changed, start);

  // ─── Gate 2: Rate Check ─────────────────────────────────────
  const g2 = await timed('Rate Check', async () => {
    const proxyReq: ProxyRequest = { domain: task.domain, url: `https://${task.domain}${task.path}` };
    const resp = await callService<ProxyResponse>(env.PROXY, '/proxy', proxyReq);
    if (!resp.allowed) throw new Error(resp.error ?? `Rate limit exceeded for ${task.domain}`);
  });
  gates.push(g2);
  if (!g2.passed) return buildResult(task, 2, gates, oldValue, extractedValue, changed, start);

  // ─── Gate 3: Fetch ──────────────────────────────────────────
  const g3 = await timed('Fetch', async () => {
    const fetchReq: FetchRequest = {
      url: `https://${task.domain}${task.path}`,
      fetch_mode: 'plain',
      timeout_ms: 10_000,
      byte_limit: 1_048_576,
    };
    const resp = await callService<FetchResponse>(env.FETCHER, '/fetch', fetchReq);
    if (!resp.success) throw new Error(resp.error ?? 'Fetch failed');
    fetchedBody = resp.body;
  });
  gates.push(g3);
  if (!g3.passed) return buildResult(task, 3, gates, oldValue, extractedValue, changed, start);

  // ─── Gate 4: Parse ──────────────────────────────────────────
  const g4 = await timed('Parse', async () => {
    if (!fetchedBody) throw new Error('No body to parse');
    const parseReq: ParseRequest = {
      domain: task.domain,
      field_name: task.field_name,
      raw_html: fetchedBody,
    };
    const resp = await callService<ParseResponse>(env.PARSER, '/parse', parseReq);
    if (resp.result_type === 'EXTRACTION_FAILED') throw new Error(resp.error ?? 'Extraction failed');
    extractedValue = resp.extracted_value;
  });
  gates.push(g4);
  if (!g4.passed) return buildResult(task, 4, gates, oldValue, extractedValue, changed, start);

  // ─── Gate 5: Change Detection ───────────────────────────────
  const g5 = await timed('Change Detection', async () => {
    const rows = await sql`
      SELECT current_value FROM field_monitor.field_state
      WHERE field_id = ${task.field_id}::uuid
    `;
    oldValue = rows.length > 0 ? (rows[0].current_value as string | null) : null;
    changed = extractedValue !== oldValue;
  });
  gates.push(g5);
  if (!g5.passed) return buildResult(task, 5, gates, oldValue, extractedValue, changed, start);

  // ─── Gate 6: State Update ───────────────────────────────────
  const g6 = await timed('State Update', async () => {
    await sql`
      UPDATE field_monitor.field_state
      SET
        previous_value = current_value,
        current_value = ${extractedValue},
        last_checked_at = now(),
        last_changed_at = CASE WHEN ${changed} THEN now() ELSE last_changed_at END,
        status = 'ACTIVE',
        updated_at = now()
      WHERE field_id = ${task.field_id}::uuid
    `;
  });
  gates.push(g6);
  if (!g6.passed) return buildResult(task, 6, gates, oldValue, extractedValue, changed, start);

  // ─── Gate 7: Log ────────────────────────────────────────────
  const g7 = await timed('Log', async () => {
    const fetchMs = gates.find(g => g.name === 'Fetch')?.duration_ms ?? 0;
    const parseMs = gates.find(g => g.name === 'Parse')?.duration_ms ?? 0;
    await sql`
      INSERT INTO field_monitor.check_log (url_id, field_name, old_value, new_value, changed, fetch_duration_ms, parse_duration_ms)
      VALUES (${task.url_id}::uuid, ${task.field_name}, ${oldValue}, ${extractedValue}, ${changed}, ${fetchMs}, ${parseMs})
    `;
  });
  gates.push(g7);

  return buildResult(task, 7, gates, oldValue, extractedValue, changed, start);
}

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

async function callService<T>(binding: Fetcher, path: string, body: unknown): Promise<T> {
  const resp = await binding.fetch(new Request(`https://internal${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
  return resp.json() as Promise<T>;
}

async function timed(name: string, fn: () => Promise<void>): Promise<GateResult> {
  const start = Date.now();
  try {
    await fn();
    return { gate: 0, name, passed: true, error: null, duration_ms: Date.now() - start };
  } catch (err) {
    return {
      gate: 0,
      name,
      passed: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      duration_ms: Date.now() - start,
    };
  }
}

function buildResult(
  task: CheckTask,
  gateReached: number,
  gates: GateResult[],
  oldValue: string | null,
  newValue: string | null,
  changed: boolean,
  startMs: number
): CheckResult {
  // Number the gates sequentially
  gates.forEach((g, i) => { g.gate = i + 1; });
  return {
    task,
    gate_reached: gateReached,
    gates,
    old_value: oldValue,
    new_value: newValue,
    changed,
    total_duration_ms: Date.now() - startMs,
    error: gates.find(g => !g.passed)?.error ?? null,
  };
}

async function queryDueTasks(sql: ReturnType<typeof neon>): Promise<CheckTask[]> {
  const rows = await sql`
    SELECT
      ur.url_id, ur.domain, ur.path,
      fs.field_name, fs.field_id
    FROM field_monitor.url_registry ur
    JOIN field_monitor.field_state fs ON fs.url_id = ur.url_id
    WHERE ur.is_active = true
      AND fs.status IN ('ACTIVE', 'STALE')
      AND (
        fs.last_checked_at IS NULL
        OR fs.last_checked_at < now() - (ur.check_interval_minutes || ' minutes')::interval
      )
    ORDER BY fs.last_checked_at ASC NULLS FIRST
    LIMIT 50
  `;
  return rows.map(r => ({
    url_id: r.url_id as string,
    domain: r.domain as string,
    path: r.path as string,
    field_name: r.field_name as string,
    field_id: r.field_id as string,
  }));
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
