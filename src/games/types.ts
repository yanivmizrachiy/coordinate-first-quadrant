/* Puzzle data contracts. The games themselves are gone — every page is printed
   („המשימות שלנו הן להדפסה", 31.07.2026) — but the puzzle DATA lives on here and
   feeds the printed sheets, so these shapes and their tests stay. */
import type { GridSpec } from '../lib/coordinateGrid';

/** Answer kinds shared by data-driven games. */
export type AnswerKind = 'text' | 'point' | 'choice';

export interface RevealStep {
  prompt: string;
  grid?: GridSpec;
  kind: AnswerKind;
  /** Canonical correct answer (already normalised, see normalizeAnswer). */
  answer: string;
  /** Extra accepted spellings. */
  accept?: string[];
  /** For kind === 'choice'. */
  choices?: string[];
  /** The letter/character contributed to the reveal when solved correctly. */
  token: string;
}

export interface RevealPuzzle {
  id: string;
  title: string;
  /** The heading INSIDE the sheet. The sheet header already carries `title`,
      so this asks what the learner is about to find out. */
  question: string;
  icon: string;
  short: string;
  skill: string;
  intro: string;
  /** Label of the assembled answer, e.g. "מילת הסוד" or "קוד הכספת". */
  revealLabel: string;
  steps: RevealStep[];
}
