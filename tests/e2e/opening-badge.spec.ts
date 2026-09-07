import { test, expect } from '@playwright/test';

test('the district badge remains on the printable learning material', async ({ page }) => {
  await page.goto('/#/print');
  await expect(page.locator('.book > .sheet')).toHaveCount(80, { timeout: 15000 });
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll('.book > .sheet')]
      .filter((sheet) => !sheet.classList.contains('cover-sheet'))
      .filter((sheet) => !sheet.querySelector('.gz-badge img'))
      .map((sheet) => sheet.querySelector('.sheet-number')?.textContent?.trim() ?? '(toc)'),
  );
  expect(missing, `sheets with no district badge: ${missing.join(', ')}`).toEqual([]);
});
