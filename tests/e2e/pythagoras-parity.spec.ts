import { test, expect } from '@playwright/test';

/**
 * Measured style contract against the authored Pythagoras A4 baseline:
 * styles/a4-base.css in yanivmizrachiy/pythagoras.
 * This is geometry/style evidence, NOT a pixel-by-pixel equivalence claim.
 * Screenshots are retained by CI for visual review of real rendered pages.
 */
test('all 80 paper sheets preserve A4 and Pythagoras header and footer geometry', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Run the source-size geometry audit at desktop viewport');
  test.setTimeout(120_000);
  await page.goto('/#/print');
  await expect(page.locator('.book > .sheet')).toHaveCount(80, { timeout: 20_000 });
  const measurements = await page.locator('.book > .sheet').evaluateAll((sheets) =>
    sheets.map((sheet, i) => {
      const rect = sheet.getBoundingClientRect();
      const header = sheet.querySelector<HTMLElement>('.sheet-header');
      const title = header?.querySelector<HTMLElement>('h1');
      const number = header?.querySelector<HTMLElement>('.sheet-number');
      const footer = sheet.querySelector<HTMLElement>('.gz-footer');
      const headerStyle = header ? getComputedStyle(header) : null;
      const numberRect = number?.getBoundingClientRect();
      return {
        sheet: i,
        width: rect.width,
        height: rect.height,
        white: getComputedStyle(sheet).backgroundColor === 'rgb(255, 255, 255)',
        hasHeader: Boolean(header),
        headerBorderColor: headerStyle?.borderBottomColor,
        headerBorderStyle: headerStyle?.borderBottomStyle,
        headerBorderWidth: headerStyle?.borderBottomWidth,
        titleColor: title ? getComputedStyle(title).color : null,
        titleSize: title ? getComputedStyle(title).fontSize : null,
        titleWeight: title ? getComputedStyle(title).fontWeight : null,
        numberSize: numberRect ? [numberRect.width, numberRect.height] : null,
        footerColor: footer ? getComputedStyle(footer).borderTopColor : null,
        hasFooter: Boolean(footer),
      };
    }),
  );
  expect(measurements).toHaveLength(80);
  for (const item of measurements) {
    expect(item.width, `A4 width, sheet ${item.sheet}`).toBeGreaterThan(792);
    expect(item.width, `A4 width, sheet ${item.sheet}`).toBeLessThan(795);
    expect(item.height, `A4 height, sheet ${item.sheet}`).toBeGreaterThan(1121);
    expect(item.height, `A4 height, sheet ${item.sheet}`).toBeLessThan(1125);
    expect(item.white, `white paper, sheet ${item.sheet}`).toBe(true);
    if (item.sheet !== 0) expect(item.hasFooter, `credit footer, sheet ${item.sheet}`).toBe(true);
    if (!item.hasHeader) continue; // cover, contents and intentional poster sheets
    expect(item.headerBorderColor).toBe('rgb(29, 78, 216)');
    expect(item.headerBorderStyle).toBe('double');
    expect(item.headerBorderWidth).toBe('4px');
    expect(item.titleColor).toBe('rgb(29, 78, 216)');
    expect(item.titleSize).toBe('26px');
    expect(item.titleWeight).toBe('400');
    expect(item.numberSize?.[0]).toBeCloseTo(32, 0);
    expect(item.numberSize?.[1]).toBeCloseTo(32, 0);
    expect(item.footerColor).toBe('rgb(29, 78, 216)');
  }
});

test('retain rendered visual evidence from six parts of the 80-page workbook', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One screenshot series is sufficient');
  test.setTimeout(120_000);
  await page.goto('/#/print');
  await expect(page.locator('.book > .sheet')).toHaveCount(80, { timeout: 20_000 });
  for (const [index, label] of [[0, 'cover'], [1, 'contents'], [2, 'first-task'],
      [18, 'middle-early'], [40, 'middle-late'], [79, 'last-task']] as const) {
    const sheet = page.locator('.book > .sheet').nth(index);
    await sheet.scrollIntoViewIfNeeded();
    const filename = testInfo.outputPath(`sheet-${String(index).padStart(2, '0')}-${label}.png`);
    await sheet.screenshot({ path: filename, animations: 'disabled', timeout: 20_000 });
    await testInfo.attach(`sheet-${String(index).padStart(2, '0')}-${label}`, {
      path: filename,
      contentType: 'image/png',
    });
  }
});
