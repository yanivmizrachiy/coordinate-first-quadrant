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

/* A Hebrew reader scans right-to-left, so in „ציר y” the word „ציר” has to be
   the RIGHTMOST part — that is what makes it the first word read. Pinning such
   a label to LTR moves the Hebrew left, and it then reads „y ציר”: backwards.
   Only measuring the glyph positions tells the two apart. */
test('a mixed label puts its Hebrew word on the right, where it is read first', async ({ page }) => {
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
        // the Hebrew word must sit to the RIGHT of the Latin part
        return hebrew < latin ? s : null;
      })
      .filter(Boolean),
  );
  expect(reversed, `reversed labels: ${reversed.join(' | ')}`).toHaveLength(0);
});

/* Half-empty sheets waste the learner's writing space and look unfinished.
   The spare height is handed to the drawings first and then to the gaps, so
   the typical page should come out close to full. A median rather than a
   per-page floor: a few sheets are genuinely short, and padding them out with
   air would be worse than leaving them. */
test('the typical sheet uses the paper it is printed on', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(6000);
  const used = await page.evaluate(() =>
    [...document.querySelectorAll('.sheet')]
      .map((s) => {
        const main = s.querySelector('.sheet-content');
        const foot = s.querySelector('.gz-footer');
        if (!main || !foot) return null;
        let bottom = 0;
        for (const el of main.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.height && r.bottom > bottom) bottom = r.bottom;
        }
        const top = main.getBoundingClientRect().top;
        const footTop = foot.getBoundingClientRect().top;
        return Math.round(((bottom - top) / (footTop - top)) * 100);
      })
      .filter((n): n is number => n !== null)
      .sort((a, b) => a - b),
  );
  const median = used[Math.floor(used.length / 2)]!;
  expect(median, `median fill ${median}%`).toBeGreaterThanOrEqual(80);
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
      await rows.nth(i).locator('button', { hasText: 'בדקו' }).click();
    }
  }
  await expect(page.locator('.reveal').last()).toContainText('4705');
});

/* Black and white is for the SHEETS. The application keeps its colour — the
   point is a clean printed page, not a drained interface. */
test('black-and-white print greys the sheets and leaves the app in colour', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(2500);
  const bar = page.locator('.printbar__toggle');
  await expect(bar).toContainText(/הדפסה שחור|חזרה לצבע/);

  const read = async (): Promise<{ sheet: string; app: string }> =>
    page.evaluate(() => ({
      sheet: getComputedStyle(document.querySelectorAll('.sheet')[1]!).getPropertyValue('--blue').trim(),
      app: getComputedStyle(document.querySelector('.iconbtn--primary')!).backgroundColor,
    }));

  if (await page.evaluate(() => document.body.classList.contains('bw-print'))) await bar.click();
  const colour = await read();
  await bar.click();
  const mono = await read();

  expect(mono.sheet, 'the sheet did not go black and white').not.toBe(colour.sheet);
  expect(mono.app, 'the application lost its colour too').toBe(colour.app);
});

test('the print bar prints only the pages asked for', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(3000);
  const kept = await page.evaluate(() => {
    const bar = document.querySelector('.printbar')!;
    const [from, to] = bar.querySelectorAll<HTMLInputElement>('.printbar__num');
    from!.value = '3';
    to!.value = '5';
    const print = window.print;
    window.print = (): void => {};
    bar.querySelector<HTMLButtonElement>('.printbar__go')!.click();
    window.print = print;
    return [...document.querySelectorAll('.sheet')]
      .filter((s) => !s.classList.contains('print-skip'))
      .map((s) => s.querySelector('.sheet-number')?.textContent?.trim() ?? 'cover');
  });
  expect(kept).toEqual(['3', '4', '5']);
});

/* The single-page view is what the reader spends their time in. Stacking a
   second toolbar above it cost 78px of screen and it stopped being comfortable
   to read — this holds the controls to one row and the sheet to full size. */
test('the page viewer keeps its controls to one row and the sheet readable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the phone stacks the bar on purpose');
  await page.goto('/#/workbook/5');
  await page.waitForTimeout(2500);

  const bar = page.locator('.printbar');
  await expect(bar).toHaveCount(1);
  await expect(page.locator('.toolbar-row')).toHaveCount(0); // the second row is gone

  const rows = async (): Promise<number> =>
    bar.evaluate(
      (b) => new Set([...b.children].map((c) => Math.round(c.getBoundingClientRect().top + c.getBoundingClientRect().height / 2))).size,
    );
  expect(await rows(), 'the control bar wrapped onto more than one row').toBe(1);

  // the booklet carries more controls — range pickers too — and must still fit
  await page.goto('/#/book');
  await page.waitForTimeout(4000);
  await expect(page.locator('.toolbar-row')).toHaveCount(0);
  expect(await rows(), 'the booklet control bar wrapped').toBe(1);
  await page.goto('/#/workbook/5');
  await page.waitForTimeout(2500);

  // full size by default: a whole A4 on a laptop screen means 8px text
  const scale = await page.locator('.pageviewer__sheetwrap').evaluate(
    (w) => getComputedStyle(w).getPropertyValue('--sheet-scale').trim(),
  );
  expect(Number(scale)).toBe(1);
});

/* Shrinking the sheet must not shrink what is on it. fitSheet writes heights in
   unscaled pixels but reads them through the transform, so without dividing by
   the scale every drawing loses 40% on each pass. */
test('zooming the page out leaves the drawings the size they were', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'no zoom control on a phone');
  await page.goto('/#/workbook/5');
  await page.waitForTimeout(2500);
  const sizes = async (): Promise<string[]> =>
    page.locator('.sheet .coordinate-grid').evaluateAll((gs) =>
      gs.map((g) => `${(g as HTMLElement).offsetWidth}x${(g as HTMLElement).offsetHeight}`),
    );

  const before = await sizes();
  await page.locator('.zoombtn--label').click();         // → fit to screen
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(1200);
  const after = await sizes();

  expect(after, 'the drawings shrank when the page was scaled').toEqual(before);
});

/* Measuring the CONTAINER is what let this through twice. An SVG scales its own
   type, so a drawing can be the right size on paper while the numbers inside it
   render at 8px next to 13px body text — which is what „הציורים לא ברורים”
   means. This measures the type as the reader sees it, not the box around it. */
test('every axis number renders at a size a learner can actually read', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll('.sheet .coordinate-grid')]
      .map((g) => {
        const svg = g.querySelector('svg');
        if (!svg) return null;
        const box = svg.viewBox.baseVal;
        const shown = svg.getBoundingClientRect().width;
        if (!box?.width || !shown) return null;
        const tick = [...svg.querySelectorAll('text')].find((t) => /^\d+$/.test(t.textContent!.trim()));
        if (!tick) return null;
        const px = Number(tick.getAttribute('font-size')) * (shown / box.width);
        const n = g.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
        return px < 11 ? `page ${n}: axis numbers at ${px.toFixed(1)}px` : null;
      })
      .filter(Boolean),
  );
  expect(tiny, tiny.join(', ')).toHaveLength(0);
});

/* Putting the type back to size can push a label out of the drawing or on top
   of its neighbour. Both are worse than small type, so both are measured. */
test('no label spills out of its drawing or lands on another', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const faults = await page.evaluate(() => {
    const out: string[] = [];
    for (const g of document.querySelectorAll('.sheet .coordinate-grid')) {
      const svg = g.querySelector('svg');
      if (!svg) continue;
      const n = g.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
      const r = svg.getBoundingClientRect();
      const texts = [...svg.querySelectorAll('text')];
      for (const t of texts) {
        const b = t.getBoundingClientRect();
        if (b.width && (b.left < r.left - 2 || b.right > r.right + 2 || b.top < r.top - 2 || b.bottom > r.bottom + 2)) {
          out.push(`page ${n}: „${t.textContent!.trim().slice(0, 10)}” spills out`);
        }
      }
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i]!.getBoundingClientRect();
          const b = texts[j]!.getBoundingClientRect();
          if (a.width && b.width && a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) {
            out.push(`page ${n}: „${texts[i]!.textContent!.trim()}” over „${texts[j]!.textContent!.trim()}”`);
          }
        }
      }
    }
    return [...new Set(out)];
  });
  expect(faults, faults.join(' | ')).toHaveLength(0);
});

/* A vertex has to be visible. The marks scale with the drawing exactly as the
   type does, so a point on a half-size grid was a 5px dot — „הקודקודים לא
   רואים בכלל”. Yesterday's fix measured the letters and forgot the marks; this
   measures the marks. */
test('every point on a drawing is drawn large enough to see', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const faults = await page.evaluate(() =>
    [...document.querySelectorAll('.sheet .coordinate-grid')]
      .map((g) => {
        const svg = g.querySelector('svg');
        const c = svg?.querySelector('circle');
        if (!svg || !c) return null;
        const box = svg.viewBox.baseVal;
        const shown = svg.getBoundingClientRect().width;
        if (!box?.width || !shown) return null;
        const px = Number(c.getAttribute('r')) * (shown / box.width);
        const n = g.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
        return px < 4 ? `page ${n}: vertices at ${px.toFixed(1)}px radius` : null;
      })
      .filter(Boolean),
  );
  expect(faults, faults.join(', ')).toHaveLength(0);
});

/* Two letter O on one corner — the grid's own origin plus a point the sheet
   marked at (0,0) — reads as a mistake in the drawing. */
test('the origin is never labelled twice', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const doubled = await page.evaluate(() =>
    [...document.querySelectorAll('.sheet .coordinate-grid svg')]
      .map((svg) => {
        const os = [...svg.querySelectorAll('text')].filter((t) => t.textContent!.trim() === 'O');
        const n = svg.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
        return os.length > 1 ? `page ${n}` : null;
      })
      .filter(Boolean),
  );
  expect(doubled, doubled.join(', ')).toHaveLength(0);
});
