import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loadPortfolio } from '../../scripts/load-portfolio';
const owner = (await loadPortfolio()).config;

async function nav(page: Page) {
  await page.locator('.site-header').waitFor();
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  if (await menu.isVisible()) await menu.click();
  return page.locator('#main-navigation');
}
async function settledAnchor(page: Page, id: string) {
  const target = page.locator('#' + id);
  await expect(target).toBeFocused();
  await expect.poll(() => target.evaluate(element => {
    const wanted = parseFloat(getComputedStyle(element).scrollMarginTop);
    return Math.abs(element.getBoundingClientRect().top - wanted);
  })).toBeLessThan(3);
  const header = await page.locator('.site-header').boundingBox();
  expect((await target.boundingBox())!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
}
async function finish(page: Page) {
  await page.evaluate(async () => { const effects = document.getAnimations(); effects.forEach(x => x.finish()); await Promise.allSettled(effects.map(x => x.finished)); });
}

test('editorial: anchors scroll through intermediate positions, repeat and preserve motion/history', async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.set(window, 'anchorCalls', []);
    const scroll = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(options) {
      const call = { id: this.id, behavior: typeof options === 'object' ? options.behavior : undefined, start: scrollY, frames: [] as number[] };
      Reflect.get(window, 'anchorCalls').push(call);
      const result = scroll.call(this, options);
      let frames = 0;
      const sample = () => { call.frames.push(scrollY); if (++frames < 90) requestAnimationFrame(sample); };
      requestAnimationFrame(sample); return result;
    };
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(frames, options) {
      const result = animate.call(this, frames, options);
      if (result.id === 'portfolio-word') Reflect.set(window, 'wordRuns', Number(Reflect.get(window, 'wordRuns') || 0) + 1);
      return result;
    };
  });
  await page.goto('/');
  if (!owner.about) {
    await (await nav(page)).getByRole('link', { name: 'Work', exact: true }).click();
    await settledAnchor(page, 'work'); return;
  }
  await (await nav(page)).getByRole('link', { name: 'About', exact: true }).click();
  await settledAnchor(page, 'about');
  expect(await page.evaluate(() => Reflect.get(window, 'anchorCalls').some((call: { id: string; behavior: string; start: number; frames: number[] }) => call.id === 'about' && call.behavior === 'smooth' && call.frames.some((y, i) => i > 0 && y > call.start + 2 && y < Math.max(...call.frames) - 2)))).toBe(true);
  const runs = await page.evaluate(() => Reflect.get(window, 'wordRuns'));
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await (await nav(page)).getByRole('link', { name: 'About', exact: true }).click();
  await settledAnchor(page, 'about');
  await (await nav(page)).getByRole('link', { name: 'Work', exact: true }).click();
  await settledAnchor(page, 'work');
  expect(await page.evaluate(() => Reflect.get(window, 'wordRuns'))).toBe(runs);
  await page.goBack(); await settledAnchor(page, 'about');
  await page.reload(); await settledAnchor(page, 'about');
});

test('editorial: anchors work when arriving from contact and project routes', async ({ page }) => {
  await page.goto('/#/contact');
  const label = owner.about ? 'About' : 'Work', id = owner.about ? 'about' : 'work';
  await (await nav(page)).getByRole('link', { name: label, exact: true }).click();
  await settledAnchor(page, id);
  const first = owner.projects[0];
  if (first) {
    await page.goto('/#/work/' + first.slug);
    await page.getByRole('heading', { level: 1, name: first.title, exact: true }).waitFor();
    await (await nav(page)).getByRole('link', { name: 'Work', exact: true }).click();
    await settledAnchor(page, 'work');
  }
});

test('editorial: reduced-motion anchors arrive immediately including direct links', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Reflect.set(window, 'scrollBehaviors', []);
    const scroll = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(options) { if (typeof options === 'object') Reflect.get(window, 'scrollBehaviors').push(options.behavior); return scroll.call(this, options); };
  });
  await page.goto('/#/' + (owner.about ? '#about' : '#work'));
  await settledAnchor(page, owner.about ? 'about' : 'work');
  await (await nav(page)).getByRole('link', { name: 'Work', exact: true }).click();
  await settledAnchor(page, 'work');
  expect(await page.evaluate(() => Reflect.get(window, 'scrollBehaviors').every((x: string) => x === 'instant'))).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test('editorial: actual sessions keep headings, photographic ratios and use previews before viewer', async ({ page }) => {
  const originals: string[] = [];
  page.on('request', request => { if (request.resourceType() === 'image' && /\/sessions\//.test(request.url())) originals.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('.project-row h3')).toHaveCount(owner.projects.length);
  for (const project of owner.projects) await expect(page.locator('.project-row').getByRole('heading', { name: project.title, exact: true })).toBeVisible();
  const project = owner.projects[0];
  if (!project) { await expect(page.getByText('New work is on its way.', { exact: true })).toBeVisible(); return; }
  if (project.cover.thumbnail) expect(originals).toEqual([]);
  await page.getByRole('link', { name: 'View ' + project.title, exact: true }).click();
  const images = project.gallery.length ? project.gallery : [project.cover];
  await expect(page.locator('.gallery-image')).toHaveCount(images.length);
  const first = page.locator('.gallery-image').first();
  if (images[0].width) {
    const ratio = await first.locator('.image-frame').evaluate(e => e.getBoundingClientRect().width / e.getBoundingClientRect().height);
    expect(Math.abs(ratio - images[0].width / images[0].height!)).toBeLessThan(.01);
  }
  await first.click();
  await expect.poll(() => page.locator('dialog img').evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
  if (images[0].display) {
    await expect(page.locator('dialog img')).toHaveAttribute('src', /-1920.webp$/);
    expect(originals).toEqual([]);
    const response = await page.request.get('/' + images[0].src);
    expect(response.status()).toBe(200);
  }
  if (images[0].caption) await expect(page.locator('.lightbox-caption')).toContainText(images[0].caption);
  await page.keyboard.press('Escape');
  await expect(first).toBeFocused();
});

test('editorial: a large mixed gallery, long titles, light theme and no about stay usable', async ({ page }) => {
  const first = owner.projects[0];
  if (!first) { await page.goto('/'); await expect(page.getByText('New work is on its way.', { exact: true })).toBeVisible(); return; }
  const photos = first.gallery.length ? first.gallery : [first.cover];
  const project = { ...first, slug: 'many-photographs', title: 'Light and the spaces between photographs', gallery: Array.from({ length: 30 }, (_, i) => ({ ...photos[i % photos.length], caption: 'Frame ' + (i + 1) })) };
  const config = structuredClone(owner); config.projects = []; delete config.about;
  config.identity.name = 'Alexandria Montgomery Independent Creative Practice';
  config.theme = { background: '#fafaf4', surface: '#eeeee2', text: '#171a12', muted: '#434b36', accent: '#3e4e13' };
  await page.route(/\/src\/content\/portfolio\.json(?:\?.*)?$/, route => route.fulfill({ contentType: 'application/javascript', body: 'export default ' + JSON.stringify(config) }));
  await page.route(/virtual:portfolio-sessions/, route => route.fulfill({ contentType: 'application/javascript', body: 'export default ' + JSON.stringify([project]) }));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(config.identity.name);
  await expect(page.locator('#about')).toHaveCount(0);
  await page.getByRole('link', { name: 'View ' + project.title, exact: true }).click();
  await expect(page.locator('.gallery-image')).toHaveCount(30);
  const last = page.locator('.gallery-image').last(); await last.click(); await finish(page);
  await expect(page.getByRole('status')).toHaveText('30 / 30');
  await page.keyboard.press('ArrowRight'); await expect(page.getByRole('status')).toHaveText('1 / 30');
  await page.keyboard.press('ArrowLeft'); await expect(page.getByRole('status')).toHaveText('30 / 30');
  await finish(page);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape'); await expect(last).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('editorial: broken generated images retain session navigation and viewer focus', async ({ page }) => {
  const project = owner.projects.find(p => p.cover.thumbnail);
  if (!project) { await page.goto('/'); await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); return; }
  await page.route('**/media/**', route => route.abort());
  await page.goto('/');
  const link = page.getByRole('link', { name: 'View ' + project.title, exact: true });
  await link.scrollIntoViewIfNeeded();
  await expect(link.getByText('Image unavailable', { exact: true })).toBeVisible();
  await link.click();
  const first = page.locator('.gallery-image').first(); await first.click();
  await expect(page.getByRole('dialog').getByText('Image unavailable', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(first).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
});
