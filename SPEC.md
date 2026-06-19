# Personal Profile Website — Technical Specification

> **Version:** 1.1 | **Date:** 2026-06-14 | **Owner:** hoangdung.proelsalo@gmail.com

---

## 1. Tổng Quan (Overview)

Website giới thiệu profile cá nhân dành cho mục đích xin việc, hoàn toàn **client-side** (không có backend). Nổi bật với AI chatbot tích hợp model Qwen2.5-0.5B chạy trực tiếp trên trình duyệt, hỗ trợ RAG để cung cấp thông tin cá nhân chính xác.

**Mục tiêu chính:**
- Tạo ấn tượng tốt với nhà tuyển dụng trong 30 giây đầu
- Cho phép nhà tuyển dụng tương tác với AI để tìm hiểu thêm về ứng viên
- Dễ dàng cập nhật thông tin cá nhân không cần sửa code

---

## 2. Tech Stack

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|------------|
| Framework | **React 19 + TypeScript** | Type safety, ecosystem tốt |
| Build Tool | **Vite** | Fast HMR, tối ưu bundle |
| Styling | **Tailwind CSS v4** | Responsive nhanh, dark mode built-in |
| Dark Mode | **Tailwind `dark:` + class strategy** | Toggle qua JS, persist vào `localStorage` |
| i18n | **i18next + react-i18next** | Đa ngôn ngữ VI/EN, lazy load translations |
| AI Inference | **Transformers.js v3** | Chạy Qwen2.5-0.5B ONNX trực tiếp trong browser |
| AI Model | **Qwen2.5-0.5B (ONNX quantized)** | Nhỏ gọn, chạy client-side, load từ HuggingFace CDN |
| RAG Embeddings | **Transformers.js** (model: `Xenova/all-MiniLM-L6-v2`) | Tạo embedding cho RAG |
| Email (Contact) | **EmailJS** | Gửi email không cần backend |
| Icons | **Lucide React** | Nhẹ, đẹp, tree-shakable |
| Animation | **Framer Motion** | Scroll animations, transitions |
| Deployment | **GitHub Pages / Netlify / Vercel** | Static hosting miễn phí |

> **Lưu ý về model:** Model `Qwen2.5-0.5B` dạng `.safetensors` (PyTorch format) trong thư mục local không dùng được trực tiếp trên browser. Transformers.js cần định dạng **ONNX quantized**. Sẽ load từ HuggingFace CDN: `Xenova/Qwen2.5-0.5B-Instruct` (đã được pre-convert).

---

## 3. Kiến Trúc (Architecture)

```
profile_app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/              # Hình ảnh, CV PDF
│   ├── components/          # React components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── sections/        # Các section của trang
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── Certificates.tsx
│   │   │   └── Contact.tsx
│   │   └── chatbot/
│   │       ├── ChatbotWidget.tsx   # Floating chat button + panel
│   │       ├── ChatMessage.tsx
│   │       ├── ChatInput.tsx
│   │       └── ModelLoader.tsx     # Loading progress bar
│   ├── ai/
│   │   ├── engine.ts              # Transformers.js wrapper (load model, generate)
│   │   ├── embeddings.ts          # Embedding generation
│   │   └── rag.ts                 # RAG pipeline (retrieve + augment prompt)
│   ├── data/                      # ← RAG Knowledge Base (dễ maintain)
│   │   ├── index.ts               # Export tất cả knowledge chunks
│   │   ├── personal.ts            # Thông tin cá nhân
│   │   ├── experience.ts          # Kinh nghiệm làm việc
│   │   ├── skills.ts              # Kỹ năng kỹ thuật & mềm
│   │   ├── projects.ts            # Dự án đã thực hiện
│   │   ├── education.ts           # Bằng cấp
│   │   ├── certificates.ts        # Chứng chỉ
│   │   ├── hobbies.ts             # Sở thích
│   │   └── contact.ts             # Thông tin liên hệ
│   ├── i18n/
│   │   ├── index.ts               # i18next config
│   │   ├── vi/
│   │   │   ├── common.json        # Nav, buttons, labels
│   │   │   ├── sections.json      # Nội dung các section
│   │   │   └── chatbot.json       # Chatbot UI strings
│   │   └── en/
│   │       ├── common.json
│   │       ├── sections.json
│   │       └── chatbot.json
│   ├── hooks/
│   │   ├── useChat.ts             # Chat state management
│   │   ├── useAI.ts               # AI model lifecycle
│   │   ├── useDarkMode.ts         # Dark mode toggle + localStorage
│   │   └── useScrollSpy.ts        # Active nav section
│   ├── types/
│   │   └── index.ts               # Shared TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── knowledge/                     # Raw markdown files (source of truth cho RAG)
│   ├── personal.md
│   ├── experience.md
│   ├── skills.md
│   ├── projects.md
│   ├── education.md
│   ├── certificates.md
│   ├── hobbies.md
│   └── contact.md
├── SPEC.md
├── package.json
└── vite.config.ts
```

---

## 4. Các Section Của Website

### 4.1 Hero Section
- Ảnh avatar (professional)
- Tên đầy đủ + chức danh
- Tagline 1-2 câu
- CTA buttons: "Tải CV" | "Liên hệ" | "Chat với AI"
- Social links: GitHub, LinkedIn, Email

### 4.2 About
- Đoạn giới thiệu ngắn (~150 từ)
- Highlights: năm kinh nghiệm, số dự án, technologies

### 4.3 Experience (Timeline)
- Timeline dọc
- Mỗi entry: công ty, vị trí, thời gian, mô tả, tech stack dùng

### 4.4 Skills
- Nhóm theo category: Frontend, Backend, DevOps, Soft Skills
- Visual: progress bar hoặc badge/tag
- Không dùng số % (không chính xác) → dùng label: Beginner / Intermediate / Advanced / Expert

### 4.5 Projects
- Grid card layout
- Mỗi card: thumbnail, tên, mô tả ngắn, tech tags, link GitHub/Demo
- Filter theo category (optional)

### 4.6 Education
- Đại học, bằng cấp, năm tốt nghiệp, GPA (nếu muốn)

### 4.7 Certificates
- Grid/list các chứng chỉ với logo tổ chức cấp, năm, link verify

### 4.8 Contact
- Form: Tên, Email, Công ty, Tin nhắn
- Submit → gửi qua EmailJS đến `hoangdung.proelsalo@gmail.com`
- Social links

---

## 5. AI Chatbot

### 5.1 UX/UI
- **Vị trí:** Floating button góc phải dưới (fixed)
- **Trạng thái:** Collapsed (icon) ↔ Expanded (chat panel 360×500px)
- **Model loading:** Lần đầu mở chatbot → hiển thị progress bar download model (~150MB quantized)
  - Sau khi load xong → cache vào IndexedDB (lần sau không cần download lại)
- **Responsive:** Trên mobile → full-screen khi mở

### 5.2 Tính Năng Chatbot
Chatbot có thể trả lời các câu hỏi về:
- Thông tin cá nhân (tuổi, vị trí, năm kinh nghiệm)
- Kỹ năng kỹ thuật và mềm
- Chứng chỉ đã có
- Sở thích cá nhân
- Dự án đã thực hiện (mô tả, tech stack, kết quả)
- Kinh nghiệm làm việc
- Bằng cấp học vấn
- **Hỗ trợ gửi liên hệ:** Chatbot hỏi tên, email, tin nhắn → tự động gửi EmailJS

### 5.3 Luồng RAG Pipeline

```
User Input
    ↓
[Embedding] → dùng all-MiniLM-L6-v2 tạo vector cho câu hỏi
    ↓
[Retrieve] → cosine similarity với pre-embedded knowledge chunks
    ↓
[Top-K chunks] → lấy 3-5 chunks liên quan nhất
    ↓
[Augment Prompt] → ghép context vào system prompt
    ↓
[Qwen2.5-0.5B] → sinh câu trả lời
    ↓
Response
```

### 5.4 System Prompt Template

**Detect ngôn ngữ:** Chatbot tự detect ngôn ngữ user đang dùng (VI/EN) và trả lời cùng ngôn ngữ đó.

```
You are an AI assistant representing [Name]. Reply concisely, friendly, and professionally.
Detect the user's language and respond in the SAME language (Vietnamese or English).
Base your answers ONLY on the following context:

CONTEXT:
{retrieved_chunks}

If the question is not covered by the context, say you don't have that information
and suggest contacting directly via email [email].
Never fabricate information.
```

### 5.5 i18n trong RAG Knowledge Chunks
Mỗi knowledge chunk có field `lang` hoặc cung cấp nội dung song ngữ:
```typescript
{
  id: 'exp-001',
  category: 'experience',
  content: 'Senior Frontend Developer at ABC Corp (2024-present). Built dashboard with React/TypeScript. Reduced load time by 40%.',
  contentVi: 'Senior Frontend Developer tại Công ty ABC (2024-nay). Xây dựng dashboard bằng React/TypeScript. Giảm load time 40%.',
  tags: ['react', 'typescript', 'senior', '2024'],
}
```

---

## 6. RAG Knowledge Base Structure

### 6.1 Nguyên Tắc Thiết Kế
- **Tách biệt rõ ràng:** Mỗi file `.ts` trong `src/data/` = một domain
- **Chunk nhỏ:** Mỗi chunk ≤ 200 tokens để embedding chính xác
- **Metadata:** Mỗi chunk có `category`, `tags`, `language` để filter
- **Source of truth:** Files markdown trong `/knowledge/` → script import vào `src/data/`

### 6.2 Data Type Definition

```typescript
// src/types/index.ts
export interface KnowledgeChunk {
  id: string;           // unique: "exp-001", "skill-react"
  category: Category;   // 'personal' | 'experience' | 'skill' | 'project' | 'education' | 'certificate' | 'hobby' | 'contact'
  content: string;      // văn bản nội dung
  tags: string[];       // ["react", "frontend", "2024"]
  embedding?: number[]; // vector sau khi embed (cached runtime)
}

export type Category =
  | 'personal'
  | 'experience'
  | 'skill'
  | 'project'
  | 'education'
  | 'certificate'
  | 'hobby'
  | 'contact';
```

### 6.3 Ví Dụ Data File

```typescript
// src/data/experience.ts
import type { KnowledgeChunk } from '../types';

export const experienceChunks: KnowledgeChunk[] = [
  {
    id: 'exp-001',
    category: 'experience',
    content: `Từ 01/2024 đến nay: Senior Frontend Developer tại Công ty ABC.
      Phụ trách xây dựng hệ thống dashboard quản lý với React, TypeScript.
      Tối ưu hiệu năng giảm load time 40%. Team 5 người.`,
    tags: ['react', 'typescript', 'frontend', 'senior', '2024'],
  },
  {
    id: 'exp-002',
    category: 'experience',
    content: `Từ 06/2022 đến 12/2023: Frontend Developer tại Startup XYZ.
      Xây dựng mobile app với React Native và REST API.
      Triển khai CI/CD với GitHub Actions.`,
    tags: ['react-native', 'mobile', 'cicd', '2022', '2023'],
  },
];
```

### 6.4 Unified Index

```typescript
// src/data/index.ts
import { personalChunks } from './personal';
import { experienceChunks } from './experience';
import { skillsChunks } from './skills';
// ... tất cả imports

export const ALL_KNOWLEDGE_CHUNKS = [
  ...personalChunks,
  ...experienceChunks,
  ...skillsChunks,
  // ...
];
```

---

## 7. Email Integration (EmailJS)

### 7.1 Setup
1. Tạo account EmailJS (free tier: 200 emails/tháng)
2. Tạo Email Template với variables: `{{from_name}}`, `{{from_email}}`, `{{company}}`, `{{message}}`
3. Config trong `.env` (vẫn client-side nhưng tách config):
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxx
   VITE_EMAILJS_PUBLIC_KEY=xxx
   ```

### 7.2 Chatbot Email Flow
```
Chatbot: "Bạn muốn gửi thông tin liên hệ đến [Tên]?"
User: "Có"
Chatbot: "Tên của bạn là gì?"
User: "Nguyen Van A"
Chatbot: "Email của bạn?"
User: "recruiter@company.com"
Chatbot: "Tin nhắn muốn gửi?"
User: "Tôi muốn mời bạn phỏng vấn..."
→ EmailJS.send() → Email đến hoangdung.proelsalo@gmail.com
Chatbot: "Đã gửi thành công! [Tên] sẽ phản hồi trong 24h."
```

---

## 8. UI/UX Requirements

### 8.1 Design System
- **Color palette:** Neutral chủ đạo + 1 accent color (professional: blue/teal/indigo)
- **Dark mode:** Class-based (`dark` class trên `<html>`), toggle button trên nav, persist vào `localStorage`
  - Light: `bg-white` / `text-gray-900`
  - Dark: `bg-gray-950` / `text-gray-100`
  - Accent giữ nguyên cả 2 mode
- **Typography:** Inter (headings) + Inter (body) — Google Fonts
- **Spacing:** 8px grid system (Tailwind default)
- **Border radius:** Rounded moderate (rounded-lg = 8px)

### 8.2 Responsive Breakpoints (Tailwind)
| Breakpoint | Width | Layout |
|------------|-------|--------|
| mobile | < 640px | Single column |
| tablet (sm) | 640px+ | 2 columns (skills, projects) |
| desktop (lg) | 1024px+ | Full layout với sidebar/grid |

### 8.3 Animations
- Fade-in on scroll (Framer Motion `whileInView`)
- Smooth scroll navigation
- Chatbot slide-up animation
- Typing indicator trong chat

### 8.4 Performance
- Lazy load sections (Suspense)
- Model load chỉ khi user mở chatbot lần đầu
- Images: WebP format, lazy loading
- Bundle size target: < 200KB (không tính AI model)

### 8.5 Accessibility
- Alt text cho tất cả images
- Keyboard navigation cho chatbot
- ARIA labels
- Color contrast WCAG AA

---

## 9. Các Màn Hình Cần Design

1. **Desktop** - Full layout (1440px reference)
2. **Mobile** - Single column (375px reference)
3. **Chatbot closed** - Floating button
4. **Chatbot open** - Chat panel
5. **Chatbot model loading** - Progress indicator
6. **Mobile chatbot** - Fullscreen overlay

---

## 10. Milestones Triển Khai

| Phase | Nội Dung | Ước Tính |
|-------|----------|----------|
| Phase 1 | Setup project, layout, all sections (static) | 2-3 ngày |
| Phase 2 | Điền data cá nhân vào `src/data/` | 1 ngày |
| Phase 3 | EmailJS integration (Contact form) | 0.5 ngày |
| Phase 4 | AI engine + RAG pipeline | 2-3 ngày |
| Phase 5 | Chatbot UI + email flow trong chat | 1-2 ngày |
| Phase 6 | Polish, animations, responsive test | 1 ngày |
| Phase 7 | Deploy lên GitHub Pages / Netlify | 0.5 ngày |

---

## 11. Các Quyết Định Đã Xác Nhận

| Vấn đề | Quyết định |
|--------|-----------|
| Ngôn ngữ | ✅ Hỗ trợ **cả VI lẫn EN** (i18next) |
| Dark mode | ✅ **Có** — class-based, persist localStorage |
| UI Framework | ✅ **Tự custom** — không dùng Shadcn/ui |
| Accent color | ✅ **Baby blue** — CSS var `--color-accent: #89CFF0`, Tailwind custom `sky` palette |
| Chức danh | ✅ **Software Engineer** |
| CV PDF | ✅ **Có** — nút "Download CV" trên Hero section, file để ở `public/cv.pdf` |

---

## 12. Giới Hạn Kỹ Thuật Cần Biết

| Vấn đề | Chi tiết |
|--------|----------|
| Model size | Qwen2.5-0.5B ONNX quantized ~150MB → user phải download lần đầu |
| WebGPU | Cần Chrome/Edge mới nhất để inference nhanh; fallback CPU (chậm hơn) |
| EmailJS free | 200 emails/tháng, nếu vượt cần upgrade |
| CORS | Tất cả resources phải từ CDN hoặc same-origin |
| Local model files | `Qwen2.5-0.5B/*.safetensors` không dùng được trong browser (cần ONNX) |
