import { test, expect } from '@playwright/test';

test('one canonical white A4 reader replaces the old blue flipbook', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.cr-reader')).toHaveCount(1);
  await expect(page.locator('.cr-pages > .cr-cell')).toHaveCount(80);
  await expect(page.locator('.cr-cell[data-index="0"] .cover-sheet')).toHaveCount(1);
  await expect(page.locator('.lxbook, .lx-stage, .landing')).toHaveCount(0);
  await expect(page.locator('.cr-pages')).toHaveAttribute('data-view', 'scroll');
  const bg = await page.locator('.cr-reader').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe('rgb(243, 244, 246)');
  const barDisplay = await page.locator('.appbar').evaluate((el) => getComputedStyle(el).display);
  expect(barDisplay).toBe('none');
});

test('existing teacher links keep reaching the same reader', async ({ page }) => {
  for (const hash of ['#/', '#/menu', '#/book', '#/workbook', '#/games']) {
    await page.goto('/' + hash);
    await expect(page.locator('.cr-reader'), hash).toHaveCount(1);
    await expect(page.locator('.cr-cell[data-index="0"] .cover-sheet')).toHaveCount(1);
  }
});

test('book actions are available without duplicated toolbars', async ({ page }) => {
  await page.goto('/#/');
  const actions = page.locator('.cr-actions');
  for (const label of ['הורדה', 'הדפסה', 'סרטון', 'פתיח', 'תשובות', 'המחשות', 'שיתוף']) {
    await expect(actions.getByText(label, { exact: true }), label).toHaveCount(1);
  }
  await expect(page.locator('.cr-bar')).toHaveCount(1);
  await expect(page.locator('.cr-pages')).toHaveCount(1);
});

test('privacy-enhanced video remains accessible in one modal', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('button', { name: 'סרטון', exact: true }).click();
  const modal = page.locator('.unified-media__dialog');
  await expect(modal).toBeVisible();
  const src = await modal.locator('iframe').getAttribute('src');
  expect(src).toContain('youtube-nocookie.com/embed/h5wegXI2ZGw');
  expect(src).toContain('autoplay=1');
  expect(src).toContain('cc_load_policy=1');
  await page.getByRole('button', { name: 'סגירה' }).click();
  await expect(modal).toHaveCount(0);
});

test('the original local opening film stays linked', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('button', { name: 'פתיח', exact: true }).click();
  const video = page.locator('.unified-media video');
  await expect(video).toHaveCount(1);
  await expect(video.locator('source[type="video/webm"]')).toHaveAttribute('src', /opening-720\.webm/);
  await expect(video.locator('source[type="video\/mp4"]')).toHaveAttribute('src', /opening-720\.mp4/);
});

test('single-sheet navigation uses the actual A4 content and source ordering', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('button', { name: 'עמוד', exact: true }).click();
  await expect(page.locator('.cr-pages')).toHaveAttribute('data-view', 'single');
  await expect(page.locator('.cr-cell:not([hidden])')).toHaveCount(1);
  await page.getByRole('button', { name: 'העמוד הבא' }).click();
  await expect(page.locator('.cr-cell[data-index="1"] .toc-sheet')).toBeVisible();
  await page.getByRole('button', { name: 'העמוד הבא' }).click();
  await expect(page.locator('.cr-cell[data-index="2"] .sheet-number')).toHaveText('1');
  await expect(page.locator('.cr-count')).toHaveText('עמוד 1 מתוך 78');
});

test('contents navigation is derived from workbook chapters', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.cr-toc-link')).toHaveCount(16);
  if ((page.viewportSize()?.width ?? 1200) <= 780) {
    await page.getByRole('button', { name: 'תוכן העניינים', exact: true }).click();
  }
  const last = page.locator('.cr-toc-link').last();
  await last.click();
  await expect(page.locator('.cr-count')).toContainText('עמוד');
});

test('phone has no body-level horizontal overflow and scales identical A4', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/');
  await expect(page.locator('.cr-reader')).toBeVisible();
  const scale = await page.locator('.cr-pages').evaluate((el) =>
    Number(getComputedStyle(el).getPropertyValue('--cr-scale')),
  );
  expect(scale).toBeGreaterThan(0);
  expect(scale).toBeLessThan(0.6);
  const overflow = await page.evaluate(() => document.scrollingElement!.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'תוכן העניינים', exact: true }).click();
  await expect(page.locator('.cr-toc')).toBeVisible();
});

test('direct worksheet link still shows the canonical page', async ({ page }) => {
  await page.goto('/#/workbook/3');
  await expect(page.locator('.cr-reader')).toHaveCount(1);
  await expect(page.locator('.cr-pages')).toHaveAttribute('data-view', 'single');
  await expect(page.locator('.cr-cell:not([hidden])')).toHaveCount(1);
  await expect(page.locator('.cr-cell[data-index="4"] .sheet-number')).toHaveText('3');
  expect(await page.locator('.cr-cell[data-index="4"] .coordinate-grid svg').count()).toBeGreaterThan(0);
});

test('print surface preserves the full 80-sheet A4 book', async ({ page }) => {
  await page.goto('/#/print');
  await expect(page.locator('.book > .sheet')).toHaveCount(80, { timeout: 15000 });
  await expect(page.locator('.cover-sheet')).toHaveCount(1);
  await expect(page.locator('.toc-sheet')).toHaveCount(1);
  await expect(page.locator('.toc-buttons > .toc-btn')).toHaveCount(14);
});

test('cover artwork is never stretched or cropped', async ({ page }) => {
  await page.goto('/#/print');
  const ratios = await page.locator('.cover-image').evaluate((el) => {
    const img = el as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    return { natural: img.naturalWidth / img.naturalHeight, shown: rect.width / rect.height };
  });
  expect(Math.abs(ratios.natural - ratios.shown)).toBeLessThan(0.02);
});

test('answers and print aids continue linking to the main reader', async ({ page }) => {
  for (const hash of ['#/solutions', '#/print-aids']) {
    await page.goto('/' + hash);
    await expect(page.locator('.appbar')).toBeVisible();
    await expect(page.getByRole('button', { name: 'חזרה לחוברת הדיגיטלית' })).toBeVisible();
  }
});
