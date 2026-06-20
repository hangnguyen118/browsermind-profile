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
  /** Timeline marker icon (defaults to "briefcase"). */
  icon?: 'briefcase' | 'graduation' | 'rocket';
  /** Optional company website, embedded in the left side panel on click. */
  websiteUrl?: string;
  /**
   * Optional Markdown write-up base name in /public/experience. The side panel
   * loads `./experience/{markdownDoc}.{lang}.md`. Takes priority over websiteUrl.
   */
  markdownDoc?: string;
}

/**
 * A project resolved to display strings, produced from a fetched GitHub repo
 * (see lib/githubProjects.ts).
 */
export interface DisplayProject {
  id: string;
  name: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  categoryKey: string;
  /**
   * Candidate thumbnail URL: a `preview.png` committed at the repo root. May
   * 404 (not every repo has one) — the card falls back to GitHub's OpenGraph
   * image, then to a gradient placeholder.
   */
  image?: string;
}

export interface EducationItem {
  id: string;
  school: string;
  /** i18n key for the degree. */
  degreeKey: string;
  period: string;
  gpa?: string;
  /** Optional academic transcript PDF, shown in the left side panel. */
  transcriptUrl?: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  verifyUrl?: string;
  /** Optional PDF of the certificate, shown in the left side panel. */
  pdfUrl?: string;
}

// ---------------------------------------------------------------------------
// Left side panel (opened from any component to display rich content).
// ---------------------------------------------------------------------------

/**
 * Content shown in the global left-docked {@link SidePanel}. Any component can
 * open it via `openSidePanel(...)` (see `lib/sidePanelBus.ts`).
 */
export type SidePanelContent =
  /** A PDF document rendered inline (certificates, CV, papers…). */
  | { kind: 'pdf'; title: string; subtitle?: string; url: string }
  /** A blog/article: trusted HTML rendered in a readable prose column. */
  | { kind: 'blog'; title: string; subtitle?: string; html: string }
  /** Any external page embedded via an iframe. */
  | { kind: 'embed'; title: string; subtitle?: string; url: string }
  /** A GitHub repo's README, fetched & rendered to HTML at open time. */
  | { kind: 'github'; title: string; subtitle?: string; repoUrl: string }
  /** A Markdown document (e.g. from /public), fetched & rendered at open time. */
  | { kind: 'markdown'; title: string; subtitle?: string; url: string };
