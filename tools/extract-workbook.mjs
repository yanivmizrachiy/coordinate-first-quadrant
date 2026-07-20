/* ===========================================================================
   extract-workbook.mjs — one-time, reproducible content generator.

   Converts the original single-file booklet (tools/legacy-baseline.html) into
   clean, editable source (src/data/workbook/legacy-pages.generated.ts).

   It bakes in the three transforms that the previous architecture applied at
   RUNTIME in the browser, so the result is self-contained and needs no network:
     1. normalizeMovement     — "מתקדמים" → "זזים/הזזה" wording.
     2. patchTrueFalseTables  — balanced נכון/לא-נכון statements + answer boxes.
     3. patchErrorGrid        — page-25 error cards with answer boxes.

   Only the 30 native `.sheet` pages (1–30) are extracted here; pages 31–34 are
   authored natively in src/data/workbook/continuation.ts.

   Run with:  npm run build:content
   =========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const INPUT = resolve(ROOT, 'tools/legacy-baseline.html');
const OUTPUT = resolve(ROOT, 'src/data/workbook/legacy-pages.generated.ts');

/* ---- transform 1: movement wording ------------------------------------- */
function normalizeMovement(html) {
  const replacements = [
    ['מתקדמים ימינה', 'זזים ימינה'],
    ['מתקדמים שמאלה', 'זזים שמאלה'],
    ['מתקדמים למעלה', 'זזים למעלה'],
    ['מתקדמים למטה', 'זזים למטה'],
    ['מתקדמים', 'זזים'],
    ['מתקדמת', 'זזה'],
    ['מתקדם', 'זז'],
  ];
  for (const [from, to] of replacements) html = html.split(from).join(to);
  return html;
}

/* ---- shared: answer-box markup ----------------------------------------- */
const optionHtml = (name) =>
  '<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון">' +
  '<label class="tf-option"><input type="radio" name="' + name + '" value="true"><span>נכון</span></label>' +
  '<label class="tf-option"><input type="radio" name="' + name + '" value="false"><span>לא נכון</span></label>' +
  '</div>';

/* ---- transform 2: balanced true/false tables --------------------------- */
const trueFalseSets = [
  {
    pattern: [true, false, true, false, false],
    truth: [
      'x ציר הוא הציר האופקי.',
      'ראשית הצירים נמצאת על שני הצירים.',
      'המספרים על y ציר גדלים כשזזים למעלה.',
    ],
    falsehood: [
      'y ציר הוא הציר האופקי.',
      'המספרים על x ציר גדלים כשזזים שמאלה.',
      'המספרים על y ציר גדלים כשזזים למטה.',
    ],
  },
  {
    pattern: [true, false, true, false],
    truth: ['ראשית הצירים היא (0,0).', 'ברביע הראשון שני שיעורי הנקודה אינם שליליים.'],
    falsehood: ['x ציר הוא הציר האנכי.', 'הנקודה (3,0) נמצאת על y ציר.'],
  },
  {
    pattern: [true, false, true, false, true],
    truth: ['B נמצאת על x ציר.', 'A נמצאת מעל x ציר.', 'D נמצאת מימין ל־y ציר.'],
    falsehood: ['C נמצאת מימין ל־y ציר.', 'E נמצאת מימין ל־y ציר.'],
  },
];
const genericTrue = [
  'כאשר נקודה זזה ימינה, שיעור ה־x שלה גדל.',
  'כאשר נקודה זזה למעלה, שיעור ה־y שלה גדל.',
  'נקודות בעלות אותו שיעור x נמצאות על ישר אנכי.',
  'נקודות בעלות אותו שיעור y נמצאות על ישר אופקי.',
  'לנקודה על x ציר שיעור y שווה ל־0.',
];
const genericFalse = [
  'כאשר נקודה זזה ימינה, שיעור ה־y שלה גדל תמיד.',
  'כאשר נקודה זזה למעלה, שיעור ה־y שלה קטן.',
  'נקודות בעלות אותו שיעור x נמצאות על ישר אופקי.',
  'נקודות בעלות אותו שיעור y נמצאות על ישר אנכי.',
  'לנקודה על y ציר שיעור y שווה תמיד ל־0.',
];

function patchTrueFalseTables(doc) {
  doc.querySelectorAll('.tf-table').forEach((table, tableIndex) => {
    const rows = [...table.querySelectorAll('tr')];
    const config = trueFalseSets[tableIndex];
    const fallbackPattern = rows.map((_, i) => (i + tableIndex) % 2 === 0);
    const pattern = config?.pattern?.length === rows.length ? config.pattern : fallbackPattern;
    let ti = 0, fi = 0;
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) return;
      const isTrue = Boolean(pattern[rowIndex]);
      const source = isTrue ? (config?.truth || genericTrue) : (config?.falsehood || genericFalse);
      const statement = source[(isTrue ? ti++ : fi++) % source.length];
      cells[0].textContent = statement;
      cells[cells.length - 1].innerHTML = optionHtml(`tf-${tableIndex + 1}-${rowIndex + 1}`);
      row.dataset.answer = String(isTrue);
    });
    table.dataset.balanced = 'true';
  });
}

/* ---- transform 3: page-25 error grid ----------------------------------- */
function patchErrorGrid(doc) {
  const cards = [...doc.querySelectorAll('#page-25 .error-grid .mist-card')];
  if (!cards.length) return;
  const statements = [
    ['false', 'התקבל x=3, y=5 ונכתב (5,3).'],
    ['true', 'הנקודה (5,0) נמצאת על x ציר.'],
    ['false', 'הנקודה (0,4) נמצאת מימין ל־y ציר.'],
    ['true', 'אותו שיעור x פירושו שהנקודות נמצאות על אותו קו אנכי.'],
    ['false', 'בנקודה (3,6), שיעור y גדול ב־2 משיעור x.'],
    ['true', 'מזיזים את (2,4) שלוש יחידות ימינה ומקבלים (5,4).'],
    ['false', 'בקטע המקביל ל־x ציר, שיעור x זהה בשתי הנקודות.'],
  ];
  cards.forEach((card, index) => {
    const [answer, statement] = statements[index % statements.length];
    card.dataset.answer = answer;
    const p = card.querySelector('p');
    if (p) p.textContent = statement;
    const head = card.querySelector('.mist-head');
    if (head) {
      head.querySelector('.choice-row')?.remove();
      head.querySelector('.tf-options')?.remove();
      head.insertAdjacentHTML('beforeend', optionHtml(`tf-error-${index + 1}`));
    }
  });
}

/* ---- run --------------------------------------------------------------- */
const rawHtml = normalizeMovement(readFileSync(INPUT, 'utf8'));
const dom = new JSDOM(rawHtml);
const doc = dom.window.document;

patchTrueFalseTables(doc);
patchErrorGrid(doc);

const pages = [];
doc.querySelectorAll('section.sheet').forEach((section) => {
  const id = section.id; // page-N
  const n = Number(id.replace('page-', ''));
  if (!Number.isInteger(n)) return;
  const h1 = section.querySelector('.sheet-header h1');
  const sub = section.querySelector('.sheet-header p');
  pages.push({
    n,
    id,
    sectionClass: section.getAttribute('class') || 'sheet',
    title: (h1?.textContent || '').trim(),
    subtitle: (sub?.textContent || '').trim(),
    html: section.outerHTML,
  });
});
pages.sort((a, b) => a.n - b.n);

const banner =
  '/* AUTO-GENERATED by tools/extract-workbook.mjs — do not edit by hand.\n' +
  '   Source: tools/legacy-baseline.html. Regenerate with `npm run build:content`.\n' +
  '   Holds the 30 native workbook pages (1–30). Pages 31–34 live in continuation.ts. */\n';
const body =
  banner +
  "import type { WorkbookPageContent } from './types';\n\n" +
  'export const LEGACY_PAGES: WorkbookPageContent[] = ' +
  JSON.stringify(pages, null, 2) +
  ';\n';

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, body, 'utf8');

console.log(`Extracted ${pages.length} native pages → ${OUTPUT}`);
console.log('\nTitles:');
for (const p of pages) console.log(`  ${String(p.n).padStart(2, ' ')}. ${p.title}${p.subtitle ? '  — ' + p.subtitle : ''}`);
const firstFooter = doc.querySelector('.gz-footer');
console.log('\nCanonical footer HTML:\n' + (firstFooter?.outerHTML || '(none found)'));
