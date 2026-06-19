import type { KnowledgeChunk } from '../types';
import { personalChunks } from './personal';
import { experienceChunks } from './experience';
import { skillsChunks } from './skills';
import { projectsChunks } from './projects';
import { educationChunks } from './education';
import { certificatesChunks } from './certificates';
import { hobbiesChunks } from './hobbies';
import { contactChunks } from './contact';

/** Every knowledge chunk used by the RAG pipeline (SPEC §6.4). */
export const ALL_KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  ...personalChunks,
  ...experienceChunks,
  ...skillsChunks,
  ...projectsChunks,
  ...educationChunks,
  ...certificatesChunks,
  ...hobbiesChunks,
  ...contactChunks,
];
