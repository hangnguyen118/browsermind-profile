import type { KnowledgeChunk } from '../types';
import { personalChunks } from './personal';
import { experienceChunks } from './experience';
import { skillsChunks } from './skills';
import { educationChunks } from './education';
import { certificatesChunks } from './certificates';
import { hobbiesChunks } from './hobbies';
import { contactChunks } from './contact';

/**
 * Static knowledge chunks for the RAG pipeline (SPEC §6.4). Project chunks are
 * intentionally NOT here: they are sourced live from GitHub at index time
 * (see ai/rag.ts → buildIndex) so the chatbot stays in sync with the Projects
 * section instead of a hard-coded list.
 */
export const ALL_KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  ...personalChunks,
  ...experienceChunks,
  ...skillsChunks,
  ...educationChunks,
  ...certificatesChunks,
  ...hobbiesChunks,
  ...contactChunks,
];
