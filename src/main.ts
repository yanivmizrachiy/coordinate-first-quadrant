import './styles/tokens.css';
import './styles/base.css';
import './styles/app.css';
import './styles/flipbook.css';
import './styles/unified-shell.css';
import './styles/workbook.css';
import './styles/print-aids.css';
import './styles/grayscale.css';
import './styles/solutions.css';

import { startRouter, navigate, type RouteMatch } from './router';
import { elem, clear } from './lib/dom';
import type { View, ViewContext } from './views/context';
import { solutions } from './views/solutions';
import { pageViewer } from './views/pageViewer';
import { book } from './views/book';
import { printAids } from './views/printAids';
import { unifiedBookSite } from './views/unifiedBookSite';
import { ensureFreshBuild } from './lib/freshBuild';

const app = document.getElementById('app');
if (!app) throw new Error('#app root missing');

/* Internal routes keep one compact way back to the canonical book. */
const homeBtn = elem('button', {
  class: 'iconbtn iconbtn--primary',
  type: 'button',
  text: '⌂ לחוברת',
  'aria-label': 'חזרה לחוברת הדיגיטלית',
});
homeBtn.addEventListener('click', () => navigate('#/'));

const titleEl = elem('div', { class: 'appbar__title', text: 'מערכת צירים — הרביע הראשון' });
const appbar = elem('header', { class: 'appbar no-print' }, homeBtn, titleEl);
const outlet = elem('main', { class: 'app-main', id: 'main', tabindex: '-1' });
const skip = elem('a', { class: 'skip-link', href: '#main', text: 'דלגו לתוכן' });
app.append(skip, appbar, outlet);

const setTitle = (t: string): void => {
  titleEl.textContent = t;
  document.title = `${t} | מערכת צירים`;
};

/* The digital book is now the site itself. Legacy public hashes remain valid
   so bookmarks and links already sent to teachers continue to work. */
function resolve(match: RouteMatch): View {
  switch (match.name) {
    case 'home':
    case 'menu':
    case 'book':
      return unifiedBookSite;
    case 'solutions': return solutions;
    case 'page': return pageViewer(Number(match.params['n'] ?? '1'));
    case 'print': return book;
    case 'aids': return printAids;
  }
}

let cleanup: (() => void) | undefined;
const CROSSFADE = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150;

function render(match: RouteMatch): void {
  if (cleanup) { cleanup(); cleanup = undefined; }
  clear(outlet);

  const isCanonicalBook = match.name === 'home' || match.name === 'menu' || match.name === 'book';
  appbar.classList.toggle('appbar--hidden', isCanonicalBook);

  const ctx: ViewContext = { outlet, setTitle };
  const result = resolve(match)(ctx);
  cleanup = typeof result === 'function' ? result : undefined;

  if (CROSSFADE) {
    outlet.classList.remove('app-main--in');
    requestAnimationFrame(() => outlet.classList.add('app-main--in'));
  }
}

startRouter(render);

// Devices can hold an old index.html. Reload once when a fresher build exists.
void ensureFreshBuild();
