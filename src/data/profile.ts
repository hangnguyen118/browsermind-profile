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
  email: 'ntdieuhang192@gmail.com',
  phone: '0327 840 518',
  /** CV file placed at public/CV_NguyenThiDieuHang.pdf (served at the site root). */
  cvUrl: './CV_NguyenThiDieuHang.pdf',
  /** Avatar placed at public/avatar.jpg (falls back to initials if missing). */
  avatarUrl: './avatar.jpg',
  initials: 'DH',
} as const;

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/hangnguyen118',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/hangnguyen118',
    icon: 'linkedin',
  },
  { label: 'Email', href: `mailto:${PROFILE.email}`, icon: 'mail' },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp1',
    company: 'Viet Japan Partner',
    roleKey: 'exp1.role',
    period: '05/2024 — 06/2024',
    descKey: 'exp1.desc',
    tech: ['Web Development', 'REST APIs', 'Teamwork'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    categoryKey: 'frontend',
    skills: [
      { name: 'React.js', level: 'Advanced' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'HTML / CSS', level: 'Advanced' },
      { name: 'Next.js', level: 'Intermediate' },
      { name: 'Angular', level: 'Intermediate' },
    ],
  },
  {
    categoryKey: 'backend',
    skills: [
      { name: '.NET', level: 'Intermediate' },
      { name: 'Node.js', level: 'Intermediate' },
      { name: 'SQL', level: 'Intermediate' },
      { name: 'Java', level: 'Beginner' },
      { name: 'PHP', level: 'Beginner' },
    ],
  },
  {
    categoryKey: 'devops',
    skills: [
      { name: 'Git & GitHub', level: 'Advanced' },
      { name: 'Vercel', level: 'Intermediate' },
      { name: 'Azure DevOps', level: 'Intermediate' },
      { name: 'Figma', level: 'Intermediate' },
      { name: 'Adobe XD', level: 'Beginner' },
    ],
  },
  {
    categoryKey: 'soft',
    skills: [
      { name: 'Problem solving', level: 'Advanced' },
      { name: 'Fast learner', level: 'Advanced' },
      { name: 'Teamwork', level: 'Advanced' },
      { name: 'Communication', level: 'Intermediate' },
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj1',
    nameKey: 'proj1.name',
    descKey: 'proj1.desc',
    tech: ['React', 'Node.js', 'OpenAI API', 'ElevenLabs'],
    github: 'https://github.com/hangnguyen118/Esme-Chatbot',
    categoryKey: 'ai',
  },
  {
    id: 'proj2',
    nameKey: 'proj2.name',
    descKey: 'proj2.desc',
    tech: ['Angular', 'Angular Material', '.NET', 'SQL', 'Azure'],
    github: 'https://github.com/hangnguyen118/profile-me',
    demo: 'https://profile-me-website.vercel.app/home',
    categoryKey: 'web',
  },
  {
    id: 'proj3',
    nameKey: 'proj3.name',
    descKey: 'proj3.desc',
    tech: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    github: 'https://github.com/hangnguyen118/flip-card-game',
    demo: 'https://flip-card-game-seven.vercel.app/',
    categoryKey: 'game',
  },
  {
    id: 'proj4',
    nameKey: 'proj4.name',
    descKey: 'proj4.desc',
    tech: ['Cocos Creator', 'JavaScript', 'TypeScript'],
    github: 'https://github.com/hangnguyen118/fruit-catcher-cc2d',
    demo: 'https://fruit-catcher-cc2d.vercel.app/',
    categoryKey: 'game',
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: 'edu1',
    school: 'Ho Chi Minh City University of Technology (HUTECH)',
    degreeKey: 'edu1.degree',
    period: 'Graduated 01/2025',
    gpa: '3.35 / 4.0 (Very Good)',
  },
];

export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert1',
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    year: '',
    verifyUrl: 'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/',
  },
  {
    id: 'cert2',
    name: 'English B1 Certification',
    issuer: 'CEFR — Intermediate',
    year: '',
  },
];
