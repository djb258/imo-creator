// ═══════════════════════════════════════════════════════════════
// svg-brain — CF-Native Knowledge Layer
// ═══════════════════════════════════════════════════════════════
// BAR-147 | CC-02 (Hub) | Hono on CF Workers
// Routes: /health, /ingest, /query, /lookup, /documents, /decisions
// IMO: Ingress (validation) → Middle (logic) → Egress (response)
// ═══════════════════════════════════════════════════════════════

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import { ingestDocument } from './app/ingest';
import { hybridSearch } from './app/search';
import { lookupTerm, upsertGlossaryTerm } from './data/glossary';
import { listDocuments, getDocument } from './data/documents';
import { listDecisions, getDecision, upsertDecision } from './data/decisions';
import { insertRelationship, getRelatedEntities } from './data/relationships';
import { recordError } from './data/errors';

const app = new Hono<{ Bindings: Env }>();

// ── Middleware ────────────────────────────────────────────────
app.use('*', cors());

// API key auth — skip /health for uptime monitors
app.use('*', async (c, next) => {
  if (c.req.path === '/health') return next();

  const header = c.req.header('Authorization') ?? c.req.header('X-API-Key') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  if (!token || token !== c.env.SVG_BRAIN_API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return next();
});

// ── Health Check ─────────────────────────────────────────────
app.get('/health', async (c) => {
  try {
    const result = await c.env.D1_BRAIN.prepare('SELECT COUNT(*) as count FROM documents').first<{ count: number }>();
    return c.json({
      status: 'ok',
      documents: result?.count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return c.json({ status: 'error', message: e.message }, 500);
  }
});

// ── Ingest Document ──────────────────────────────────────────
// POST /ingest
// Body: { domain, source_path, title, content, doc_version? }
app.post('/ingest', async (c) => {
  try {
    const body = await c.req.json();
    const result = await ingestDocument(c.env, body);
    const status = result.action === 'skipped' ? 200 : 201;
    return c.json(result, status);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// ── Hybrid Search (Query) ────────────────────────────────────
// POST /query
// Body: { query, domain?, top_k? }
app.post('/query', async (c) => {
  try {
    const body = await c.req.json<{ query?: string; domain?: string; top_k?: number }>();

    if (!body.query || typeof body.query !== 'string') {
      return c.json({ error: 'query is required (string)' }, 400);
    }

    const topK = Math.min(body.top_k ?? 10, 50);
    const results = await hybridSearch(c.env, body.query, body.domain, topK);

    return c.json({
      query: body.query,
      domain: body.domain ?? 'all',
      results,
      count: results.length,
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// ── Glossary Lookup ──────────────────────────────────────────
// GET /lookup?term=CTB&domain=architecture
app.get('/lookup', async (c) => {
  const term = c.req.query('term');
  const domain = c.req.query('domain');

  if (!term) {
    return c.json({ error: 'term query parameter is required' }, 400);
  }

  const results = await lookupTerm(c.env.D1_BRAIN, term, domain || undefined);
  return c.json({ term, results, count: results.length });
});

// ── Glossary Upsert ──────────────────────────────────────────
// POST /glossary
// Body: { term, definition, domain, source_document_id? }
app.post('/glossary', async (c) => {
  try {
    const body = await c.req.json<{
      term?: string; definition?: string; domain?: string; source_document_id?: string;
    }>();

    if (!body.term || !body.definition || !body.domain) {
      return c.json({ error: 'term, definition, and domain are required' }, 400);
    }

    const result = await upsertGlossaryTerm(c.env.D1_BRAIN, {
      term_id: crypto.randomUUID(),
      term: body.term,
      definition: body.definition,
      domain: body.domain,
      source_document_id: body.source_document_id ?? null,
    });

    return c.json(result, result.action === 'inserted' ? 201 : 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// ── Documents List/Get ───────────────────────────────────────
app.get('/documents', async (c) => {
  const domain = c.req.query('domain');
  const docs = await listDocuments(c.env.D1_BRAIN, domain || undefined);
  return c.json({ documents: docs, count: docs.length });
});

app.get('/documents/:id', async (c) => {
  const doc = await getDocument(c.env.D1_BRAIN, c.req.param('id'));
  if (!doc) return c.json({ error: 'Document not found' }, 404);
  return c.json(doc);
});

// ── Decisions List/Get/Upsert ────────────────────────────────
app.get('/decisions', async (c) => {
  const domain = c.req.query('domain');
  const decisions = await listDecisions(c.env.D1_BRAIN, domain || undefined);
  return c.json({ decisions, count: decisions.length });
});

app.get('/decisions/:adr', async (c) => {
  const decision = await getDecision(c.env.D1_BRAIN, c.req.param('adr'));
  if (!decision) return c.json({ error: 'Decision not found' }, 404);
  return c.json(decision);
});

app.post('/decisions', async (c) => {
  try {
    const body = await c.req.json<{
      adr_number?: string; title?: string; status?: string;
      domain?: string; summary?: string; source_document_id?: string; decided_at?: string;
    }>();

    if (!body.adr_number || !body.title || !body.domain || !body.summary || !body.decided_at) {
      return c.json({ error: 'adr_number, title, domain, summary, and decided_at are required' }, 400);
    }

    const result = await upsertDecision(c.env.D1_BRAIN, {
      decision_id: crypto.randomUUID(),
      adr_number: body.adr_number,
      title: body.title,
      status: body.status ?? 'accepted',
      domain: body.domain,
      summary: body.summary,
      source_document_id: body.source_document_id ?? null,
      decided_at: body.decided_at,
    });

    return c.json(result, result.action === 'inserted' ? 201 : 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// ── Relationships ────────────────────────────────────────────
app.post('/relationships', async (c) => {
  try {
    const body = await c.req.json<{
      source_type?: string; source_id?: string;
      target_type?: string; target_id?: string;
      relation?: string; weight?: number;
    }>();

    if (!body.source_type || !body.source_id || !body.target_type || !body.target_id || !body.relation) {
      return c.json({ error: 'source_type, source_id, target_type, target_id, and relation are required' }, 400);
    }

    const result = await insertRelationship(c.env.D1_BRAIN, {
      relationship_id: crypto.randomUUID(),
      source_type: body.source_type,
      source_id: body.source_id,
      target_type: body.target_type,
      target_id: body.target_id,
      relation: body.relation,
      weight: body.weight ?? 1.0,
    });

    return c.json(result, result.action === 'inserted' ? 201 : 200);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

app.get('/relationships/:type/:id', async (c) => {
  const sourceType = c.req.param('type');
  const sourceId = c.req.param('id');
  const rels = await getRelatedEntities(c.env.D1_BRAIN, sourceType, sourceId);
  return c.json({ relationships: rels, count: rels.length });
});

// ── 404 Handler ──────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// ── Error Handler ────────────────────────────────────────────
app.onError((err, c) => {
  console.error('Unhandled error:', err.message);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
