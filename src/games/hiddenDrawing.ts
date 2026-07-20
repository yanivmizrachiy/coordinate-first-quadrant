/* ציור נסתר — follow the plan of ordered pairs, plot each next point, and watch
   the picture appear segment by segment. The finished drawing is not shown in
   advance; it emerges as the learner plots the plan correctly. */
import type { GameDefinition } from './types';
import { renderCoordinateGrid, type GridSegment } from '../lib/coordinateGrid';
import { isFirstQuadrant, type Point } from '../lib/coordinateMath';
import { normalizeAnswer } from './revealEngine';
import { elem, clear } from '../lib/dom';

/** The drawing plan: a closed outline of a little house. */
export const drawingPlan: Point[] = [
  { x: 2, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 4 }, { x: 4, y: 6 }, { x: 2, y: 4 }, { x: 2, y: 1 },
];
export const drawingTitle = 'בית';

export const hiddenDrawingGame: GameDefinition = {
  id: 'hidden-drawing',
  title: 'ציור נסתר',
  icon: '🖼️',
  short: 'מחברים זוגות סדורים לפי התוכנית ומגלים ציור.',
  skill: 'סימון נקודות וחיבור זוגות סדורים',
  mount(root) {
    let solvedTo = 0; // number of points confirmed (>=1 means the first point is placed)
    const wrap = elem('div', { class: 'game' });
    wrap.append(elem('div', { class: 'game__intro' },
      elem('h2', { text: 'ציור נסתר' }),
      elem('p', { text: 'לפניכם תוכנית של זוגות סדורים. סמנו כל נקודה לפי הסדר. הקו ייחבר מנקודה לנקודה, ובסוף יתגלה הציור.' }),
    ));

    const planText = drawingPlan.map((p) => `(${p.x},${p.y})`).join('  →  ');
    wrap.append(elem('div', { class: 'game__row' }, elem('span', { class: 'game__prompt', text: 'התוכנית: ' + planText })));

    const holder = elem('div', { class: 'coordinate-grid grid-lg', style: 'max-width:520px' });
    wrap.append(holder);

    const promptRow = elem('div', { class: 'game__row' });
    wrap.append(promptRow);

    const finalMsg = elem('div', { class: 'reveal reveal--pending no-print', text: 'סמנו את כל הנקודות כדי לגלות את הציור.' });
    wrap.append(finalMsg);

    const draw = (): void => {
      const solvedPts = drawingPlan.slice(0, Math.max(solvedTo, 0));
      const segments: GridSegment[] = [];
      for (let i = 1; i < solvedPts.length; i++) {
        segments.push({ from: [solvedPts[i - 1]!.x, solvedPts[i - 1]!.y], to: [solvedPts[i]!.x, solvedPts[i]!.y], type: 'shape' });
      }
      const points = solvedPts.map((p, i) => ({ x: p.x, y: p.y, label: i === 0 ? 'התחלה' : '' }));
      clear(holder);
      holder.append(renderCoordinateGrid({ points, segments, ariaLabel: 'ציור נסתר מתגלה' }));
    };

    const renderPrompt = (): void => {
      clear(promptRow);
      if (solvedTo >= drawingPlan.length) {
        finalMsg.className = 'reveal';
        finalMsg.textContent = `✓ הציור שהתגלה: ${drawingTitle}`;
        return;
      }
      const target = drawingPlan[solvedTo]!;
      const ordinal = solvedTo === 0 ? 'נקודת ההתחלה' : `הנקודה ה־${solvedTo + 1} בתוכנית`;
      const input = elem('input', { class: 'answer-input', type: 'text', inputmode: 'numeric', placeholder: '(x,y)', 'aria-label': 'הנקודה הבאה' }) as HTMLInputElement;
      const feedback = elem('span', { class: 'game__prompt' });
      const check = elem('button', { class: 'iconbtn iconbtn--primary', type: 'button', text: 'סמנו' });
      const evaluate = (): void => {
        const ok = normalizeAnswer('point', input.value) === `${target.x},${target.y}`;
        if (ok) { solvedTo += 1; draw(); renderPrompt(); }
        else { input.classList.add('is-wrong'); feedback.textContent = '✗ נסו שוב'; }
      };
      check.addEventListener('click', evaluate);
      input.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter') evaluate(); });
      promptRow.append(elem('span', { class: 'game__prompt', text: `סמנו את ${ordinal}:` }), input, check, feedback);
    };

    draw();
    renderPrompt();

    clear(root);
    root.append(wrap);
    return () => clear(root);
  },
};

/** Exposed for tests: the plan stays in the first quadrant and is a closed loop. */
export function planIsClosedFirstQuadrant(): boolean {
  const first = drawingPlan[0]!;
  const last = drawingPlan[drawingPlan.length - 1]!;
  return drawingPlan.every(isFirstQuadrant) && first.x === last.x && first.y === last.y;
}
