import type { Activity, ValidationCode } from './types';

const guidedByCode: Readonly<Partial<Record<ValidationCode, string>>> = {
  'swapped-xy': 'הדרכה: עברו מהנקודה אל ציר x וקראו את המספר האופקי. זהו המספר הראשון. אחר כך קראו את הגובה על ציר y.',
  'wrong-x': 'הדרכה: התעלמו לרגע מהגובה. עקבו רק אופקית מן הנקודה אל ציר y וקראו את שיעור x.',
  'wrong-y': 'הדרכה: השאירו את שיעור x כפי שהוא. עכשיו עקבו אנכית וקראו את שיעור y.',
  'wrong-point': 'הדרכה: פצלו את המשימה לשניים — קודם x בלבד, אחר כך y בלבד — ורק בסוף חברו לזוג סדור.',
  'wrong-segment-length': 'הדרכה: בקטע אופקי מחסרים את שני שיעורי x; בקטע אנכי מחסרים את שני שיעורי y. אין צורך לספור משבצות.',
  'segment-not-axis-aligned': 'הדרכה: הזיזו את נקודת הקצה עד שלשתי הנקודות יהיה אותו y או אותו x.',
  'wrong-point-region': 'הדרכה: אם x=0 הנקודה על ציר y; אם y=0 היא על ציר x; אם שניהם 0 זו הראשית.',
  'wrong-coordinate-comparison': 'הדרכה: כסו בדמיון את השיעור שלא נשאלתם עליו והשוו רק את שני המספרים של הציר המבוקש.',
  'wrong-rectangle-length': 'הדרכה: האורך אופקי, לכן מחסרים את שיעורי x של שני הקודקודים הקיצוניים.',
  'wrong-rectangle-width': 'הדרכה: הרוחב אנכי, לכן מחסרים את שיעורי y של שני הקודקודים הקיצוניים.',
  'wrong-rectangle-perimeter': 'הדרכה: חשבו קודם אורך ורוחב, חברו אותם, ואז כפלו ב־2.',
  'wrong-rectangle-area': 'הדרכה: חשבו קודם אורך ורוחב, ואז הכפילו ביניהם.',
};

export type HintStage = Readonly<{
  level: 'hint' | 'guided';
  text: string;
}>;

export function stagedHint(activity: Activity, code: ValidationCode, attemptNumber: number): HintStage | null {
  if (code === 'correct' || attemptNumber < 1) return null;

  if (attemptNumber >= 3) {
    const guided = guidedByCode[code];
    if (guided) return { level: 'guided', text: guided };
  }

  const activitySpecific: Readonly<Partial<Record<Activity['kind'], string>>> = {
    'read-point': 'רמז: בזוג סדור תמיד קוראים קודם x ואז y.',
    'place-point': 'רמז: התחילו בתנועה אופקית לפי x ורק אחר כך עלו לפי y.',
    'segment-length': 'רמז: בדקו קודם שהקטע מקביל לאחד הצירים, ואז השתמשו בהפרש השיעורים.',
    'classify-point': 'רמז: חפשו האם אחד השיעורים שווה 0.',
    'compare-coordinate': 'רמז: השוו רק את השיעור של הציר שמופיע בשאלה.',
    'rectangle-properties': 'רמז: את ממדי המלבן מוצאים קודם מהפרשי x ו־y, ורק אחר כך מחשבים P ו־S.',
  };

  return { level: 'hint', text: activitySpecific[activity.kind] ?? 'רמז: נסו לפרק את המשימה לצעד אחד בכל פעם.' };
}
