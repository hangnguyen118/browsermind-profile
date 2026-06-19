# Nguyen Thi Dieu Hang — Personal Profile & AI Portfolio

A fully **client-side** personal portfolio (no backend) for **Nguyen Thi Dieu Hang**,
a Full Stack Developer and Software Engineering graduate from HUTECH. It ships an
**in-browser AI chatbot** (Qwen2.5-0.5B via Transformers.js) with **RAG** over a
personal knowledge base, so visitors can ask questions and get grounded answers —
all running locally in the browser. Built per [SPEC.md](SPEC.md).

> 🌐 Bilingual (Vietnamese / English) · 🌓 Dark mode · 🤖 On-device AI · 📨 Contact via EmailJS

## ✨ Features

- **Sections:** Hero, About, Experience, Skills, Projects, Education, Certificates, Contact.
- **AI chatbot (right-side sidebar):** a floating button opens a full-height panel
  docked to the right edge; on mobile it goes full-screen. It answers questions
  about experience, skills, projects, and more using RAG.
- **Bilingual UI:** instant VI ⇄ EN switch via i18next; the chatbot auto-detects
  the question language and replies in kind.
- **Dark mode:** class-based, persisted to `localStorage`, no flash on load.
- **Contact:** EmailJS-powered form, plus a guided contact flow inside the chatbot
  (name → email → message). Falls back to a `mailto:` link if EmailJS is not set up.

## 🧰 Tech stack

| Layer        | Tech                                                              |
| ------------ | ---------------------------------------------------------------- |
| Framework    | React 19 + TypeScript                                            |
| Build        | Vite 7                                                           |
| Styling      | Tailwind CSS v4                                                  |
| i18n         | i18next + react-i18next (VI / EN)                                |
| AI inference | Transformers.js (Qwen2.5-0.5B-Instruct, ONNX, in-browser)       |
| RAG embed    | Transformers.js (`all-MiniLM-L6-v2`)                            |
| Email        | EmailJS (no backend)                                            |
| Animation    | Framer Motion · Icons: Lucide                                   |

## 🚀 Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build → dist/
npm run preview  # preview the production build
npm run lint     # typecheck only (tsc --noEmit)
```

## 📁 Project structure

```
profile_app/
├── knowledge/            # Human-readable source of truth (markdown) for the RAG data
├── public/               # Static assets: cv.pdf, avatar.jpg, favicon.svg
├── src/
│   ├── ai/               # Transformers.js engine, embeddings, RAG pipeline
│   ├── components/       # layout/, sections/, chatbot/, ui/
│   ├── data/             # profile.ts (UI data) + RAG KnowledgeChunk files
│   ├── hooks/            # useAI, useChat, useDarkMode, useScrollSpy
│   ├── i18n/             # vi/ and en/ translation JSON
│   ├── lib/              # email, chatBus, motion, helpers
│   └── types/            # shared TypeScript types
├── SPEC.md               # full technical specification
└── vite.config.ts
```

## ✏️ Editing the content

Content lives in **three places that must stay in sync** when you update the CV:

1. **Static section data** — [src/data/profile.ts](src/data/profile.ts)
   (experience, skills, projects, education, certificates, social links) plus the
   translated strings in [src/i18n/](src/i18n/) (`vi/` and `en/`, referenced via
   `*Key` fields like `roleKey`, `descKey`, `nameKey`).
2. **RAG knowledge base** (what the chatbot can answer) — the bilingual
   `KnowledgeChunk` arrays in [src/data/](src/data/) (`personal.ts`,
   `experience.ts`, `skills.ts`, …), combined in `src/data/index.ts`.
3. **Source-of-truth notes** — [knowledge/](knowledge/) markdown. These are *not*
   imported by the app; they’re where you draft content by hand, then mirror into
   the `src/data/*.ts` files above.

> ⚠️ Editing only the `knowledge/*.md` files does **not** change the site — the app
> reads from `src/data/*.ts` and `src/i18n/`. Update those for changes to take effect.

## 🤖 How the AI chatbot works

1. On first open, the model + embedding index load lazily (cached in the browser
   afterwards; ~150MB downloaded once). WebGPU is used when available, with a
   WASM/CPU fallback.
2. Each question is embedded with `all-MiniLM-L6-v2` and matched against the
   knowledge chunks by cosine similarity (top-K = 4).
3. The retrieved context is injected into a grounded system prompt; Qwen2.5-0.5B
   generates the answer in the detected language (VI / EN) and is told not to
   fabricate beyond the context.
4. A deterministic contact flow collects name → email → message and sends it via
   EmailJS — the small model never has to "function call".

The Transformers.js runtime is dynamically imported, so it stays out of the initial
bundle and only loads when the chatbot is first opened.

## ⚙️ Configuration

### EmailJS (contact form + chatbot contact flow)

Copy `.env.example` to `.env` and fill in your EmailJS keys:

```
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
```

The EmailJS template should use these variables: `{{from_name}}`, `{{from_email}}`,
`{{company}}`, `{{message}}`. If unconfigured, the UI gracefully falls back to a
`mailto:` link / showing the direct email address.

### Personal assets

Drop these into `public/`:

- `CV_NguyenThiDieuHang.pdf` — linked by the Hero "Download CV" button (path set in
  [src/data/profile.ts](src/data/profile.ts) → `PROFILE.cvUrl`). The editable source
  `.docx` lives in [cv/](cv/).
- `avatar.jpg` — Hero avatar (falls back to the "DH" initials if missing).

## 🌍 Deployment

Static hosting (GitHub Pages / Netlify / Vercel). `vite.config.ts` sets
`base: './'` so it works on subpaths. Build with `npm run build` and deploy the
`dist/` folder.

## 👩‍💻 Author

**Nguyen Thi Dieu Hang** — Full Stack Developer, Ho Chi Minh City, Vietnam

- 📧 Email: ntdieuhang192@gmail.com
- 💻 GitHub: [github.com/hangnguyen118](https://github.com/hangnguyen118)
- 💼 LinkedIn: [linkedin.com/in/hangnguyen118](https://www.linkedin.com/in/hangnguyen118)
