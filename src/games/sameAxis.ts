/* אותו x או אותו y — pick every point that shares a vertical line (same x) or a
   horizontal line (same y) with the target. Each correct round reveals a letter;
   together they spell a word. */
import { sameX, sameY } from '../lib/coordinateMath';

export interface SameAxisRound {
  points: { label: string; x: number; y: number }[];
  targetLabel: string;
  /** 'x' → same x (vertical line); 'y' → same y (horizontal line). */
  axis: 'x' | 'y';
  token: string;
}

export const sameAxisRounds: SameAxisRound[] = [
  {
    axis: 'x', token: 'י', targetLabel: 'A',
    points: [
      { label: 'A', x: 3, y: 1 }, { label: 'B', x: 3, y: 4 }, { label: 'C', x: 6, y: 2 },
      { label: 'D', x: 3, y: 5 }, { label: 'E', x: 5, y: 4 },
    ],
  },
  {
    axis: 'y', token: 'ש', targetLabel: 'M',
    points: [
      { label: 'M', x: 2, y: 2 }, { label: 'N', x: 5, y: 2 }, { label: 'P', x: 2, y: 5 },
      { label: 'Q', x: 7, y: 2 }, { label: 'R', x: 4, y: 6 },
    ],
  },
  {
    axis: 'x', token: 'ר', targetLabel: 'K',
    points: [
      { label: 'K', x: 6, y: 1 }, { label: 'L', x: 6, y: 3 }, { label: 'S', x: 1, y: 4 },
      { label: 'T', x: 6, y: 5 }, { label: 'U', x: 3, y: 3 },
    ],
  },
];

/** The set of labels the learner must select for a round (excludes the target). */
export function correctSelection(round: SameAxisRound): string[] {
  const target = round.points.find((p) => p.label === round.targetLabel)!;
  return round.points
    .filter((p) => p.label !== round.targetLabel && (round.axis === 'x' ? sameX(p, target) : sameY(p, target)))
    .map((p) => p.label)
    .sort();
}

export const sameAxisSolution = sameAxisRounds.map((r) => r.token).join('');

/* השעשועון המקוון הוסר (31.07.2026) — הדף הוא עכשיו `SAME_AXIS_PRINT`.
   הנתונים למעלה הם מקור האמת של הדף המודפס ושל הבדיקות. */
