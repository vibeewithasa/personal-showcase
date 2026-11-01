import { chromium, devices } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const output = path.resolve(
  process.argv[2] || '/workspace/artifacts/chriz-review',
);
const baseURL = process.env.REVIEW_BASE_URL || 'http://127.0.0.1:5174';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  proxy: process.env.HTTPS_PROXY
    ? { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,localhost' }
    : undefined,
});
const routes = {
  home: '/',
  portfolio: '/portfolio',
  devon: '/projects/devon-x-chriz',
  ucbfw: '/projects/ucbfw-x-chriz',
  itza: '/projects/itza-x-chriz',
  about: '/about',
  contact: '/contact',
  'not-found': '/missing',
};
const results = [];
for (const [name, options] of Object.entries({
  desktop: { viewport: { width: 1440, height: 1000 } },
  tablet: { ...devices['iPad Mini'], defaultBrowserType: undefined },
  mobile: { ...devices['iPhone 13'], defaultBrowserType: undefined },
})) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.reviewMetrics = { cls: 0, lcp: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.reviewMetrics.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.reviewMetrics.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [routeName, route] of Object.entries(routes)) {
    const errors = [];
    const failedRequests = [];
    const failureListener = (request) =>
      failedRequests.push({
        url: request.url(),
        reason: request.failure()?.errorText,
      });
    page.on('requestfailed', failureListener);
    const listener = (error) => errors.push(error.message);
    page.on('pageerror', listener);
    const response = await page.goto(baseURL + route);
    await page.locator('h1').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += 600)
        window.scrollTo(0, y);
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    const layout = await page.evaluate(() => ({
      metrics: window.reviewMetrics,
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      images: [...document.images].map((i) => ({
        src: i.currentSrc,
        loaded: i.complete && i.naturalWidth > 0,
        width: i.naturalWidth,
        height: i.naturalHeight,
      })),
      fallbacks: document.querySelectorAll('.photo-fallback').length,
    }));
    const filename = `${name}-${routeName}.png`;
    await page.screenshot({
      path: path.join(output, filename),
      fullPage: true,
    });
    results.push({
      size: name,
      route,
      status: response.status(),
      screenshot: filename,
      errors,
      failedRequests,
      ...layout,
      violations: audit.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    page.off('pageerror', listener);
    page.off('requestfailed', failureListener);
    console.log(
      name,
      routeName,
      `HTTP ${response.status()}`,
      `axe ${audit.violations.length}`,
      `overflow ${layout.scrollWidth > layout.width}`,
    );
  }
  if (name === 'mobile') {
    await page.goto(baseURL + '/');
    await page.getByRole('button', { name: 'Menu +' }).click();
    await page.screenshot({
      path: path.join(output, 'mobile-navigation.png'),
      fullPage: false,
    });
  }
  await context.close();
}
await writeFile(
  path.join(output, 'review.json'),
  JSON.stringify(results, null, 2),
);
await browser.close();
