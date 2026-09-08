import type { Point } from './types';

const NS = 'http://www.w3.org/2000/svg';
const MAX = 10;
const PAD = 36;
const SIZE = 360;
const STEP = (SIZE - PAD * 2) / MAX;

export type GridOptions = Readonly<{
  interactive?: boolean;
  ariaLabel?: string;
}>;

export type GridController = Readonly<{
  getPoint: () => Point;
  setPoint: (point: Point) => void;
  destroy: () => void;
}>;

function svgEl<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string>) {
  const el = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

function toScreen(point: Point) {
  return {
    x: PAD + point.x * STEP,
    y: SIZE - PAD - point.y * STEP,
  };
}

function toPoint(clientX: number, clientY: number, svg: SVGSVGElement): Point {
  const rect = svg.getBoundingClientRect();
  const sx = ((clientX - rect.left) / rect.width) * SIZE;
  const sy = ((clientY - rect.top) / rect.height) * SIZE;
  return {
    x: Math.max(0, Math.min(MAX, Math.round((sx - PAD) / STEP))),
    y: Math.max(0, Math.min(MAX, Math.round((SIZE - PAD - sy) / STEP))),
  };
}

export function mountInteractiveGrid(
  host: HTMLElement,
  initial: Point,
  onChange: (point: Point) => void,
  options: GridOptions = {},
): GridController {
  host.replaceChildren();
  let current = initial;
  const interactive = options.interactive ?? true;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    class: 'digital-next-grid',
    role: 'img',
    'aria-label': options.ariaLabel ?? 'מערכת צירים ברביע הראשון',
  });

  if (interactive) {
    svg.setAttribute('role', 'application');
    svg.setAttribute('tabindex', '0');
  }

  const grid = svgEl('g', { class: 'grid-lines', 'aria-hidden': 'true' });
  for (let i = 0; i <= MAX; i += 1) {
    const p = PAD + i * STEP;
    grid.append(
      svgEl('line', { x1: `${p}`, y1: `${PAD}`, x2: `${p}`, y2: `${SIZE - PAD}` }),
      svgEl('line', { x1: `${PAD}`, y1: `${p}`, x2: `${SIZE - PAD}`, y2: `${p}` }),
    );
  }
  svg.append(grid);

  svg.append(
    svgEl('line', {
      x1: `${PAD}`,
      y1: `${SIZE - PAD}`,
      x2: `${SIZE - PAD + 10}`,
      y2: `${SIZE - PAD}`,
      class: 'axis',
      'aria-hidden': 'true',
    }),
    svgEl('line', {
      x1: `${PAD}`,
      y1: `${SIZE - PAD}`,
      x2: `${PAD}`,
      y2: `${PAD - 10}`,
      class: 'axis',
      'aria-hidden': 'true',
    }),
  );

  for (let i = 0; i <= MAX; i += 1) {
    const x = PAD + i * STEP;
    const y = SIZE - PAD - i * STEP;
    const xLabel = svgEl('text', { x: `${x}`, y: `${SIZE - 14}`, class: 'axis-label', 'text-anchor': 'middle', 'aria-hidden': 'true' });
    xLabel.textContent = String(i);
    const yLabel = svgEl('text', { x: '18', y: `${y + 4}`, class: 'axis-label', 'text-anchor': 'middle', 'aria-hidden': 'true' });
    yLabel.textContent = String(i);
    svg.append(xLabel, yLabel);
  }
  const xName = svgEl('text', { x: `${SIZE - 14}`, y: `${SIZE - PAD - 10}`, class: 'axis-name', 'aria-hidden': 'true' });
  xName.textContent = 'x';
  const yName = svgEl('text', { x: `${PAD + 10}`, y: '18', class: 'axis-name', 'aria-hidden': 'true' });
  yName.textContent = 'y';
  svg.append(xName, yName);

  const point = svgEl('circle', {
    r: '10',
    class: interactive ? 'draggable-point' : 'static-point',
    'aria-hidden': 'true',
    focusable: 'false',
  });
  svg.append(point);
  host.append(svg);

  function render() {
    const pos = toScreen(current);
    point.setAttribute('cx', `${pos.x}`);
    point.setAttribute('cy', `${pos.y}`);
    svg.setAttribute(
      'aria-label',
      interactive
        ? `מערכת צירים אינטראקטיבית. הנקודה כעת (${current.x},${current.y}). הזיזו בעזרת החצים. Home מעביר לראשית ו-End לקצה העליון הימני.`
        : options.ariaLabel ?? `מערכת צירים עם נקודה בשיעורים (${current.x},${current.y}).`,
    );
  }

  function update(next: Point) {
    current = next;
    render();
    if (interactive) onChange(current);
  }

  let activePointerId: number | null = null;

  function onPointerDown(event: PointerEvent) {
    if (!interactive) return;
    activePointerId = event.pointerId;
    svg.setPointerCapture(event.pointerId);
    svg.focus({ preventScroll: true });
    update(toPoint(event.clientX, event.clientY, svg));
  }

  function onPointerMove(event: PointerEvent) {
    if (!interactive || activePointerId !== event.pointerId || !svg.hasPointerCapture(event.pointerId)) return;
    update(toPoint(event.clientX, event.clientY, svg));
  }

  function onPointerUp(event: PointerEvent) {
    if (!interactive || activePointerId !== event.pointerId) return;
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    activePointerId = null;
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!interactive) return;
    const delta: Record<string, Point> = {
      ArrowRight: { x: 1, y: 0 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };

    if (event.key === 'Home') {
      event.preventDefault();
      update({ x: 0, y: 0 });
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      update({ x: MAX, y: MAX });
      return;
    }

    const move = delta[event.key];
    if (!move) return;
    event.preventDefault();
    update({
      x: Math.max(0, Math.min(MAX, current.x + move.x)),
      y: Math.max(0, Math.min(MAX, current.y + move.y)),
    });
  }

  if (interactive) {
    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointermove', onPointerMove);
    svg.addEventListener('pointerup', onPointerUp);
    svg.addEventListener('pointercancel', onPointerUp);
    svg.addEventListener('keydown', onKeyDown);
  }
  render();

  return {
    getPoint: () => current,
    setPoint: (next) => {
      current = next;
      render();
    },
    destroy: () => {
      svg.removeEventListener('pointerdown', onPointerDown);
      svg.removeEventListener('pointermove', onPointerMove);
      svg.removeEventListener('pointerup', onPointerUp);
      svg.removeEventListener('pointercancel', onPointerUp);
      svg.removeEventListener('keydown', onKeyDown);
      host.replaceChildren();
    },
  };
}
