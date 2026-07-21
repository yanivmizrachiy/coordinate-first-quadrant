import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const POSITION_LANGUAGE_PRACTICE: WorkbookPageContent = sheet({
  sectionClass: "sheet practice",
  title: "שפת מיקום",
  subtitle: "ימין, שמאל, מעל, מתחת ושיעורים שווים",
  content: `
<div class="two-col">
<section class="q-card span-2">
<h3>שפת מיקום</h3>
<div class="rule-box">
    מעל ציר <span class="math-ltr" dir="ltr">x</span>: <span class="math-ltr" dir="ltr">y&gt;0</span> &nbsp; | &nbsp;
    מימין לציר <span class="math-ltr" dir="ltr">y</span>: <span class="math-ltr" dir="ltr">x&gt;0</span> &nbsp; | &nbsp;
    שיעורים שווים: <span class="math-ltr" dir="ltr">x=y</span>.
  
</div>
<div aria-label="מערכת צירים ובה הנקודות A עד E" class="coordinate-grid grid-large" data-arrows="[]" data-points='[{"x": 2, "y": 2, "label": "A", "dx": 10, "dy": -10}, {"x": 5, "y": 2, "label": "B", "dx": 10, "dy": -10}, {"x": 5, "y": 5, "label": "C", "dx": 10, "dy": -10}, {"x": 1, "y": 5, "label": "D", "dx": 10, "dy": -10}, {"x": 4, "y": 4, "label": "E", "dx": 10, "dy": -10}]' data-polygons="[]" data-segments="[]" role="img">
</div>
</section>
<section class="q-card">
<h3>ימין, שמאל, מעל ומתחת</h3>
<ul class="tasks">
<li>איזו נקודה מימין ל־<span class="math-ltr" dir="ltr">A</span> ובאותו גובה? <span class="blank" style="--blank-width:5ch"></span></li>
<li>איזו נקודה מעל <span class="math-ltr" dir="ltr">B</span> ובאותו קו אנכי? <span class="blank" style="--blank-width:5ch"></span></li>
<li>איזו נקודה משמאל ל־<span class="math-ltr" dir="ltr">C</span> ובאותו גובה? <span class="blank" style="--blank-width:5ch"></span></li>
<li>איזו נקודה מתחת ל־<span class="math-ltr" dir="ltr">C</span> ובאותו קו אנכי? <span class="blank" style="--blank-width:5ch"></span></li>
</ul>
</section>
<section class="q-card">
<h3>שיעורים שווים</h3>
<p>אילו נקודות מקיימות <span class="math-ltr" dir="ltr">x=y</span>? <span class="blank" style="--blank-width:10ch"></span></p>
<p>כתבו שתי נקודות נוספות ברביע הראשון ששיעוריהן שווים:</p>
<p><span class="blank" style="--blank-width:9ch"></span> &nbsp;&nbsp; <span class="blank" style="--blank-width:9ch"></span></p>
<p>האם <span class="math-ltr" dir="ltr">(0,0)</span> מקיימת <span class="math-ltr" dir="ltr">x=y</span>? הסבירו.</p>
<div class="answer-line">
</div>
</section>
<section class="q-card span-2">
<h3>מתיאור לזוג סדור</h3>
<p>נקודה נמצאת מימין לציר <span class="math-ltr" dir="ltr">y</span> במרחק 6 יחידות ומעל ציר <span class="math-ltr" dir="ltr">x</span> במרחק 3 יחידות.</p>
<p>שיעוריה: <span class="blank" style="--blank-width:10ch"></span></p>
</section>
</div>
`,
});
