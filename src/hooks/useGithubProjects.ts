import { useCallback, useEffect, useState } from 'react';
import type { DisplayProject } from '../types';
import {
  fetchGithubProjects,
  getProjectsSyncedAt,
} from '../lib/githubProjects';

type Status = 'loading' | 'ready' | 'error';

/**
 * Loads the user's portfolio repos from GitHub. This is the only source of
 * projects, so callers should handle the loading / error / empty states.
 * `syncedAt` is the timestamp (ms) of the last successful GitHub sync.
 */
export function useGithubProjects(): {
  status: Status;
  projects: DisplayProject[];
  syncedAt: number | null;
  reload: () => void;
} {
  const [status, setStatus] = useState<Status>('loading');
  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [syncedAt, setSyncedAt] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    // First mount uses the cache (fast); a manual reload (nonce > 0) forces a
    // fresh fetch so GitHub edits — new topics, categories — show up at once.
    fetchGithubProjects({ force: nonce > 0 })
      .then((data) => {
        if (cancelled) return;
        setProjects(data);
        setSyncedAt(getProjectsSyncedAt());
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { status, projects, syncedAt, reload };
}
