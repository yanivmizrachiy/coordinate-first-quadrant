import type { ActivityKind, ValidationCode } from './types';

export type SkillId =
  | 'ordered-pair-order'
  | 'x-reading'
  | 'y-reading'
  | 'point-placement'
  | 'axis-segment-length'
  | 'axes-origin'
  | 'coordinate-comparison'
  | 'rectangle-dimensions'
  | 'rectangle-perimeter'
  | 'rectangle-area';

export type SkillState = Readonly<Record<SkillId, number>>;

export type AttemptEvent = Readonly<{
  activityKind: ActivityKind;
  code: ValidationCode;
}>;

export const skillLabels: Readonly<Record<SkillId, string>> = {
  'ordered-pair-order': 'סדר x ואז y',
  'x-reading': 'קריאת שיעור x',
  'y-reading': 'קריאת שיעור y',
  'point-placement': 'מיקום נקודה לפי זוג סדור',
  'axis-segment-length': 'אורך קטע באמצעות הפרש שיעורים',
  'axes-origin': 'נקודות על הצירים ובראשית',
  'coordinate-comparison': 'השוואת שיעורים',
  'rectangle-dimensions': 'אורך ורוחב של מלבן מהשיעורים',
  'rectangle-perimeter': 'היקף מלבן',
  'rectangle-area': 'שטח מלבן',
};

export const initialSkillState: SkillState = {
  'ordered-pair-order': 0,
  'x-reading': 0,
  'y-reading': 0,
  'point-placement': 0,
  'axis-segment-length': 0,
  'axes-origin': 0,
  'coordinate-comparison': 0,
  'rectangle-dimensions': 0,
  'rectangle-perimeter': 0,
  'rectangle-area': 0,
};

const clamp = (value: number) => Math.max(-3, Math.min(3, value));

export function updateSkillState(state: SkillState, attempt: AttemptEvent): SkillState {
  const next = { ...state };

  if (attempt.code === 'correct') {
    if (attempt.activityKind === 'read-point') {
      next['ordered-pair-order'] = clamp(next['ordered-pair-order'] + 1);
      next['x-reading'] = clamp(next['x-reading'] + 1);
      next['y-reading'] = clamp(next['y-reading'] + 1);
    }
    if (attempt.activityKind === 'place-point') {
      next['ordered-pair-order'] = clamp(next['ordered-pair-order'] + 1);
      next['point-placement'] = clamp(next['point-placement'] + 1);
    }
    if (attempt.activityKind === 'segment-length') next['axis-segment-length'] = clamp(next['axis-segment-length'] + 1);
    if (attempt.activityKind === 'classify-point') next['axes-origin'] = clamp(next['axes-origin'] + 1);
    if (attempt.activityKind === 'compare-coordinate') next['coordinate-comparison'] = clamp(next['coordinate-comparison'] + 1);
    if (attempt.activityKind === 'rectangle-properties') {
      next['rectangle-dimensions'] = clamp(next['rectangle-dimensions'] + 1);
      next['rectangle-perimeter'] = clamp(next['rectangle-perimeter'] + 1);
      next['rectangle-area'] = clamp(next['rectangle-area'] + 1);
    }
    return next;
  }

  if (attempt.code === 'swapped-xy') next['ordered-pair-order'] = clamp(next['ordered-pair-order'] - 2);
  if (attempt.code === 'wrong-x') next['x-reading'] = clamp(next['x-reading'] - 1);
  if (attempt.code === 'wrong-y') next['y-reading'] = clamp(next['y-reading'] - 1);
  if (attempt.code === 'wrong-point' && attempt.activityKind === 'place-point') next['point-placement'] = clamp(next['point-placement'] - 1);
  if (attempt.code === 'wrong-point' && attempt.activityKind === 'read-point') {
    next['x-reading'] = clamp(next['x-reading'] - 1);
    next['y-reading'] = clamp(next['y-reading'] - 1);
  }
  if (attempt.code === 'wrong-segment-length' || attempt.code === 'segment-not-axis-aligned') {
    next['axis-segment-length'] = clamp(next['axis-segment-length'] - 1);
  }
  if (attempt.code === 'wrong-point-region') next['axes-origin'] = clamp(next['axes-origin'] - 1);
  if (attempt.code === 'wrong-coordinate-comparison') next['coordinate-comparison'] = clamp(next['coordinate-comparison'] - 1);
  if (attempt.code === 'wrong-rectangle-length' || attempt.code === 'wrong-rectangle-width') {
    next['rectangle-dimensions'] = clamp(next['rectangle-dimensions'] - 1);
  }
  if (attempt.code === 'wrong-rectangle-perimeter') next['rectangle-perimeter'] = clamp(next['rectangle-perimeter'] - 1);
  if (attempt.code === 'wrong-rectangle-area') next['rectangle-area'] = clamp(next['rectangle-area'] - 1);

  return next;
}

export function weakestSkill(state: SkillState): SkillId {
  return (Object.entries(state) as [SkillId, number][]).reduce((weakest, current) =>
    current[1] < weakest[1] ? current : weakest,
  )[0];
}

export function rankedSkills(state: SkillState): readonly { skill: SkillId; score: number }[] {
  return (Object.entries(state) as [SkillId, number][])
    .map(([skill, score]) => ({ skill, score }))
    .sort((a, b) => b.score - a.score || skillLabels[a.skill].localeCompare(skillLabels[b.skill], 'he'));
}

export function masteryStatus(score: number): 'strong' | 'developing' | 'reinforce' {
  if (score > 0) return 'strong';
  if (score < 0) return 'reinforce';
  return 'developing';
}

export function guidanceForValidation(code: ValidationCode): string | null {
  switch (code) {
    case 'swapped-xy': return 'חיזוק מומלץ: קראו קודם את שיעור x — התנועה האופקית — ורק אחר כך את שיעור y.';
    case 'wrong-x': return 'חיזוק מומלץ: התמקדו במרחק האופקי מציר y.';
    case 'wrong-y': return 'חיזוק מומלץ: התמקדו במרחק האנכי מציר x.';
    case 'wrong-point': return 'חיזוק מומלץ: עקבו בנפרד אחרי x ואחרי y לפני שאתם כותבים את הזוג הסדור.';
    case 'wrong-segment-length': return 'חיזוק מומלץ: בקטע המקביל לציר משתמשים בהפרש של השיעורים המשתנים.';
    case 'segment-not-axis-aligned': return 'בשלב הזה מתרגלים רק קטעים המקבילים לציר x או לציר y.';
    case 'wrong-point-region': return 'חיזוק מומלץ: שיעור 0 קובע אם הנקודה יושבת על אחד הצירים או בראשית.';
    case 'wrong-coordinate-comparison': return 'חיזוק מומלץ: השוו רק את השיעור שהתבקשתם להשוות.';
    case 'wrong-rectangle-length': return 'חיזוק מומלץ: אורך אופקי מתקבל מהפרש שיעורי x.';
    case 'wrong-rectangle-width': return 'חיזוק מומלץ: רוחב אנכי מתקבל מהפרש שיעורי y.';
    case 'wrong-rectangle-perimeter': return 'חיזוק מומלץ: P = 2·(אורך + רוחב).';
    case 'wrong-rectangle-area': return 'חיזוק מומלץ: S = אורך · רוחב.';
    case 'correct': return null;
  }
}
