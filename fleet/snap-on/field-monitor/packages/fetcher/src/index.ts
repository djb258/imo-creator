import type { FetchRequest, FetchResponse } from '@field-monitor/shared';

export interface Env {
  ENVIRONMENT: string;
  DEFAULT_TIMEOUT_MS: string;
  DEFAULT_BYTE_LIMIT: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      const body = await request.json() as FetchRequest;
      const result = await executeFetch(body, env);
      return jsonResponse(result, result.success ? 200 : 502);
    } catch (err) {
      return jsonResponse({
        success: false,
        status_code: null,
        body: null,
        content_type: null,
        fetch_duration_ms: 0,
        byte_count: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      } satisfies FetchResponse, 500);
    }
  },
};

async function executeFetch(req: FetchRequest, env: Env): Promise<FetchResponse> {
  const timeoutMs = req.timeout_ms || parseInt(env.DEFAULT_TIMEOUT_MS, 10) || 10_000;
  const byteLimit = req.byte_limit || parseInt(env.DEFAULT_BYTE_LIMIT, 10) || 1_048_576;
  const start = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchOptions: RequestInit = {
      signal: controller.signal,
      headers: { 'Accept': 'text/html,application/xhtml+xml,*/*', 'Accept-Charset': 'utf-8' },
      redirect: 'follow',
    };

    // proxied mode uses cf object for Cloudflare proxy features
    if (req.fetch_mode === 'proxied') {
      (fetchOptions as Record<string, unknown>).cf = { cacheTtl: 0, cacheEverything: false };
    }

    const response = await fetch(req.url, fetchOptions);
    const contentType = response.headers.get('content-type');

    // Read body with byte limit enforcement
    const rawBuffer = await readWithByteLimit(response, byteLimit);
    const body = transcodeToUtf8(rawBuffer, contentType);
    const duration = Date.now() - start;

    return {
      success: true,
      status_code: response.status,
      body,
      content_type: contentType,
      fetch_duration_ms: duration,
      byte_count: rawBuffer.byteLength,
      error: null,
    };
  } catch (err) {
    const duration = Date.now() - start;
    const isTimeout = err instanceof DOMException && err.name === 'AbortError';

    return {
      success: false,
      status_code: null,
      body: null,
      content_type: null,
      fetch_duration_ms: duration,
      byte_count: 0,
      error: isTimeout ? `Timeout after ${timeoutMs}ms` : (err instanceof Error ? err.message : 'Fetch failed'),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readWithByteLimit(response: Response, byteLimit: number): Promise<ArrayBuffer> {
  const reader = response.body?.getReader();
  if (!reader) return new ArrayBuffer(0);

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > byteLimit) {
      // Trim last chunk to fit within limit
      const overshoot = totalBytes - byteLimit;
      const trimmed = value.slice(0, value.byteLength - overshoot);
      chunks.push(trimmed);
      reader.cancel();
      break;
    }
    chunks.push(value);
  }

  // Concatenate chunks
  const result = new Uint8Array(Math.min(totalBytes, byteLimit));
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return result.buffer;
}

function transcodeToUtf8(buffer: ArrayBuffer, contentType: string | null): string {
  // Detect charset from content-type header
  const charsetMatch = contentType?.match(/charset=([^\s;]+)/i);
  const charset = charsetMatch?.[1]?.toLowerCase() ?? 'utf-8';

  try {
    const decoder = new TextDecoder(charset, { fatal: false });
    return decoder.decode(buffer);
  } catch {
    // Fallback to UTF-8 if charset is unsupported
    return new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  }
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
