import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';
import './styles/opening-mobile.css';
import './styles/workbook.css';
import './styles/grayscale.css';

import { startRouter, navigate, type RouteMatch } from './router';
import { grayscale } from './lib/storage';
import { elem, clear } from './lib/dom';
import type { View, ViewContext } from './views/context';
import { home } from './views/home';
import { menu } from './views/menu';
import { pageViewer } from './views/pageViewer';
import { book } from './views/book';
import { ensureFreshBuild } from './lib/freshBuild';

const app = document.getElementById('app');
if (!app) throw new Error('#app root missing');

/* ---- app bar ----------------------------------------------------------- */
const homeBtn = elem('button', { class: 'iconbtn iconbtn--primary', type: 'button', text: '⌂ בית', 'aria-label': 'מסך הבית' });
homeBtn.addEventListener('click', () => navigate('#/'));

const titleEl = elem('div', { class: 'appbar__title', text: 'מערכת צירים — הרביע הראשון' });


const appbar = elem('header', { class: 'appbar no-print' }, homeBtn, titleEl);
const outlet = elem('main', { class: 'app-main', id: 'main', tabindex: '-1' });
const skip = elem('a', { class: 'skip-link', href: '#main', text: 'דלגו לתוכן' });

app.append(skip, appbar, outlet);

/* ---- routing ----------------------------------------------------------- */
const setTitle = (t: string): void => {
  titleEl.textContent = t;
  document.title = `${t} | מערכת צירים`;
};

function resolve(match: RouteMatch): View {
  switch (match.name) {
    case 'home': return home;
    case 'menu': return menu;
    case 'page': return pageViewer(Number(match.params['n'] ?? '1'));
    case 'book': return book;
  }
}

let cleanup: (() => void) | undefined;

/* A view swap is instant — the whole booklet is already in memory — so the only
   thing to soften is the swap itself. The outgoing screen is not waited for:
   the new one is built at once and fades up over a single frame, which reads as
   quick rather than as an animation to sit through. */
const CROSSFADE = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150;

function render(match: RouteMatch): void {
  if (cleanup) { cleanup(); cleanup = undefined; }
  clear(outlet);
  homeBtn.style.visibility = match.name === 'home' ? 'hidden' : 'visible';
  /* The opening is the whole screen — the bar would sit on the film. */
  appbar.classList.toggle('appbar--hidden', match.name === 'home');
  const ctx: ViewContext = { outlet, setTitle };
  const result = resolve(match)(ctx);
  cleanup = typeof result === 'function' ? result : undefined;

  if (CROSSFADE) {
    outlet.classList.remove('app-main--in');
    requestAnimationFrame(() => outlet.classList.add('app-main--in'));
  }
}

// Black and white is a property of the SHEETS, not of the application, and the
// switch for it lives in the print bar. Restore the last choice on load.
document.body.classList.toggle('bw-print', grayscale.get());
startRouter(render);

// A device that opened the site earlier can be holding an old index.html;
// this notices that and reloads once so nobody reads a stale booklet.
void ensureFreshBuild();
