import type { WorkbookPageContent } from '../types';
import { sheet, blank, wordBlank, wordBank, grid, ltr } from '../authoring';

/* The opening sheet. Identification only: which axis is which, where they
   meet, and which way the numbers grow. No ordered pair, no (x,y) notation
   and no שיעורים — those start once these names are secure.

   Every completion asks for a DIFFERENT kind of answer (letter, property,
   concept, direction, relation, number) — never the same one twice in a row.
   The `data-missing` tags are what the variety test reads. */
export const AXES_IDENTIFY: WorkbookPageContent = sheet({
  sectionClass: 'sheet guided',
  title: 'מכירים את הצירים',
  subtitle: 'הציר האופקי, הציר האנכי וראשית הצירים',
  content: `
<div class="rule-box completion-intro">
<div class="completion-sentence">ציר ${wordBlank('short', 'letter', 'מקום להשלמת האות x')} הוא הציר האופקי.</div>
<div class="completion-sentence">ציר ${ltr('y')} הוא הציר ה${wordBlank('medium', 'property', 'מקום להשלמת המילה אנכי')}.</div>
<div class="completion-sentence">הנקודה שבה נפגשים שני הצירים נקראת ${wordBlank('medium', 'concept', 'מקום להשלמת המילה ראשית')} ה${wordBlank('medium', 'concept', 'מקום להשלמת המילה צירים')}.</div>
</div>
<section class="q-card">
<h3>א. השלימו את החסר.</h3>
${wordBank(['ציר x', 'ציר y', 'ראשית', 'הצירים', '2', '3', '5', '6'])}
${grid({
  size: 'hero',
  axisNames: false,
  originName: true,
  label: 'מערכת צירים גדולה ובה תיבות ריקות לשמות הצירים, לראשית הצירים ולמספרים החסרים',
  xlabels: [0, 1, 2, '', 4, 5, '', 7, 8],
  ylabels: [0, 1, '', 3, 4, '', 6],
})}
</section>
<div class="cols-2">
<section class="q-card">
<h3>ב. השלימו על כיוון וגודל.</h3>
<!-- Same sentence three times on purpose: the shape stays put so the only
     thing that changes is WHICH part is missing (Yaniv's rule). -->
<ul class="tasks">
<li>ככל שזזים ימינה על ציר ${ltr('x')}, המספרים ${blank(6, 'relation')}.</li>
<li>ככל שזזים למעלה על ציר ${blank(3, 'letter')}, המספרים גדלים.</li>
<li>ככל שזזים ${blank(7, 'direction')} על ציר ${ltr('x')}, המספרים קטנים.</li>
</ul>
</section>
<section class="q-card">
<h3>ג. איפה נפגשים שני הצירים?</h3>
<ul class="tasks">
<li>שני הצירים נפגשים במספר ${blank(3, 'number')}.</li>
<li>הנקודה הזאת מסומנת על הסרטוט באות ${blank(3, 'letter')}.</li>
</ul>
</section>
</div>
<section class="q-card">
<h3>ד. חצאים על הצירים.</h3>
<p>בין כל שני מספרים שכנים על הציר יש עוד מספר: <b>חצי</b>. המספר שלוש וחצי נמצא בדיוק באמצע, בין המספר 3 למספר 4.</p>
<div class="cols-2">
<ul class="tasks">
<li>המספר חמש וחצי נמצא בין המספר 5 למספר ${blank(3, 'number')}.</li>
<li>כדי לסמן אותו מסמנים ב${blank(5, 'concept')} שבין שני המספרים האלה.</li>
<li>המספר שנמצא בדיוק בין המספר 6 למספר 7 הוא ${blank(6, 'number')} וחצי.</li>
</ul>
<ul class="tasks">
<li>סמנו על ציר ${ltr('x')} שבסרטוט את המספר <b>שלוש וחצי</b>.</li>
<li>סמנו על ציר ${ltr('x')} שבסרטוט את המספר <b>חמש וחצי</b>.</li>
<li>סמנו על ציר ${ltr('y')} שבסרטוט את המספר <b>שתיים וחצי</b>.</li>
</ul>
</div>
</section>
`,
});
