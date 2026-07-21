import type { WorkbookPageContent } from '../types';
import { sheet, blank, grid } from '../authoring';

/* The opening sheet. Identification only: which axis is which, where they
   meet, and which way the numbers grow. No ordered pair, no (x,y) notation
   and no שיעורים — those start once these names are secure. */
export const AXES_IDENTIFY: WorkbookPageContent = sheet({
  sectionClass: 'sheet guided',
  title: 'מכירים את הצירים',
  subtitle: 'הציר האופקי, הציר האנכי וראשית הצירים',
  content: `
<div class="rule-box completion-intro">
<div class="completion-sentence">במערכת הצירים יש שני צירים: אחד <b>אופקי</b> ואחד <b>אנכי</b>.</div>
<div class="completion-sentence">הציר האופקי נקרא ציר <span class="word-blank word-short" aria-label="מקום להשלמת האות x"></span>, והציר האנכי נקרא ציר <span class="word-blank word-short" aria-label="מקום להשלמת האות y"></span>.</div>
<div class="completion-sentence">הנקודה שבה נפגשים שני הצירים נקראת <span class="word-blank word-medium" aria-label="מקום להשלמת המילה ראשית"></span> ה<span class="word-blank word-medium" aria-label="מקום להשלמת המילה צירים"></span>.</div>
</div>
<section class="q-card">
<h3>א. השלימו את התיבות הריקות שעל הסרטוט.</h3>
<ul class="tasks">
<li>בתיבה שבקצה הציר האופקי — כתבו את שמו.</li>
<li>בתיבה שבקצה הציר האנכי — כתבו את שמו.</li>
<li>בתיבה שליד נקודת המפגש — כתבו את האות <span class="math-ltr" dir="ltr">O</span>.</li>
<li>בתיבות שעל הצירים — כתבו את המספרים החסרים.</li>
</ul>
${grid({
  size: 'hero',
  axisNames: false,
  label: 'מערכת צירים גדולה ובה תיבות ריקות לשמות הצירים ולמספרים החסרים',
  xlabels: [0, 1, 2, '', 4, 5, '', 7, 8],
  ylabels: [0, 1, '', 3, 4, '', 6],
})}
</section>
<div class="cols-2">
<section class="q-card">
<h3>ב. כיווני הגדילה.</h3>
<ul class="tasks">
<li>המספרים על הציר האופקי גדלים כשזזים ${blank(7)}.</li>
<li>המספרים על הציר האנכי גדלים כשזזים ${blank(7)}.</li>
<li>הכי קרוב לראשית הצירים נמצא המספר ${blank(3)}.</li>
</ul>
</section>
<section class="q-card">
<h3>ג. השלימו במילים <b>אופקי</b> או <b>אנכי</b>.</h3>
<ul class="tasks">
<li>הציר שהמספרים שלו כתובים מצד שמאל לצד ימין הוא הציר ה${blank(6)}.</li>
<li>הציר שהמספרים שלו כתובים מלמטה למעלה הוא הציר ה${blank(6)}.</li>
<li>ציר <span class="math-ltr" dir="ltr">x</span> הוא הציר ה${blank(6)}, וציר <span class="math-ltr" dir="ltr">y</span> הוא הציר ה${blank(6)}.</li>
</ul>
</section>
</div>
`,
});
