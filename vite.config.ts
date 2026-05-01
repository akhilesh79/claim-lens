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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-icons'))                                      return 'vendor-icons';
          if (id.includes('node_modules/react-pdf') || id.includes('node_modules/pdfjs-dist')) return 'vendor-pdf';
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/recharts')) return 'vendor-ui';
          if (id.includes('node_modules/@reduxjs') || id.includes('node_modules/react-redux') || id.includes('node_modules/redux-persist')) return 'vendor-redux';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor-react';
        },
      },
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
