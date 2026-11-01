import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const demo = JSON.parse(readFileSync(new URL('../../src/content/portfolio.json', import.meta.url), 'utf8'));

async function navigation(page: Page) {
  const menu = page.getByRole('button', { name: 'Menu' });
  if (await menu.isVisible()) await menu.click();
  return page.getByRole('navigation', { name: 'Main navigation' });
}

async function customize(page: Page, config: typeof demo) {
  await page.route(/\/src\/content\/portfolio\.json(?:\?.*)?$/, route => route.fulfill({
    contentType: 'application/javascript', body: `export default ${JSON.stringify(config)};`,
  }));
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

async function accessible(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
}

test('projects have working detail routes, a modal gallery, and refreshable URLs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(demo.identity.name);
  await page.getByRole('link', { name: 'View Field Notes', exact: true }).click();
  await expect(page).toHaveURL(/#\/work\/field-notes$/);
  await expect(page).toHaveTitle(`Field Notes — ${demo.identity.name}`);
  await page.reload();
  const opener = page.getByRole('button', { name: /Enlarge image 1:/ });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('status')).toHaveText('2 / 2');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('status')).toHaveText('1 / 2');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.getByRole('status')).toHaveText('2 / 2');
  for (let count = 0; count < 6; count++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true);
  }
  await accessible(page);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await page.getByRole('link', { name: 'Next project Common Ground' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Common Ground');
  await page.getByRole('link', { name: 'All work' }).click();
  await expect(page).toHaveTitle(demo.seo.title);
  expect(errors).toEqual([]);
  await noOverflow(page);
});

test('keyboard skip link, mobile disclosure, and about navigation work', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const menu = page.getByRole('button', { name: 'Menu' });
  if (await menu.isVisible()) {
    await expect(page.getByRole('navigation')).not.toBeVisible();
    await menu.click();
    await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(page.getByRole('navigation')).not.toBeVisible();
  }
  const nav = await navigation(page);
  await nav.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.locator('#about')).toBeFocused();
  await expect(page.locator('#about')).toBeInViewport();
  await noOverflow(page);
});

test('home, project, and contact pass automated accessibility checks', async ({ page }) => {
  await page.goto('/');
  await accessible(page);
  await page.getByRole('link', { name: 'View Field Notes', exact: true }).click();
  await accessible(page);
  const nav = await navigation(page);
  await nav.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Let's talk.");
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await accessible(page);
});

test('unknown pages and unknown projects recover to work', async ({ page }) => {
  for (const route of ['/#/missing', '/#/work/missing']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('A different direction.');
    await page.getByRole('link', { name: 'Back to selected work' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(demo.identity.name);
  }
});

test('image errors show an alternative and retain project navigation', async ({ page }) => {
  await page.route('**/images/field-cover.svg', route => route.abort());
  await page.goto('/');
  const link = page.getByRole('link', { name: 'View Field Notes', exact: true });
  await link.scrollIntoViewIfNeeded();
  await expect(link.getByText('Image unavailable', { exact: true })).toBeVisible();
  await link.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Field Notes');
  await page.getByRole('button', { name: /Enlarge image 1:/ }).click();
  await expect(page.getByRole('dialog').getByText('Image unavailable', { exact: true })).toBeVisible();
});

test('one-file customization changes identity, colours, images, contact, and optional sections', async ({ page }) => {
  const config = structuredClone(demo);
  config.demo = false;
  config.identity = {
    name: 'Mara Sol', role: 'Artist & maker', intro: 'Objects and visual experiments, made with care.',
    logo: { src: 'images/favicon.svg', alt: 'Mara Sol mark' },
    portrait: { src: 'images/after-cover.svg', alt: 'Mara Sol studio artwork' },
  };
  config.theme = { background: '#fafaf4', surface: '#eeeee2', text: '#171a12', muted: '#434b36', accent: '#3e4e13' };
  config.contact = { email: 'mara@example.com', phone: '+1 (555) 123-4567', note: 'Tell me what you are making.', links: [{ label: 'Journal', url: 'https://example.com/journal' }] };
  config.projects = [config.projects[0]];
  config.projects[0].title = 'A new project';
  config.projects[0].gallery = [];
  config.projects[0].cover = { src: 'images/after-cover.svg', alt: 'Replacement blue artwork' };
  delete config.about;
  await customize(page, config);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mara Sol');
  await expect(page.getByText('Demo portfolio', { exact: true })).toHaveCount(0);
  await expect(page.locator('#about')).toHaveCount(0);
  await expect(page.getByText('1 project', { exact: true })).toBeVisible();
  await expect(page.getByAltText('Replacement blue artwork')).toHaveAttribute('src', /images\/after-cover\.svg$/);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim())).toBe('#3e4e13');
  await accessible(page);
  await page.getByRole('link', { name: 'View A new project', exact: true }).click();
  await expect(page.getByRole('button', { name: /Enlarge image/ })).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Next project/ })).toHaveCount(0);
  const nav = await navigation(page);
  await expect(nav.getByRole('link', { name: 'About' })).toHaveCount(0);
  await nav.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page.getByRole('link', { name: 'mara@example.com' })).toHaveAttribute('href', 'mailto:mara@example.com');
  await expect(page.getByRole('link', { name: '+1 (555) 123-4567' })).toHaveAttribute('href', 'tel:+15551234567');
  await expect(page.getByRole('link', { name: /Journal/ })).toHaveAttribute('rel', 'noopener noreferrer');
  await noOverflow(page);
  await accessible(page);
});

test('empty portfolio and absent contact methods are clear and usable', async ({ page }) => {
  const config = structuredClone(demo);
  config.projects = [];
  config.contact = { links: [] };
  delete config.about;
  await customize(page, config);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'New work is on its way.' })).toBeVisible();
  await expect(page.getByText('0 projects', { exact: true })).toBeVisible();
  await page.goto('/#/contact');
  await expect(page.getByText('Contact details will be available here soon.')).toBeVisible();
  await expect(page.locator('form, a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
  await accessible(page);
});

test('reduced motion, narrow screens, and long content remain readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  const config = structuredClone(demo);
  config.identity.name = 'Alexandra Montgomery';
  config.identity.intro = 'Independent creative direction and carefully considered visual identities for people with something to say. '.repeat(3);
  config.projects[0].title = 'An exceptionally considered editorial collaboration';
  await customize(page, config);
  await page.goto('/');
  await noOverflow(page);
  expect(await page.locator('.primary-link').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  await page.getByRole('link', { name: 'View selected work' }).click();
  await expect(page.locator('#work')).toBeFocused();
  await expect(page.locator('#work')).toBeInViewport();
  await accessible(page);
});
