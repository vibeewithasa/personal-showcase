import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from './scripts/validate-content';
import { metadata } from './scripts/metadata';

export default defineConfig({
  plugins: [react(), {
    name: 'portfolio-metadata',
    transformIndexHtml: { order: 'post', handler: () => metadata(config, './') },
  }],
  base: './',
});
