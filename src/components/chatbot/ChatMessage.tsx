import { useTranslation } from 'react-i18next';
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types';
import { cn } from '../../lib/cn';

/** A single chat bubble. Shows a typing indicator while a reply streams in empty. */
export function ChatMessage({ message }: { message: ChatMessageType }) {
  const { t } = useTranslation('chatbot');
  const isUser = message.role === 'user';
  const isEmptyPending = message.pending && message.content.length === 0;

  return (
    <div className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
      <span
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-full',
          isUser
            ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
            : 'bg-accent-300 text-[#0b2434]',
        )}
        aria-hidden
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </span>

      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'rounded-tr-sm bg-accent-500 text-white'
            : 'rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
        )}
      >
        {isEmptyPending ? (
          <span className="flex items-center gap-1 py-0.5" aria-label={t('typing')}>
            <Dot delay={0} />
            <Dot delay={150} />
            <Dot delay={300} />
          </span>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
