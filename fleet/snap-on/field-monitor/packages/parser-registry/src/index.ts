import type { ParseRequest, ParseResponse } from '@field-monitor/shared';

export interface Env {
  ENVIRONMENT: string;
  PARSER_KV: KVNamespace;
}

/**
 * Parser config stored in KV as JSON.
 *
 * KV key:   domain::field_name
 * KV value: JSON matching ParserConfig
 *
 * Example:
 * {
 *   "type": "regex",
 *   "pattern": "<title[^>]*>([^<]+)",
 *   "flags": "i",
 *   "group": 1,
 *   "transforms": [
 *     { "type": "replace", "pattern": " \\| LinkedIn$", "flags": "", "replacement": "" },
 *     { "type": "trim" }
 *   ]
 * }
 */
interface ParserConfig {
  type: 'regex';
  pattern: string;
  flags?: string;
  group?: number;
  transforms?: Transform[];
}

type Transform =
  | { type: 'trim' }
  | { type: 'replace'; pattern: string; flags?: string; replacement: string }
  | { type: 'lowercase' }
  | { type: 'uppercase' };

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      const body = await request.json() as ParseRequest;
      const result = await executeParse(body, env);
      return jsonResponse(result, 200);
    } catch (err) {
      return jsonResponse({
        success: false,
        extracted_value: null,
        confidence_score: 0,
        result_type: 'EXTRACTION_FAILED',
        parse_duration_ms: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      } satisfies ParseResponse, 500);
    }
  },
};

async function executeParse(req: ParseRequest, env: Env): Promise<ParseResponse> {
  const start = Date.now();

  // KV key format: domain::field_name
  const kvKey = `${req.domain}::${req.field_name}`;

  // Look up parser config from KV
  const raw = await env.PARSER_KV.get(kvKey);

  if (!raw) {
    return {
      success: false,
      extracted_value: null,
      confidence_score: 0,
      result_type: 'FIELD_ABSENT',
      parse_duration_ms: Date.now() - start,
      error: `No parser registered for key: ${kvKey}`,
    };
  }

  try {
    const config = JSON.parse(raw) as ParserConfig;

    if (config.type !== 'regex') {
      throw new Error(`Unsupported parser type: ${config.type}`);
    }

    // Apply regex extraction
    const regex = new RegExp(config.pattern, config.flags ?? '');
    const match = req.raw_html.match(regex);
    const group = config.group ?? 1;

    if (!match || match[group] === undefined) {
      return {
        success: true,
        extracted_value: null,
        confidence_score: 0,
        result_type: 'FIELD_ABSENT',
        parse_duration_ms: Date.now() - start,
        error: null,
      };
    }

    let value = match[group];

    // Apply transforms
    if (config.transforms) {
      for (const t of config.transforms) {
        switch (t.type) {
          case 'trim':
            value = value.trim();
            break;
          case 'replace':
            value = value.replace(new RegExp(t.pattern, t.flags ?? ''), t.replacement);
            break;
          case 'lowercase':
            value = value.toLowerCase();
            break;
          case 'uppercase':
            value = value.toUpperCase();
            break;
        }
      }
    }

    return {
      success: true,
      extracted_value: value,
      confidence_score: 1.0,
      result_type: 'EXTRACTED',
      parse_duration_ms: Date.now() - start,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      extracted_value: null,
      confidence_score: 0,
      result_type: 'EXTRACTION_FAILED',
      parse_duration_ms: Date.now() - start,
      error: err instanceof Error ? err.message : 'Parser execution failed',
    };
  }
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
