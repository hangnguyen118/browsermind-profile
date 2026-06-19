import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FileText, Newspaper, Globe, X } from 'lucide-react';
import type { SidePanelContent } from '../../types';
import { onOpenSidePanel } from '../../lib/sidePanelBus';

/** Icon shown in the header for each content kind. */
const KIND_ICON = {
  pdf: FileText,
  blog: Newspaper,
  embed: Globe,
} as const;

/**
 * Global left-docked panel that slides in to show rich content (PDF, blog
 * article, embedded page). Opened from anywhere via `openSidePanel(...)`.
 */
export function SidePanel() {
  const { t } = useTranslation('common');
  const [content, setContent] = useState<SidePanelContent | null>(null);

  // Open from any component.
  useEffect(() => onOpenSidePanel((c) => setContent(c)), []);

  // Close on Escape.
  useEffect(() => {
    if (!content) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContent(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [content]);

  const close = () => setContent(null);
  const Icon = content ? KIND_ICON[content.kind] : FileText;

  return (
    <AnimatePresence>
      {content && (
        <>
          {/* Dimmed backdrop — click to close. */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm"
          />

          {/* Panel docked to the LEFT edge, full height. */}
          <motion.aside
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={content.title}
            className="fixed inset-y-0 left-0 z-50 flex w-full flex-col bg-white shadow-2xl sm:w-[34rem] sm:border-r sm:border-gray-200 dark:bg-gray-950 sm:dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-3 text-white">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-bold">{content.title}</p>
                  {content.subtitle && (
                    <p className="truncate text-[11px] text-white/80">
                      {content.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t('panel.closeAria')}
                className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="scrollbar-thin flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/40">
              <PanelBody content={content} />
            </div>

            {/* Footer action for external content */}
            {content.kind !== 'blog' && (
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 border-t border-gray-200 bg-white py-3 text-sm font-semibold text-accent-600 hover:bg-accent-50 dark:border-gray-800 dark:bg-gray-950 dark:text-accent-300 dark:hover:bg-gray-900"
              >
                <ExternalLink size={15} />
                {t('panel.openInNewTab')}
              </a>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Renders the body for each content kind. */
function PanelBody({ content }: { content: SidePanelContent }) {
  const { t } = useTranslation('common');

  if (content.kind === 'blog') {
    return (
      <article
        className="panel-prose mx-auto max-w-prose px-5 py-6"
        // Content is authored in our own data files, so it is trusted.
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

  // pdf + embed both render in an iframe; #view hides the PDF toolbar chrome.
  const src = content.kind === 'pdf' ? `${content.url}#view=FitH` : content.url;
  return (
    <iframe
      src={src}
      title={content.title}
      className="h-full w-full border-0 bg-white"
      // Lazy so the iframe network request only fires when the panel opens.
      loading="lazy"
    >
      {t('panel.loading')}
    </iframe>
  );
}
