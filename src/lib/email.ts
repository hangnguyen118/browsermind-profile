import emailjs from '@emailjs/browser';

/**
 * EmailJS integration (SPEC §7). Sends contact messages without a backend.
 * Config comes from Vite env vars (see .env.example). If unconfigured, callers
 * should fall back to showing the direct email address.
 */

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as
  | string
  | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export function isEmailConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
}

/**
 * Send a contact message. Template variables match SPEC §7.1:
 * {{from_name}}, {{from_email}}, {{company}}, {{message}}.
 */
export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error('EmailJS is not configured');
  }

  await emailjs.send(
    SERVICE_ID!,
    TEMPLATE_ID!,
    {
      from_name: payload.name,
      from_email: payload.email,
      company: payload.company ?? '',
      message: payload.message,
      reply_to: payload.email,
    },
    { publicKey: PUBLIC_KEY! },
  );
}

/** Basic email format validation shared by the form and chatbot flow. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Build a `mailto:` link with a pre-filled subject and body. Used as a no-config
 * fallback when EmailJS is not set up: clicking submit opens the visitor's mail
 * client composing a message to the site owner. `encodeURIComponent` keeps spaces
 * as %20 and newlines as %0A, which every mail client handles correctly.
 */
export function buildMailtoLink(
  to: string,
  subject: string,
  body: string,
): string {
  return `mailto:${to}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
