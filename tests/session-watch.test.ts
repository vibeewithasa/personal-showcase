import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { createServer } from 'vite';
import sharp from 'sharp';
import { portfolioPlugin } from '../scripts/portfolio-plugin.ts';

test('development discovers added/replaced/renamed/deleted sessions and recovers from invalid metadata', async () => {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-watch-'));
  assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep));
  const config = JSON.parse(readFileSync(new URL('./fixtures/portfolio.json', import.meta.url), 'utf8'));
  config.projects = [];
  for (const path of ['src/content', 'public/images', 'public/sessions']) mkdirSync(join(root, path), { recursive: true });
  writeFileSync(join(root, 'src/content/portfolio.json'), JSON.stringify(config));
  for (const name of ['favicon.svg', 'share.png']) writeFileSync(join(root, 'public/images', name), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  writeFileSync(join(root, 'index.html'), '<html><head></head><body><script type="module" src="/entry.js"></script></body></html>');
  writeFileSync(join(root, 'entry.js'), "import sessions from 'virtual:portfolio-sessions'; document.body.dataset.sessions=JSON.stringify(sessions);");
  const server = await createServer({ root, configFile: false, plugins: [portfolioPlugin(root)], logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
  try {
    await server.listen();
    const address = server.httpServer!.address() as { port: number };
    const url = `http://127.0.0.1:${address.port}/@id/__x00__virtual:portfolio-sessions`;
    const until = async (predicate: () => Promise<boolean> | boolean) => {
      const deadline = Date.now() + 8000;
      while (Date.now() < deadline) {
        if (await predicate()) return;
        await new Promise(done => setTimeout(done, 30));
      }
      assert.fail('Session watcher did not reflect the filesystem change.');
    };
    const source = async () => (await fetch(url)).text();
    assert.match(await source(), /export default \[\]/);
    await until(() => Object.keys(server.watcher.getWatched()).some(path => path.endsWith('sessions')));
    const folder = join(root, 'public/sessions/late-session');
    mkdirSync(folder);
    const image = await sharp({ create: { width: 80, height: 50, channels: 3, background: '#264f61' } }).jpeg().toBuffer();
    writeFileSync(join(folder, 'DSC_0001.JPG'), image);
    await until(async () => (await source()).includes('Late session'));
    const first = await source();
    assert.match(first, /media\/[a-f0-9]{24}-960.webp/);
    const media = first.match(/media\/[a-f0-9]{24}-960.webp/)![0];
    assert.equal((await fetch(`http://127.0.0.1:${address.port}/${media}`)).headers.get('content-type'), 'image/webp');
    writeFileSync(join(folder, 'DSC_0001.JPG'), await sharp({ create: { width: 90, height: 60, channels: 3, background: '#574134' } }).jpeg().toBuffer());
    await until(async () => !(await source()).includes(media));
    writeFileSync(join(folder, 'session.json'), '{');
    await until(async () => (await fetch(url)).status === 500);
    writeFileSync(join(folder, 'session.json'), JSON.stringify({ title: 'Recovered session' }));
    await until(async () => (await source()).includes('Recovered session'));
    renameSync(folder, join(root, 'public/sessions/renamed-session'));
    await until(async () => (await source()).includes('"slug":"renamed-session"'));
    rmSync(join(root, 'public/sessions/renamed-session'), { recursive: true });
    await until(async () => /export default \[\]/.test(await source()));
  } finally { await server.close(); rmSync(root, { recursive: true, force: true }); }
});
