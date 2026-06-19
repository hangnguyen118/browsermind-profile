import type { KnowledgeChunk } from '../types';

export const skillsChunks: KnowledgeChunk[] = [
  {
    id: 'skill-frontend',
    category: 'skill',
    content:
      'Frontend skills: React.js (Advanced), TypeScript (Advanced), JavaScript (Advanced), HTML/CSS (Advanced), Next.js (Intermediate), Angular (Intermediate).',
    contentVi:
      'Kỹ năng Frontend: React.js (Nâng cao), TypeScript (Nâng cao), JavaScript (Nâng cao), HTML/CSS (Nâng cao), Next.js (Trung cấp), Angular (Trung cấp).',
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
      'DevOps & tools: Git & GitHub (Advanced), Vercel (Intermediate), Azure DevOps (Intermediate). UI/UX design tools: Figma (Intermediate), Adobe XD (Beginner).',
    contentVi:
      'DevOps & công cụ: Git & GitHub (Nâng cao), Vercel (Trung cấp), Azure DevOps (Trung cấp). Công cụ thiết kế UI/UX: Figma (Trung cấp), Adobe XD (Cơ bản).',
    tags: ['devops', 'git', 'github', 'vercel', 'azure', 'figma', 'adobe xd'],
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
