import { test, expect } from '@playwright/test';
test('gallery can recover when an unavailable image becomes reachable', async ({
  page,
}) => {
  let available = false;
  await page.route('**/slow-test-photo.svg', (route) =>
    available
      ? route.fulfill({
          contentType: 'image/svg+xml',
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"/>',
        })
      : route.abort(),
  );
  await page.goto('/tests/fixtures/gallery.html?mode=loading');
  await expect(
    page.getByText('Photograph unavailable', { exact: true }),
  ).toBeVisible();
  available = true;
  await page.getByRole('button', { name: 'Retry photographs' }).click();
  await expect(page.locator('.photo-is-loaded')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Retry photographs' }),
  ).toHaveCount(0);
});
test('render failures present a recovery screen rather than an empty page', async ({
  page,
}) => {
  await page.goto('/tests/fixtures/gallery.html?mode=crash');
  await expect(
    page.getByRole('heading', { name: 'Something went wrong.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reload page' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Back to portfolio' }),
  ).toHaveAttribute('href', '/portfolio');
});
test('metadata follows project navigation and unknown pages cannot be indexed', async ({
  page,
}) => {
  await page.route('https://res.cloudinary.com/**', (route) => route.abort());
  await page.goto('/projects/devon-x-chriz');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'DEVON X CHRIZ — CHRIZ',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /v1753950999/,
  );
  await page.getByRole('link', { name: /Next project/ }).click();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'UCBFW X CHRIZ — CHRIZ',
  );
  await page.goto('/missing');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  await page.getByRole('link', { name: /Explore the portfolio/ }).click();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index,follow',
  );
});
test('project enquiry carries a verified project reference to contact', async ({
  page,
}) => {
  await page.route('https://res.cloudinary.com/**', (r) => r.abort());
  await page.goto('/projects/itza-x-chriz');
  await page.getByRole('link', { name: /Enquire about this work/ }).click();
  await expect(page).toHaveURL(/contact\?project=itza-x-chriz/);
  await expect(
    page.getByText(
      'For enquiries about ITZA X CHRIZ, get in touch with CHRIZ directly.',
    ),
  ).toBeVisible();
  await page.goto('/contact?project=untrusted-project');
  await expect(
    page.getByText('For project enquiries, get in touch with CHRIZ directly.'),
  ).toBeVisible();
});
