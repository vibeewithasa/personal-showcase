import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/portfolio',
  '/about',
  '/contact',
  '/projects/devon-x-chriz',
  '/projects/ucbfw-x-chriz',
  '/projects/itza-x-chriz',
  '/missing',
];
test.beforeEach(async ({ page }) => {
  await page.route('https://res.cloudinary.com/**', (route) => route.abort());
});

test('all pages satisfy automated WCAG checks', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(audit.violations, route).toEqual([]);
  }
});

test('gallery images preserve measured aspect ratios and lightbox fits the viewport', async ({
  page,
}) => {
  await page.goto('/tests/fixtures/gallery.html');
  const images = page.locator('.gallery-photo img');
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    await expect(image).toHaveJSProperty('complete', true);
    const measurement = await image.evaluate((img) => ({
      natural: img.naturalWidth / img.naturalHeight,
      display:
        img.getBoundingClientRect().width / img.getBoundingClientRect().height,
    }));
    expect(measurement.display).toBeCloseTo(measurement.natural, 1);
    await expect(image).not.toHaveAttribute('srcset');
  }
  await page
    .getByRole('button', { name: 'Open photograph: First test shape' })
    .click();
  const dialog = page.getByRole('dialog');
  const box = (await dialog.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.width).toBe(viewport.width);
  expect(box.height).toBe(viewport.height);
  const photo = dialog.locator('img');
  await expect(photo).toHaveCSS('object-fit', 'contain');
  expect(
    await dialog.evaluate((el) => el.scrollHeight <= el.clientHeight),
  ).toBe(true);
  await page.keyboard.press('Shift+Tab');
  expect(
    await page.evaluate(() => !!document.activeElement?.closest('dialog')),
  ).toBe(true);
});

test('loading, success and failure preserve a known photograph frame', async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/slow-test-photo.svg', async (route) => {
    await gate;
    await route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#444"/></svg>',
    });
  });
  await page.goto('/tests/fixtures/gallery.html?mode=loading', {
    waitUntil: 'domcontentloaded',
  });
  const frame = page.locator('.photo-frame');
  await expect(page.getByRole('status')).toHaveText('Loading photograph…');
  const before = await frame.boundingBox();
  release();
  await expect(frame).toHaveAttribute('aria-busy', 'false');
  await expect(frame).toHaveClass(/photo-is-loaded/);
  expect((await frame.boundingBox())!.height).toBeCloseTo(before!.height, 0);
  await page.unroute('**/slow-test-photo.svg');
  await page.route('**/slow-test-photo.svg', (route) => route.abort());
  await page.reload();
  await expect(
    page.getByText('Photograph unavailable', { exact: true }),
  ).toBeVisible();
  expect((await frame.boundingBox())!.height).toBeCloseTo(before!.height, 0);
});

test('Escape outside an open menu preserves focus and menus close on history navigation', async ({
  page,
  isMobile,
}) => {
  await page.goto('/portfolio');
  const project = page.getByRole('link', { name: 'View DEVON X CHRIZ' });
  await project.focus();
  await page.keyboard.press('Escape');
  await expect(project).toBeFocused();
  if (isMobile && page.viewportSize()!.width <= 700) {
    await page.getByRole('button', { name: 'Menu +' }).click();
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Contact' })
      .click();
    await page.getByRole('button', { name: 'Menu +' }).click();
    await page.goBack();
    await expect(page.getByRole('button', { name: 'Menu +' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  }
});

test('narrow reflow and short landscape lightbox keep controls available', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 700, height: 320 });
  await page.goto('/tests/fixtures/gallery.html?mode=long');
  await page.getByRole('button', { name: /Open photograph/ }).click();
  const dialog = page.getByRole('dialog');
  expect(
    await dialog.evaluate((el) => el.scrollHeight <= el.clientHeight),
  ).toBe(true);
  const close = (await page
    .getByRole('button', { name: 'Close photo viewer' })
    .boundingBox())!;
  expect(close.y).toBeGreaterThanOrEqual(0);
  expect(close.y + close.height).toBeLessThanOrEqual(320);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('each approved project requests its original media identity with responsive delivery', async ({
  page,
}) => {
  const expected = [
    [
      'devon-x-chriz',
      'v1753950999/Imagen_de_WhatsApp_2025-07-31_a_las_01.32.01_0859db68_esjsx9.jpg',
    ],
    ['ucbfw-x-chriz', 'v1753951613/UCBFW_x_CHRIZ_Album_kypoor.jpg'],
    ['itza-x-chriz', 'v1753951607/ITZA_x_CHRIZ_Album_zqwbob.jpg'],
  ];
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));
  for (const [slug, mediaPath] of expected) {
    await page.goto(`/projects/${slug}`);
    await expect(
      page.getByText('Photograph unavailable', { exact: true }),
    ).toBeVisible();
    expect(
      requested.some(
        (url) =>
          url.startsWith(
            'https://res.cloudinary.com/dimmyentl/image/upload/f_auto,q_auto,c_limit,w_',
          ) && url.endsWith(mediaPath),
      ),
    ).toBe(true);
  }
});
