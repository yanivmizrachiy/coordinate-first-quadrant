import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const RIGHT_ANGLE_SUMMARY: WorkbookPageContent = sheet({
  sectionClass: "sheet practice",
  title: "זווית ישרה — תרגול מסכם",
  subtitle: "מלבנים, זוויות ישרות, היקף ושטח ברביע הראשון",
  contentTag: 'div',
  content: `
<section class="q-card">
<h3>א. לפני המלבן ABCD שקודקודיו A(2,1), B(7,1), C(7,5), D(2,5).</h3>
<div class="cols-2">
<div aria-label="מלבן ABCD ברביע הראשון" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 1, "label": "A"}, {"x": 7, "y": 1, "label": "B"}, {"x": 7, "y": 5, "label": "C"}, {"x": 2, "y": 5, "label": "D"}]' data-polygons='[{"points": [[2, 1], [7, 1], [7, 5], [2, 5]]}]' data-segments="[]" role="img">
</div>
<div>
<p>צלעות מקבילות לציר x: <span class="blank" style="--blank-width:8ch"></span></p>
<p>צלעות מקבילות לציר y: <span class="blank" style="--blank-width:8ch"></span></p>
<p>מספר הזוויות הישרות: <span class="blank" style="--blank-width:3ch"></span></p>
<p><span class="math-ltr" dir="ltr">AB =</span> <span class="blank" style="--blank-width:3ch"></span> יחידות, &nbsp; <span class="math-ltr" dir="ltr">BC =</span> <span class="blank" style="--blank-width:3ch"></span> יחידות</p>
<p>היקף: <span class="blank" style="--blank-width:4ch"></span> יחידות, &nbsp; שטח: <span class="blank" style="--blank-width:4ch"></span> יחידות ריבועיות</p>
<div class="calc-box"><b>דרך החישוב (היקף ושטח):</b>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
</div>
</div>
</section>
<section class="q-card">
<h3>ב. דניאל סימן שלושה קודקודים: P(2,2), Q(6,2), R(6,5). סמנו את הקודקוד הרביעי S כך שייווצר מלבן.</h3>
<div class="cols-2">
<div aria-label="שלושה קודקודים לבניית מלבן עם זוויות ישרות" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 2, "label": "P"}, {"x": 6, "y": 2, "label": "Q"}, {"x": 6, "y": 5, "label": "R"}]' data-polygons="[]" data-segments='[{"from": [2, 2], "to": [6, 2], "type": "shape"}, {"from": [6, 2], "to": [6, 5], "type": "shape"}]' role="img">
</div>
<div>
<p class="axis-answer-box">S = <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>בקודקוד Q הזווית היא <span class="blank" style="--blank-width:5ch"></span>.</p>
<p>היקף המלבן: <span class="blank" style="--blank-width:4ch"></span> יחידות, &nbsp; שטח: <span class="blank" style="--blank-width:4ch"></span> יחידות ריבועיות</p>
<div class="calc-box"><b>דרך החישוב:</b>
<div class="answer-line">
</div>
</div>
</div>
</div>
</section>
<section class="q-card span-2">
<h3>ג. סמנו נכון או לא נכון.</h3>
<table class="tf-table">
<tr><td>לכל מלבן יש ארבע זוויות ישרות.</td><td>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="rt-sum-1" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="rt-sum-1" value="false"><span>לא נכון</span></label>
</div></td></tr>
<tr><td>שני קטעים המקבילים שניהם לציר x יוצרים ביניהם זווית ישרה.</td><td>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="rt-sum-2" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="rt-sum-2" value="false"><span>לא נכון</span></label>
</div></td></tr>
<tr><td>קטע המקביל לציר x וקטע המקביל לציר y יוצרים זווית ישרה.</td><td>
<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון"><label class="tf-option"><input type="radio" name="rt-sum-3" value="true"><span>נכון</span></label><label class="tf-option"><input type="radio" name="rt-sum-3" value="false"><span>לא נכון</span></label>
</div></td></tr>
</table>
</section>
`,
});
