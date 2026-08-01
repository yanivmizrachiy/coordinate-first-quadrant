/* הנקודה החשודה — several clues; exactly one candidate point satisfies all of
   them. Find it in each round to reveal a letter. Clues carry predicates so the
   test suite can prove each round has a unique solution. */
export interface Candidate { label: string; x: number; y: number; }
export interface Clue { text: string; test: (p: Candidate) => boolean; }
export interface SuspectRound { candidates: Candidate[]; clues: Clue[]; token: string; }

export const suspectRounds: SuspectRound[] = [
  {
    token: 'א',
    candidates: [ { label: 'A', x: 2, y: 3 }, { label: 'B', x: 5, y: 3 }, { label: 'C', x: 5, y: 1 }, { label: 'D', x: 2, y: 1 } ],
    clues: [
      { text: 'שיעור x שווה ל־5', test: (p) => p.x === 5 },
      { text: 'שיעור y גדול מ־2', test: (p) => p.y > 2 },
    ],
  },
  {
    token: 'מ',
    candidates: [ { label: 'P', x: 1, y: 4 }, { label: 'Q', x: 4, y: 4 }, { label: 'R', x: 4, y: 2 }, { label: 'S', x: 6, y: 5 } ],
    clues: [
      { text: 'הנקודה ממוקמת על אותו קו אנכי כמו (4,0) — כלומר שיעור x שווה 4', test: (p) => p.x === 4 },
      { text: 'שיעור y קטן מ־3', test: (p) => p.y < 3 },
    ],
  },
  {
    token: 'ת',
    candidates: [ { label: 'K', x: 3, y: 5 }, { label: 'L', x: 7, y: 2 }, { label: 'M', x: 3, y: 2 }, { label: 'N', x: 7, y: 5 } ],
    clues: [
      { text: 'שיעור x שווה ל־7', test: (p) => p.x === 7 },
      { text: 'שיעור y שווה ל־2', test: (p) => p.y === 2 },
    ],
  },
];

/** The candidates satisfying every clue (must be exactly one per round). */
export function suspectsOf(round: SuspectRound): Candidate[] {
  return round.candidates.filter((c) => round.clues.every((clue) => clue.test(c)));
}

export const suspectSolution = suspectRounds.map((r) => r.token).join('');

/* השעשועון המקוון הוסר (31.07.2026) — הדף הוא עכשיו `SUSPECT_POINT_PRINT`.
   הנתונים למעלה הם מקור האמת של הדף המודפס ושל הבדיקות. */
