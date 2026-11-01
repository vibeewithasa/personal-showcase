import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { parsePortfolio } from '../../src/content/schema';

const portfolio = parsePortfolio(JSON.parse(readFileSync(new URL('../../src/content/portfolio.json', import.meta.url), 'utf8')));

// Serve the actual build through request interception, as a plain static host would.
test('production build works at a domain root and in a subdirectory without rewrites', async ({ page }) => {
  const root = resolve('dist');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const prefix of ['/', '/my-portfolio/']) {
    await page.route('http://portfolio.test/**', async route => {
      const path = new URL(route.request().url()).pathname;
      if (!path.startsWith(prefix)) return route.fulfill({ status: 404 });
      const file = resolve(root, path.slice(prefix.length) || 'index.html');
      if (!file.startsWith(root + sep)) return route.fulfill({ status: 403 });
      try { await route.fulfill({ path: file }); }
      catch { errors.push(`Missing production file: ${path}`); await route.fulfill({ status: 404 }); }
    });
    const response = await page.goto(`http://portfolio.test${prefix}`);
    const html = await response!.text();
    expect(html.indexOf('charset=')).toBeLessThan(html.indexOf('<title>'));
    await expect(page.getByRole('heading', { level: 1 })).toContainText(portfolio.identity.name);
    await expect(page).toHaveTitle(portfolio.seo.title);
    const project = portfolio.projects[0];
    if (project) {
      const cover = page.getByRole('link', { name: `View ${project.title}`, exact: true });
      await cover.scrollIntoViewIfNeeded();
      await expect.poll(() => cover.locator('img').evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
      await cover.click();
      await page.reload();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title);
      await page.getByRole('button', { name: /Enlarge image 1:/ }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: 'Close', exact: true }).click();
    } else {
      await expect(page.getByRole('heading', { name: 'New work is on its way.' })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.unrouteAll({ behavior: 'wait' });
  }
  expect(errors).toEqual([]);
});
