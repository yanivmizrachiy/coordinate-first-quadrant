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
<h3>לפניכם מערכת הצירים. ענו עליה בסעיפים שמתחת.</h3>
${grid({ size: 'hero', axisNames: false, label: 'מערכת צירים גדולה בלי שמות הצירים' })}
</section>
<div class="cols-2">
<section class="q-card">
<h3>א. כתבו על הסרטוט.</h3>
<ul class="tasks">
<li>כתבו את שם הציר האופקי בקצה הימני שלו.</li>
<li>כתבו את שם הציר האנכי בקצה העליון שלו.</li>
<li>סמנו באות <span class="math-ltr" dir="ltr">O</span> את נקודת המפגש של הצירים.</li>
</ul>
</section>
<section class="q-card">
<h3>ב. כיווני הגדילה.</h3>
<ul class="tasks">
<li>המספרים על הציר האופקי גדלים כשזזים ${blank(7)}.</li>
<li>המספרים על הציר האנכי גדלים כשזזים ${blank(7)}.</li>
<li>הכי קרוב לראשית הצירים נמצא המספר ${blank(3)}.</li>
</ul>
</section>
</div>
<section class="q-card">
<h3>ג. השלימו במילים <b>אופקי</b> או <b>אנכי</b>.</h3>
<ul class="tasks">
<li>הציר שהמספרים שלו כתובים מצד שמאל לצד ימין הוא הציר ה${blank(6)}.</li>
<li>הציר שהמספרים שלו כתובים מלמטה למעלה הוא הציר ה${blank(6)}.</li>
<li>ציר <span class="math-ltr" dir="ltr">x</span> הוא הציר ה${blank(6)}, וציר <span class="math-ltr" dir="ltr">y</span> הוא הציר ה${blank(6)}.</li>
</ul>
</section>
`,
});
