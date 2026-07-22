/* Hash-based router — works on any static host (GitHub Pages included) with no
   server rewrites. Routes:
     #/                  home
     #/workbook/:n       single page viewer
     #/book              continuous full booklet, contents page included
   There is no chapter-list page: Yaniv asked for one contents page only, the
   coloured one that prints as the booklet's second sheet. Bare #/workbook and
   the legacy #/games both land on the booklet, where that page lives.
*/
export interface RouteMatch {
  name: 'home' | 'page' | 'book';
  params: Record<string, string>;
}

export function parseHash(hash: string): RouteMatch {
  const path = hash.replace(/^#/, '');
  const parts = path.split('/').filter(Boolean);
  const [head, sub] = parts;
  if (head === 'workbook') return sub ? { name: 'page', params: { n: sub } } : { name: 'book', params: {} };
  if (head === 'book') return { name: 'book', params: {} };
  if (head === 'games') return { name: 'book', params: {} };
  return { name: 'home', params: {} };
}

export const navigate = (to: string): void => {
  if (location.hash === to) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = to;
};

export function startRouter(onChange: (match: RouteMatch) => void): void {
  const handler = (): void => onChange(parseHash(location.hash));
  window.addEventListener('hashchange', handler);
  handler();
}
