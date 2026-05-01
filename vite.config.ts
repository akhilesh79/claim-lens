import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Route PDF.js fetch requests through localhost to bypass CORS.
      // The forgery API server doesn't set Access-Control-Allow-Origin.
      '/forgery-proxy': {
        target: 'http://sanju121212-document-forgery-detector.hf.space',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/forgery-proxy/, ''),
      },
    },
  },
});
