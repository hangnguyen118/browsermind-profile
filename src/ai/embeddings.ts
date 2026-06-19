import type { FeatureExtractionPipeline } from '@huggingface/transformers';

/**
 * Sentence embeddings via all-MiniLM-L6-v2 (SPEC §2/§5.3). Used to embed both
 * knowledge chunks and the user's query so we can rank by cosine similarity.
 * The library is dynamically imported to keep it out of the initial bundle.
 */

const EMBED_MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline } = await import('@huggingface/transformers');
      // Cast to a simpler signature to avoid TS2590 (overload union too complex).
      const createPipeline = pipeline as unknown as (
        task: string,
        model: string,
        options: Record<string, unknown>,
      ) => Promise<FeatureExtractionPipeline>;
      return createPipeline('feature-extraction', EMBED_MODEL_ID, {
        dtype: 'fp32',
      });
    })();
  }
  return extractorPromise;
}

/** Embed a single text into a normalized vector (mean pooled). */
export async function embed(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data as Float32Array | number[]);
}

/** Embed many texts, returning one vector per input (sequential to limit memory). */
export async function embedMany(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor();
  const vectors: number[][] = [];
  for (const text of texts) {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    vectors.push(Array.from(output.data as Float32Array | number[]));
  }
  return vectors;
}

/**
 * Cosine similarity. Vectors from `embed` are already L2-normalized, so this is
 * just a dot product — but we guard against non-normalized inputs anyway.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Preload the embedding model (optional warmup). */
export async function warmupEmbeddings(): Promise<void> {
  await getExtractor();
}
