import { test, expect } from '@playwright/test';

test('home shows the cover, the action buttons and the page picker', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.home-cover__img')).toBeVisible();
  // תצוגה · הורדה · הדפסה · וואטסאפ
  await expect(page.locator('.act')).toHaveCount(4);
  await expect(page.locator('.act--wa')).toHaveAttribute('href', /wa\.me/);
  expect(await page.locator('.jump__select option').count()).toBeGreaterThan(40);
});

test('the cover keeps its own aspect ratio — never stretched', async ({ page }) => {
  await page.goto('/#/');
  const ratios = await page.locator('.home-cover__img').evaluate((el) => {
    const i = el as HTMLImageElement;
    const r = i.getBoundingClientRect();
    return { natural: i.naturalWidth / i.naturalHeight, shown: r.width / r.height };
  });
  expect(Math.abs(ratios.natural - ratios.shown)).toBeLessThan(0.01);
});

test('a worksheet renders an SVG coordinate grid', async ({ page }) => {
  await page.goto('/#/workbook/3');
  await expect(page.locator('.sheet')).toHaveCount(1);
  expect(await page.locator('.coordinate-grid svg').count()).toBeGreaterThan(0);
});

test('no horizontal overflow on any core view', async ({ page }) => {
  for (const hash of ['#/', '#/workbook', '#/workbook/1', '#/workbook/12', '#/book']) {
    await page.goto('/' + hash);
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(
      () => document.scrollingElement!.scrollWidth - window.innerWidth,
    );
    expect(overflow, `overflow on ${hash}`).toBeLessThanOrEqual(1);
  }
});

test('the full booklet opens with the cover, then worksheet 1', async ({ page }) => {
  await page.goto('/#/book');
  const sheets = page.locator('.book > .sheet');
  await expect(sheets.first()).toHaveClass(/cover-sheet/);
  await expect(sheets.nth(1).locator('.sheet-number')).toHaveText('1');
});

/* A sheet is a fixed-height A4 box with overflow:hidden, so anything past its
   bottom edge is content the learner never sees — silently, with no error. */
test('no sheet cuts off its own content', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(3500);
  const clipped = await page.evaluate(() =>
    [...document.querySelectorAll('.sheet')]
      .map((s) => {
        const main = s.querySelector('.sheet-content');
        if (!main) return null;
        let bottom = 0;
        for (const el of main.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.height && r.bottom > bottom) bottom = r.bottom;
        }
        const px = Math.round(s.getBoundingClientRect().bottom - bottom);
        const n = s.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
        return px < 0 ? `page ${n}: ${px}px` : null;
      })
      .filter(Boolean),
  );
  expect(clipped, clipped.join(', ')).toHaveLength(0);
});

/* Learners write inside the squares. A system squeezed into a narrow column
   keeps its ratio and collapses to a thumbnail — unusable on paper. */
test('every coordinate system renders large enough to write on', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(3500);
  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll('.sheet')]
      .flatMap((s) => {
        const n = s.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
        return [...s.querySelectorAll('.coordinate-grid svg')]
          .map((g) => g.getBoundingClientRect())
          .filter((r) => r.width < 240)
          .map((r) => `page ${n}: ${Math.round(r.width)}x${Math.round(r.height)}`);
      }),
  );
  expect(tiny, tiny.join(', ')).toHaveLength(0);
});

/* „ציר x” can be perfectly correct in the source and still print backwards:
   the sheet is RTL, so without an explicit direction the Latin letter lands on
   the LEFT and the label reads „x ציר”. Only measuring the glyphs catches it. */
test('every label in a drawing reads Hebrew-word first, left to right', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(3500);
  const reversed = await page.evaluate(() =>
    [...document.querySelectorAll('.coordinate-grid text')]
      .map((t) => {
        const s = t.textContent ?? '';
        if (!/[֐-׿]/.test(s) || !/[A-Za-z]/.test(s)) return null;
        const node = t as SVGTextContentElement;
        let hebrew = Infinity;
        let latin = Infinity;
        for (let i = 0; i < s.length; i++) {
          const x = node.getStartPositionOfChar(i).x;
          if (/[֐-׿]/.test(s[i]!)) hebrew = Math.min(hebrew, x);
          if (/[A-Za-z]/.test(s[i]!)) latin = Math.min(latin, x);
        }
        // the Hebrew word must start to the LEFT of the Latin part
        return hebrew > latin ? s : null;
      })
      .filter(Boolean),
  );
  expect(reversed, `reversed labels: ${reversed.join(' | ')}`).toHaveLength(0);
});

test('a game sheet reveals its answer when solved correctly', async ({ page }) => {
  // The safe game is a numbered worksheet page now, not a separate area.
  await page.goto('/#/workbook/37');
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
