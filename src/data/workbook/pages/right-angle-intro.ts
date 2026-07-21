import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const RIGHT_ANGLE_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "זווית ישרה במערכת הצירים",
  subtitle: "קטע אופקי וקטע אנכי נפגשים בזווית ישרה",
  contentTag: 'div',
  content: `
<div class="completion-intro">
<div class="completion-title">השלימו את המשפטים
</div>
<div class="completion-sentence">קטע המקביל לציר x הוא קטע <span class="word-blank word-medium"></span>.
</div>
<div class="completion-sentence">קטע המקביל לציר y הוא קטע <span class="word-blank word-medium"></span>.
</div>
<div class="completion-sentence">כאשר קטע אופקי וקטע אנכי נפגשים, נוצרת ביניהם זווית <span class="word-blank word-medium"></span>.
</div>
</div>
<section class="q-card">
<h3>א. דוגמה: הקטע AB מקביל לציר x והקטע BC מקביל לציר y.</h3>
<div class="cols-2">
<div aria-label="זווית ישרה בנקודה B בין קטע אופקי לקטע אנכי" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes='[{"text": "זווית ישרה", "at": [4.2, 3.6], "to": [6, 2]}]' data-points='[{"x": 2, "y": 2, "label": "A"}, {"x": 6, "y": 2, "label": "B"}, {"x": 6, "y": 5, "label": "C"}]' data-polygons="[]" data-segments='[{"from": [2, 2], "to": [6, 2], "type": "shape"}, {"from": [6, 2], "to": [6, 5], "type": "shape"}, {"from": [5.5, 2], "to": [5.5, 2.5], "type": "guide"}, {"from": [5.5, 2.5], "to": [6, 2.5], "type": "guide"}]' role="img">
</div>
<div>
<p>הקטע AB מקביל לציר <span class="blank" style="--blank-width:4ch"></span>.</p>
<p>הקטע BC מקביל לציר <span class="blank" style="--blank-width:4ch"></span>.</p>
<p class="axis-answer-box">הזווית הישרה נמצאת בנקודה <span class="blank" style="--blank-width:4ch"></span></p>
</div>
</div>
</section>
<section class="q-card">
<h3>ב. נועה מסמנת קטע מ־(1,3) עד (5,3) וקטע מ־(5,3) עד (5,6). איזו זווית נוצרת בנקודה (5,3)?</h3>
<div class="choice-row"><span class="choice">זווית ישרה</span><span class="choice">אין זווית ישרה</span>
</div>
<p>הקטע הראשון מקביל לציר <span class="blank" style="--blank-width:4ch"></span>; הקטע השני מקביל לציר <span class="blank" style="--blank-width:4ch"></span>.</p>
</section>
`,
});
