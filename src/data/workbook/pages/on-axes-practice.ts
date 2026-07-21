import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const ON_AXES_PRACTICE: WorkbookPageContent = sheet({
  sectionClass: "sheet practice",
  title: "נקודות על הצירים",
  subtitle: "מזהים x=0, y=0 ואת ראשית הצירים",
  content: `
<div class="two-col">
<section class="q-card">
<h3>הכללים</h3>
<div class="rule-box">
    נקודה נמצאת על ציר <span class="math-ltr" dir="ltr">x</span> אם ורק אם <span class="math-ltr" dir="ltr">y=0</span>.<br>
    נקודה נמצאת על ציר <span class="math-ltr" dir="ltr">y</span> אם ורק אם <span class="math-ltr" dir="ltr">x=0</span>.<br>
    ראשית הצירים היא <span class="math-ltr" dir="ltr">O(0,0)</span>.
  
</div>
<p>השלימו:</p>
<ul class="tasks">
<li>בכל נקודה על ציר <span class="math-ltr" dir="ltr">x</span>, שיעור <span class="math-ltr" dir="ltr">y</span> שווה ל־<span class="blank" style="--blank-width:3ch"></span>.</li>
<li>בכל נקודה על ציר <span class="math-ltr" dir="ltr">y</span>, שיעור <span class="math-ltr" dir="ltr">x</span> שווה ל־<span class="blank" style="--blank-width:3ch"></span>.</li>
</ul>
</section>
<section class="q-card">
<h3>ממיינים נקודות</h3>
<p>מיינו את הנקודות: <span class="math-ltr" dir="ltr">(3,0), (0,5), (4,2), (0,0), (8,0), (0,1)</span>.</p>
<table class="work-table">
<tbody>
<tr><th>על ציר <span class="math-ltr" dir="ltr">x</span></th><th>על ציר <span class="math-ltr" dir="ltr">y</span></th><th>לא על ציר</th></tr>
<tr><td class="tall"></td><td class="tall"></td><td class="tall"></td></tr>
</tbody>
</table>
</section>
<section class="q-card span-2">
<h3>מסמנים על הצירים</h3>
<p>סמנו <span class="math-ltr" dir="ltr">A(2,0), B(0,3), C(7,0), D(0,6), O(0,0)</span>.</p>
<div aria-label="מערכת צירים ריקה לסימון נקודות על הצירים" class="coordinate-grid grid-large" data-arrows="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img">
</div>
</section>
<section class="q-card span-2">
<h3>נקודה מיוחדת</h3>
<p>איזו נקודה נמצאת גם על ציר <span class="math-ltr" dir="ltr">x</span> וגם על ציר <span class="math-ltr" dir="ltr">y</span>?</p>
<p><span class="blank" style="--blank-width:12ch"></span></p>
<p>הסבירו מדוע אין נקודה אחרת כזאת.</p>
<div class="answer-line">
</div>
</section>
</div>
`,
});
