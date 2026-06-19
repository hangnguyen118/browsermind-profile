import type { KnowledgeChunk, Lang, RetrievedChunk } from '../types';
import { ALL_KNOWLEDGE_CHUNKS } from '../data';
import { PROFILE } from '../data/profile';
import { cosineSimilarity, embed, embedMany } from './embeddings';

/**
 * RAG pipeline (SPEC §5.3): embed the knowledge base once, retrieve the most
 * relevant chunks for a query by cosine similarity, then build an augmented
 * system prompt grounded only in that context.
 */

const TOP_K = 4;
const PROFILE_NAME = 'Nguyen Thi Dieu Hang';

// In-memory cache of chunk embeddings (built once per session).
let indexedChunks: KnowledgeChunk[] | null = null;
let indexPromise: Promise<KnowledgeChunk[]> | null = null;

/** Text used to embed a chunk: combine both languages so either query matches. */
function embedText(chunk: KnowledgeChunk): string {
  return chunk.contentVi
    ? `${chunk.content}\n${chunk.contentVi}`
    : chunk.content;
}

/** Build (and cache) embeddings for every knowledge chunk. */
export async function buildIndex(): Promise<KnowledgeChunk[]> {
  if (indexedChunks) return indexedChunks;
  if (indexPromise) return indexPromise;

  indexPromise = (async () => {
    const texts = ALL_KNOWLEDGE_CHUNKS.map(embedText);
    const vectors = await embedMany(texts);
    indexedChunks = ALL_KNOWLEDGE_CHUNKS.map((chunk, i) => ({
      ...chunk,
      embedding: vectors[i],
    }));
    return indexedChunks;
  })();

  return indexPromise;
}

/** Whether the embedding index has been built. */
export function isIndexReady(): boolean {
  return indexedChunks != null;
}

/** Retrieve the top-K most relevant chunks for a query. */
export async function retrieve(
  query: string,
  topK: number = TOP_K,
): Promise<RetrievedChunk[]> {
  const chunks = await buildIndex();
  const queryVec = await embed(query);

  const scored: RetrievedChunk[] = chunks.map((chunk) => ({
    chunk,
    score: chunk.embedding ? cosineSimilarity(queryVec, chunk.embedding) : 0,
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Lightweight language detection (SPEC §5.4). Vietnamese is detected via its
 * diacritics / đ; otherwise we assume English.
 */
export function detectLanguage(text: string): Lang {
  const viPattern =
    /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
  return viPattern.test(text) ? 'vi' : 'en';
}

/** Pick the chunk text in the requested language. */
function chunkInLang(chunk: KnowledgeChunk, lang: Lang): string {
  if (lang === 'vi' && chunk.contentVi) return chunk.contentVi;
  return chunk.content;
}

/** Build the grounded system prompt from retrieved context (SPEC §5.4). */
export function buildSystemPrompt(
  retrieved: RetrievedChunk[],
  lang: Lang,
): string {
  const context = retrieved
    .map((r) => `- ${chunkInLang(r.chunk, lang)}`)
    .join('\n');

  return [
    `You are an AI assistant representing ${PROFILE_NAME}. Reply concisely, friendly, and professionally.`,
    'Detect the user\'s language and respond in the SAME language (Vietnamese or English).',
    'Base your answers ONLY on the following context:',
    '',
    'CONTEXT:',
    context,
    '',
    `If the question is not covered by the context, say you don't have that information and suggest contacting directly via email ${PROFILE.email}.`,
    'Never fabricate information.',
  ].join('\n');
}

/** Convenience: run retrieval + prompt building in one call. */
export async function buildRagContext(query: string): Promise<{
  lang: Lang;
  retrieved: RetrievedChunk[];
  systemPrompt: string;
}> {
  const lang = detectLanguage(query);
  const retrieved = await retrieve(query);
  const systemPrompt = buildSystemPrompt(retrieved, lang);
  return { lang, retrieved, systemPrompt };
}
