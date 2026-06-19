import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  ChatMessage,
  ContactDraft,
  ContactFlowStep,
  Lang,
} from '../types';
import { generate } from '../ai/engine';
import { buildRagContext, detectLanguage } from '../ai/rag';
import { isEmailConfigured, isValidEmail, sendContactEmail } from '../lib/email';
import { PROFILE } from '../data/profile';

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function msg(role: ChatMessage['role'], content: string, pending = false): ChatMessage {
  return { id: uid(), role, content, pending, createdAt: Date.now() };
}

// Intent / yes-no detection (VI + EN).
const CONTACT_INTENT =
  /(contact|hire|reach out|get in touch|send (a )?message|interview|email you|liên hệ|tuyển|phỏng vấn|gửi (tin|email|lời nhắn))/i;
const YES = /^\s*(y|yes|yeah|yep|sure|ok|okay|có|đồng ý|vâng|ừ|uh|được|co)\b/i;
const NO = /^\s*(n|no|nope|không|khong|ko|thôi|thoi)\b/i;

/**
 * Chat state + send pipeline (SPEC §3 useChat). Runs RAG → generation for
 * normal questions, and drives the deterministic contact-collection flow
 * (SPEC §7.2) so the small model never has to "function call".
 */
export function useChat(onReady?: () => void) {
  const { t, i18n } = useTranslation('chatbot');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [contactStep, setContactStep] = useState<ContactFlowStep>(null);
  const draftRef = useRef<ContactDraft>({});
  const abortRef = useRef<AbortController | null>(null);

  const uiLang = (i18n.language?.startsWith('vi') ? 'vi' : 'en') as Lang;

  const push = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const addAssistant = useCallback((content: string) => {
    push(msg('assistant', content));
  }, [push]);

  /** Append text to the last (streaming) assistant message. */
  const appendToLast = useCallback((chunk: string) => {
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last && last.role === 'assistant') {
        next[next.length - 1] = { ...last, content: last.content + chunk };
      }
      return next;
    });
  }, []);

  const finalizeLast = useCallback(() => {
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last && last.pending) {
        next[next.length - 1] = { ...last, pending: false };
      }
      return next;
    });
  }, []);

  /** Begin the conversational contact flow. */
  const startContactFlow = useCallback(() => {
    if (!isEmailConfigured()) {
      addAssistant(t('fallback', { email: PROFILE.email }));
      return;
    }
    draftRef.current = {};
    setContactStep('awaiting_confirm');
    addAssistant(t('contactFlow.offer'));
  }, [addAssistant, t]);

  /** Handle a user turn while inside the contact flow. Returns true if handled. */
  const handleContactStep = useCallback(
    async (text: string): Promise<boolean> => {
      const step = contactStep;
      if (!step || step === 'done' || step === 'sending') return false;

      if (step === 'awaiting_confirm') {
        if (NO.test(text)) {
          setContactStep(null);
          addAssistant(t('contactFlow.cancelled'));
          return true;
        }
        if (YES.test(text)) {
          setContactStep('awaiting_name');
          addAssistant(t('contactFlow.askName'));
          return true;
        }
        // Unclear answer — re-offer.
        addAssistant(t('contactFlow.offer'));
        return true;
      }

      if (step === 'awaiting_name') {
        draftRef.current.name = text.trim();
        setContactStep('awaiting_email');
        addAssistant(t('contactFlow.askEmail', { name: draftRef.current.name }));
        return true;
      }

      if (step === 'awaiting_email') {
        if (!isValidEmail(text)) {
          addAssistant(t('contactFlow.invalidEmail'));
          return true;
        }
        draftRef.current.email = text.trim();
        setContactStep('awaiting_message');
        addAssistant(t('contactFlow.askMessage'));
        return true;
      }

      if (step === 'awaiting_message') {
        draftRef.current.message = text.trim();
        setContactStep('sending');
        addAssistant(t('contactFlow.sending'));
        try {
          await sendContactEmail({
            name: draftRef.current.name ?? '',
            email: draftRef.current.email ?? '',
            message: draftRef.current.message ?? '',
          });
          addAssistant(t('contactFlow.success'));
        } catch {
          addAssistant(t('contactFlow.error', { email: PROFILE.email }));
        }
        draftRef.current = {};
        setContactStep(null);
        return true;
      }

      return false;
    },
    [contactStep, addAssistant, t],
  );

  /** Run RAG + generation for a normal question, streaming the reply. */
  const respondWithRag = useCallback(
    async (text: string) => {
      const { systemPrompt } = await buildRagContext(text);
      const controller = new AbortController();
      abortRef.current = controller;

      // Placeholder streaming message.
      push(msg('assistant', '', true));

      await generate({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        onToken: (chunk) => appendToLast(chunk),
        signal: controller.signal,
      });

      finalizeLast();
      abortRef.current = null;
    },
    [push, appendToLast, finalizeLast],
  );

  /** Public: send a user message through the pipeline. */
  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isResponding) return;

      push(msg('user', text));
      setIsResponding(true);

      try {
        // 1) If mid-flow, treat input as flow data.
        const handled = await handleContactStep(text);
        if (handled) return;

        // 2) Detect a fresh contact intent.
        if (CONTACT_INTENT.test(text) && isEmailConfigured()) {
          draftRef.current = {};
          setContactStep('awaiting_confirm');
          addAssistant(t('contactFlow.offer'));
          return;
        }

        // 3) Otherwise answer the question with RAG.
        await respondWithRag(text);
      } catch (err) {
        finalizeLast();
        // Replace an empty streaming bubble or add a new error message.
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          const errText = t('errors.generate');
          if (last && last.role === 'assistant' && last.content === '') {
            next[next.length - 1] = { ...last, content: errText, pending: false };
            return next;
          }
          return [...next, msg('assistant', errText)];
        });
        // eslint-disable-next-line no-console
        console.error('[chat] generation failed', err);
      } finally {
        setIsResponding(false);
      }
    },
    [isResponding, push, handleContactStep, respondWithRag, addAssistant, finalizeLast, t],
  );

  /** Reset the transcript and show the welcome message. */
  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setContactStep(null);
    draftRef.current = {};
    setMessages([msg('assistant', t('welcome'))]);
    onReady?.();
  }, [t, onReady]);

  /** Seed the welcome message (call once when chat first opens & ready). */
  const seedWelcome = useCallback(() => {
    setMessages((prev) =>
      prev.length === 0 ? [msg('assistant', t('welcome'))] : prev,
    );
  }, [t]);

  return {
    messages,
    isResponding,
    contactStep,
    uiLang,
    send,
    reset,
    seedWelcome,
    startContactFlow,
    detectLanguage,
  };
}
