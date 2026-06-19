import type { KnowledgeChunk } from '../types';

export const projectsChunks: KnowledgeChunk[] = [
  {
    id: 'proj-001',
    category: 'project',
    content:
      'AI Profile Website (this site): a fully client-side personal portfolio with an in-browser AI chatbot (Qwen2.5-0.5B via Transformers.js) and RAG over personal knowledge. No backend required. Tech: React, TypeScript, Vite, Tailwind, Transformers.js.',
    contentVi:
      'AI Profile Website (chính trang này): portfolio cá nhân chạy hoàn toàn phía client với chatbot AI trong trình duyệt (Qwen2.5-0.5B qua Transformers.js) và RAG trên dữ liệu cá nhân. Không cần backend. Công nghệ: React, TypeScript, Vite, Tailwind, Transformers.js.',
    tags: ['ai', 'rag', 'react', 'transformers.js', 'portfolio'],
  },
  {
    id: 'proj-002',
    category: 'project',
    content:
      'Realtime Analytics Dashboard: visualizes live metrics with charts and filters, optimized to render thousands of data points smoothly over WebSocket. Tech: React, TypeScript, WebSocket, D3.',
    contentVi:
      'Realtime Analytics Dashboard: trực quan hóa số liệu thời gian thực với biểu đồ và bộ lọc, tối ưu để render hàng nghìn điểm dữ liệu mượt mà qua WebSocket. Công nghệ: React, TypeScript, WebSocket, D3.',
    tags: ['dashboard', 'realtime', 'websocket', 'd3', 'react'],
  },
  {
    id: 'proj-003',
    category: 'project',
    content:
      'E-commerce Mobile App: cross-platform shopping app with cart, payments, and push notifications. Tech: React Native, Node.js, Stripe, PostgreSQL.',
    contentVi:
      'Ứng dụng di động thương mại điện tử: app mua sắm đa nền tảng với giỏ hàng, thanh toán và push notification. Công nghệ: React Native, Node.js, Stripe, PostgreSQL.',
    tags: ['mobile', 'ecommerce', 'react-native', 'stripe', 'payments'],
  },
];
