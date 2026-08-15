# מערכת צירים — הרביע הראשון

אתר וחוברת ללימוד מערכת הצירים ברביע הראשון: **78 עמודים ממוספרים להדפסה**, עמוד שער, עמוד תוכן עניינים, חוברת מדפדפת דיגיטלית, תצוגת מובייל והדפסת A4.

**מקור האמת היחיד של הפרויקט:** `USER_MEMORY.md`.

## מצב נוכחי

- 78 עמודים ממוספרים.
- שער + תוכן עניינים = **80 גיליונות בחוברת המלאה**.
- כל משימה ממוספרת פתירה על נייר; אין שעשועונים מקוונים בתוך העמודים הממוספרים.
- דפי חידה/פענוח קיימים כדפי עבודה מודפסים.
- `#/print-aids` מכיל המחשות A4 נפרדות ואינו חלק ממספור החוברת.
- האתר הרשמי: `https://yanivmizrachiy.github.io/coordinate-first-quadrant/`.

## נתיבים

- `#/` — דף הבית.
- `#/menu` — תפריט פעולות.
- `#/book` — חוברת מדפדפת.
- `#/workbook/:n` — עמוד בודד.
- `#/print` — החוברת הרציפה ב־A4, מקור ההדפסה וה־PDF.
- `#/print-aids` — המחשות להדפסה.

## מבנה עיקרי

```text
index.html
src/
  main.ts
  router.ts
  data/workbook/
    authoring.ts
    index.ts              # BOOK — סדר, מספור ופרקים
    pages/                # קובץ אחד לכל עמוד
  data/colorDecode.ts
  data/printAids.ts
  lib/
  styles/
  views/
public/
  hoveret.pdf
  hoveret-bw.pdf
  hoveret-map.json
  assets/
tests/
```

## פיתוח ובדיקות

```bash
npm install
npm run dev
npm run verify
```

`npm run verify` הוא שער הסיום: typecheck, בדיקות יחידה/תוכן, build ובדיקות דפדפן/רינדור.

אחרי שינוי שנראה בעמודים עצמם:

```bash
npm run pdf
```

יש לוודא שהחוברת נשארת **80 עמודי PDF**, ללא עמודים ריקים וללא גלישה, וש־`hoveret-map.json` תואם.

## פרסום

GitHub Pages הוא הקישור הציבורי הרשמי. הפרסום מתבצע ידנית דרך workflow:

`Deploy to GitHub Pages (manual)`

מפרסמים רק לאחר שכל שערי האימות הרלוונטיים עברו.

## לסוכני AI

- `USER_MEMORY.md` — מקור האמת היחיד.
- `AGENTS.md` — הוראות תפעול ל־Codex/סוכני קוד.
- `CLAUDE.md` — שלט הפניה בלבד.
- `HANDOFF.md` — מצביע מצב בלבד, לא מקור כללים.

אין להסיק כללים מתיעוד היסטורי או מ־commit ישן כאשר הם סותרים את `USER_MEMORY.md`.
