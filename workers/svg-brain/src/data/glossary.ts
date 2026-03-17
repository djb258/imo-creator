// ═══════════════════════════════════════════════════════════════
// Glossary Sub-hub — CANONICAL table operations
// ═══════════════════════════════════════════════════════════════

import type { GlossaryTerm } from '../types';

export async function upsertGlossaryTerm(
  db: D1Database,
  term: Omit<GlossaryTerm, 'created_at' | 'updated_at'>
): Promise<{ action: 'inserted' | 'updated' }> {
  const existing = await db.prepare(
    'SELECT term_id FROM glossary WHERE term = ? AND domain = ?'
  ).bind(term.term, term.domain).first<{ term_id: string }>();

  if (existing) {
    await db.prepare(
      `UPDATE glossary SET definition = ?, source_document_id = ?, updated_at = datetime('now')
       WHERE term_id = ?`
    ).bind(term.definition, term.source_document_id, existing.term_id).run();
    return { action: 'updated' };
  }

  await db.prepare(
    `INSERT INTO glossary (term_id, term, definition, domain, source_document_id)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(term.term_id, term.term, term.definition, term.domain, term.source_document_id).run();

  return { action: 'inserted' };
}

export async function lookupTerm(
  db: D1Database,
  term: string,
  domain?: string
): Promise<GlossaryTerm[]> {
  if (domain) {
    const result = await db.prepare(
      'SELECT * FROM glossary WHERE term LIKE ? AND domain = ?'
    ).bind(`%${term}%`, domain).all<GlossaryTerm>();
    return result.results;
  }
  const result = await db.prepare(
    'SELECT * FROM glossary WHERE term LIKE ?'
  ).bind(`%${term}%`).all<GlossaryTerm>();
  return result.results;
}
