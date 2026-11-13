import type { Activity, ActivityKind } from './types';
import type { SkillId, SkillState } from './mastery';
import { weakestSkill } from './mastery';

const activitySkills: Readonly<Record<ActivityKind, readonly SkillId[]>> = {
  'read-point': ['ordered-pair-order', 'x-reading', 'y-reading'],
  'place-point': ['ordered-pair-order', 'point-placement'],
  'segment-length': ['axis-segment-length'],
  'classify-point': ['axes-origin'],
  'compare-coordinate': ['coordinate-comparison'],
  'rectangle-properties': ['rectangle-dimensions', 'rectangle-perimeter', 'rectangle-area'],
};

export function skillsForActivity(activity: Activity): readonly SkillId[] {
  return activitySkills[activity.kind];
}

export function nextActivity(
  activities: readonly Activity[],
  state: SkillState,
  completedIds: readonly string[],
): Activity | null {
  if (activities.length === 0) return null;

  const remaining = activities.filter((activity) => !completedIds.includes(activity.id));
  if (remaining.length === 0) return null;

  const weakest = weakestSkill(state);
  const targeted = remaining.find((activity) => skillsForActivity(activity).includes(weakest));
  if (targeted) return targeted;

  const scoreFor = (activity: Activity) =>
    Math.min(...skillsForActivity(activity).map((skill) => state[skill]));

  return remaining.reduce((best, current) =>
    scoreFor(current) < scoreFor(best) ? current : best,
  );
}

export function explainRecommendation(activity: Activity, state: SkillState): string {
  const relevant = skillsForActivity(activity);
  const weakest = relevant.reduce((best, current) =>
    state[current] < state[best] ? current : best,
  );

  const labels: Readonly<Record<SkillId, string>> = {
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

  return `מומלץ עכשיו לחזק: ${labels[weakest]}.`;
}
