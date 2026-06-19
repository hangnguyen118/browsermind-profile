import type { KnowledgeChunk } from '../types';

export const skillsChunks: KnowledgeChunk[] = [
  {
    id: 'skill-frontend',
    category: 'skill',
    content:
      'Frontend skills: React.js (Expert), TypeScript (Advanced), HTML/CSS/JS (Advanced), Next.js (Advanced), Angular (Intermediate).',
    contentVi:
      'Kỹ năng Frontend: React.js (Chuyên gia), TypeScript (Nâng cao), HTML/CSS/JS (Nâng cao), Next.js (Nâng cao), Angular (Trung cấp).',
    tags: ['frontend', 'react', 'typescript', 'javascript', 'nextjs', 'angular'],
  },
  {
    id: 'skill-backend',
    category: 'skill',
    content:
      'Backend skills: .NET (Intermediate), Node.js (Intermediate), SQL (Intermediate), Java (Beginner), PHP (Beginner).',
    contentVi:
      'Kỹ năng Backend: .NET (Trung cấp), Node.js (Trung cấp), SQL (Trung cấp), Java (Cơ bản), PHP (Cơ bản).',
    tags: ['backend', 'dotnet', 'node', 'sql', 'java', 'php'],
  },
  {
    id: 'skill-devops',
    category: 'skill',
    content:
      'DevOps & tools: Git (Advanced), Scrum/Agile (Advanced), Azure DevOps (Intermediate), Figma (Advanced).',
    contentVi:
      'DevOps & công cụ: Git (Nâng cao), Scrum/Agile (Nâng cao), Azure DevOps (Trung cấp), Figma (Nâng cao).',
    tags: ['devops', 'git', 'scrum', 'agile', 'azure devops', 'figma'],
  },
  {
    id: 'skill-practices',
    category: 'skill',
    content:
      'Development practices & workflow: strong in prompt engineering (Advanced), and works spec-driven — starting from a written technical specification (like this site\'s SPEC.md) before coding. Uses an AI-assisted development workflow, pairing with AI coding tools to plan, scaffold, and review code, and runs local AI / LLMs in the browser end to end, including RAG pipelines (e.g. the in-browser RAG chatbot on this site and the Esme voice chatbot).',
    contentVi:
      'Phương pháp & quy trình làm việc: thành thạo prompt engineering (Nâng cao) và phát triển theo hướng spec-driven — bắt đầu từ một bản đặc tả kỹ thuật (như SPEC.md của trang này) trước khi viết code. Áp dụng quy trình phát triển có hỗ trợ của AI, kết hợp công cụ AI để lên kế hoạch, dựng khung và review code, và chạy AI/LLM cục bộ (local AI) ngay trong trình duyệt từ đầu đến cuối, gồm pipeline RAG (ví dụ chatbot RAG trong trình duyệt ở trang này và chatbot giọng nói Esme).',
    tags: ['prompt engineering', 'spec-driven', 'ai workflow', 'ai-assisted development', 'local ai', 'rag', 'llm', 'methodology'],
  },
  {
    id: 'skill-soft',
    category: 'skill',
    content:
      'Soft skills: problem solving, fast learner, teamwork, and communication.',
    contentVi:
      'Kỹ năng mềm: giải quyết vấn đề, học hỏi nhanh, làm việc nhóm và giao tiếp.',
    tags: ['soft skills', 'problem solving', 'teamwork', 'communication'],
  },
];
