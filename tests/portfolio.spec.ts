import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Make the unavailable-media path deterministic without relying on an external host.
  await page.route('https://res.cloudinary.com/**', (route) => route.abort());
});

test('all navigation destinations, contact and unknown routes work', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  if (isMobile && page.viewportSize()!.width <= 700) {
    await page.getByRole('button', { name: 'Menu +' }).click();
    const nav = (await page.getByRole('navigation').boundingBox())!;
    const main = (await page.locator('main').boundingBox())!;
    expect(nav.y + nav.height).toBeLessThanOrEqual(main.y);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Menu +' })).toBeFocused();
    await expect(page.getByRole('navigation')).not.toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CHRIZ㋛');
  for (const [name, heading] of [
    ['Portfolio', 'Selected work.'],
    ['About', 'CHRIZ'],
    ['Contact', 'Let’s makesomething.'],
    ['Home', 'CHRIZ㋛'],
  ]) {
    if (isMobile && page.viewportSize()!.width <= 700)
      await page.getByRole('button', { name: 'Menu +' }).click();
    await page
      .getByRole('navigation')
      .getByRole('link', { name, exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('main')).toBeFocused();
  }
  await page.goto('/contact');
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Instagram' }),
  ).toHaveAttribute('href', 'https://www.instagram.com/chriizz___/');
  await page.goto('/missing');
  await expect(
    page.getByRole('heading', { name: 'Page not found.' }),
  ).toBeVisible();
  await page.goto('/projects/missing');
  await expect(
    page.getByRole('heading', { name: 'Page not found.' }),
  ).toBeVisible();
});

test('project links, deep links, missing media, lightbox and next project', async ({
  page,
}) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('article')).toHaveCount(3);
  await page.getByRole('link', { name: 'View DEVON X CHRIZ' }).click();
  await expect(page).toHaveURL(/projects\/devon-x-chriz/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'DEVON X CHRIZ',
  );
  const opener = page.getByRole('button', { name: /Open photograph/ });
  await expect(
    page.getByText('Photograph unavailable', { exact: true }),
  ).toBeVisible();
  await opener.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(opener).toBeFocused();
  await page.getByRole('link', { name: /Next project/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'UCBFW X CHRIZ',
  );
});

test('gallery keyboard navigation wraps, focus is trapped and restored', async ({
  page,
}) => {
  await page.goto('/tests/fixtures/gallery.html');
  const opener = page.getByRole('button', {
    name: 'Open photograph: First test shape',
  });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Close photo viewer' }),
  ).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('dialog').getByText('Second caption'),
  ).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('dialog').getByText('First caption'),
  ).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(
    page.getByRole('dialog').getByText('Second caption'),
  ).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('dialog')),
    ).toBe(true);
  }
  await page.getByRole('button', { name: 'Close photo viewer' }).click();
  await expect(opener).toBeFocused();
});

test('responsive layouts do not overflow and reduced motion is respected', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of [
    '/',
    '/portfolio',
    '/about',
    '/contact',
    '/projects/itza-x-chriz',
    '/projects/devon-x-chriz',
    '/projects/ucbfw-x-chriz',
    '/missing',
  ]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto('/');
  const top = await page.locator('.hero-topline').boundingBox();
  const title = await page.locator('.hero-title').boundingBox();
  const bottom = await page.locator('.hero-bottom').boundingBox();
  expect(top!.y + top!.height).toBeLessThanOrEqual(title!.y);
  expect(title!.y + title!.height).toBeLessThanOrEqual(bottom!.y);
  await page.screenshot({
    path: testInfo.outputPath('home.png'),
    fullPage: true,
  });
});

test('category filtering and empty states', async ({ page }) => {
  await page.goto('/tests/fixtures/gallery.html?mode=portfolio');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Empty collection' }).click();
  await expect(page.getByRole('article')).toHaveCount(0);
  await expect(
    page.getByText('No projects in this collection yet.', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Test collection', exact: true })
    .click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Test collection', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/tests/fixtures/gallery.html?mode=empty');
  await expect(
    page.getByText('This collection is being prepared.', { exact: false }),
  ).toBeVisible();
});
