import { loadPortfolio } from '../../scripts/load-portfolio';
import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const demo = JSON.parse(readFileSync(new URL('../fixtures/portfolio.json', import.meta.url), 'utf8'));
const owner = (await loadPortfolio()).config;

test.beforeEach(async ({ page }) => {
  await page.route(/virtual:portfolio-sessions/, route => route.fulfill({ contentType: 'application/javascript', body: 'export default [];' }));
  await page.route(/\/src\/content\/portfolio\.json(?:\?.*)?$/, route => route.fulfill({ contentType: 'application/javascript', body: `export default ${JSON.stringify(demo)};` }));
  await page.route('**/images/**', route => {
    const path = resolve('tests/fixtures/images', new URL(route.request().url()).pathname.split('/').pop()!);
    return existsSync(path) ? route.fulfill({ path }) : route.continue();
  });
});

async function probe(page: Page, paused: string[] = []) {
  await page.addInitScript(effects => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, frames, options) {
      const animation = original.call(this, frames, options);
      if (animation.id.startsWith('portfolio-')) {
        Reflect.set(this, '__motionRuns', Number(Reflect.get(this, '__motionRuns') || 0) + 1);
        if (effects.includes(animation.id.replace('portfolio-', ''))) animation.pause();
      }
      return animation;
    };
  }, paused);
}

async function hasEffect(page: Page, effect: string) {
  return page.evaluate(name => document.getAnimations().some(animation => animation.id === `portfolio-${name}`), effect);
}

async function finish(page: Page) {
  await page.evaluate(async () => {
    const animations = document.getAnimations().filter(animation => animation.id.startsWith('portfolio-'));
    animations.forEach(animation => animation.finish());
    await Promise.allSettled(animations.map(animation => animation.finished));
  });
}

test('motion: hero uses masked staggered typography and settles to readable CSS', async ({ page }) => {
  await probe(page, ['word', 'line', 'rise', 'button']);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: demo.identity.name, exact: true })).toBeVisible();
  await expect.poll(() => hasEffect(page, 'word')).toBe(true);
  const sequence = await page.locator('.hero [data-motion="word"]').evaluateAll(elements => elements.map(element => {
    const animation = element.getAnimations()[0];
    return { delay: animation.effect!.getTiming().delay ?? 0, frames: (animation.effect as KeyframeEffect).getKeyframes() };
  }));
  expect(sequence.length).toBeGreaterThan(1);
  expect(sequence[1].delay).toBeGreaterThan(sequence[0].delay);
  expect(sequence[0].frames[0].transform).toContain('translateY');
  expect(await hasEffect(page, 'button')).toBe(true);
  await finish(page);
  await expect(page.locator('.hero [data-motion="word"]').first()).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-intro')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('motion: image shutters reveal once and scroll depth is bounded', async ({ page }) => {
  await probe(page, ['picture', 'picture-reverse']);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const project = page.getByRole('link', { name: 'View After Hours', exact: true });
  await project.scrollIntoViewIfNeeded();
  await expect.poll(() => project.evaluate(element => Number(Reflect.get(element, '__motionRuns') || 0))).toBe(1);
  const animation = await project.evaluate(element => (element.getAnimations()[0].effect as KeyframeEffect).getKeyframes());
  expect(animation[0].clipPath).not.toBe(animation[1].clipPath);
  await finish(page);
  const image = project.locator('.image-frame');
  const before = await image.evaluate(element => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollBy(0, 160));
  await expect.poll(() => image.evaluate(element => getComputedStyle(element).transform)).not.toBe(before);
  expect(Math.abs(await project.evaluate(element => parseFloat((element as HTMLElement).style.getPropertyValue('--image-drift'))))).toBeLessThan(25);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => project.evaluate(element => element.getBoundingClientRect().top > innerHeight)).toBe(true);
  await project.scrollIntoViewIfNeeded();
  expect(await project.evaluate(element => Reflect.get(element, '__motionRuns'))).toBe(1);
});

test('motion: mobile menu has cancellable open/close and navigation never waits for exit', async ({ page }) => {
  await probe(page, ['menu-open', 'menu-close']);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const nav = page.locator('#main-navigation');
  await expect.poll(() => hasEffect(page, 'menu-open')).toBe(true);
  await expect(nav).not.toHaveAttribute('inert');
  await finish(page);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect.poll(() => hasEffect(page, 'menu-close')).toBe(true);
  await expect(nav).toHaveAttribute('inert');
  await page.setViewportSize({ width: 900, height: 1000 });
  await expect(nav).not.toHaveAttribute('inert');
  await expect(nav).toHaveCSS('pointer-events', 'auto');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(nav).toHaveAttribute('inert');
  await finish(page);
  await expect(nav).not.toBeVisible();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
  await finish(page);
  await expect(nav).not.toBeVisible();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await finish(page);
  await nav.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/#\/contact$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => hasEffect(page, 'page')).toBe(true);
});

test('motion: native dialog animates surfaces, photos, counter and close while retaining focus', async ({ page }) => {
  await probe(page, ['gallery-open', 'gallery-close', 'image-next', 'image-previous', 'counter']);
  await page.goto('/#/work/field-notes');
  const opener = page.getByRole('button', { name: /Enlarge image 1:/ });
  await opener.click();
  // Development StrictMode may restart the initial effect before its passive cleanup in WebKit.
  const reveals = await opener.evaluate(element => Number(Reflect.get(element, '__motionRuns')));
  expect(reveals).toBeGreaterThanOrEqual(1);
  await expect.poll(() => hasEffect(page, 'gallery-open')).toBe(true);
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await finish(page);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('status')).toHaveText('2 / 2');
  await expect.poll(() => hasEffect(page, 'image-next')).toBe(true);
  expect(await hasEffect(page, 'counter')).toBe(true);
  await finish(page);
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('status')).toHaveText('1 / 2');
  await expect.poll(() => hasEffect(page, 'image-previous')).toBe(true);
  await finish(page);
  await page.keyboard.press('Escape');
  await expect.poll(() => hasEffect(page, 'gallery-close')).toBe(true);
  await expect(page.locator('dialog')).toHaveAttribute('open');
  await finish(page);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await opener.evaluate(element => Reflect.get(element, '__motionRuns'))).toBe(reveals);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
});

test('motion: reduced preference and live changes remove movement without hiding content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  const config = structuredClone(demo);
  config.identity.name = 'AlexandriaMontgomeryCreativePractice';
  config.identity.logo = { src: 'images/favicon.svg', alt: 'Studio mark' };
  config.projects = [config.projects[0]];
  config.projects[0].gallery = [];
  delete config.about;
  config.theme = { background: '#fafaf4', surface: '#eeeee2', text: '#171a12', muted: '#434b36', accent: '#3e4e13' };
  await page.route(/\/src\/content\/portfolio\.json(?:\?.*)?$/, route => route.fulfill({ contentType: 'application/javascript', body: `export default ${JSON.stringify(config)};` }));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${config.identity.name}.`);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(axe.violations).toEqual([]);
  await page.getByRole('link', { name: 'View Field Notes', exact: true }).click();
  await page.getByRole('button', { name: /Enlarge image 1:/ }).click();
  expect(await hasEffect(page, 'gallery-open')).toBe(false);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await probe(page, ['gallery-open']);
  await page.reload();
  await page.getByRole('button', { name: /Enlarge image 1:/ }).click();
  await expect.poll(() => hasEffect(page, 'gallery-open')).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => hasEffect(page, 'gallery-open')).toBe(false);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('motion: ordinary long identity words stay whole at 320px', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  const config = structuredClone(demo);
  config.identity.name = 'Alexandria Montgomery Independent Creative Practice';
  await page.route(/\/src\/content\/portfolio\.json(?:\?.*)?$/, route => route.fulfill({ contentType: 'application/javascript', body: `export default ${JSON.stringify(config)};` }));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(config.identity.name);
  const lines = await page.locator('.word-mask > span').evaluateAll(words => words.map(word => word.getBoundingClientRect().height / parseFloat(getComputedStyle(word).lineHeight)));
  expect(lines.every(count => count < 1.1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('motion: blocked animation API leaves readable pages and usable controls', async ({ page }) => {
  await page.addInitScript(() => { Element.prototype.animate = () => { throw new Error('Animation API blocked for fallback test'); }; });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(demo.identity.name);
  await expect(page.locator('.hero [data-motion="word"]').first()).toHaveCSS('transform', 'none');
  await page.getByRole('link', { name: 'View Field Notes', exact: true }).click();
  const opener = page.getByRole('button', { name: /Enlarge image 1:/ });
  await opener.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  expect(errors).toEqual([]);
});

test('motion: failed photos keep the viewer geometry and release scroll on close', async ({ page }) => {
  await page.route('**/images/field-detail.svg', route => route.abort());
  await page.goto('/#/work/field-notes');
  await page.getByRole('button', { name: /Enlarge image 1:/ }).click();
  await finish(page);
  const frame = page.locator('.lightbox-image');
  const height = await frame.evaluate(element => element.getBoundingClientRect().height);
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog').getByText('Image unavailable', { exact: true })).toBeVisible();
  await finish(page);
  expect(Math.abs(await frame.evaluate(element => element.getBoundingClientRect().height) - height)).toBeLessThan(1);
  await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
});

test('motion: no JavaScript still serves the actual readable portfolio', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  try {
    const page = await context.newPage();
    const root = resolve('dist');
    await page.route('http://noscript.test/**', async route => {
      const path = new URL(route.request().url()).pathname.slice(1) || 'index.html';
      const file = resolve(root, path);
      if (!file.startsWith(root + sep)) return route.fulfill({ status: 403 });
      await route.fulfill({ path: file });
    });
    await page.goto('http://noscript.test/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(owner.identity.name);
    await expect(page.locator('.noscript-project')).toHaveCount(owner.projects.length);
    await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally {
    await context.close();
  }
});
