import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModelLoader } from './ModelLoader';
import { useAI } from '../../hooks/useAI';
import { useChat } from '../../hooks/useChat';
import { onOpenChat } from '../../lib/chatBus';

/** AI chat: floating toggle button ↔ right-side sidebar panel (SPEC §5.1). */
export function ChatbotWidget() {
  const { t } = useTranslation('chatbot');
  const [open, setOpen] = useState(false);
  const { status, progress, error, load, retry } = useAI();
  const { messages, isResponding, send, seedWelcome } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Open from anywhere (Hero CTA, etc.).
  useEffect(() => onOpenChat(() => setOpen(true)), []);

  // Kick off model load the first time the panel opens.
  useEffect(() => {
    if (open && status === 'idle') void load();
  }, [open, status, load]);

  // Seed the welcome message once the model is ready.
  useEffect(() => {
    if (status === 'ready') seedWelcome();
  }, [status, seedWelcome]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const ready = status === 'ready';
  const showSuggestions = ready && messages.length <= 1 && !isResponding;
  const suggestions = t('suggestions.items', {
    returnObjects: true,
  }) as string[];

  return (
    <>
      {/* Floating toggle button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t('openAria')}
            className="fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent-500 text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600"
          >
            <MessageCircle size={26} />
            <span className="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              <Sparkles size={11} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat sidebar (docked to the right edge, full height) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label={t('title')}
            className="fixed inset-0 z-50 flex flex-col bg-white shadow-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[25rem] sm:border-l sm:border-gray-200 dark:bg-gray-950 sm:dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                  <Sparkles size={18} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold">{t('title')}</p>
                  <p className="text-[11px] text-white/80">{t('subtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('closeAria')}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            {!ready ? (
              <ModelLoader
                status={status}
                progress={progress}
                error={error}
                onRetry={retry}
              />
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"
                >
                  {messages.map((m) => (
                    <ChatMessage key={m.id} message={m} />
                  ))}

                  {showSuggestions && (
                    <div className="pt-1">
                      <p className="mb-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                        {t('suggestions.label')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => send(s)}
                            className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-medium text-accent-700 transition-colors hover:bg-accent-100 dark:border-accent-800 dark:bg-accent-900/30 dark:text-accent-200"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <ChatInput onSend={send} disabled={isResponding} />
                <p className="px-4 pb-2 text-center text-[10px] text-gray-400 dark:text-gray-600">
                  {t('disclaimer')}
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
