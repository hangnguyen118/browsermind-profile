/**
 * Auto-sync the Projects section from GitHub at runtime: fetch the user's public
 * repos, keep only those tagged with the `portfolio` topic, and map them to the
 * display shape the UI uses. Results are cached in localStorage so repeat visits
 * (and re-renders) don't re-hit the API.
 *
 * To make a repo appear here, add the topic `portfolio` to it on GitHub
 * (Repo → About ⚙ → Topics). Add `ai` / `web` / `game` to control its filter
 * category; any other topics become tech tags.
 */
import type { DisplayProject } from '../types';

/** GitHub account to pull repos from (matches the profile's GitHub link). */
export const GITHUB_USER = 'hangnguyen118';
/** Only repos carrying this topic are shown. */
export const PORTFOLIO_TOPIC = 'portfolio';

const CACHE_KEY = 'gh-projects-v1';
const CACHE_TTL = 10 * 60 * 1000; // 10 mins
/** Topics that map to an existing UI filter category. */
const KNOWN_CATEGORIES = ['ai', 'web', 'game'];

/** The subset of the GitHub repo payload we rely on. */
interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  language: string | null;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  pushed_at: string;
}

/** "fruit-catcher_cc2d" -> "Fruit Catcher Cc2d". */
function prettify(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function toDisplay(repo: GithubRepo): DisplayProject {
  const topics = repo.topics ?? [];
  const categoryKey = topics.find((tp) => KNOWN_CATEGORIES.includes(tp)) ?? 'web';
  const tech = topics
    .filter((tp) => tp !== PORTFOLIO_TOPIC && tp !== categoryKey)
    .map(prettify);
  if (tech.length === 0 && repo.language) tech.push(repo.language);

  return {
    id: `gh-${repo.id}`,
    name: prettify(repo.name),
    description: repo.description ?? '',
    tech,
    github: repo.html_url,
    demo: repo.homepage ? repo.homepage : undefined,
    categoryKey,
  };
}

function readCache(): DisplayProject[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw) as { ts: number; data: DisplayProject[] };
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: DisplayProject[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // Ignore quota / private-mode errors — caching is best-effort.
  }
}

/**
 * Timestamp (ms) of the most recent successful GitHub sync, or null if never
 * synced. Read without the TTL check so the UI can show "last synced" even once
 * the cache is stale (a fresh fetch rewrites `ts`, so this stays accurate).
 */
export function getProjectsSyncedAt(): number | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts } = JSON.parse(raw) as { ts: number };
    return typeof ts === 'number' ? ts : null;
  } catch {
    return null;
  }
}

/** Shared in-flight request so concurrent callers don't double-fetch. */
let inflight: Promise<DisplayProject[]> | null = null;

/**
 * Fetch portfolio repos (cached + de-duplicated). Sorted by stars, then most
 * recently pushed. Throws on network / API errors so callers can show a state.
 *
 * Pass `{ force: true }` to bypass the localStorage cache and re-hit the API —
 * used by the "refresh" action so newly added GitHub topics show up immediately
 * instead of waiting out the 10-minute TTL.
 */
export function fetchGithubProjects(
  opts: { force?: boolean } = {},
): Promise<DisplayProject[]> {
  if (!opts.force) {
    const cached = readCache();
    if (cached) return Promise.resolve(cached);
  }
  if (inflight) return inflight;

  inflight = loadFromApi().finally(() => {
    inflight = null;
  });
  return inflight;
}

async function loadFromApi(): Promise<DisplayProject[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);

  const repos = (await res.json()) as GithubRepo[];
  const projects = repos
    .filter(
      (r) =>
        !r.fork && !r.archived && (r.topics ?? []).includes(PORTFOLIO_TOPIC),
    )
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        b.pushed_at.localeCompare(a.pushed_at),
    )
    .map(toDisplay);

  writeCache(projects);
  return projects;
}
