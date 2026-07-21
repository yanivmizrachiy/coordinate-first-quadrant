# CLAUDE.md — מצביע לדף הכללים היחיד

## לפני כל פעולה
כל כללי הפרויקט, הדרישות וההחלטות נמצאים ב**דף כללים אחד ויחיד**:

> **`USER_MEMORY.md`**

קרא אותו לפני כל פעולה. כל דרישה חדשה של יניב נכתבת שם (לא כאן ולא בקבצים אחרים).

## גבול בטיחות קשיח (מועתק כאן בכוונה, למען הבהירות)
- הריפו המותר היחיד: `yanivmizrachiy/coordinate-first-quadrant`.
- אסור כל כתיבה / commit / push / merge אל `yanivmizrachiy/parabula-next`.
- אם `git remote get-url origin` אינו מצביע בדיוק אל `yanivmizrachiy/coordinate-first-quadrant` — לעצור ולא לכתוב.

## אישור קבוע (21.07.2026) — מחליף את הכלל הקודם
- ליניב יש **אישור עומד**: commit · push · PR · **merge ל־`main`** · **פרסום ל־Pages**
  מתבצעים **בלי לשאול**, בריפו המותר בלבד. הפירוט המלא בפרק 1 של `USER_MEMORY.md`.
- תנאי יחיד: typecheck · test · build עוברים. נכשלה בדיקה — מתקנים, לא מפרסמים.
