import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const AXES_INTRO: WorkbookPageContent = sheet({
  sectionClass: "sheet guided dense",
  title: "מכירים את מערכת הצירים",
  subtitle: "שמות הצירים, הראשית וכיווני הגדילה",
  content: `
<div class="rule-box completion-intro">
<div class="completion-sentence">הציר האנכי הוא ציר <span class="word-blank word-short" aria-label="מקום להשלמת האות y"></span>.
</div>
<div class="completion-sentence">הציר ה<span class="word-blank word-medium" aria-label="מקום להשלמת המילה אופקי"></span> הוא ציר <span class="math-ltr" dir="ltr">x</span>.
</div>
<div class="completion-sentence">נקודת המפגש בין שני הצירים נקראת <span class="word-blank word-medium" aria-label="מקום להשלמת המילה ראשית"></span> ה<span class="word-blank word-medium" aria-label="מקום להשלמת המילה צירים"></span>.
</div>
<div class="completion-sentence">ראשית הצירים נכתבת כזוג סדור <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span>.
</div>
<div class="completion-sentence">כל הנקודות שעל ציר <span class="math-ltr" dir="ltr">x</span> הן בעלות שיעור <span class="math-ltr" dir="ltr">y</span> ששווה ל־<span class="word-blank word-short" aria-label="מקום להשלמת המספר אפס"></span>.
</div>
<div class="completion-sentence">הנקודה <span class="math-ltr" dir="ltr">(0,4)</span> נמצאת על ציר <span class="word-blank word-short" aria-label="מקום להשלמת האות y"></span>.
</div>
<div class="completion-sentence">בנקודה <span class="math-ltr" dir="ltr">(5,0)</span> ערך <span class="math-ltr" dir="ltr">x</span> הוא <span class="word-blank word-short" aria-label="מקום להשלמת המספר חמש"></span> ושיעור <span class="math-ltr" dir="ltr">y</span> הוא <span class="word-blank word-short" aria-label="מקום להשלמת המספר אפס"></span>.
</div>
</div>
<section class="q-card">
<h3>א. על הסרטוט: כתבו בתיבות את שם כל ציר ואת שם נקודת המפגש, והשלימו את המספרים החסרים שעל הצירים.</h3>
<div aria-label="מערכת צירים אחת: שלוש תיבות לשמות הצירים והראשית, ותיבות למספרים החסרים" class="coordinate-grid grid-lg" data-axisnames="false" data-arrows="[]" data-labelboxes='[{"text": "……………", "at": [5.4, 0.7], "to": [5, 0]}, {"text": "……………", "at": [1.5, 4.8], "to": [0, 4.2]}, {"text": "……………", "at": [1.7, 1.3], "to": [0, 0]}]' data-points="[]" data-polygons="[]" data-segments="[]" data-xlabels='[0, 1, "", 3, "", 5, "", "", 8]' data-ylabels='[0, "", 2, "", "", 5, ""]' role="img">
</div>
</section>
<div class="cols-2">
<section class="q-card">
<h3>ב. השלימו את כיווני הגדילה.</h3>
<ul class="tasks compact">
<li>המספרים על ציר <span class="math-ltr" dir="ltr">x</span> גדלים כשזזים <span class="blank" style="--blank-width:7ch"></span>.</li>
<li>המספרים על ציר <span class="math-ltr" dir="ltr">y</span> גדלים כשזזים <span class="blank" style="--blank-width:7ch"></span>.</li>
<li>בראשית הצירים שיעור <span class="math-ltr" dir="ltr">x</span> הוא <span class="blank" style="--blank-width:4ch"></span> ושיעור <span class="math-ltr" dir="ltr">y</span> הוא <span class="blank" style="--blank-width:4ch"></span>.</li>
</ul>
</section>
<section class="q-card">
<h3>ג. השלימו: מדוע דרושים שני צירים?</h3>
<ul class="tasks compact">
<li>מספר אחד בלבד אומר לנו רק <span class="blank" style="--blank-width:10ch"></span>.</li>
<li>ציר <span class="math-ltr" dir="ltr">x</span> אומר כמה זזים <span class="blank" style="--blank-width:7ch"></span>.</li>
<li>ציר <span class="math-ltr" dir="ltr">y</span> אומר כמה זזים <span class="blank" style="--blank-width:7ch"></span>.</li>
</ul>
</section>
</div>
<section class="q-card">
<h3>ד. מזוג סדור לשיעורים — ובחזרה.</h3>
<div class="cols-2">
<div>
<p><b>נתון זוג סדור — כתבו את השיעורים:</b></p>
<ul class="tasks compact">
<li>נקודה <span class="math-ltr" dir="ltr">A(3,5)</span>: ערך <span class="math-ltr" dir="ltr">x</span> הוא <span class="blank" style="--blank-width:4ch"></span>, שיעור <span class="math-ltr" dir="ltr">y</span> הוא <span class="blank" style="--blank-width:4ch"></span>.</li>
<li>נקודה <span class="math-ltr" dir="ltr">B(6,2)</span>: ערך <span class="math-ltr" dir="ltr">x</span> הוא <span class="blank" style="--blank-width:4ch"></span>, שיעור <span class="math-ltr" dir="ltr">y</span> הוא <span class="blank" style="--blank-width:4ch"></span>.</li>
</ul>
</div>
<div>
<p><b>נתונים השיעורים — כתבו כזוג סדור:</b></p>
<ul class="tasks compact">
<li>ערך <span class="math-ltr" dir="ltr">x</span> שווה 4 ושיעור <span class="math-ltr" dir="ltr">y</span> שווה 7: <span class="pair math-ltr" dir="ltr">C(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
<li>ערך <span class="math-ltr" dir="ltr">x</span> שווה 8 ושיעור <span class="math-ltr" dir="ltr">y</span> שווה 1: <span class="pair math-ltr" dir="ltr">D(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>
</ul>
</div>
</div>
</section>
`,
});
