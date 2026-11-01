import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { sitePaths, pageMetadata } from '../src/content/metadata.ts';
const origin = 'http://127.0.0.1:4183';
const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4183',
    '--strictPort',
  ],
  { stdio: 'ignore' },
);
let browser;
const results: { path: string; htmlMetadata: boolean; rendered: boolean }[] =
  [];
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw Error('Production preview exited');
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* server starting */
    }
    await setTimeout(100);
  }
  assert.ok(ready, 'Production preview did not start');
  browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  });
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('https://res.cloudinary.com/**', (r) => r.abort());
  for (const path of sitePaths()) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    const expected = pageMetadata(path);
    assert.ok(
      html.includes(
        `<title>${expected.title.replaceAll('&', '&amp;')}</title>`,
      ),
      `Static title missing: ${path}`,
    );
    assert.ok(
      html.includes(expected.image),
      `Static sharing image missing: ${path}`,
    );
    await page.goto(origin + path);
    await page.locator('main h1').waitFor();
    assert.equal(await page.title(), expected.title);
    results.push({ path, htmlMetadata: true, rendered: true });
  }
  const notFound = await (await fetch(origin + '/404.html')).text();
  assert.ok(notFound.includes('noindex,follow'));
  for (const path of ['/missing', '/projects/missing']) {
    await page.goto(origin + path);
    assert.equal(await page.locator('h1').textContent(), 'Page not found.');
  }
  await page.goto(origin + '/projects/devon-x-chriz');
  await page.getByRole('button', { name: /Open photograph/ }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  assert.deepEqual(errors, []);
  if (process.env.PRODUCTION_REPORT_PATH)
    writeFileSync(
      process.env.PRODUCTION_REPORT_PATH,
      JSON.stringify(
        { results, unknownRoutes: 2, static404: true, lightbox: true, errors },
        null,
        2,
      ),
    );
  console.log(
    'Production checks passed: 7 raw HTML metadata checks, 9 rendered routes, static noindex 404, lazy lightbox open/close; zero JavaScript exceptions.',
  );
} finally {
  await browser?.close();
  server.kill();
}
