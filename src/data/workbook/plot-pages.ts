/* The old page 7 was a single ultra-dense sheet with six cramped grids.
   Per Yaniv's rule (big, comfortable grids; no tiny sheets) it is split into
   two roomy sheets: PLOT_A (marking points) and PLOT_B (checking + fixing).
   Numbers here are placeholders — index.ts assigns the final page numbers. */
import type { WorkbookPageContent } from './types';

const FOOTER =
  '<footer class="gz-footer">' +
  '<div class="f1">יניב רז - מדריך מחוזי חט"ב בעיר ירושלים</div>' +
  '<div class="f2">הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין</div>' +
  '</footer>';

const pair = '<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>';

/* Opening sheet: ONE giant (half-page) coordinate system that many questions
   refer to, plus the ordered-pair rule — ערך x on the left, שיעור y on the right. */
export const HERO_INTRO: WorkbookPageContent = {
  n: 100,
  id: 'page-100',
  sectionClass: 'sheet guided dense',
  title: 'מערכת הצירים והזוג הסדור',
  subtitle: 'ערך x משמאל, שיעור y מימין',
  html:
    '<section aria-labelledby="title-100" class="sheet guided dense" id="page-100">' +
    '<header class="sheet-header"><div><h1 id="title-100">מערכת הצירים והזוג הסדור</h1><p>ערך x משמאל, שיעור y מימין</p></div><div aria-label="עמוד 100" class="sheet-number">100</div></header>' +
    '<main class="sheet-content">' +
    '<div class="rule-box">כל נקודה נכתבת כ<b>זוג סדור</b> בתוך סוגריים: <span class="math-ltr" dir="ltr">(x,y)</span>. ' +
    '<b>ערך <span class="math-ltr" dir="ltr">x</span> נכתב משמאל</b> ו<b>שיעור <span class="math-ltr" dir="ltr">y</span> נכתב מימין</b>. יש סֵדֶר — ולכן קוראים לזה זוג <b>סדור</b>.</div>' +
    '<section class="q-card"><h3>לפניכם מערכת הצירים. ענו עליה בסעיפים שמתחת.</h3>' +
    '<div aria-label="מערכת צירים גדולה ובה הנקודות A B C D" class="coordinate-grid grid-hero" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 2, "y": 5, "label": "A"}, {"x": 6, "y": 3, "label": "B"}, {"x": 4, "y": 0, "label": "C"}, {"x": 0, "y": 4, "label": "D"}]\' data-polygons="[]" data-segments="[]" role="img"></div></section>' +
    '<div class="cols-2">' +
    '<section class="q-card"><h3>א. כתבו את שיעורי הנקודות כזוג סדור.</h3><div class="cols-2 task-grid">' +
    '<div><span class="pair math-ltr" dir="ltr">A(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></div>' +
    '<div><span class="pair math-ltr" dir="ltr">B(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></div>' +
    '<div><span class="pair math-ltr" dir="ltr">C(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></div>' +
    '<div><span class="pair math-ltr" dir="ltr">D(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></div>' +
    '</div></section>' +
    '<section class="q-card"><h3>ב. בנקודה <span class="math-ltr" dir="ltr">A</span>.</h3><ul class="tasks compact">' +
    '<li>ערך <span class="math-ltr" dir="ltr">x</span> (משמאל) הוא <span class="blank" style="--blank-width:4ch"></span>.</li>' +
    '<li>שיעור <span class="math-ltr" dir="ltr">y</span> (מימין) הוא <span class="blank" style="--blank-width:4ch"></span>.</li>' +
    '</ul></section>' +
    '</div>' +
    '<div class="cols-2">' +
    '<section class="q-card"><h3>ג. נקודות שעל הצירים.</h3><ul class="tasks compact">' +
    '<li>איזו נקודה נמצאת על ציר <span class="math-ltr" dir="ltr">x</span>? <span class="blank" style="--blank-width:4ch"></span></li>' +
    '<li>איזו נקודה נמצאת על ציר <span class="math-ltr" dir="ltr">y</span>? <span class="blank" style="--blank-width:4ch"></span></li>' +
    '</ul></section>' +
    '<section class="q-card"><h3>ד. סמנו על הסרטוט שתי נקודות נוספות.</h3><ul class="tasks compact">' +
    '<li>נקודה <span class="math-ltr" dir="ltr">E</span> שבה ערך <span class="math-ltr" dir="ltr">x</span> הוא 7 ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 2.</li>' +
    '<li>נקודה <span class="math-ltr" dir="ltr">F(1,1)</span>.</li>' +
    '</ul></section>' +
    '</div>' +
    '<section class="q-card"><h3>ה. הסדר קובע.</h3><p>נקודה <span class="math-ltr" dir="ltr">(2,6)</span> ונקודה <span class="math-ltr" dir="ltr">(6,2)</span> — האם הן אותה נקודה? <span class="blank" style="--blank-width:6ch"></span> &nbsp; כי בזוג הסדור ערך <span class="math-ltr" dir="ltr">x</span> נכתב <span class="blank" style="--blank-width:7ch"></span> ושיעור <span class="math-ltr" dir="ltr">y</span> נכתב <span class="blank" style="--blank-width:7ch"></span>.</p></section>' +
    '</main>' + FOOTER + '</section>',
};

export const PLOT_A: WorkbookPageContent = {
  n: 101,
  id: 'page-101',
  sectionClass: 'sheet guided',
  title: 'מסמנים נקודות',
  subtitle: 'מהראשית: ימינה לפי שיעור x, למעלה לפי שיעור y',
  html:
    '<section aria-labelledby="title-101" class="sheet guided" id="page-101">' +
    '<header class="sheet-header"><div><h1 id="title-101">מסמנים נקודות</h1><p>מהראשית: ימינה לפי שיעור x, למעלה לפי שיעור y</p></div><div aria-label="עמוד 101" class="sheet-number">101</div></header>' +
    '<main class="sheet-content">' +
    '<div class="cols-2 compact-top"><div class="rule-box"><b>הדגמה:</b> כדי לסמן נקודה <span class="math-ltr" dir="ltr">A(3,4)</span> מתחילים בראשית, זזים 3 יחידות ימינה (שיעור <span class="math-ltr" dir="ltr">x</span>) ואז 4 יחידות למעלה (שיעור <span class="math-ltr" dir="ltr">y</span>).</div>' +
    '<div aria-label="הדגמת סימון הנקודה A שלוש ארבע" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 3, "y": 4, "label": "A"}]\' data-polygons="[]" data-segments=\'[{"from": [0, 0], "to": [3, 0], "dashed": true, "type": "guide"}, {"from": [3, 0], "to": [3, 4], "dashed": true, "type": "guide"}]\' role="img"></div></div>' +
    '<section class="q-card"><h3>א. סמנו את הנקודות על הסרטוט וכתבו ליד כל נקודה את שמה.</h3>' +
    '<p>נקודה <span class="math-ltr" dir="ltr">A(2,1)</span>, נקודה <span class="math-ltr" dir="ltr">B(5,4)</span>, נקודה <span class="math-ltr" dir="ltr">C(7,2)</span>, נקודה <span class="math-ltr" dir="ltr">D(3,6)</span>, נקודה <span class="math-ltr" dir="ltr">E(6,5)</span>.</p>' +
    '<div aria-label="מערכת צירים גדולה לסימון חמש נקודות" class="coordinate-grid grid-lg" data-arrows="[]" data-labelboxes="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img"></div></section>' +
    '<section class="q-card"><h3>ב. סמנו את הנקודות לפי השיעורים, וכתבו כל אחת כזוג סדור.</h3>' +
    '<div class="cols-2"><div aria-label="מערכת צירים לסימון הנקודות F G H" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img"></div>' +
    '<div><p>נקודה <span class="math-ltr" dir="ltr">F</span>: שיעור <span class="math-ltr" dir="ltr">x =</span> 4, שיעור <span class="math-ltr" dir="ltr">y =</span> 2 &nbsp;←&nbsp; <span class="pair math-ltr" dir="ltr">F(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>' +
    '<p>נקודה <span class="math-ltr" dir="ltr">G</span>: שיעור <span class="math-ltr" dir="ltr">x =</span> 1, שיעור <span class="math-ltr" dir="ltr">y =</span> 5 &nbsp;←&nbsp; <span class="pair math-ltr" dir="ltr">G(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>' +
    '<p>נקודה <span class="math-ltr" dir="ltr">H</span>: שיעור <span class="math-ltr" dir="ltr">x =</span> 8, שיעור <span class="math-ltr" dir="ltr">y =</span> 3 &nbsp;←&nbsp; <span class="pair math-ltr" dir="ltr">H(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p></div></div></section>' +
    '</main>' + FOOTER + '</section>',
};

export const PLOT_B: WorkbookPageContent = {
  n: 102,
  id: 'page-102',
  sectionClass: 'sheet guided',
  title: 'בודקים ומתקנים סימון',
  subtitle: 'הסדר בזוג הסדור קובע את המקום',
  html:
    '<section aria-labelledby="title-102" class="sheet guided" id="page-102">' +
    '<header class="sheet-header"><div><h1 id="title-102">בודקים ומתקנים סימון</h1><p>הסדר בזוג הסדור קובע את המקום</p></div><div aria-label="עמוד 102" class="sheet-number">102</div></header>' +
    '<main class="sheet-content">' +
    '<section class="q-card"><h3>א. באיזה שרטוט סומנו נכון נקודה A(2,5) ונקודה B(5,2)?</h3>' +
    '<div class="choice-grid">' +
    '<div><b>1</b><div aria-label="אפשרות אחת החלפת שיעורים" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 5, "y": 2, "label": "A"}, {"x": 2, "y": 5, "label": "B"}]\' data-polygons="[]" data-segments="[]" role="img"></div></div>' +
    '<div><b>2</b><div aria-label="אפשרות שתיים נכונה" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 2, "y": 5, "label": "A"}, {"x": 5, "y": 2, "label": "B"}]\' data-polygons="[]" data-segments="[]" role="img"></div></div>' +
    '<div><b>3</b><div aria-label="אפשרות שלוש קו אופקי" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 2, "y": 3, "label": "A"}, {"x": 5, "y": 3, "label": "B"}]\' data-polygons="[]" data-segments="[]" role="img"></div></div>' +
    '<div><b>4</b><div aria-label="אפשרות ארבע קו אנכי" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 3, "y": 5, "label": "A"}, {"x": 3, "y": 2, "label": "B"}]\' data-polygons="[]" data-segments="[]" role="img"></div></div>' +
    '</div><p class="axis-answer-box">השרטוט הנכון: <span class="blank" style="--blank-width:4ch"></span></p>' +
    '<p>הסבירו לפי סדר השיעורים:</p><div class="answer-line"></div></section>' +
    '<section class="q-card"><h3>ב. גיא סימן נקודה K(2,5) במקום נקודה K(5,2).</h3>' +
    '<div class="cols-2"><div aria-label="מערכת צירים לסימון המקום הנכון של הנקודה K" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 2, "y": 5, "label": "K?", "color": "#dc2626"}]\' data-polygons="[]" data-segments="[]" role="img"></div>' +
    '<div><p>סמנו את המקום הנכון של נקודה <span class="math-ltr" dir="ltr">K</span> וכתבו אותה כזוג סדור:</p>' +
    '<p><span class="pair math-ltr" dir="ltr">K(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>' +
    '<p>מה גיא החליף?</p><div class="answer-line"></div><div class="answer-line"></div></div></div></section>' +
    '<section class="q-card"><h3>ג. אם מזיזים את נקודה (2,5) — לאן מגיעים?</h3><ul class="tasks compact">' +
    '<li>אם מזיזים 3 יחידות ימינה, אז מגיעים אל נקודה ' + pair + '</li>' +
    '<li>אם מזיזים 2 יחידות למטה, אז מגיעים אל נקודה ' + pair + '</li>' +
    '<li>כדי להגיע אל נקודה <span class="math-ltr" dir="ltr">(2,1)</span> צריך הזזה של <span class="blank" style="--blank-width:12ch"></span></li>' +
    '</ul></section>' +
    '</main>' + FOOTER + '</section>',
};
