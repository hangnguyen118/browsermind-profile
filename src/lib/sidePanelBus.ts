/**
 * Tiny event bus to open the global left-side panel from anywhere (a certificate
 * card, a project, the chatbot, …) without prop-drilling. Mirrors `chatBus.ts`,
 * but carries a content payload describing what to show.
 */
import type { SidePanelContent } from '../types';

const OPEN_EVENT = 'sidepanel:open';

/** Open the left side panel with the given content (PDF, blog, embed…). */
export function openSidePanel(content: SidePanelContent): void {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: content }));
}

/** Subscribe to open requests. Returns an unsubscribe fn. */
export function onOpenSidePanel(
  handler: (content: SidePanelContent) => void,
): () => void {
  const listener = (e: Event) =>
    handler((e as CustomEvent<SidePanelContent>).detail);
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
