/* ===========================================================================
   Continuation pages 31–34 — "זווית ישרה במערכת הצירים" (right angle in the
   coordinate system). These are authored natively to replace the previous
   parabula-next iframes, so the app is fully self-contained (one repo, no
   external dependency). Content follows the locked pedagogy rules:
   ציר x / ציר y, fill-in tasks, real student names, dual checkboxes on every
   true/false row, first quadrant only, and the canonical footer on every page.
   =========================================================================== */
import type { WorkbookPageContent } from './types';

const FOOTER =
  '<footer class="gz-footer">' +
  '<div class="f1">יניב רז - מדריך מחוזי חט"ב בעיר ירושלים</div>' +
  '<div class="f2">הדרכה במחוז ירושלים והעיר ירושלים - מנח"י, בהובלת איילת קריספין</div>' +
  '</footer>';

const tf = (name: string) =>
  '<div class="tf-options" role="group" aria-label="סמנו נכון או לא נכון">' +
  `<label class="tf-option"><input type="radio" name="${name}" value="true"><span>נכון</span></label>` +
  `<label class="tf-option"><input type="radio" name="${name}" value="false"><span>לא נכון</span></label>` +
  '</div>';

const page31: WorkbookPageContent = {
  n: 31,
  id: 'page-31',
  sectionClass: 'sheet guided dense',
  title: 'זווית ישרה במערכת הצירים',
  subtitle: 'קטע אופקי וקטע אנכי נפגשים בזווית ישרה',
  html:
    '<section aria-labelledby="title-31" class="sheet guided dense" id="page-31">' +
    '<header class="sheet-header"><div><h1 id="title-31">זווית ישרה במערכת הצירים</h1><p>קטע אופקי וקטע אנכי נפגשים בזווית ישרה</p></div><div aria-label="עמוד 31" class="sheet-number">31</div></header>' +
    '<div class="sheet-content">' +
    '<div class="completion-intro">' +
    '<div class="completion-title">השלימו את המשפטים</div>' +
    '<div class="completion-sentence">קטע המקביל לציר x הוא קטע <span class="word-blank word-medium"></span>.</div>' +
    '<div class="completion-sentence">קטע המקביל לציר y הוא קטע <span class="word-blank word-medium"></span>.</div>' +
    '<div class="completion-sentence">כאשר קטע אופקי וקטע אנכי נפגשים, נוצרת ביניהם זווית <span class="word-blank word-medium"></span>.</div>' +
    '</div>' +
    '<section class="q-card"><h3>א. דוגמה: הקטע AB מקביל לציר x והקטע BC מקביל לציר y.</h3>' +
    '<div class="cols-2"><div aria-label="זווית ישרה בנקודה B בין קטע אופקי לקטע אנכי" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes=\'[{"text": "זווית ישרה", "at": [4.2, 3.6], "to": [6, 2]}]\' data-points=\'[{"x": 2, "y": 2, "label": "A"}, {"x": 6, "y": 2, "label": "B"}, {"x": 6, "y": 5, "label": "C"}]\' data-polygons="[]" data-segments=\'[{"from": [2, 2], "to": [6, 2], "type": "shape"}, {"from": [6, 2], "to": [6, 5], "type": "shape"}, {"from": [5.5, 2], "to": [5.5, 2.5], "type": "guide"}, {"from": [5.5, 2.5], "to": [6, 2.5], "type": "guide"}]\' role="img"></div>' +
    '<div><p>הקטע AB מקביל לציר <span class="blank" style="--blank-width:4ch"></span>.</p><p>הקטע BC מקביל לציר <span class="blank" style="--blank-width:4ch"></span>.</p><p class="axis-answer-box">הזווית הישרה נמצאת בנקודה <span class="blank" style="--blank-width:4ch"></span></p></div></div></section>' +
    '<section class="q-card"><h3>ב. נועה מסמנת קטע מ־(1,3) עד (5,3) וקטע מ־(5,3) עד (5,6). איזו זווית נוצרת בנקודה (5,3)?</h3>' +
    '<div class="choice-row"><span class="choice">זווית ישרה</span><span class="choice">אין זווית ישרה</span></div>' +
    '<p>הקטע הראשון מקביל לציר <span class="blank" style="--blank-width:4ch"></span>; הקטע השני מקביל לציר <span class="blank" style="--blank-width:4ch"></span>.</p></section>' +
    '</div>' + FOOTER + '</section>',
};

const page32: WorkbookPageContent = {
  n: 32,
  id: 'page-32',
  sectionClass: 'sheet practice',
  title: 'מזהים זווית ישרה',
  subtitle: 'זווית ישרה נוצרת רק כשקטע אחד אופקי והשני אנכי',
  html:
    '<section aria-labelledby="title-32" class="sheet practice" id="page-32">' +
    '<header class="sheet-header"><div><h1 id="title-32">מזהים זווית ישרה</h1><p>זווית ישרה נוצרת רק כשקטע אחד אופקי והשני אנכי</p></div><div aria-label="עמוד 32" class="sheet-number">32</div></header>' +
    '<div class="sheet-content">' +
    '<section class="q-card"><h3>א. בכל שרטוט בדקו את הזווית בנקודה האמצעית וסמנו אם היא זווית ישרה.</h3>' +
    '<div class="cols-2">' +
    '<div><div aria-label="קטעים בנקודה P" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 1, "y": 2, "label": "M"}, {"x": 4, "y": 2, "label": "P"}, {"x": 4, "y": 5, "label": "N"}]\' data-polygons="[]" data-segments=\'[{"from": [1, 2], "to": [4, 2], "type": "shape"}, {"from": [4, 2], "to": [4, 5], "type": "shape"}]\' role="img"></div><div class="mist-head"><span>הזווית ב־P ישרה</span>' + tf('rt-1') + '</div></div>' +
    '<div><div aria-label="קטעים בנקודה Q" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 1, "y": 1, "label": "R"}, {"x": 4, "y": 2, "label": "Q"}, {"x": 6, "y": 5, "label": "S"}]\' data-polygons="[]" data-segments=\'[{"from": [1, 1], "to": [4, 2], "type": "shape"}, {"from": [4, 2], "to": [6, 5], "type": "shape"}]\' role="img"></div><div class="mist-head"><span>הזווית ב־Q ישרה</span>' + tf('rt-2') + '</div></div>' +
    '</div></section>' +
    '<section class="q-card"><h3>ב. עוד שני שרטוטים. סמנו נכון או לא נכון.</h3>' +
    '<div class="cols-2">' +
    '<div><div aria-label="קטעים בנקודה K" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 2, "y": 5, "label": "A"}, {"x": 2, "y": 1, "label": "K"}, {"x": 7, "y": 1, "label": "B"}]\' data-polygons="[]" data-segments=\'[{"from": [2, 5], "to": [2, 1], "type": "shape"}, {"from": [2, 1], "to": [7, 1], "type": "shape"}]\' role="img"></div><div class="mist-head"><span>הזווית ב־K ישרה</span>' + tf('rt-3') + '</div></div>' +
    '<div><div aria-label="קטעים בנקודה T" class="coordinate-grid grid-sm" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 1, "y": 4, "label": "C"}, {"x": 5, "y": 4, "label": "T"}, {"x": 7, "y": 2, "label": "D"}]\' data-polygons="[]" data-segments=\'[{"from": [1, 4], "to": [5, 4], "type": "shape"}, {"from": [5, 4], "to": [7, 2], "type": "shape"}]\' role="img"></div><div class="mist-head"><span>הזווית ב־T ישרה</span>' + tf('rt-4') + '</div></div>' +
    '</div>' +
    '<p class="small">הסבירו: זווית ישרה נוצרת כאשר קטע אחד מקביל לציר x והשני מקביל לציר y.</p></section>' +
    '</div>' + FOOTER + '</section>',
};

const page33: WorkbookPageContent = {
  n: 33,
  id: 'page-33',
  sectionClass: 'sheet guided dense',
  title: 'בונים זווית ישרה',
  subtitle: 'זזים לפי x ואז לפי y — ובפינה נוצרת זווית ישרה',
  html:
    '<section aria-labelledby="title-33" class="sheet guided dense" id="page-33">' +
    '<header class="sheet-header"><div><h1 id="title-33">בונים זווית ישרה</h1><p>זזים לפי x ואז לפי y — ובפינה נוצרת זווית ישרה</p></div><div aria-label="עמוד 33" class="sheet-number">33</div></header>' +
    '<div class="sheet-content">' +
    '<div class="cols-2 compact-top"><div class="rule-box">מהראשית זזים תחילה לפי x ואז לפי y. בפינה שבה הכיוון משתנה מאופקי לאנכי נוצרת זווית ישרה.</div>' +
    '<div aria-label="מסלול מהראשית עם זווית ישרה בפינה" class="coordinate-grid grid-md" data-arrows=\'[{"from": [0, 0], "to": [4, 0], "label": "4 ימינה"}, {"from": [4, 0], "to": [4, 3], "label": "3 למעלה"}]\' data-labelboxes="[]" data-points=\'[{"x": 0, "y": 0, "label": "O"}, {"x": 4, "y": 0, "label": ""}, {"x": 4, "y": 3, "label": "P"}]\' data-polygons="[]" data-segments=\'[{"from": [3.5, 0], "to": [3.5, 0.5], "type": "guide"}, {"from": [3.5, 0.5], "to": [4, 0.5], "type": "guide"}]\' role="img"></div></div>' +
    '<section class="q-card"><h3>א. לפי המסלול שלמעלה.</h3><p>בפינה (4,0) הכיוון משתנה מ־<span class="blank" style="--blank-width:5ch"></span> ל־<span class="blank" style="--blank-width:5ch"></span>.</p><p>לכן ב־(4,0) נוצרת זווית <span class="blank" style="--blank-width:5ch"></span>.</p></section>' +
    '<section class="q-card"><h3>ב. אורי בונה מלבן ABCD. בכמה מקודקודי המלבן יש זווית ישרה?</h3>' +
    '<div class="cols-2"><div aria-label="מלבן ABCD עם זוויות ישרות בקודקודים" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 1, "y": 1, "label": "A"}, {"x": 6, "y": 1, "label": "B"}, {"x": 6, "y": 4, "label": "C"}, {"x": 1, "y": 4, "label": "D"}]\' data-polygons=\'[{"points": [[1, 1], [6, 1], [6, 4], [1, 4]]}]\' data-segments="[]" role="img"></div>' +
    '<div><p class="axis-answer-box">מספר הזוויות הישרות: <span class="blank" style="--blank-width:4ch"></span></p><p>הצלעות AB ו־DC מקבילות לציר <span class="blank" style="--blank-width:4ch"></span>.</p><p>הצלעות AD ו־BC מקבילות לציר <span class="blank" style="--blank-width:4ch"></span>.</p></div></div></section>' +
    '<section class="q-card span-2"><h3>ג. חשבו את היקף ושטח המלבן ABCD מסעיף ב.</h3>' +
    '<p>אורך הצלע האופקית <span class="math-ltr" dir="ltr">AB</span>: <span class="blank" style="--blank-width:4ch"></span> יחידות. &nbsp; אורך הצלע האנכית <span class="math-ltr" dir="ltr">BC</span>: <span class="blank" style="--blank-width:4ch"></span> יחידות.</p>' +
    '<p>היקף המלבן: <span class="blank" style="--blank-width:4ch"></span> יחידות. &nbsp; שטח המלבן: <span class="blank" style="--blank-width:4ch"></span> יחידות ריבועיות.</p>' +
    '<div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div><div class="answer-line"></div></div></section>' +
    '</div>' + FOOTER + '</section>',
};

const page34: WorkbookPageContent = {
  n: 34,
  id: 'page-34',
  sectionClass: 'sheet practice',
  title: 'זווית ישרה — תרגול מסכם',
  subtitle: 'מלבנים, זוויות ישרות, היקף ושטח ברביע הראשון',
  html:
    '<section aria-labelledby="title-34" class="sheet practice" id="page-34">' +
    '<header class="sheet-header"><div><h1 id="title-34">זווית ישרה — תרגול מסכם</h1><p>מלבנים, זוויות ישרות, היקף ושטח ברביע הראשון</p></div><div aria-label="עמוד 34" class="sheet-number">34</div></header>' +
    '<div class="sheet-content">' +
    '<section class="q-card"><h3>א. לפני המלבן ABCD שקודקודיו A(2,1), B(7,1), C(7,5), D(2,5).</h3>' +
    '<div class="cols-2"><div aria-label="מלבן ABCD ברביע הראשון" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 2, "y": 1, "label": "A"}, {"x": 7, "y": 1, "label": "B"}, {"x": 7, "y": 5, "label": "C"}, {"x": 2, "y": 5, "label": "D"}]\' data-polygons=\'[{"points": [[2, 1], [7, 1], [7, 5], [2, 5]]}]\' data-segments="[]" role="img"></div>' +
    '<div><p>צלעות מקבילות לציר x: <span class="blank" style="--blank-width:8ch"></span></p><p>צלעות מקבילות לציר y: <span class="blank" style="--blank-width:8ch"></span></p><p>מספר הזוויות הישרות: <span class="blank" style="--blank-width:3ch"></span></p><p><span class="math-ltr" dir="ltr">AB =</span> <span class="blank" style="--blank-width:3ch"></span> יחידות, &nbsp; <span class="math-ltr" dir="ltr">BC =</span> <span class="blank" style="--blank-width:3ch"></span> יחידות</p><p>היקף: <span class="blank" style="--blank-width:4ch"></span> יחידות, &nbsp; שטח: <span class="blank" style="--blank-width:4ch"></span> יחידות ריבועיות</p><div class="calc-box"><b>דרך החישוב (היקף ושטח):</b><div class="answer-line"></div><div class="answer-line"></div></div></div></div></section>' +
    '<section class="q-card"><h3>ב. דניאל סימן שלושה קודקודים: P(2,2), Q(6,2), R(6,5). סמנו את הקודקוד הרביעי S כך שייווצר מלבן.</h3>' +
    '<div class="cols-2"><div aria-label="שלושה קודקודים לבניית מלבן עם זוויות ישרות" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 2, "y": 2, "label": "P"}, {"x": 6, "y": 2, "label": "Q"}, {"x": 6, "y": 5, "label": "R"}]\' data-polygons="[]" data-segments=\'[{"from": [2, 2], "to": [6, 2], "type": "shape"}, {"from": [6, 2], "to": [6, 5], "type": "shape"}]\' role="img"></div>' +
    '<div><p class="axis-answer-box">S = <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></p><p>בקודקוד Q הזווית היא <span class="blank" style="--blank-width:5ch"></span>.</p><p>היקף המלבן: <span class="blank" style="--blank-width:4ch"></span> יחידות, &nbsp; שטח: <span class="blank" style="--blank-width:4ch"></span> יחידות ריבועיות</p><div class="calc-box"><b>דרך החישוב:</b><div class="answer-line"></div></div></div></div></section>' +
    '<section class="q-card span-2"><h3>ג. סמנו נכון או לא נכון.</h3>' +
    '<table class="tf-table"><tr><td>לכל מלבן יש ארבע זוויות ישרות.</td><td>' + tf('rt-sum-1') + '</td></tr>' +
    '<tr><td>שני קטעים המקבילים שניהם לציר x יוצרים ביניהם זווית ישרה.</td><td>' + tf('rt-sum-2') + '</td></tr>' +
    '<tr><td>קטע המקביל לציר x וקטע המקביל לציר y יוצרים זווית ישרה.</td><td>' + tf('rt-sum-3') + '</td></tr></table></section>' +
    '</div>' + FOOTER + '</section>',
};

const page35: WorkbookPageContent = {
  n: 35,
  id: 'page-35',
  sectionClass: 'sheet guided',
  title: 'הזוג הסדור — סדר, סוגריים ותרגול',
  subtitle: 'x מצד שמאל, y מצד ימין — יש סדר, ולכן זוג סדור',
  html:
    '<section aria-labelledby="title-35" class="sheet guided" id="page-35">' +
    '<header class="sheet-header"><div><h1 id="title-35">הזוג הסדור — סדר, סוגריים ותרגול</h1><p>x מצד שמאל, y מצד ימין — יש סדר, ולכן זוג סדור</p></div><div aria-label="עמוד 35" class="sheet-number">35</div></header>' +
    '<div class="sheet-content">' +
    '<div class="rule-box">כל נקודה נכתבת כ<b>זוג סדור</b> בתוך סוגריים: <span class="math-ltr" dir="ltr">(x,y)</span>. המספר ה<b>שמאלי</b> הוא שיעור <span class="math-ltr" dir="ltr">x</span>, והמספר ה<b>ימני</b> הוא שיעור <span class="math-ltr" dir="ltr">y</span>. הסדר קובע — ולכן זהו זוג <b>סדור</b>.</div>' +
    '<section class="q-card"><h3>א. נתונה נקודה — כתבו את שיעוריה.</h3><ul class="tasks">' +
    '<li>נקודה <span class="math-ltr" dir="ltr">A(3,5)</span>: שיעור <span class="math-ltr" dir="ltr">x =</span> <span class="blank" style="--blank-width:3ch"></span> , שיעור <span class="math-ltr" dir="ltr">y =</span> <span class="blank" style="--blank-width:3ch"></span></li>' +
    '<li>נקודה <span class="math-ltr" dir="ltr">B(6,2)</span>: שיעור <span class="math-ltr" dir="ltr">x =</span> <span class="blank" style="--blank-width:3ch"></span> , שיעור <span class="math-ltr" dir="ltr">y =</span> <span class="blank" style="--blank-width:3ch"></span></li>' +
    '</ul></section>' +
    '<section class="q-card"><h3>ב. נתונים שיעורים — כתבו את הזוג הסדור.</h3><ul class="tasks">' +
    '<li>שיעור <span class="math-ltr" dir="ltr">x</span> הוא 4 ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 7: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>' +
    '<li>שיעור <span class="math-ltr" dir="ltr">x</span> הוא 8 ושיעור <span class="math-ltr" dir="ltr">y</span> הוא 1: <span class="pair math-ltr" dir="ltr">(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>' +
    '</ul></section>' +
    '<section class="q-card"><h3>ג. הסדר משנה!</h3><p>האם נקודה <span class="math-ltr" dir="ltr">(2,6)</span> ונקודה <span class="math-ltr" dir="ltr">(6,2)</span> הן אותה נקודה? <span class="blank" style="--blank-width:6ch"></span></p><p>הסבירו מדוע:</p><div class="answer-line"></div></section>' +
    '<section class="q-card"><h3>ד. כתבו כל נקודה — האות משמאל לסוגריים.</h3><ul class="tasks">' +
    '<li>נקודה בשם <span class="math-ltr" dir="ltr">C</span> ששיעוריה 5 ו־3: <span class="pair math-ltr" dir="ltr">C(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>' +
    '<li>נקודה בשם <span class="math-ltr" dir="ltr">D</span> ששיעוריה 0 ו־4: <span class="pair math-ltr" dir="ltr">D(<span class="pair-blank"></span>,<span class="pair-blank"></span>)</span></li>' +
    '</ul></section>' +
    '</div>' + FOOTER + '</section>',
};

const page36: WorkbookPageContent = {
  n: 36,
  id: 'page-36',
  sectionClass: 'sheet guided',
  title: 'מקביל ומאונך במערכת הצירים',
  subtitle: 'קטע מקביל לציר x הוא מאונך לציר y',
  html:
    '<section aria-labelledby="title-36" class="sheet guided" id="page-36">' +
    '<header class="sheet-header"><div><h1 id="title-36">מקביל ומאונך במערכת הצירים</h1><p>קטע מקביל לציר x הוא מאונך לציר y</p></div><div aria-label="עמוד 36" class="sheet-number">36</div></header>' +
    '<div class="sheet-content">' +
    '<div class="rule-box">קטע <b>אופקי</b> מקביל לציר <span class="math-ltr" dir="ltr">x</span> — ולכן הוא <b>מאונך</b> לציר <span class="math-ltr" dir="ltr">y</span>. קטע <b>אנכי</b> מקביל לציר <span class="math-ltr" dir="ltr">y</span> — ולכן הוא <b>מאונך</b> לציר <span class="math-ltr" dir="ltr">x</span>.</div>' +
    '<div class="cols-2"><section class="q-card"><h3>א. שני קטעים.</h3><div aria-label="קטע אופקי AB וקטע אנכי CD" class="coordinate-grid grid-md" data-arrows="[]" data-labelboxes="[]" data-points=\'[{"x": 1, "y": 2, "label": "A"}, {"x": 6, "y": 2, "label": "B"}, {"x": 3, "y": 3, "label": "C"}, {"x": 3, "y": 6, "label": "D"}]\' data-polygons="[]" data-segments=\'[{"from": [1, 2], "to": [6, 2], "type": "shape"}, {"from": [3, 3], "to": [3, 6], "type": "shape"}]\' role="img"></div>' +
    '<p>הקטע <span class="math-ltr" dir="ltr">AB</span> מקביל לציר <span class="blank" style="--blank-width:3ch"></span>, כי בשתי נקודותיו <b>שיעור <span class="math-ltr" dir="ltr">y</span> זהה</b>.</p>' +
    '<p>הקטע <span class="math-ltr" dir="ltr">CD</span> מקביל לציר <span class="blank" style="--blank-width:3ch"></span>, כי בשתי נקודותיו <b>שיעור <span class="math-ltr" dir="ltr">x</span> זהה</b>.</p></section>' +
    '<section class="q-card"><h3>ב. השלימו.</h3><ul class="tasks compact">' +
    '<li>קטע שבו <b>שיעור <span class="math-ltr" dir="ltr">y</span> זהה</b> בשתי הנקודות מקביל לציר <span class="blank" style="--blank-width:3ch"></span>.</li>' +
    '<li>קטע שבו <b>שיעור <span class="math-ltr" dir="ltr">x</span> זהה</b> בשתי הנקודות מקביל לציר <span class="blank" style="--blank-width:3ch"></span>.</li>' +
    '<li>קטע המקביל לציר <span class="math-ltr" dir="ltr">x</span> מאונך לציר <span class="blank" style="--blank-width:3ch"></span>.</li>' +
    '<li>קטע המקביל לציר <span class="math-ltr" dir="ltr">y</span> מאונך לציר <span class="blank" style="--blank-width:3ch"></span>.</li>' +
    '</ul></section></div>' +
    '<section class="q-card span-2"><h3>ג. סמנו נכון או לא נכון.</h3><table class="tf-table">' +
    '<tr data-answer="true"><td>קטע המקביל לציר <span class="math-ltr" dir="ltr">x</span> הוא מאונך לציר <span class="math-ltr" dir="ltr">y</span>.</td><td>' + tf('pp-1') + '</td></tr>' +
    '<tr data-answer="false"><td>בקטע המקביל לציר <span class="math-ltr" dir="ltr">y</span>, שיעור <span class="math-ltr" dir="ltr">y</span> זהה בשתי הנקודות.</td><td>' + tf('pp-2') + '</td></tr>' +
    '<tr data-answer="true"><td>בקטע המקביל לציר <span class="math-ltr" dir="ltr">x</span>, שיעור <span class="math-ltr" dir="ltr">y</span> זהה בשתי הנקודות.</td><td>' + tf('pp-3') + '</td></tr>' +
    '</table></section>' +
    '</div>' + FOOTER + '</section>',
};

export const CONTINUATION_PAGES: WorkbookPageContent[] = [page31, page32, page33, page34, page35, page36];
