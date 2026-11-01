import { expect, test } from '@playwright/test';

test('trusted touch gestures advance, reverse and ignore vertical swipes', async ({
  page,
}) => {
  await page.goto('/tests/fixtures/gallery.html');
  expect(await page.evaluate(() => navigator.maxTouchPoints)).toBeGreaterThan(
    0,
  );
  await page
    .getByRole('button', { name: 'Open photograph: First test shape' })
    .tap();
  const frame = page.getByRole('dialog').locator('.photo-frame');
  const bounds = (await frame.boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  async function swipe(dx: number, dy = 0) {
    const x = bounds.x + bounds.width / 2 - dx / 2;
    const y = bounds.y + bounds.height / 2 - dy / 2;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + (dx * i) / 8, y: y + (dy * i) / 8 }],
      });
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
  }
  await swipe(-160);
  await expect(
    page.getByRole('dialog').getByText('Second caption'),
  ).toBeVisible();
  await swipe(160);
  await expect(
    page.getByRole('dialog').getByText('First caption'),
  ).toBeVisible();
  await swipe(-60, 160);
  await expect(
    page.getByRole('dialog').getByText('First caption'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close photo viewer' }).tap();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await cdp.detach();
});
