import { useCallback, useRef, useState } from 'react';
import type { ModelProgress, ModelStatus } from '../types';
import { loadEngine } from '../ai/engine';
import { buildIndex } from '../ai/rag';

/**
 * Manages the in-browser AI lifecycle (SPEC §3 useAI): triggers model + RAG
 * index loading on demand, exposes status and download progress for the UI.
 */
export function useAI() {
  const [status, setStatus] = useState<ModelStatus>('idle');
  const [progress, setProgress] = useState<ModelProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const load = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus('loading');
    setError(null);
    try {
      // Load the generation model (progress drives the loader bar) and build
      // the embedding index in parallel.
      await Promise.all([
        loadEngine((p) => setProgress(p)),
        buildIndex(),
      ]);
      setStatus('ready');
    } catch (err) {
      startedRef.current = false;
      setStatus('error');
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  const retry = useCallback(() => {
    startedRef.current = false;
    setStatus('idle');
    setError(null);
    setProgress(null);
    void load();
  }, [load]);

  return { status, progress, error, load, retry, setStatus };
}
