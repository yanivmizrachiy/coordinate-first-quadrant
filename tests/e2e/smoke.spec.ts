import { test, expect } from '@playwright/test';

test('home shows the three entry cards', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.hero__title')).toContainText('מערכת צירים');
  await expect(page.locator('.entry-card')).toHaveCount(3);
});

test('workbook page renders an SVG coordinate grid', async ({ page }) => {
  await page.goto('/#/workbook/3');
  await expect(page.locator('.sheet')).toHaveCount(1);
  expect(await page.locator('.coordinate-grid svg').count()).toBeGreaterThan(0);
});

test('no horizontal overflow on any core view', async ({ page }) => {
  for (const hash of ['#/', '#/workbook', '#/workbook/1', '#/games', '#/games/secret-word']) {
    await page.goto('/' + hash);
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(
      () => document.scrollingElement!.scrollWidth - window.innerWidth,
    );
    expect(overflow, `overflow on ${hash}`).toBeLessThanOrEqual(1);
  }
});

test('full booklet shows the approved cover as the first A4 page', async ({ page }) => {
  await page.goto('/#/book');
  const first = page.locator('.book > .sheet').first();
  await expect(first).toHaveClass(/cover-sheet/);
  // cover + 34 worksheets
  expect(await page.locator('.book .sheet').count()).toBe(35);
});

test('games hub lists all eight games', async ({ page }) => {
  await page.goto('/#/games');
  await expect(page.locator('.game-card')).toHaveCount(8);
});

test('a game reveals its answer when solved correctly', async ({ page }) => {
  await page.goto('/#/games/coordinate-safe');
  const answers = ['4', '7', '0', '5'];
  const rows = page.locator('.game__board .game__row');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const input = rows.nth(i).locator('input.answer-input');
    if (await input.count()) {
      await input.fill(answers[i] ?? '');
      await rows.nth(i).locator('button', { hasText: 'בדיקה' }).click();
    }
  }
  await expect(page.locator('.reveal').last()).toContainText('4705');
});
