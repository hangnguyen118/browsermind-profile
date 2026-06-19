// Shared TypeScript types across the app.

/** Domains a knowledge chunk can belong to (used for RAG filtering). */
export type Category =
  | 'personal'
  | 'experience'
  | 'skill'
  | 'project'
  | 'education'
  | 'certificate'
  | 'hobby'
  | 'contact';

/**
 * A single retrievable unit for the RAG pipeline. Keep `content` <= ~200 tokens
 * for accurate embeddings. Bilingual content lives side by side so we can embed
 * and surface the right language (SPEC §5.5).
 */
export interface KnowledgeChunk {
  /** Unique id, e.g. "exp-001", "skill-react". */
  id: string;
  category: Category;
  /** English content (default for embedding/retrieval). */
  content: string;
  /** Vietnamese content (optional — falls back to `content`). */
  contentVi?: string;
  tags: string[];
  /** Embedding vector, populated lazily at runtime. */
  embedding?: number[];
}

/** Supported UI / chat languages. */
export type Lang = 'vi' | 'en';

/** A retrieved chunk paired with its similarity score. */
export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  score: number;
}

/** Roles in the chat transcript. */
export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** True while the assistant message is still being streamed/generated. */
  pending?: boolean;
  createdAt: number;
}

/** Lifecycle of the in-browser model. */
export type ModelStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'generating'
  | 'error';

/** Progress event surfaced to the UI while downloading model shards. */
export interface ModelProgress {
  /** What is currently loading (file name or stage label). */
  label: string;
  /** 0–100, or null when indeterminate. */
  percent: number | null;
}

/** Steps in the conversational contact-collection flow (SPEC §7.2). */
export type ContactFlowStep =
  | null
  | 'awaiting_confirm'
  | 'awaiting_name'
  | 'awaiting_email'
  | 'awaiting_message'
  | 'sending'
  | 'done';

export interface ContactDraft {
  name?: string;
  email?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// Section content models (consumed by the static UI sections).
// ---------------------------------------------------------------------------

export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'mail';
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  /** i18n key suffix, e.g. "frontend" -> sections.skills.groups.frontend */
  categoryKey: string;
  skills: Skill[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  /** i18n key for the role, e.g. "exp1.role". */
  roleKey: string;
  period: string;
  /** i18n key for the description. */
  descKey: string;
  tech: string[];
}

export interface ProjectItem {
  id: string;
  /** i18n key for the project name. */
  nameKey: string;
  /** i18n key for the short description. */
  descKey: string;
  tech: string[];
  github?: string;
  demo?: string;
  /** project category key for optional filtering. */
  categoryKey: string;
}

export interface EducationItem {
  id: string;
  school: string;
  /** i18n key for the degree. */
  degreeKey: string;
  period: string;
  gpa?: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  verifyUrl?: string;
}
