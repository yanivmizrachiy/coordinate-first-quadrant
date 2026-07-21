/* Fill the sheet, don't leave it half empty.

   A worksheet whose questions happen to be short used to end at 55% of the A4
   page with a band of white below it — the learner gets less room to write and
   the page looks unfinished. The leftover height is measured after the page has
   rendered and handed back to the spaces BETWEEN the blocks, so the sheet
   breathes evenly instead of being padded at the bottom.

   It adds padding rather than switching the container to flex: some sheets lay
   their cards out side by side with inline-block, and a flex COLUMN stacks
   those into one column — the page then doubles in height and is cut off.
   Padding leaves every existing layout exactly as it was.

   Bounded on purpose: never below BASE (a full page stays readable) and never
   above MAX (two blocks on an empty page must not end up at opposite edges of
   the paper). Space left after the cap simply stays as margin — a page may be
   airy, it may not look broken. */

const BASE = 0;
const MAX = 30;
/** How much taller a single drawing may get, at most. */
const GRID_GROWTH = 120;

/** Are these children stacked one under the other, rather than side by side? */
function stacked(box: Element): boolean {
  const kids = [...box.children];
  for (let i = 1; i < kids.length; i++) {
    const prev = kids[i - 1]!.getBoundingClientRect();
    const here = kids[i]!.getBoundingClientRect();
    if (here.height && prev.height && here.top < prev.bottom - 1) return false;
  }
  return true;
}

/** Space out one sheet's blocks so it uses the height it actually has. */
export function fitSheet(sheet: HTMLElement): void {
  const content = sheet.querySelector<HTMLElement>('.sheet-content');
  const footer = sheet.querySelector<HTMLElement>('.gz-footer');
  // A game sheet grows with its board; there is no leftover to hand back.
  if (!content || !footer || sheet.classList.contains('game-sheet')) return;

  // Descend past wrappers that hold everything in one box, but never into a
  // row whose children sit next to each other.
  let box: HTMLElement = content;
  while (box.childElementCount === 1 && box.firstElementChild instanceof HTMLElement) {
    box = box.firstElementChild;
  }
  if (box.childElementCount < 2 || !stacked(box)) return;

  const kids = [...box.children] as HTMLElement[];
  for (const k of kids) k.style.paddingTop = '';

  const room = (): number => {
    let lowest = 0;
    for (const el of content.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.height && r.bottom > lowest) lowest = r.bottom;
    }
    return footer.getBoundingClientRect().top - lowest;
  };

  /* Spare height goes to the drawings first — a bigger system is worth more to
     a learner than a wider margin. Grown a step at a time and re-measured,
     because two systems sharing a row grow the page once, not twice. */
  const grids = [...content.querySelectorAll<HTMLElement>('.coordinate-grid')];
  const grown = new Map<HTMLElement, number>();
  for (let pass = 0; pass < 5 && grids.length; pass++) {
    if (room() < 110) break;
    let changed = false;
    for (const g of grids) {
      const added = grown.get(g) ?? 0;
      if (added >= GRID_GROWTH) continue;
      const step = Math.min(26, GRID_GROWTH - added);
      g.style.height = `${Math.round(g.getBoundingClientRect().height + step)}px`;
      grown.set(g, added + step);
      changed = true;
    }
    if (!changed) break;
  }
  // one step too far is possible on the last pass — give it back
  while (grids.length && room() < 0) {
    for (const g of grids) g.style.height = `${Math.round(g.getBoundingClientRect().height - 14)}px`;
  }

  const leftover = room();
  if (leftover <= 8) return;

  const extra = Math.min(MAX, BASE + leftover / (kids.length - 1));
  for (let i = 1; i < kids.length; i++) kids[i]!.style.paddingTop = `${Math.round(extra)}px`;
}

/** Measure only once the sheets are in the document and laid out — off-document
    elements report a height of zero, and every page would keep its own spacing. */
export function fitSheets(root: ParentNode = document): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.querySelectorAll<HTMLElement>('.sheet').forEach(fitSheet);
    });
  });
}
