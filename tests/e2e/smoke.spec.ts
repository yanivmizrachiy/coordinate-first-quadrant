import { test, expect } from '@playwright/test';

test('the canonical address opens directly on the digital book', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.lxbook')).toHaveCount(1);
  await expect(page.locator('.lx-half--left .cover-sheet')).toHaveCount(1);
  await expect(page.locator('.landing')).toHaveCount(0);
  await expect(page.locator('.lx-entry__btn')).toHaveText('התחל');
  const barDisplay = await page.locator('.appbar').evaluate((el) => getComputedStyle(el).display);
  expect(barDisplay).toBe('none');
});

test('legacy teacher links remain compatible with the same book', async ({ page }) => {
  for (const hash of ['#/', '#/menu', '#/book', '#/workbook', '#/games']) {
    await page.goto('/' + hash);
    await expect(page.locator('.lxbook'), `${hash} does not reach the canonical reader`).toHaveCount(1);
    await expect(page.locator('.lx-half--left .cover-sheet')).toHaveCount(1);
  }
});

test('all former site materials are reachable from the book toolbar', async ({ page }) => {
  await page.goto('/#/');
  const acts = page.locator('.lx-topbar__acts');
  for (const label of ['סרטון', 'פתיח', 'תשובות', 'המחשות', 'מצב קריאה נגיש', 'הורדת החוברת', 'הדפסה', 'שיתוף']) {
    await expect(acts.getByText(label, { exact: false }), `missing action ${label}`).toBeVisible();
  }
  await expect(acts.getByText('חזרה לאתר')).toHaveCount(0);
});

test('the curriculum video opens immediately in one privacy-enhanced modal', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('button', { name: 'סרטון', exact: true }).click();
  const modal = page.locator('.unified-media__dialog');
  await expect(modal).toBeVisible();
  const frame = modal.locator('iframe');
  await expect(frame).toHaveCount(1);
  const src = await frame.getAttribute('src');
  expect(src).toContain('youtube-nocookie.com/embed/h5wegXI2ZGw');
  expect(src).toContain('autoplay=1');
  expect(src).toContain('cc_load_policy=1');
  await page.getByRole('button', { name: 'סגירה' }).click();
  await expect(page.locator('.unified-media')).toHaveCount(0);
  await expect(page.locator('.lxbook')).toHaveCount(1);
});

test('the original local opening film is preserved in the unified site', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('button', { name: 'פתיח', exact: true }).click();
  const video = page.locator('.unified-media video');
  await expect(video).toHaveCount(1);
  await expect(video.locator('source[type="video/webm"]')).toHaveAttribute('src', /opening-720\.webm/);
  await expect(video.locator('source[type="video\/mp4"]')).toHaveAttribute('src', /opening-720\.mp4/);
});

test('the book opens naturally from the cover to contents/page 1', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.lxbook')).toHaveAttribute('data-open', 'false');
  await page.locator('.lx-entry__btn').click();
  await expect(page.locator('.lxbook')).toHaveAttribute('data-open', 'true', { timeout: 4000 });
  const view = await page.locator('.lxbook').getAttribute('data-view');
  if (view === 'double') {
    await expect(page.locator('.lx-half--right .toc-sheet')).toHaveCount(1);
    await expect(page.locator('.lx-half--left .sheet-number')).toHaveText('1');
  } else {
    await expect(page.locator('.lx-half--left .toc-sheet')).toHaveCount(1);
  }
  await expect(page.locator('.lx-toolbar')).toBeVisible();
});

test('phone layout is a readable single page without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/');
  await expect(page.locator('.lxbook')).toHaveAttribute('data-view', 'single');
  const overflow = await page.evaluate(() => document.scrollingElement!.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const startBox = await page.locator('.lx-entry__btn').boundingBox();
  expect(startBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(startBox?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test('a direct worksheet link still renders the live canonical page', async ({ page }) => {
  await page.goto('/#/workbook/3');
  await expect(page.locator('.sheet')).toHaveCount(1);
  expect(await page.locator('.coordinate-grid svg').count()).toBeGreaterThan(0);
  await expect(page.locator('.appbar')).toBeVisible();
});

test('print surface remains the complete 80-sheet A4 book', async ({ page }) => {
  await page.goto('/#/print');
  await expect(page.locator('.book > .sheet')).toHaveCount(80, { timeout: 15000 });
  await expect(page.locator('.cover-sheet')).toHaveCount(1);
  await expect(page.locator('.toc-sheet')).toHaveCount(1);
});

test('the approved cover is never stretched', async ({ page }) => {
  await page.goto('/#/print');
  const ratios = await page.locator('.cover-image').evaluate((el) => {
    const image = el as HTMLImageElement;
    const rect = image.getBoundingClientRect();
    return { natural: image.naturalWidth / image.naturalHeight, shown: rect.width / rect.height };
  });
  expect(Math.abs(ratios.natural - ratios.shown)).toBeLessThan(0.02);
});

test('answers and aids keep an obvious route back to the same book', async ({ page }) => {
  for (const hash of ['#/solutions', '#/print-aids']) {
    await page.goto('/' + hash);
    await expect(page.locator('.appbar')).toBeVisible();
    await expect(page.getByRole('button', { name: 'חזרה לחוברת הדיגיטלית' })).toBeVisible();
  }
});
