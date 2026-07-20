# CLAUDE.md — הוראות חובה

לפני כל שינוי יש לקרוא:

1. `USER_MEMORY.md`
2. `docs/CURRENT_REQUIREMENTS.md`
3. `docs/DECISION_LOG.md`

## גבול בטיחות

הריפו המותר היחיד:

`yanivmizrachiy/coordinate-first-quadrant`

אסור לבצע כתיבה, commit, push, reset או שינוי כלשהו ב:

`yanivmizrachiy/parabula-next`

לפני כל push יש לבדוק את `git remote get-url origin`.
אם ה־remote אינו הריפו המותר — עוצרים.

## מדיניות שינויים

- ההנחיה החדשה ביותר מחליפה רק כלל שסותר אותה.
- שאר הדרישות נשמרות.
- מבצעים שינוי ממוקד.
- לא מוחקים תוכן שאינו קשור לתיקון.
- בודקים את כל 34 העמודים לפני שמירה.
