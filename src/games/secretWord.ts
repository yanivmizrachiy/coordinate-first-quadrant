/* מילת הסוד — read each marked point's ordered pair. Every correct reading
   reveals one Hebrew letter; together they spell a word (read right-to-left). */
import type { RevealPuzzle } from './types';
import { createRevealGame } from './revealEngine';

export const secretWordPuzzle: RevealPuzzle = {
  id: 'secret-word',
  title: 'מילת הסוד',
  question: 'איזו מילה מסתתרת בנקודות?',
  icon: '🔤',
  short: 'קוראים נקודות ומגלים מילה עברית נסתרת.',
  skill: 'קריאת זוג סדור (x, y)',
  intro: 'קראו את שיעורי כל נקודה מסומנת בצורה (x, y). כל תשובה נכונה חושפת אות. יחד האותיות יוצרות מילה.',
  revealLabel: 'מילת הסוד',
  steps: [
    { prompt: 'מהם שיעורי הנקודה A?', kind: 'point', answer: '3,2', token: 'נ',
      grid: { points: [{ x: 3, y: 2, label: 'A' }], ariaLabel: 'הנקודה A' } },
    { prompt: 'מהם שיעורי הנקודה B?', kind: 'point', answer: '6,4', token: 'ק',
      grid: { points: [{ x: 6, y: 4, label: 'B' }], ariaLabel: 'הנקודה B' } },
    { prompt: 'מהם שיעורי הנקודה C?', kind: 'point', answer: '2,5', token: 'ו',
      grid: { points: [{ x: 2, y: 5, label: 'C' }], ariaLabel: 'הנקודה C' } },
    { prompt: 'מהם שיעורי הנקודה D?', kind: 'point', answer: '7,1', token: 'ד',
      grid: { points: [{ x: 7, y: 1, label: 'D' }], ariaLabel: 'הנקודה D' } },
    { prompt: 'מהם שיעורי הנקודה E?', kind: 'point', answer: '4,3', token: 'ה',
      grid: { points: [{ x: 4, y: 3, label: 'E' }], ariaLabel: 'הנקודה E' } },
  ],
};

export const secretWordGame = createRevealGame(secretWordPuzzle);
