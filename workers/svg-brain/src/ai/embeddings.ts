// ═══════════════════════════════════════════════════════════════
// Embedding Pipeline — Workers AI + Vectorize
// ═══════════════════════════════════════════════════════════════
// IMO Layer: Middle (AI is a tool in the M layer, not spine)
// Model: @cf/baai/bge-large-en-v1.5 (1024 dims, free tier)
// Batch size: 10 chunks per embedding call
// ═══════════════════════════════════════════════════════════════

const EMBEDDING_MODEL = '@cf/baai/bge-large-en-v1.5';
const BATCH_SIZE = 10;

interface EmbeddingInput {
  chunk_id: string;
  content: string;
  document_id: string;
  domain: string;
}

export async function embedAndUpsert(
  ai: Ai,
  vectorize: VectorizeIndex,
  inputs: EmbeddingInput[]
): Promise<{ embedded: number; errors: string[] }> {
  let embedded = 0;
  const errors: string[] = [];

  for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
    const batch = inputs.slice(i, i + BATCH_SIZE);
    const texts = batch.map(b => b.content);

    try {
      const response = await ai.run(EMBEDDING_MODEL, { text: texts }) as { data: number[][] };

      if (!response.data || response.data.length !== batch.length) {
        errors.push(`Batch ${i}: embedding count mismatch (got ${response.data?.length}, expected ${batch.length})`);
        continue;
      }

      const vectors: VectorizeVector[] = batch.map((input, idx) => ({
        id: input.chunk_id,
        values: response.data[idx],
        metadata: {
          document_id: input.document_id,
          domain: input.domain,
        },
      }));

      await vectorize.upsert(vectors);
      embedded += batch.length;
    } catch (e: any) {
      errors.push(`Batch ${i}: ${e.message}`);
    }
  }

  return { embedded, errors };
}

export async function embedQuery(ai: Ai, query: string): Promise<number[]> {
  const response = await ai.run(EMBEDDING_MODEL, { text: [query] }) as { data: number[][] };
  return response.data[0];
}

export async function deleteVectors(
  vectorize: VectorizeIndex,
  chunkIds: string[]
): Promise<void> {
  if (chunkIds.length === 0) return;
  // Vectorize delete accepts arrays
  await vectorize.deleteByIds(chunkIds);
}
