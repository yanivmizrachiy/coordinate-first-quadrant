import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const ERRORS_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided error-page",
  title: "מזהים ומתקנים טעויות",
  subtitle: "נכון או לא נכון, תיקון והסבר",
  content: `
<div class="error-grid">
<div class="mist-card" data-answer="false">
<div class="mist-head">מקרה 1<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-1" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-1" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>התקבל x=3, y=5 ונכתב (5,3).</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
<div class="mist-card" data-answer="true">
<div class="mist-head">מקרה 2<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-2" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-2" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>הנקודה (5,0) ממוקמת על ציר x.</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
<div class="mist-card" data-answer="false">
<div class="mist-head">מקרה 3<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-3" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-3" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>הנקודה (0,4) ממוקמת מימין לציר y.</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
<div class="mist-card" data-answer="true">
<div class="mist-head">מקרה 4<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-4" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-4" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>אותו שיעור x פירושו שהנקודות ממוקמות על אותו קו אנכי.</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
<div class="mist-card" data-answer="false">
<div class="mist-head">מקרה 5<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-5" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-5" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>בנקודה (3,6), שיעור y גדול ב־2 משיעור x.</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
<div class="mist-card" data-answer="true">
<div class="mist-head">מקרה 6<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-6" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-6" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>מזיזים את (2,4) שלוש יחידות ימינה ומקבלים (5,4).</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
<div class="mist-card" data-answer="false">
<div class="mist-head">מקרה 7<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-7" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-7" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>בקטע המקביל לציר x, שיעור x זהה בשתי הנקודות.</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
<div class="mist-card" data-answer="true">
<div class="mist-head">מקרה 8<span>נכון / לא נכון</span>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="tf-error-8" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="tf-error-8" value="false"><span>לא נכון</span></label>
</div>
</div>
<p>קטע המקביל לציר <span class="math-ltr" dir="ltr">x</span> הוא מאונך לציר <span class="math-ltr" dir="ltr">y</span>.</p><small>תיקון והסבר:</small>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
</div>
`,
});
