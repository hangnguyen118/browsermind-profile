import type {
  CertificateItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  SocialLink,
} from '../types';

/**
 * Structured, non-RAG content for the static UI sections. Text that needs
 * translation lives in i18n JSON (referenced here via *Key fields); stable
 * data (companies, dates, tech, links) lives here.
 */

export const PROFILE = {
  email: 'hoangdung.proelsalo@gmail.com',
  /** CV file placed at public/cv.pdf */
  cvUrl: './cv.pdf',
  /** Avatar placed at public/avatar.jpg (falls back to initials if missing). */
  avatarUrl: './avatar.jpg',
  initials: 'HD',
} as const;

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/your-handle', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/your-handle',
    icon: 'linkedin',
  },
  { label: 'Email', href: `mailto:${PROFILE.email}`, icon: 'mail' },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp1',
    company: 'ABC Corp',
    roleKey: 'exp1.role',
    period: '01/2024 — Present',
    descKey: 'exp1.desc',
    tech: ['React', 'TypeScript', 'Vite', 'Node.js'],
  },
  {
    id: 'exp2',
    company: 'Startup XYZ',
    roleKey: 'exp2.role',
    period: '06/2022 — 12/2023',
    descKey: 'exp2.desc',
    tech: ['React Native', 'Node.js', 'PostgreSQL', 'GitHub Actions'],
  },
  {
    id: 'exp3',
    company: 'Studio QWE',
    roleKey: 'exp3.role',
    period: '07/2021 — 05/2022',
    descKey: 'exp3.desc',
    tech: ['JavaScript', 'HTML', 'CSS', 'PHP'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    categoryKey: 'frontend',
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'HTML / CSS', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Advanced' },
      { name: 'Next.js', level: 'Advanced' },
      { name: 'React Native', level: 'Intermediate' },
    ],
  },
  {
    categoryKey: 'backend',
    skills: [
      { name: 'Node.js', level: 'Advanced' },
      { name: 'REST APIs', level: 'Advanced' },
      { name: 'PostgreSQL', level: 'Intermediate' },
      { name: 'Python', level: 'Intermediate' },
    ],
  },
  {
    categoryKey: 'devops',
    skills: [
      { name: 'GitHub Actions / CI/CD', level: 'Advanced' },
      { name: 'Vercel / Netlify', level: 'Advanced' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'Linux', level: 'Intermediate' },
    ],
  },
  {
    categoryKey: 'soft',
    skills: [
      { name: 'Problem solving', level: 'Expert' },
      { name: 'Communication', level: 'Advanced' },
      { name: 'Mentoring', level: 'Advanced' },
      { name: 'Teamwork', level: 'Advanced' },
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj1',
    nameKey: 'proj1.name',
    descKey: 'proj1.desc',
    tech: ['React', 'TypeScript', 'Transformers.js', 'Tailwind'],
    github: 'https://github.com/your-handle/profile-app',
    categoryKey: 'ai',
  },
  {
    id: 'proj2',
    nameKey: 'proj2.name',
    descKey: 'proj2.desc',
    tech: ['React', 'TypeScript', 'WebSocket', 'D3'],
    github: 'https://github.com/your-handle/analytics-dashboard',
    demo: 'https://example.com/demo',
    categoryKey: 'web',
  },
  {
    id: 'proj3',
    nameKey: 'proj3.name',
    descKey: 'proj3.desc',
    tech: ['React Native', 'Node.js', 'Stripe', 'PostgreSQL'],
    github: 'https://github.com/your-handle/ecommerce-app',
    categoryKey: 'mobile',
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: 'edu1',
    school: 'University of Technology',
    degreeKey: 'edu1.degree',
    period: '2017 — 2021',
    gpa: '3.5 / 4.0',
  },
];

export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert1',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    year: '2023',
    verifyUrl: 'https://www.credly.com/',
  },
  {
    id: 'cert2',
    name: 'Meta Front-End Developer',
    issuer: 'Coursera / Meta',
    year: '2022',
    verifyUrl: 'https://www.coursera.org/',
  },
  {
    id: 'cert3',
    name: 'TOEIC 900',
    issuer: 'ETS',
    year: '2022',
  },
];
