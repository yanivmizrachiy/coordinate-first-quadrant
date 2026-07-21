import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const PLOT_B: WorkbookPageContent = sheet({
  sectionClass: "sheet guided",
  title: "בודקים ומתקנים סימון",
  subtitle: "הסדר בזוג הסדור קובע את המקום",
  content: `
<section class="q-card">
<h3>א. באיזה שרטוט סומנו נכון נקודה A(2,5) ונקודה B(5,2)?</h3>
<div class="choice-grid">
<div><b>1</b>
<div aria-label="אפשרות אחת החלפת שיעורים" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 5, "y": 2, "label": "A"}, {"x": 2, "y": 5, "label": "B"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
</div>
<div><b>2</b>
<div aria-label="אפשרות שתיים נכונה" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 5, "label": "A"}, {"x": 5, "y": 2, "label": "B"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
</div>
<div><b>3</b>
<div aria-label="אפשרות שלוש קו אופקי" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 3, "label": "A"}, {"x": 5, "y": 3, "label": "B"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
</div>
<div><b>4</b>
<div aria-label="אפשרות ארבע קו אנכי" class="coordinate-grid grid-xs" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 3, "y": 5, "label": "A"}, {"x": 3, "y": 2, "label": "B"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
</div>
</div>
<p class="axis-answer-box">השרטוט הנכון: <span class="blank" style="--blank-width:4ch"></span></p>
<p>הסבירו לפי סדר השיעורים:</p>
<div class="answer-line">
</div>
</section>
<section class="q-card">
<h3>ב. גיא סימן נקודה K(2,5) במקום נקודה K(5,2).</h3>
<div class="cols-2">
<div aria-label="מערכת צירים לסימון המקום הנכון של הנקודה K" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 5, "label": "K?", "color": "#dc2626"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
<div>
<p>סמנו את המקום הנכון של נקודה <span class="math-ltr" dir="ltr">K</span> וכתבו אותה כזוג סדור:</p>
<p><span class="pair math-ltr" dir="ltr">K(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p>
<p>מה גיא החליף?</p>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</div>
</div>
</section>
<section class="q-card">
<h3>ג. אם מזיזים את נקודה (2,5) — לאן מגיעים?</h3>
<ul class="tasks compact">
<li>אם מזיזים 3 יחידות ימינה, אז מגיעים אל נקודה <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
<li>אם מזיזים 2 יחידות למטה, אז מגיעים אל נקודה <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
<li>כדי להגיע אל נקודה <span class="math-ltr" dir="ltr">(2,1)</span> צריך הזזה של <span class="blank" style="--blank-width:12ch"></span></li>
</ul>
</section>
`,
});
