import { elem } from '../lib/dom';
import { navigate } from '../router';
import { gameById } from '../games';
import type { ViewContext } from './context';

export function gameView(id: string): (ctx: ViewContext) => (() => void) | void {
  return ({ outlet, setTitle }) => {
    const game = gameById(id);
    setTitle(game ? game.title : 'משחק');

    const c = elem('div', { class: 'container' });
    c.append(
      elem('div', { class: 'toolbar-row no-print' },
        linkBtn('◀ לכל המשחקים', () => navigate('#/games')),
        game ? actionBtn('🖨️ הדפסה', () => window.print()) : null,
      ),
    );

    if (!game) {
      c.append(elem('div', { class: 'empty-note', text: 'המשחק לא נמצא.' }));
      outlet.append(c);
      return;
    }

    const host = elem('div', {});
    c.append(host);
    outlet.append(c);
    const cleanup = game.mount(host);
    return cleanup;
  };
}

function actionBtn(text: string, onClick: () => void): HTMLElement {
  const b = elem('button', { class: 'iconbtn', type: 'button', text });
  b.addEventListener('click', onClick);
  return b;
}
function linkBtn(text: string, onClick: () => void): HTMLElement {
  const b = elem('button', { class: 'iconbtn iconbtn--primary', type: 'button', text });
  b.addEventListener('click', onClick);
  return b;
}
