import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const SQUARES_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided ultra-dense",
  title: "ריבועים ומלבנים — שטח והיקף",
  subtitle: "השוואה, הזזה וטענות מתמטיות",
  content: `
<div class="cols-2">
<div aria-label="ריבוע ABCD" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 1, "label": "A"}, {"x": 6, "y": 1, "label": "B"}, {"x": 6, "y": 5, "label": "C"}, {"x": 2, "y": 5, "label": "D"}]' data-polygons='[{"points": [[2, 1], [6, 1], [6, 5], [2, 5]]}]' data-segments="[]" role="img">
</div>
<section class="q-card">
<h3>א. הריבוע <span class="math-ltr" dir="ltr">ABCD</span>.</h3>
<ul class="tasks compact">
<li>הצלעות המקבילות לציר <span class="math-ltr" dir="ltr">x</span> הן <span class="blank" data-missing="letter" style="--blank-width:8ch"></span>.</li>
<li>המלבן הזה הוא <b>ריבוע</b>, כי כל הצלעות שלו <span class="blank" data-missing="relation" style="--blank-width:5ch"></span>.</li>
</ul>
<div class="calc-ltr" dir="ltr"><span class="calc-ltr__name">AB</span><span class="calc-ltr__eq">=</span><span class="blank" data-missing="number" style="--blank-width:10ch"></span><span class="calc-ltr__eq">=</span><span class="blank" data-missing="number" style="--blank-width:4ch"></span><span class="calc-ltr__unit">יח'</span></div><div class="calc-ltr" dir="ltr"><span class="calc-ltr__name">AB</span><span class="calc-ltr__eq">=</span><span class="blank" data-missing="number" style="--blank-width:4ch"></span><span class="calc-ltr__unit">יח'</span></div>
<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div><div class="calc-final"><span>ההיקף: <span class="math-ltr" dir="ltr">P</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח'</span><span>השטח: <span class="math-ltr" dir="ltr">S</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח"ר</span></div></div>
<ul class="tasks compact">
<li>באורך <span class="blank" data-missing="number" style="--blank-width:3ch"></span> יח' וברוחב <span class="blank" data-missing="number" style="--blank-width:3ch"></span> יח' — ולכן האורך והרוחב <b>זהים</b>.</li>
</ul>
</section>
</div>
<section class="q-card">
<h3>ב. חשבו שטח והיקף לשני המלבנים.</h3>
<div class="cols-2">
<div><b>מלבן א:</b> <span class="math-ltr" dir="ltr">(1,1),(7,1),(7,3),(1,3)</span>
<div aria-label="מערכת צירים ברביע הראשון" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 1, "y": 1}, {"x": 7, "y": 1}, {"x": 7, "y": 3}, {"x": 1, "y": 3}]' data-polygons='[{"points": [[1, 1], [7, 1], [7, 3], [1, 3]]}]' data-segments="[]" role="img">
</div>
<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div><div class="calc-final"><span>ההיקף: <span class="math-ltr" dir="ltr">P</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח'</span><span>השטח: <span class="math-ltr" dir="ltr">S</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח"ר</span></div></div>
</div>
<div><b>מלבן ב:</b> <span class="math-ltr" dir="ltr">(2,1),(5,1),(5,5),(2,5)</span>
<div aria-label="מערכת צירים ברביע הראשון" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 1}, {"x": 5, "y": 1}, {"x": 5, "y": 5}, {"x": 2, "y": 5}]' data-polygons='[{"points": [[2, 1], [5, 1], [5, 5], [2, 5]]}]' data-segments="[]" role="img">
</div>
<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div><div class="calc-final"><span>ההיקף: <span class="math-ltr" dir="ltr">P</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח'</span><span>השטח: <span class="math-ltr" dir="ltr">S</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח"ר</span></div></div>
</div>
</div>
<p>האם אותו שטח מחייב אותו היקף? <span class="blank" style="--blank-width:6ch"></span></p>
</section>
<div class="cols-2">
<section class="q-card">
<h3>ג. הזיזו את הריבוע (1,1),(4,1),(4,4),(1,4) - 3 ימינה ו־2 למעלה.</h3>
<p>A′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> B′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>C′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span> D′=<span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div><div class="calc-final"><span>ההיקף: <span class="math-ltr" dir="ltr">P</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח'</span><span>השטח: <span class="math-ltr" dir="ltr">S</span> = <span class="blank" data-missing="number" style="--blank-width:4ch"></span> יח"ר</span></div></div>
<p>מה נשאר זהה? <span class="blank" style="--blank-width:10ch"></span></p>
</section>
`,
});
