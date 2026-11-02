import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { loadPortfolio } from './load-portfolio.ts';
import { metadata } from './metadata.ts';

export function portfolioPlugin(root = fileURLToPath(new URL('../', import.meta.url))): Plugin {
  const sessions = resolve(root, 'public/sessions');
  const owner = resolve(root, 'src/content/portfolio.json');
  const id = '\0virtual:portfolio-sessions';
  let current: ReturnType<typeof loadPortfolio> | undefined;
  const get = () => current ??= loadPortfolio(root);
  return {
    name: 'portfolio-content',
    resolveId(source) { if (source === 'virtual:portfolio-sessions') return id; },
    async load(source) { if (source === id) return `export default ${JSON.stringify((await get()).sessions)};`; },
    async buildStart() {
      const result = await get();
      for (const warning of result.warnings) this.warn(warning);
    },
    transformIndexHtml: { order: 'post', handler: async () => metadata((await get()).config, './') },
    async generateBundle() {
      for (const [fileName, path] of (await get()).assets) this.emitFile({ type: 'asset', fileName, source: readFileSync(path) });
    },
    configureServer(server) {
      server.watcher.add([sessions, owner]);
      let timer: ReturnType<typeof setTimeout>;
      const change = (_event: string, path: string) => {
        const file = resolve(path);
        if (file !== owner && file !== sessions && !file.startsWith(sessions + sep)) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          current = undefined;
          const module = server.moduleGraph.getModuleById(id);
          if (module) server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: 'full-reload' });
        }, 120);
      };
      server.watcher.on('all', change);
      server.middlewares.use(async (request, response, next) => {
        try {
          const path = new URL(request.url || '/', 'http://localhost').pathname;
          const result = await get();
          const asset = [...result.assets].find(([name]) => path.endsWith('/' + name));
          if (!asset) return next();
          response.setHeader('Content-Type', 'image/webp');
          response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          response.end(readFileSync(asset[1]));
        } catch (error) { next(error as Error); }
      });
      server.httpServer?.once('close', () => { clearTimeout(timer); server.watcher.off('all', change); });
    },
  };
}
