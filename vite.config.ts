import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/langflow': {
        target: 'https://api.langflow.astra.datastax.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/langflow/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  }
});