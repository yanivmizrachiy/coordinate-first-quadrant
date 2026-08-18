import { chromium } from '@playwright/test';
import { preview } from 'vite';
import { mkdirSync, readFileSync } from 'node:fs';
import { PDFDocument } from 'pdf-lib';

const EXPECTED_PAGES = 78;
const PORT = 4178;
const server = await preview({ preview: { port: PORT, strictPort: true } });
let browser;

try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  await page.goto(`http://localhost:${PORT}/#/solutions`, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    (expected) => document.querySelectorAll('.solutions__page').length === expected,
    EXPECTED_PAGES,
    { timeout: 30_000 },
  );

  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(250);

  const layout = await page.evaluate(() => {
    const a4HeightPx = (297 / 25.4) * 96;
    const pages = [...document.querySelectorAll('.solutions__page')];
    return {
      count: pages.length,
      tooTall: pages
        .map((el, index) => ({ index: index + 1, height: el.getBoundingClientRect().height }))
        .filter((entry) => entry.height > a4HeightPx + 2),
      interactive: document.querySelectorAll('.solutions button, .solutions select, .solutions input, .solutions textarea, .solutions a').length,
    };
  });

  if (layout.count !== EXPECTED_PAGES) {
    throw new Error(`solutions view has ${layout.count} sheets; expected ${EXPECTED_PAGES}`);
  }
  if (layout.interactive !== 0) {
    throw new Error(`solutions view still contains ${layout.interactive} interactive elements`);
  }
  if (layout.tooTall.length) {
    throw new Error(`solution sheets exceed A4 height: ${JSON.stringify(layout.tooTall)}`);
  }

  mkdirSync('public', { recursive: true });
  await page.pdf({
    path: 'public/solutions.pdf',
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}

const pdf = await PDFDocument.load(readFileSync('public/solutions.pdf'));
if (pdf.getPageCount() !== EXPECTED_PAGES) {
  throw new Error(`public/solutions.pdf has ${pdf.getPageCount()} pages; expected ${EXPECTED_PAGES}`);
}

console.log(`public/solutions.pdf written and verified — ${EXPECTED_PAGES} A4 pages, print-only`);
