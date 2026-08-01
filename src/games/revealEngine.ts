/* ===========================================================================
   revealEngine — the shared ANSWER logic for the „answer questions → reveal a
   hidden result" puzzles (secret word, coordinate safe, encrypted route).

   Pure functions only. The on-screen player was removed on 31.07.2026 when
   every puzzle became a printed page — „המשימות שלנו הן להדפסה" — but the
   checking stays, because it is what proves each printed puzzle is solvable
   and that the right answers assemble exactly the intended word or code.
   =========================================================================== */
import type { RevealPuzzle, RevealStep } from './types';

/** Canonicalise a learner answer for comparison. */
export function normalizeAnswer(kind: RevealStep['kind'], raw: string): string {
  const s = raw.trim();
  if (kind === 'point') {
    // Accept "(5,3)", "5,3", "5 3", "5 , 3" → "5,3"
    const nums = s.match(/-?\d+/g);
    if (!nums || nums.length < 2) return s.replace(/\s+/g, '');
    return `${nums[0]},${nums[1]}`;
  }
  // text / choice: collapse whitespace, drop surrounding punctuation
  return s.replace(/\s+/g, ' ').replace(/[.,;]+$/, '').trim();
}

/** Is a learner answer correct for this step? */
export function isStepCorrect(step: RevealStep, raw: string): boolean {
  const got = normalizeAnswer(step.kind, raw);
  const candidates = [step.answer, ...(step.accept ?? [])].map((a) => normalizeAnswer(step.kind, a));
  return candidates.includes(got);
}

/** The assembled reveal (word / code) for a fully-solved puzzle. */
export function solutionOf(puzzle: RevealPuzzle): string {
  return puzzle.steps.map((s) => s.token).join('');
}
