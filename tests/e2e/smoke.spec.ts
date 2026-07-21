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
   keeps its ratio and collapses to a thumbnail — unusable on paper. The
   threshold is about the A4 sheet, so it is measured at full sheet width; a
   phone scales the whole sheet down and would fail it for the wrong reason. */
test('every coordinate system renders large enough to write on', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet, not on a phone');
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

/* Sheet text is 13px — including anything a game draws. The exceptions are
   deliberate and listed here; anything else is a regression. */
test('every sheet keeps its body text at 13px', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(4000);
  const offenders = await page.evaluate(() => {
    const out: string[] = [];
    for (const s of document.querySelectorAll('.sheet')) {
      const n = s.querySelector('.sheet-number')?.textContent?.trim() ?? 'cover';
      for (const el of s.querySelectorAll('*')) {
        if (el.closest('svg')) continue; // drawings scale as a unit
        const ownText = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent!.trim());
        if (!ownText) continue;
        const px = Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10;
        if (px === 13) continue;
        const allowed =
          el.tagName === 'H1' ||                    // page title
          el.tagName === 'H2' ||                    // game title
          el.classList.contains('sheet-number') ||  // the numbered circle
          el.classList.contains('reveal') ||        // a game's result display
          el.classList.contains('frac__n') ||       // fraction — two digits in one line
          el.classList.contains('frac__d');
        if (!allowed) out.push(`page ${n}: ${el.tagName.toLowerCase()} at ${px}px`);
      }
    }
    return [...new Set(out)];
  });
  expect(offenders, offenders.join(', ')).toHaveLength(0);
});

test('a game sheet reveals its answer when solved correctly', async ({ page }) => {
  /* Find the sheet by what it hosts, never by its number — page numbers come
     from the position in BOOK and move whenever a page is added or split. */
  await page.goto('/#/workbook');
  const n = await page.evaluate(async () => {
    const res = await fetch(location.pathname);
    void res;
    location.hash = '#/book';
    await new Promise((r) => setTimeout(r, 4000));
    const host = document.querySelector('[data-game-host="coordinate-safe"]');
    return host?.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '';
  });
  expect(n, 'the coordinate-safe game is not on any sheet').not.toBe('');
  await page.goto(`/#/workbook/${n}`);
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
