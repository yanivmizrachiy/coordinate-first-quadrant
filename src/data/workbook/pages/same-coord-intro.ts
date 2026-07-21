import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const SAME_COORD_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "שיעורים זהים וקטעים מקבילים",
  subtitle: "אותו x - אנכי; אותו y - אופקי",
  content: `
<div class="cols-2">
<div aria-label="קטעים AB BC CD" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 1, "label": "A"}, {"x": 2, "y": 5, "label": "B"}, {"x": 6, "y": 5, "label": "C"}, {"x": 6, "y": 2, "label": "D"}]' data-polygons="[]" data-segments='[{"from": [2, 1], "to": [2, 5]}, {"from": [2, 5], "to": [6, 5]}, {"from": [6, 5], "to": [6, 2]}]' role="img">
</div>
<div>
<section class="q-card">
<h3>א. הנקודות A ו־B.</h3>
<p>שיעורי x: <span class="blank" style="--blank-width:3ch"></span> ו־<span class="blank" style="--blank-width:3ch"></span></p>
<p>השיעור הזהה: <span class="blank" style="--blank-width:4ch"></span></p>
<p>AB מקביל לציר: <span class="blank" style="--blank-width:4ch"></span></p>
</section>
<section class="q-card">
<h3>ב. הנקודות B ו־C.</h3>
<p>שיעורי y: <span class="blank" style="--blank-width:3ch"></span> ו־<span class="blank" style="--blank-width:3ch"></span></p>
<p>השיעור הזהה: <span class="blank" style="--blank-width:4ch"></span></p>
<p>BC מקביל לציר: <span class="blank" style="--blank-width:4ch"></span></p>
</section>
</div>
</div>
<div class="rule-box">אותו שיעור x ⇒ קטע מקביל לציר y. אותו שיעור y ⇒ קטע מקביל לציר x.
</div>
<section class="q-card">
<h3>ג. השלימו.</h3>
<p><span class="math-ltr" dir="ltr">P(4,1)</span> ו־<span class="math-ltr" dir="ltr">Q(4,6)</span>: PQ מקביל לציר <span class="blank" style="--blank-width:3ch"></span></p>
<p><span class="math-ltr" dir="ltr">R(2,3)</span> ו־<span class="math-ltr" dir="ltr">S(7,3)</span>: RS מקביל לציר <span class="blank" style="--blank-width:3ch"></span></p>
</section>
<section class="q-card">
<h3>ד. כתבו נקודה נוספת כך שהקטע בינה לבין <span class="math-ltr" dir="ltr">(3,4)</span> יהיה מקביל לציר x: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>. ולציר y: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>.</h3>
</section>
<section class="q-card">
<h3>ה. הקיפו את כל הנקודות ששני שיעוריהן זהים.</h3>
<div class="choice-row"><span class="choice"><span class="math-ltr" dir="ltr">(1,1)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(2,5)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(4,4)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(6,3)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(0,0)</span></span><span class="choice"><span class="math-ltr" dir="ltr">(5,5)</span></span>
</div>
</section>
<section class="q-card">
<h3>ו. האם יכולות להיות שתי נקודות שונות בעלות אותו שיעור x וגם אותו שיעור y?</h3>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</section>
`,
});
