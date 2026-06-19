import { useTranslation } from 'react-i18next';
import { Loader2, AlertTriangle, RotateCw } from 'lucide-react';
import type { ModelProgress, ModelStatus } from '../../types';

interface ModelLoaderProps {
  status: ModelStatus;
  progress: ModelProgress | null;
  error: string | null;
  onRetry: () => void;
}

/** Download/progress UI shown the first time the model loads (SPEC §5.1). */
export function ModelLoader({
  status,
  progress,
  error,
  onRetry,
}: ModelLoaderProps) {
  const { t } = useTranslation('chatbot');

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertTriangle size={28} />
        </span>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('errors.load')}
        </p>
        {error && (
          <p className="max-w-xs text-xs text-gray-400 dark:text-gray-500">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600"
        >
          <RotateCw size={16} />
          {t('loader.preparing')}
        </button>
      </div>
    );
  }

  const pct = progress?.percent ?? null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <Loader2 className="animate-spin text-accent-500" size={40} />
      <div>
        <p className="font-semibold">{t('loader.title')}</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('loader.subtitle')}
        </p>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-accent-400 transition-all duration-300"
            style={{ width: pct != null ? `${pct}%` : '40%' }}
          />
        </div>
        <p className="mt-2 truncate text-xs text-gray-400 dark:text-gray-500">
          {progress
            ? t('loader.downloading', { file: progress.label })
            : t('loader.preparing')}
          {pct != null ? ` · ${pct}%` : ''}
        </p>
      </div>
    </div>
  );
}
