import { useCallback, useEffect, useState } from 'react';
import type { DisplayProject } from '../types';
import { fetchGithubProjects } from '../lib/githubProjects';

type Status = 'loading' | 'ready' | 'error';

/**
 * Loads the user's portfolio repos from GitHub. This is the only source of
 * projects, so callers should handle the loading / error / empty states.
 */
export function useGithubProjects(): {
  status: Status;
  projects: DisplayProject[];
  reload: () => void;
} {
  const [status, setStatus] = useState<Status>('loading');
  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetchGithubProjects()
      .then((data) => {
        if (cancelled) return;
        setProjects(data);
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

  return { status, projects, reload };
}
