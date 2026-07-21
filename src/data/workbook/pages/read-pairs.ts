import type { WorkbookPageContent } from '../types';
import { sheet } from '../authoring';

export const READ_PAIRS: WorkbookPageContent = sheet({
  sectionClass: "sheet guided",
  title: "קוראים נקודה מהסרטוט",
  subtitle: "מזהים את השיעורים של נקודה שכבר מסומנת",
  content: `
<section class="q-card">
<h3>ג. באיזו נקודה שיעור x הוא 5 ושיעור y הוא 2?</h3>
<div aria-label="ארבע נקודות לבחירת הנקודה ששיעוריה חמש שתיים" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points='[{"x": 2, "y": 5, "label": "A"}, {"x": 5, "y": 2, "label": "B"}, {"x": 5, "y": 4, "label": "C"}, {"x": 3, "y": 2, "label": "D"}]' data-polygons="[]" data-segments="[]" role="img">
</div>
<p class="axis-answer-box">הנקודה המבוקשת: <span class="blank" style="--blank-width:5ch"></span></p>
</section>\n
<section class="q-card">
<h3>ד. השלימו.</h3>
<ul class="tasks compact">
<li>המספר המתאים לציר האופקי הוא שיעור ה־<span class="blank" style="--blank-width:4ch"></span>.</li>
<li>המספר המתאים לציר האנכי הוא שיעור ה־<span class="blank" style="--blank-width:4ch"></span>.</li>
<li>כדי לקבוע נקודה במישור משתמשים ב־<span class="blank" style="--blank-width:4ch"></span> מספרים.</li>
</ul>
</section>\n
<section class="q-card">
<h3>ה. האם <span class="math-ltr" dir="ltr">x=2, y=5</span> ו־<span class="math-ltr" dir="ltr">x=5, y=2</span> מתארים אותו מקום? הסבירו.</h3>
<div class="answer-line">
</div>
<div class="answer-line">
</div>
</section>
`,
});
