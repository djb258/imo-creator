// ═══════════════════════════════════════════════════════════════
// Relationships Sub-hub — CANONICAL table operations (graph)
// ═══════════════════════════════════════════════════════════════

import type { Relationship } from '../types';

export async function insertRelationship(
  db: D1Database,
  rel: Omit<Relationship, 'created_at'>
): Promise<{ action: 'inserted' | 'skipped' }> {
  try {
    await db.prepare(
      `INSERT INTO relationships (relationship_id, source_type, source_id, target_type, target_id, relation, weight)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      rel.relationship_id, rel.source_type, rel.source_id,
      rel.target_type, rel.target_id, rel.relation, rel.weight
    ).run();
    return { action: 'inserted' };
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      return { action: 'skipped' };
    }
    throw e;
  }
}

export async function getRelatedEntities(
  db: D1Database,
  sourceType: string,
  sourceId: string
): Promise<Relationship[]> {
  const result = await db.prepare(
    `SELECT * FROM relationships WHERE source_type = ? AND source_id = ?
     UNION ALL
     SELECT * FROM relationships WHERE target_type = ? AND target_id = ?`
  ).bind(sourceType, sourceId, sourceType, sourceId).all<Relationship>();
  return result.results;
}
