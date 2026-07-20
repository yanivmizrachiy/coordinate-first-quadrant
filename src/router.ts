/* Hash-based router — works on any static host (GitHub Pages included) with no
   server rewrites. Routes:
     #/                  home
     #/workbook          table of contents
     #/workbook/:n       single page viewer
     #/book              continuous full booklet
     #/games             games hub
     #/games/:id         a single game
*/
export interface RouteMatch {
  name: 'home' | 'workbook' | 'page' | 'book' | 'games' | 'game';
  params: Record<string, string>;
}

export function parseHash(hash: string): RouteMatch {
  const path = hash.replace(/^#/, '');
  const parts = path.split('/').filter(Boolean);
  const [head, sub] = parts;
  if (head === 'workbook') return sub ? { name: 'page', params: { n: sub } } : { name: 'workbook', params: {} };
  if (head === 'book') return { name: 'book', params: {} };
  if (head === 'games') return sub ? { name: 'game', params: { id: sub } } : { name: 'games', params: {} };
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
