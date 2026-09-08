import type { ActivityKind, ValidationCode } from './types';

export type SkillId = 'ordered-pair-order' | 'x-reading' | 'y-reading' | 'point-placement' | 'axis-segment-length';

export type SkillState = Readonly<Record<SkillId, number>>;

export type AttemptEvent = Readonly<{
  activityKind: ActivityKind;
  code: ValidationCode;
}>;

export const initialSkillState: SkillState = {
  'ordered-pair-order': 0,
  'x-reading': 0,
  'y-reading': 0,
  'point-placement': 0,
  'axis-segment-length': 0,
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
    if (attempt.activityKind === 'segment-length') {
      next['axis-segment-length'] = clamp(next['axis-segment-length'] + 1);
    }
    return next;
  }

  if (attempt.code === 'swapped-xy') next['ordered-pair-order'] = clamp(next['ordered-pair-order'] - 2);
  if (attempt.code === 'wrong-x') next['x-reading'] = clamp(next['x-reading'] - 1);
  if (attempt.code === 'wrong-y') next['y-reading'] = clamp(next['y-reading'] - 1);
  if (attempt.code === 'wrong-point' && attempt.activityKind === 'place-point') {
    next['point-placement'] = clamp(next['point-placement'] - 1);
  }
  if (attempt.code === 'wrong-point' && attempt.activityKind === 'read-point') {
    next['x-reading'] = clamp(next['x-reading'] - 1);
    next['y-reading'] = clamp(next['y-reading'] - 1);
  }
  if (attempt.code === 'wrong-segment-length' || attempt.code === 'segment-not-axis-aligned') {
    next['axis-segment-length'] = clamp(next['axis-segment-length'] - 1);
  }

  return next;
}

export function weakestSkill(state: SkillState): SkillId {
  return (Object.entries(state) as [SkillId, number][]).reduce((weakest, current) =>
    current[1] < weakest[1] ? current : weakest,
  )[0];
}

export function guidanceForValidation(code: ValidationCode): string | null {
  switch (code) {
    case 'swapped-xy':
      return 'חיזוק מומלץ: קראו קודם את שיעור x — התנועה האופקית — ורק אחר כך את שיעור y.';
    case 'wrong-x':
      return 'חיזוק מומלץ: התמקדו במרחק האופקי מציר y.';
    case 'wrong-y':
      return 'חיזוק מומלץ: התמקדו במרחק האנכי מציר x.';
    case 'wrong-point':
      return 'חיזוק מומלץ: עקבו בנפרד אחרי x ואחרי y לפני שאתם כותבים את הזוג הסדור.';
    case 'wrong-segment-length':
      return 'חיזוק מומלץ: בקטע המקביל לציר משתמשים בהפרש של השיעורים המשתנים.';
    case 'segment-not-axis-aligned':
      return 'בשלב הזה מתרגלים רק קטעים המקבילים לציר x או לציר y.';
    case 'correct':
      return null;
  }
}
