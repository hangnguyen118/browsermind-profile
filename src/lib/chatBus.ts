/**
 * Tiny event bus to open the chatbot from anywhere (e.g. the Hero CTA) without
 * prop-drilling through every section.
 */
const OPEN_EVENT = 'chat:open';

export function openChat(): void {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function onOpenChat(handler: () => void): () => void {
  const listener = () => handler();
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
