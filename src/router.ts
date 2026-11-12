/* Hash-based router — works on any static host (GitHub Pages included) with no
   server rewrites. Routes:
     #/                  canonical A4 paper reader, opens on cover
     #/menu              backward-compatible alias for the same reader
     #/solutions         print-only solutions booklet
     #/workbook/:n       single page viewer
     #/book              same canonical reader, modes: scroll/single/spread
     #/print             continuous full booklet — the way the booklet PRINTS
   There is no chapter-list page: Yaniv asked for one contents page only, the
   A4 sheet generated from TOPICS. Bare #/workbook and
   the legacy #/games both land on the canonical paper reader.
*/
export interface RouteMatch {
  name: 'home' | 'menu' | 'solutions' | 'page' | 'book' | 'print' | 'aids';
  params: Record<string, string>;
}

export function parseHash(hash: string): RouteMatch {
  const path = hash.replace(/^#/, '');
  const parts = path.split('/').filter(Boolean);
  const [head, sub] = parts;
  if (head === 'menu') return { name: 'menu', params: {} };
  if (head === 'solutions') return { name: 'solutions', params: {} };
  if (head === 'workbook') return sub ? { name: 'page', params: { n: sub } } : { name: 'book', params: {} };
  if (head === 'book') return { name: 'book', params: {} };
  if (head === 'print-aids') return { name: 'aids', params: {} };
  if (head === 'print') return { name: 'print', params: {} };
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
