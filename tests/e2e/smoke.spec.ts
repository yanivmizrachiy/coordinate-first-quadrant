import { test, expect } from '@playwright/test';

test('the opening screen carries the film and the way in, and nothing else', async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.opening')).toBeVisible();
  await expect(page.locator('.startbtn')).toBeVisible();
  // everything you can DO lives one press away, so none of it is on this screen
  await expect(page.locator('.act')).toHaveCount(0);
  await expect(page.locator('.jump')).toHaveCount(0);
  await expect(page.locator('.appbar')).toHaveClass(/appbar--hidden/);
});

/* התחל opens the booklet at its cover, with no stop on the way — the cover
   artwork is decoded while the film plays, so it is there the moment it is
   asked for. */
test('התחל opens the cover straight away', async ({ page }) => {
  await page.goto('/#/');
  await page.locator('.startbtn').click();
  await expect(page).toHaveURL(/#\/book$/);
  await expect(page.locator('.book > .sheet').first()).toHaveClass(/cover-sheet/);
});

/* The menu holds everything you can do — and must be REACHABLE. Pointing התחל
   straight at the cover once left it orphaned, and הורדה, הדפסה and וואטסאפ
   with it: a screen nobody can open is a capability that no longer exists. */
test('the menu can be reached from the bar, on every screen that has one', async ({ page }) => {
  for (const from of ['#/book', '#/workbook/1']) {
    await page.goto('/' + from);
    await page.waitForTimeout(700);
    await page.locator('.appbar button', { hasText: 'תפריט' }).click();
    await expect(page, `no way to the menu from ${from}`).toHaveURL(/#\/menu$/);
  }
});

test('the menu has the four actions and the page picker', async ({ page }) => {
  await page.goto('/#/menu');
  await expect(page.locator('.act')).toHaveCount(4);
  await expect(page.locator('.act--wa')).toHaveAttribute('href', /wa\.me/);
  expect(await page.locator('.jump__select option').count()).toBeGreaterThan(40);
});

/* The film is the app's front door: it holds its own space, comes to rest
   instead of looping, carries its sound, and never reaches paper. */
test('the opening film is sized, sounded and kept off paper', async ({ page }) => {
  await page.goto('/#/');
  const film = page.locator('.opening__film');
  await expect(film).toHaveCount(1);
  const shape = await film.evaluate((el) => {
    const v = el as HTMLVideoElement;
    return {
      poster: v.getAttribute('poster') ?? '',
      loops: v.loop,
      inline: v.playsInline,
      sources: [...v.querySelectorAll('source')].map((s) => s.getAttribute('src') ?? ''),
    };
  });
  expect(shape.poster, 'no poster, so the screen starts blank').not.toBe('');
  expect(shape.loops, 'the film loops instead of coming to rest').toBe(false);
  expect(shape.inline, 'iOS would take the film full screen').toBe(true);
  expect(shape.sources.length, 'only one encoding is offered').toBeGreaterThan(1);

  await page.emulateMedia({ media: 'print' });
  const shown = await page.locator('.opening').evaluate((el) => getComputedStyle(el).display);
  expect(shown, 'the opening would be sent to the printer').toBe('none');
  await page.emulateMedia({ media: 'screen' });
});

/* The credit is written on letter by letter, and only once the film has ended —
   so every letter must be a separate element carrying its own delay. */
test('the credit is set letter by letter and waits for the film', async ({ page }) => {
  await page.goto('/#/');
  const chars = page.locator('.opening__credit .ltr-ch');
  expect(await chars.count(), 'the credit is not split into letters').toBeGreaterThan(40);
  const before = await chars.first().evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(before), 'the letters are visible before the film ends').toBeLessThan(0.5);

  await page.locator('.opening').evaluate((el) => el.classList.add('opening--ended'));
  await page.waitForTimeout(1800);
  const after = await chars.first().evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(after), 'the letters never arrive').toBeGreaterThan(0.9);
});

/* A phone held upright is nothing like 16:9: cropping the film to fill it would
   cut away the axes, which is the one thing the film is for. */
test('on a phone the whole film is visible and nothing runs off the screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/');
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => {
    const v = document.querySelector('.opening__media') as HTMLElement;
    const s = document.querySelector('.startbtn') as HTMLElement;
    const vb = v.getBoundingClientRect(), sb = s.getBoundingClientRect();
    return {
      fit: getComputedStyle(v).objectFit,
      filmWidth: vb.width, viewport: window.innerWidth,
      startOnTheLeft: sb.x < window.innerWidth / 2,
      startInside: sb.x >= 0 && sb.right <= window.innerWidth,
      verticalOverflow: document.scrollingElement!.scrollHeight - window.innerHeight,
    };
  });
  expect(m.fit, 'the film is cropped on a phone').toBe('contain');
  expect(m.filmWidth, 'the film does not use the width it has').toBeGreaterThan(m.viewport * 0.9);
  expect(m.startOnTheLeft, 'התחל is not at the bottom left').toBe(true);
  expect(m.startInside, 'התחל runs off the screen').toBe(true);
  expect(m.verticalOverflow, 'the opening scrolls').toBeLessThanOrEqual(1);
});

/* התחל must not arrive before the last letter of the credit has landed, and the
   page count must be the biggest thing on its line and in the axes' turquoise.
   Both were asked for by name, and both are easy to undo by accident. */
test('התחל waits for the last letter, and the count leads in the axes colour', async ({ page }) => {
  await page.goto('/#/');
  await page.waitForFunction(
    () => document.querySelector('.opening')?.classList.contains('opening--ended'),
    null, { timeout: 25000 },
  );

  const shape = await page.evaluate(() => {
    const scr = document.querySelector('.opening') as HTMLElement;
    const wait = parseFloat(getComputedStyle(scr).getPropertyValue('--after-text'));
    const last = [...document.querySelectorAll('.opening__credit--2 .ltr-ch')].pop() as HTMLElement;
    const lastDelay = parseFloat(getComputedStyle(last).getPropertyValue('--d'));
    const count = document.querySelector('.opening__count') as HTMLElement;
    const unit = document.querySelector('.opening__unit') as HTMLElement;
    return {
      wait, lastDelay,
      countSize: parseFloat(getComputedStyle(count).fontSize),
      unitSize: parseFloat(getComputedStyle(unit).fontSize),
      countColour: getComputedStyle(count).color,
      startDelay: parseFloat(getComputedStyle(document.querySelector('.startbtn')!).transitionDelay),
    };
  });

  expect(shape.wait, 'התחל does not wait for the credit').toBeGreaterThan(shape.lastDelay);
  expect(shape.startDelay, 'התחל arrives before the text').toBeGreaterThanOrEqual(shape.wait - 0.01);
  expect(shape.countSize, 'the page count is not the biggest thing on its line')
    .toBeGreaterThan(shape.unitSize * 1.8);
  // #77F1F6 — sampled from the axes the film draws
  expect(shape.countColour, 'the count is not the axes turquoise').toBe('rgb(119, 241, 246)');

  // and it counts UP: still 0 while the film runs, its full value once ended
  await page.reload();
  await page.waitForTimeout(1200);
  const early = await page.locator('.opening__count').textContent();
  expect(Number(early), 'the count does not start from zero').toBeLessThan(74);
});

/* The district's badge belongs on the material it comes from: the opening, the
   menu, and every sheet of the booklet. */
test("the district's badge is on the opening and on every sheet", async ({ page }) => {
  await page.goto('/#/');
  await expect(page.locator('.opening__badge img')).toHaveCount(1);
  const spins = await page.locator('.opening__badge img').evaluate((el) => getComputedStyle(el).animationName);
  expect(spins, 'the badge does not turn').toBe('badge-turn');

  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll('.book > .sheet')]
      .filter((s) => !s.classList.contains('cover-sheet'))
      .filter((s) => !s.querySelector('.gz-badge img'))
      .map((s) => s.querySelector('.sheet-number')?.textContent?.trim() ?? '(toc)'),
  );
  expect(missing, `sheets with no badge: ${missing.join(', ')}`).toEqual([]);
});

/* The approved artwork is the booklet's first page and must keep its own shape:
   an A4 cover stretched to fill a box is a different picture. */
test('the cover keeps its own aspect ratio — never stretched', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(2500);
  const ratios = await page.locator('.cover-image').evaluate((el) => {
    const i = el as HTMLImageElement;
    const r = i.getBoundingClientRect();
    return { natural: i.naturalWidth / i.naturalHeight, shown: r.width / r.height };
  });
  expect(Math.abs(ratios.natural - ratios.shown)).toBeLessThan(0.02);
});

test('a worksheet renders an SVG coordinate grid', async ({ page }) => {
  await page.goto('/#/workbook/3');
  await expect(page.locator('.sheet')).toHaveCount(1);
  expect(await page.locator('.coordinate-grid svg').count()).toBeGreaterThan(0);
});

/* There is ONE contents page — the coloured sheet inside the booklet. The old
   chapter-list page at #/workbook was deleted for good („תמחק לצמיתות… דרשתי
   רק את התוכן עניינים הצבעוני"), so that address, and the legacy #/games,
   land on the booklet instead of resurrecting a second index. */
test('the deleted chapter-list page cannot come back', async ({ page }) => {
  for (const dead of ['#/workbook', '#/games']) {
    await page.goto('/' + dead);
    await page.waitForTimeout(1200);
    await expect(page.locator('.toc-sheet'), `${dead} does not reach the contents`).toHaveCount(1);
    await expect(page.locator('.book > .sheet').first()).toHaveClass(/cover-sheet/);
  }
});

test('no horizontal overflow on any core view', async ({ page }) => {
  for (const hash of ['#/', '#/menu', '#/workbook', '#/workbook/1', '#/workbook/12', '#/book']) {
    await page.goto('/' + hash);
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(
      () => document.scrollingElement!.scrollWidth - window.innerWidth,
    );
    expect(overflow, `overflow on ${hash}`).toBeLessThanOrEqual(1);
  }
});

test('the full booklet opens with the cover, then the contents, then worksheet 1', async ({ page }) => {
  await page.goto('/#/book');
  const sheets = page.locator('.book > .sheet');
  await expect(sheets.first()).toHaveClass(/cover-sheet/);
  await expect(sheets.nth(1)).toHaveClass(/toc-sheet/);
  await expect(sheets.nth(2).locator('.sheet-number')).toHaveText('1');
});

/* The contents sheet is a sheet: it prints with the booklet, and on screen each
   chapter is a button that goes to that chapter's first page. */
test('the contents sheet lists every chapter and each button reaches its page', async ({ page }) => {
  await page.goto('/#/book');
  await page.waitForTimeout(4000);
  const buttons = page.locator('.toc-sheet .toc-btn');
  const topics = await page.evaluate(() => document.querySelectorAll('.toc-sheet .toc-btn').length);
  /* Five chapters, named by Yaniv, and no others: „כל השאר תמחק מהתוכן". */
  expect(topics, 'the contents sheet does not list the five chapters').toBe(5);

  /* Each chapter carries a colour of its own — now as a rule at the leading
     edge rather than a slab of fill, so the page reads as a contents page and
     prints on a fraction of the ink. */
  const colours = await buttons.evaluateAll((els) =>
    els.map((e) => getComputedStyle(e.querySelector('.toc-btn__rule')!).backgroundColor),
  );
  expect(new Set(colours).size, 'the chapters are not colour-coded').toBe(5);

  /* Each chip carries the page its chapter STARTS on, and nothing else. The
     chapters must run in order and start at page 1. */
  const starts = await buttons.evaluateAll((els) =>
    els.map((e) => Number((e.getAttribute('aria-label') ?? '').match(/בעמוד (\d+)/)?.[1] ?? 0)),
  );
  expect(starts, 'the contents point at the wrong pages').toEqual([1, 12, 29, 50, 60]);
  const ranged = await buttons.evaluateAll((els) => els.filter((e) => /[–-]/.test(e.textContent ?? '')).length);
  expect(ranged, 'a chip still shows a page range instead of the starting page').toBe(0);

  /* The chapter leads and the page number closes the line — the reader is
     looking for a chapter, not for a number. In RTL that puts the name at the
     right and the number at the left. */
  const wrongWayRound = await buttons.evaluateAll((els) =>
    els.filter((e) => {
      const no = e.querySelector('.toc-btn__no')?.getBoundingClientRect();
      const name = e.querySelector('.toc-btn__name')?.getBoundingClientRect();
      const rule = e.querySelector('.toc-btn__rule')?.getBoundingClientRect();
      return !no || !name || !rule || no.left > name.left || rule.left < name.left;
    }).length,
  );
  expect(wrongWayRound, 'the contents row does not read name-then-page').toBe(0);

  /* The number is inked in its chapter's colour on a white disc, and three of
     the ten colours are pale enough to vanish there. Measured, not eyeballed. */
  const faint = await buttons.evaluateAll((els) =>
    els.map((e) => {
      const no = e.querySelector('.toc-btn__no');
      if (!no) return null;
      const rgb = getComputedStyle(no).color.match(/\d+/g)!.map(Number);
      const lin = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      const L = 0.2126 * lin(rgb[0]!) + 0.7152 * lin(rgb[1]!) + 0.0722 * lin(rgb[2]!);
      const ratio = 1.05 / (L + 0.05);                 // against the white disc
      return ratio < 4.5 ? `${no.textContent} at ${ratio.toFixed(1)}:1` : null;
    }).filter(Boolean),
  );
  expect(faint, `a page number is too faint to read: ${faint.join(', ')}`).toEqual([]);

  /* Every chip opens the page it names, straight away. */
  for (const [i, n] of [1, 12, 29, 50, 60].entries()) {
    await page.goto('/#/book');
    await page.waitForTimeout(3500);
    await page.locator('.toc-btn').nth(i).click();
    await expect(page, `chip ${i + 1} does not open page ${n}`).toHaveURL(new RegExp(`#/workbook/${n}$`));
  }
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
        /* Letterboxed: a viewBox drawing takes the SMALLER of the two ratios and
           leaves the other axis as air. Measuring the width alone reports the
           size of the BOX, not of the drawing inside it — which is how 2.8px
           vertices passed a test that demanded 4px. */
        const r = svg.getBoundingClientRect();
        if (!box?.width || !box?.height || !r.width) return null;
        const shown = Math.min(r.width, (r.height * box.width) / box.height);
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
        /* Letterboxed: a viewBox drawing takes the SMALLER of the two ratios and
           leaves the other axis as air. Measuring the width alone reports the
           size of the BOX, not of the drawing inside it — which is how 2.8px
           vertices passed a test that demanded 4px. */
        const r = svg.getBoundingClientRect();
        if (!box?.width || !box?.height || !r.width) return null;
        const shown = Math.min(r.width, (r.height * box.width) / box.height);
        const px = Number(c.getAttribute('r')) * (shown / box.width);
        const n = g.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
        return px < 4 ? `page ${n}: vertices at ${px.toFixed(1)}px radius` : null;
      })
      .filter(Boolean),
  );
  expect(faults, faults.join(', ')).toHaveLength(0);
});

/* „הציור לא ברור” on page 71 was a label crammed inside the right-angle mark at
   the origin, and the guard above never saw it: it compared labels only with
   OTHER LABELS, so a letter sitting on a drawn mark, on an arrowhead or on a
   vertex was invisible to it. This sweeps every drawing in the booklet against
   everything actually drawn on it. */
test('no label sits on a mark, an arrowhead or a vertex', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const faults = await page.evaluate(() => {
    const out: string[] = [];
    const over = (a: DOMRect, b: DOMRect, pad: number) =>
      a.width > 0 && b.width > 0 &&
      a.left < b.right - pad && b.left < a.right - pad &&
      a.top < b.bottom - pad && b.top < a.bottom - pad;

    for (const g of document.querySelectorAll('.sheet .coordinate-grid')) {
      const svg = g.querySelector('svg');
      if (!svg) continue;
      const n = g.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
      // an arrowhead inside <defs> is never painted where its box claims to be
      const drawn = (sel: string) =>
        [...svg.querySelectorAll<SVGElement>(sel)].filter((e) => !e.closest('defs') && !e.closest('marker'));
      const paths = drawn('path');
      const marks = drawn('circle');

      for (const t of svg.querySelectorAll('text')) {
        const tb = t.getBoundingClientRect();
        const label = t.textContent!.trim().slice(0, 12);
        for (const p of paths) {
          if (!over(tb, p.getBoundingClientRect(), 2)) continue;
          out.push(`page ${n}: „${label}” sits on ${p.getAttribute('fill') === 'none' ? 'the right-angle mark' : 'an axis arrowhead'}`);
        }
        for (const c of marks) {
          // a label may sit on its OWN point by design — the maze centres „■” on
          // every wall — so only another point's mark is a fault
          if (c.getAttribute('data-pt') === t.getAttribute('data-pt')) continue;
          if (over(tb, c.getBoundingClientRect(), 2)) out.push(`page ${n}: „${label}” sits on a vertex`);
        }
      }
    }
    return [...new Set(out)];
  });
  expect(faults, faults.join(' | ')).toHaveLength(0);
});

/* „צריך לכתוב משמאל לימין AB שווה תרגיל שווה תשובה”. The markup says dir="ltr",
   but what matters is where the parts actually land: the sheet around them is
   RTL, and one stray rule would flip the line back without changing the HTML.
   So this measures the painted positions — name leftmost, unit rightmost. */
test('every calculation really is painted left to right', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const faults = await page.evaluate(() => {
    const out: string[] = [];
    for (const d of document.querySelectorAll('.sheet .calc-ltr')) {
      const n = d.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
      const kids = [...d.children].filter((c) => c.getBoundingClientRect().width > 0);
      if (kids.length < 2) { out.push(`page ${n}: a calculation line did not lay out`); continue; }
      const first = kids[0]!.getBoundingClientRect().left;
      const last = kids[kids.length - 1]!.getBoundingClientRect().left;
      const text = (d as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
      if (first >= last) out.push(`page ${n}: „${text}” is painted right to left`);
    }
    return [...new Set(out)];
  });
  expect(faults.length, faults.join(' | ')).toBe(0);
});

/* „הגרש לא נמצא במקום הנכון”. A geresh is a NEUTRAL character, so inside a
   dir="ltr" line it takes the line's direction and lands to the RIGHT of the
   Hebrew word it closes. Measured per character: a Hebrew run must march
   leftwards, every next character further left than the one before it. */
test('a Hebrew word never comes out in the wrong order', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const faults = await page.evaluate(() => {
    const out: string[] = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n: Node | null; (n = walk.nextNode()); ) {
      const s = n.textContent ?? '';
      if (!/[֐-׿]/.test(s) || !/['"]/.test(s)) continue;
      const host = (n as Text).parentElement;
      if (!host?.closest('.sheet')) continue;
      const at = (i: number) => { const r = document.createRange(); r.setStart(n!, i); r.setEnd(n!, i + 1); return r.getBoundingClientRect().x; };
      const run = [...s].map((c, i) => ({ c, i })).filter((o) => /[֐-׿'"]/.test(o.c));
      for (let k = 1; k < run.length; k++) {
        if (run[k]!.i !== run[k - 1]!.i + 1) continue;
        if (at(run[k]!.i) >= at(run[k - 1]!.i)) {
          const p = host.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
          out.push(`page ${p}: „${s.trim().slice(0, 24)}” comes out in the wrong order`);
          break;
        }
      }
    }
    return [...new Set(out)];
  });
  expect(faults, faults.join(' | ')).toHaveLength(0);
});

/* An empty box on a drawing is where the learner writes. A number sitting inside
   it makes the task unanswerable — the „8” on page 1 was pushed sideways into
   the box for „ציר x” by the pass that keeps the axis NAME off the arrowhead. */
test('no number is left sitting inside a box the learner writes in', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  const faults = await page.evaluate(() => {
    const out: string[] = [];
    for (const g of document.querySelectorAll('.sheet .coordinate-grid')) {
      const svg = g.querySelector('svg');
      if (!svg) continue;
      const n = g.closest('.sheet')?.querySelector('.sheet-number')?.textContent?.trim() ?? '?';
      /* An EMPTY box only — the blue-stroked one the learner writes in. A label
         box is grey-stroked and holds its own text, which belongs inside it. */
      const boxes = [...svg.querySelectorAll('rect')]
        .filter((r) => (r.getAttribute('stroke') ?? '').toLowerCase() === '#1d4ed8')
        .map((r) => r.getBoundingClientRect());
      for (const t of svg.querySelectorAll('text')) {
        const b = t.getBoundingClientRect();
        if (!b.width) continue;
        if (boxes.some((x) => b.left < x.right - 1 && x.left < b.right - 1 && b.top < x.bottom - 1 && x.top < b.bottom - 1)) {
          out.push(`page ${n}: „${t.textContent!.trim()}” sits inside an answer box`);
        }
      }
    }
    return [...new Set(out)];
  });
  expect(faults, faults.join(' | ')).toHaveLength(0);
});

/* The cover is the approved artwork and nothing else. A footer that escaped its
   own sheet was painted across the second page once; this says out loud that
   nothing may be laid over the cover, on screen or on paper. */
test('the cover carries the artwork and nothing else', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'measured on the A4 sheet');
  await page.goto('/#/book');
  await page.waitForTimeout(9000);
  for (const media of ['screen', 'print'] as const) {
    await page.emulateMedia({ media });
    const over = await page.evaluate(() => {
      const cover = document.querySelector('.cover-sheet');
      if (!cover) return ['there is no cover sheet'];
      const box = cover.getBoundingClientRect();
      // the artwork may be wrapped in <picture> so a lighter WebP can be offered
      const extra = [...cover.children]
        .filter((e) => !e.classList.contains('cover-image') && !e.classList.contains('cover-picture'))
        .map((e) => e.className);
      const loose = [...document.querySelectorAll('.book > *:not(.sheet)')]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.height && r.top < box.bottom && r.bottom > box.top; })
        .map((e) => `loose ${e.className} over the cover`);
      return [...extra, ...loose];
    });
    expect(over, `${media}: ${over.join(', ')}`).toHaveLength(0);
  }
  await page.emulateMedia({ media: 'screen' });
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
