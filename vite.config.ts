import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { portfolioPlugin } from './scripts/portfolio-plugin';
export default defineConfig({ plugins: [react(), portfolioPlugin()], base: './' });
