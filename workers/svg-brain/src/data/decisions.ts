// ═══════════════════════════════════════════════════════════════
// Decisions Sub-hub — CANONICAL table operations
// ═══════════════════════════════════════════════════════════════

import type { Decision } from '../types';

export async function upsertDecision(
  db: D1Database,
  decision: Omit<Decision, 'created_at' | 'updated_at'>
): Promise<{ action: 'inserted' | 'updated' }> {
  const existing = await db.prepare(
    'SELECT decision_id FROM decisions WHERE adr_number = ?'
  ).bind(decision.adr_number).first<{ decision_id: string }>();

  if (existing) {
    await db.prepare(
      `UPDATE decisions SET title = ?, status = ?, domain = ?, summary = ?,
       source_document_id = ?, decided_at = ?, updated_at = datetime('now')
       WHERE decision_id = ?`
    ).bind(
      decision.title, decision.status, decision.domain, decision.summary,
      decision.source_document_id, decision.decided_at, existing.decision_id
    ).run();
    return { action: 'updated' };
  }

  await db.prepare(
    `INSERT INTO decisions (decision_id, adr_number, title, status, domain, summary, source_document_id, decided_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    decision.decision_id, decision.adr_number, decision.title, decision.status,
    decision.domain, decision.summary, decision.source_document_id, decision.decided_at
  ).run();

  return { action: 'inserted' };
}

export async function getDecision(db: D1Database, adrNumber: string): Promise<Decision | null> {
  return db.prepare('SELECT * FROM decisions WHERE adr_number = ?')
    .bind(adrNumber).first<Decision>();
}

export async function listDecisions(db: D1Database, domain?: string): Promise<Decision[]> {
  if (domain) {
    const result = await db.prepare(
      'SELECT * FROM decisions WHERE domain = ? ORDER BY decided_at DESC'
    ).bind(domain).all<Decision>();
    return result.results;
  }
  const result = await db.prepare('SELECT * FROM decisions ORDER BY decided_at DESC').all<Decision>();
  return result.results;
}
