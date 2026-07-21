import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';
import './styles/workbook.css';
import './styles/grayscale.css';

import { startRouter, navigate, type RouteMatch } from './router';
import { grayscale } from './lib/storage';
import { elem, clear } from './lib/dom';
import type { View, ViewContext } from './views/context';
import { home } from './views/home';
import { workbookToc } from './views/workbookToc';
import { pageViewer } from './views/pageViewer';
import { book } from './views/book';
import { ensureFreshBuild } from './lib/freshBuild';

const app = document.getElementById('app');
if (!app) throw new Error('#app root missing');

/* ---- app bar ----------------------------------------------------------- */
const homeBtn = elem('button', { class: 'iconbtn iconbtn--primary', type: 'button', text: '⌂ בית', 'aria-label': 'מסך הבית' });
homeBtn.addEventListener('click', () => navigate('#/'));

const titleEl = elem('div', { class: 'appbar__title', text: 'מערכת צירים — הרביע הראשון' });

const grayscaleBtn = elem('button', { class: 'iconbtn', type: 'button', 'aria-pressed': 'false', text: 'תצוגת שחור־לבן' });
const applyGrayscale = (on: boolean): void => {
  document.body.classList.toggle('grayscale-mode', on);
  grayscaleBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  grayscaleBtn.textContent = on ? 'חזרה לצבע' : 'תצוגת שחור־לבן';
  grayscale.set(on);
};
grayscaleBtn.addEventListener('click', () => applyGrayscale(!document.body.classList.contains('grayscale-mode')));

const appbar = elem('header', { class: 'appbar no-print' }, homeBtn, titleEl, grayscaleBtn);
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
    case 'workbook': return workbookToc;
    case 'page': return pageViewer(Number(match.params['n'] ?? '1'));
    case 'book': return book;
  }
}

let cleanup: (() => void) | undefined;

function render(match: RouteMatch): void {
  if (cleanup) { cleanup(); cleanup = undefined; }
  clear(outlet);
  homeBtn.style.visibility = match.name === 'home' ? 'hidden' : 'visible';
  const ctx: ViewContext = { outlet, setTitle };
  const result = resolve(match)(ctx);
  cleanup = typeof result === 'function' ? result : undefined;
}

applyGrayscale(grayscale.get());
startRouter(render);

// A device that opened the site earlier can be holding an old index.html;
// this notices that and reloads once so nobody reads a stale booklet.
void ensureFreshBuild();
