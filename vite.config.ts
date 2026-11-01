import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sitePaths } from './src/content/metadata';
export default defineConfig({
  plugins: [react(), {
    name: 'portfolio-preview-html',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url || '/', 'http://preview.invalid');
        const path = url.pathname.replace(/\/$/, '') || '/';
        if (path !== '/' && sitePaths().includes(path)) req.url = `${path}/index.html${url.search}`;
        next();
      });
    },
  }],
  server: { host: true },
});
