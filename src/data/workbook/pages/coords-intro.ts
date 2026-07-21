import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const COORDS_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "שיעור x ושיעור y",
  subtitle: "קוראים את מיקום הנקודה לפי שני מספרים",
  content: `
<div class="rule-box"><b>שיעור <span class="math-ltr" dir="ltr">x</span></b> מתאר את המיקום האופקי. <b>שיעור <span class="math-ltr" dir="ltr">y</span></b> מתאר את המיקום האנכי.
</div>
<section class="q-card">
<h3>א. דוגמה: הנקודה A(4,3).</h3>
<div aria-label="הדגמת הנקודה A ארבע שלוש" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes='[{"text": "שיעור x = 4", "at": [2, 1]}, {"text": "שיעור y = 3", "at": [6, 2]}]' data-points='[{"x": 4, "y": 3, "label": "A(4,3)"}]' data-polygons="[]" data-segments='[{"from": [0, 0], "to": [4, 0], "dashed": true, "type": "guide"}, {"from": [4, 0], "to": [4, 3], "dashed": true, "type": "guide"}]' role="img">
</div>
</section>
<section class="q-card">
<h3>ב. סמנו כל נקודה על הסרטוט וכתבו לידה את שמה.</h3>
<ul class="tasks">
<li>בנקודה <span class="math-ltr" dir="ltr">A</span> — ערך <span class="math-ltr" dir="ltr">x</span> הוא 2, ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 5.</li>
<li>בנקודה <span class="math-ltr" dir="ltr">B</span> — ערך <span class="math-ltr" dir="ltr">x</span> הוא 6, ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 2.</li>
<li>בנקודה <span class="math-ltr" dir="ltr">C</span> — ערך <span class="math-ltr" dir="ltr">x</span> הוא 3, ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 4.</li>
</ul>
<div aria-label="מערכת צירים לסימון שלוש הנקודות" class="coordinate-grid grid-lg" data-arrows="[]" data-labelboxes="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img">
</div>
</section>
`,
});
