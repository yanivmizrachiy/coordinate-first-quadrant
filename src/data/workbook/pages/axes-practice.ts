import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const AXES_PRACTICE: WorkbookPageContent = sheet({
  sectionClass: "sheet practice",
  title: "הכרת מערכת הצירים",
  subtitle: "צירים, ראשית וכיווני תנועה",
  content: `
<div class="two-col">
<section class="q-card span-2">
<h3>שמות הצירים והראשית</h3>
<p>לפניכם מערכת צירים ריקה של הרביע הראשון. השלימו לפי שלוש ההוראות שמתחת לסרטוט.</p>
<div aria-label="מערכת צירים ריקה ברביע הראשון" class="coordinate-grid grid-large" data-axisnames="false" data-arrows="[]" data-points="[]" data-polygons="[]" data-segments="[]" role="img">
</div>
<div class="mini-grid">
<div>כתבו את שם הציר האופקי: <span class="blank" style="--blank-width:10ch"></span>
</div>
<div>כתבו את שם הציר האנכי: <span class="blank" style="--blank-width:10ch"></span>
</div>
<div>סמנו את ראשית הצירים באות <span class="math-ltr" dir="ltr">O</span> על הסרטוט.
</div>
</div>
</section>
<section class="q-card">
<h3>כיווני התנועה על הצירים</h3>
<p>השלימו במילים <b>ימינה</b>, <b>שמאלה</b>, <b>למעלה</b>, <b>למטה</b>.</p>
<ul class="tasks">
<li>כאשר ערך <span class="math-ltr" dir="ltr">x</span> גדל, נעים <span class="blank" style="--blank-width:6ch"></span>.</li>
<li>כאשר ערך <span class="math-ltr" dir="ltr">y</span> גדל, נעים <span class="blank" style="--blank-width:6ch"></span>.</li>
<li>כדי לחזור אל ציר <span class="math-ltr" dir="ltr">y</span>, נעים <span class="blank" style="--blank-width:6ch"></span>.</li>
<li>כדי לחזור אל ציר <span class="math-ltr" dir="ltr">x</span>, נעים <span class="blank" style="--blank-width:6ch"></span>.</li>
</ul>
</section>
<section class="q-card">
<h3>נכון או לא נכון</h3>
<p>סמנו בכל שורה אם המשפט נכון או לא נכון.</p>
<table class="tf-table" data-balanced="true">
<tbody>
<tr data-answer="true"><td>ראשית הצירים היא הנקודה (0,0).</td><td>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-2-1" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-2-1" value="false"><span>לא נכון</span></label>
</div></td></tr>
<tr data-answer="false"><td>ציר x הוא הציר האנכי.</td><td>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-2-2" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-2-2" value="false"><span>לא נכון</span></label>
</div></td></tr>
<tr data-answer="true"><td>ברביע הראשון זזים מהראשית ימינה ולמעלה בלבד.</td><td>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-2-3" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-2-3" value="false"><span>לא נכון</span></label>
</div></td></tr>
<tr data-answer="false"><td>הנקודה (3,0) נמצאת על ציר y.</td><td>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-2-4" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-2-4" value="false"><span>לא נכון</span></label>
</div></td></tr>
</tbody>
</table>
</section>
</div>
`,
});
