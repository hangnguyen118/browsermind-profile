import type { KnowledgeChunk } from '../types';

export const personalChunks: KnowledgeChunk[] = [
  {
    id: 'per-001',
    category: 'personal',
    content:
      'Name: Nguyen Thi Dieu Hang. Title: Full Stack Developer (fresher) based in Ho Chi Minh City, Vietnam. Software Engineering graduate from HUTECH (Jan 2025) with web development experience from an internship at Viet Japan Partner.',
    contentVi:
      'Tên: Nguyễn Thị Diệu Hằng. Chức danh: Full Stack Developer (mới ra trường), sống tại TP. Hồ Chí Minh, Việt Nam. Tốt nghiệp ngành Kỹ thuật phần mềm tại HUTECH (01/2025), có kinh nghiệm phát triển web qua kỳ thực tập tại Viet Japan Partner.',
    tags: ['name', 'title', 'location', 'fresher', 'full stack developer', 'hutech'],
  },
  {
    id: 'per-002',
    category: 'personal',
    content:
      'Summary: Software Engineering graduate with hands-on experience across both front-end and back-end web technologies. Certified in Microsoft Azure Fundamentals (AZ-900) and English at B1 level. A fast learner with strong problem-solving skills, eager to grow as a Full Stack Developer building scalable, user-friendly web applications.',
    contentVi:
      'Giới thiệu: Cử nhân/Kỹ sư ngành Kỹ thuật phần mềm với kinh nghiệm thực hành cả front-end lẫn back-end. Có chứng chỉ Microsoft Azure Fundamentals (AZ-900) và tiếng Anh trình độ B1. Học hỏi nhanh, kỹ năng giải quyết vấn đề tốt, mong muốn phát triển thành Full Stack Developer xây dựng các ứng dụng web dễ dùng và có khả năng mở rộng.',
    tags: ['summary', 'about', 'strengths', 'azure', 'az-900'],
  },
  {
    id: 'per-003',
    category: 'personal',
    content:
      'Languages spoken: Vietnamese (native) and English (B1 / Intermediate) — able to read technical documentation and collaborate in English.',
    contentVi:
      'Ngôn ngữ: Tiếng Việt (bản ngữ) và Tiếng Anh (B1 / Trung cấp) — có thể đọc tài liệu kỹ thuật và làm việc bằng tiếng Anh.',
    tags: ['language', 'english', 'vietnamese', 'b1'],
  },
];
