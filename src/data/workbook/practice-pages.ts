/* Practice sheets derived from the Ministry-of-Education exercise material in
   Yaniv's Drive. The source exercises use negative coordinates; these are
   ADAPTED to the first quadrant, which is this booklet's whole scope.
   Numbers here are placeholders — index.ts assigns the final page numbers. */
import type { WorkbookPageContent } from './types';

const FOOTER =
  '<footer class="gz-footer">' +
  '<div class="f1">יניב רז - מדריך מחוזי חט"ב בעיר ירושלים</div>' +
  '<div class="f2">הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין</div>' +
  '</footer>';

const pair = (letter = ''): string =>
  `<span class="pair math-ltr" dir="ltr">${letter}(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>`;

const ltr = (s: string): string => `<span class="math-ltr" dir="ltr">${s}</span>`;
const blank = (w: number): string => `<span class="blank" style="--blank-width:${w}ch"></span>`;

/* ── Plot the points, join the segments, name the shape ─────────────────── */
export const PLOT_SHAPE: WorkbookPageContent = {
  n: 110,
  id: 'page-110',
  sectionClass: 'sheet guided',
  title: 'מסמנים, מחברים ומזהים צורה',
  subtitle: 'מזוג סדור אל צורה — ואילו צלעות מקבילות לכל ציר',
  html:
    '<section aria-labelledby="title-110" class="sheet guided" id="page-110">' +
    '<header class="sheet-header"><div><h1 id="title-110">מסמנים, מחברים ומזהים צורה</h1><p>מזוג סדור אל צורה — ואילו צלעות מקבילות לכל ציר</p></div><div aria-label="עמוד 110" class="sheet-number">110</div></header>' +
    '<main class="sheet-content">' +
    '<section class="q-card"><h3>א. סמנו את ארבע הנקודות וחברו את הקטעים לפי הסדר.</h3>' +
    `<p>נקודה ${ltr('A(2,1)')}, נקודה ${ltr('B(7,1)')}, נקודה ${ltr('C(7,5)')}, נקודה ${ltr('D(2,5)')}. חברו: ${ltr('AB')}, ${ltr('BC')}, ${ltr('CD')}, ${ltr('DA')}.</p>` +
    '<div aria-label="מערכת צירים לסימון ארבע נקודות וחיבורן" class="coordinate-grid grid-lg" data-arrows="[]" data-labelboxes="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img"></div>' +
    `<p class="axis-answer-box">איזו צורה התקבלה? ${blank(12)}</p></section>` +
    '<div class="cols-2">' +
    '<section class="q-card"><h3>ב. מקביל לאיזה ציר?</h3><ul class="tasks compact">' +
    `<li>הקטעים ${ltr('AB')} ו־${ltr('CD')} מקבילים לציר ${blank(3)}.</li>` +
    `<li>הקטעים ${ltr('BC')} ו־${ltr('DA')} מקבילים לציר ${blank(3)}.</li>` +
    `<li>קטע המקביל לציר ${ltr('x')} הוא מאונך לציר ${blank(3)}.</li>` +
    '</ul></section>' +
    '<section class="q-card"><h3>ג. איזה שיעור זהה?</h3><ul class="tasks compact">' +
    `<li>בקטע ${ltr('AB')} שיעור ${blank(3)} זהה בשתי הנקודות.</li>` +
    `<li>בקטע ${ltr('BC')} שיעור ${blank(3)} זהה בשתי הנקודות.</li>` +
    '</ul></section>' +
    '</div>' +
    '<section class="q-card"><h3>ד. חשבו את ההיקף והשטח.</h3>' +
    `<p>אורך ${ltr('AB')}: ${blank(4)} יח'. &nbsp; אורך ${ltr('BC')}: ${blank(4)} יח'.</p>` +
    `<p>היקף הצורה: ${blank(4)} יח'. &nbsp; שטח הצורה: ${blank(4)} יח"ר.</p>` +
    '<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div></div></section>' +
    '</main>' + FOOTER + '</section>',
};

/* ── Reading a real-life graph: same x = same weight, same y = same price ── */
export const GRAPH_REAL: WorkbookPageContent = {
  n: 111,
  id: 'page-111',
  sectionClass: 'sheet guided',
  title: 'קוראים גרף מהחיים',
  subtitle: 'שיעור x זהה — אותו משקל; שיעור y זהה — אותו מחיר',
  html:
    '<section aria-labelledby="title-111" class="sheet guided" id="page-111">' +
    '<header class="sheet-header"><div><h1 id="title-111">קוראים גרף מהחיים</h1><p>שיעור x זהה — אותו משקל; שיעור y זהה — אותו מחיר</p></div><div aria-label="עמוד 111" class="sheet-number">111</div></header>' +
    '<main class="sheet-content">' +
    '<div class="rule-box">בגרף שלפניכם כל נקודה מייצגת חבילת קמח. <b>שיעור <span class="math-ltr" dir="ltr">x</span></b> הוא ה<b>משקל</b> (ק"ג), ו<b>שיעור <span class="math-ltr" dir="ltr">y</span></b> הוא ה<b>מחיר</b> (₪).</div>' +
    '<section class="q-card"><h3>הגרף: משקל החבילה מול מחירה.</h3>' +
    '<div aria-label="גרף משקל מול מחיר עם שש חבילות" class="coordinate-grid grid-lg" data-axisx="משקל" data-axisy="מחיר" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 1, "y": 5, "label": "A"}, {"x": 3, "y": 5, "label": "B"}, {"x": 3, "y": 2, "label": "C"}, {"x": 6, "y": 4, "label": "D"}, {"x": 6, "y": 1, "label": "E"}, {"x": 8, "y": 4, "label": "F"}]\' data-polygons="[]" data-segments="[]" role="img"></div></section>' +
    '<div class="cols-2">' +
    '<section class="q-card"><h3>א. כתבו את שיעורי החבילות.</h3><div class="cols-2 task-grid">' +
    `<div>${pair('A')}</div><div>${pair('B')}</div><div>${pair('D')}</div><div>${pair('E')}</div>` +
    '</div></section>' +
    '<section class="q-card"><h3>ב. הכי כבדה, הכי זולה.</h3><ul class="tasks compact">' +
    `<li>איזו חבילה הכי <b>כבדה</b> (שיעור ${ltr('x')} הגדול ביותר)? ${blank(4)}</li>` +
    `<li>איזו חבילה הכי <b>זולה</b> (שיעור ${ltr('y')} הקטן ביותר)? ${blank(4)}</li>` +
    '</ul></section>' +
    '</div>' +
    '<section class="q-card"><h3>ג. שיעור זהה — מה זה אומר כאן?</h3><ul class="tasks compact">' +
    `<li>אילו שתי חבילות באותו <b>משקל</b> (שיעור ${ltr('x')} זהה)? ${blank(4)} ו־${blank(4)} , וגם ${blank(4)} ו־${blank(4)}</li>` +
    `<li>אילו שתי חבילות באותו <b>מחיר</b> (שיעור ${ltr('y')} זהה)? ${blank(4)} ו־${blank(4)} , וגם ${blank(4)} ו־${blank(4)}</li>` +
    `<li>שתי חבילות באותו משקל נמצאות על קו ${blank(6)} (אנכי או אופקי).</li>` +
    '</ul></section>' +
    '</main>' + FOOTER + '</section>',
};

/* ── Translating a whole shape, not just a single point ─────────────────── */
export const SHAPE_MOVE: WorkbookPageContent = {
  n: 112,
  id: 'page-112',
  sectionClass: 'sheet guided',
  title: 'מזיזים צורה שלמה',
  subtitle: 'כל קודקוד זז באותה הזזה בדיוק',
  html:
    '<section aria-labelledby="title-112" class="sheet guided" id="page-112">' +
    '<header class="sheet-header"><div><h1 id="title-112">מזיזים צורה שלמה</h1><p>כל קודקוד זז באותה הזזה בדיוק</p></div><div aria-label="עמוד 112" class="sheet-number">112</div></header>' +
    '<main class="sheet-content">' +
    '<div class="rule-box">כאשר מזיזים <b>צורה שלמה</b>, כל קודקוד זז באותה הזזה. הצורה לא משנה את גודלה — רק את מקומה.</div>' +
    '<section class="q-card"><h3>לפניכם המלבן ABCD.</h3>' +
    '<div class="cols-2"><div aria-label="מלבן ABCD ברביע הראשון" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 1, "y": 1, "label": "A"}, {"x": 4, "y": 1, "label": "B"}, {"x": 4, "y": 3, "label": "C"}, {"x": 1, "y": 3, "label": "D"}]\' data-polygons=\'[{"points": [[1, 1], [4, 1], [4, 3], [1, 3]]}]\' data-segments="[]" role="img"></div>' +
    '<div><p><b>א. כתבו את שיעורי הקודקודים:</b></p>' +
    `<p>${pair('A')} &nbsp; ${pair('B')}</p><p>${pair('C')} &nbsp; ${pair('D')}</p></div></div></section>` +
    '<div class="cols-2">' +
    '<section class="q-card"><h3>ב. הזזה של 3 יחידות ימינה.</h3>' +
    '<p>אם מזיזים את המלבן, אז מקבלים:</p>' +
    `<p>${pair('A')} &nbsp; ${pair('B')}</p><p>${pair('C')} &nbsp; ${pair('D')}</p></section>` +
    '<section class="q-card"><h3>ג. הזזה של 2 יחידות למעלה (מהמקור).</h3>' +
    '<p>אם מזיזים את המלבן, אז מקבלים:</p>' +
    `<p>${pair('A')} &nbsp; ${pair('B')}</p><p>${pair('C')} &nbsp; ${pair('D')}</p></section>` +
    '</div>' +
    '<section class="q-card"><h3>ד. השלימו.</h3><ul class="tasks compact">' +
    `<li>בהזזה ימינה משתנה רק שיעור ${blank(3)}, ושיעור ${blank(3)} נשאר זהה.</li>` +
    `<li>בהזזה למעלה משתנה רק שיעור ${blank(3)}, ושיעור ${blank(3)} נשאר זהה.</li>` +
    `<li>אורך הצלע ${ltr('AB')} לפני ההזזה: ${blank(3)} יח'; אחרי ההזזה: ${blank(3)} יח'.</li>` +
    '</ul></section>' +
    '</main>' + FOOTER + '</section>',
};
