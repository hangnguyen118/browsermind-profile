# Personal Profile Website

A fully **client-side** personal portfolio (no backend) with an **in-browser AI
chatbot** (Qwen2.5-0.5B via Transformers.js) and **RAG** over a personal
knowledge base. Built per [SPEC.md](SPEC.md).

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · i18next (VI/EN) ·
Transformers.js (Qwen2.5-0.5B-Instruct + all-MiniLM-L6-v2) · EmailJS ·
Framer Motion · Lucide.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build → dist/
npm run preview  # preview the production build
```

## Configuration

### EmailJS (contact form + chatbot contact flow)

Copy `.env.example` to `.env` and fill in your EmailJS keys:

```
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
```

Your EmailJS template should use these variables: `{{from_name}}`,
`{{from_email}}`, `{{company}}`, `{{message}}`. If unconfigured, the UI gracefully
falls back to showing the direct email address.

### Personal assets

Drop these into `public/`:

- `cv.pdf` — linked by the Hero "Download CV" button.
- `avatar.jpg` — Hero avatar (falls back to initials if missing).

## Editing your content

Two layers, both easy to edit by hand:

1. **Static site content** lives in [src/data/profile.ts](src/data/profile.ts)
   (experience, skills, projects, education, certificates, social links) plus
   the translated strings in [src/i18n/](src/i18n/) (`vi/` and `en/`).
2. **RAG knowledge base** (what the chatbot can answer) lives in
   [src/data/](src/data/) (`personal.ts`, `experience.ts`, …). Each file exports
   an array of bilingual `KnowledgeChunk`s. The human-readable source of truth is
   [knowledge/](knowledge/) markdown — edit there, then mirror into `src/data/`.

## How the AI works

1. On first chat open, the model + embedding index load (cached afterwards in the
   browser; ~150MB download once). WebGPU is used when available, with a WASM/CPU
   fallback.
2. Each question is embedded with all-MiniLM-L6-v2 and matched against the
   knowledge chunks by cosine similarity (top-K).
3. The retrieved context is injected into a grounded system prompt; Qwen2.5-0.5B
   generates the answer in the user's language (VI/EN auto-detected).
4. A deterministic contact flow collects name → email → message and sends it via
   EmailJS — the small model never has to "function call".

The Transformers.js runtime is dynamically imported, so it stays out of the
initial bundle and only loads when the chatbot is first opened.

## Deployment

Static hosting (GitHub Pages / Netlify / Vercel). `vite.config.ts` uses
`base: './'` so it works on subpaths. Build with `npm run build` and deploy the
`dist/` folder.
