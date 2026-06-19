import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base path: set to './' so the build works on GitHub Pages subpaths,
  // Netlify and Vercel alike.
  base: './',
  build: {
    target: 'es2022',
  },
  optimizeDeps: {
    // Transformers.js ships large wasm/onnx assets; exclude from pre-bundling.
    exclude: ['@huggingface/transformers'],
  },
});
