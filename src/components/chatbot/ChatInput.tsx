import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

/** Auto-growing chat input. Enter sends; Shift+Enter inserts a newline. */
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { t } = useTranslation('chatbot');
  const [value, setValue] = useState('');

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-2 border-t border-gray-200 p-3 dark:border-gray-800"
    >
      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={t('inputPlaceholder')}
        className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-accent-900/40"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label={t('sendAria')}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-500 text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal size={18} />
      </button>
    </form>
  );
}
