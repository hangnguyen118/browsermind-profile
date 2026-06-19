import type { KnowledgeChunk } from '../types';

export const personalChunks: KnowledgeChunk[] = [
  {
    id: 'per-001',
    category: 'personal',
    content:
      'Name: Hoang Dung. Title: Software Engineer based in Vietnam. 4+ years of experience building web applications across the stack.',
    contentVi:
      'Tên: Hoàng Dũng. Chức danh: Software Engineer, sống tại Việt Nam. Hơn 4 năm kinh nghiệm xây dựng ứng dụng web full-stack.',
    tags: ['name', 'title', 'location', 'experience', 'software engineer'],
  },
  {
    id: 'per-002',
    category: 'personal',
    content:
      'Summary: Product-minded Software Engineer with a bias toward clean architecture, performance, and developer experience. Comfortable from polished frontends to pragmatic backend services.',
    contentVi:
      'Giới thiệu: Software Engineer tư duy sản phẩm, chú trọng kiến trúc sạch, hiệu năng và trải nghiệm lập trình viên. Làm tốt từ frontend tinh tế đến backend thực dụng.',
    tags: ['summary', 'about', 'strengths'],
  },
  {
    id: 'per-003',
    category: 'personal',
    content:
      'Languages spoken: Vietnamese (native) and English (professional working proficiency).',
    contentVi:
      'Ngôn ngữ: Tiếng Việt (bản ngữ) và Tiếng Anh (sử dụng tốt trong công việc).',
    tags: ['language', 'english', 'vietnamese'],
  },
];
