import type { Point } from './types';

const NS = 'http://www.w3.org/2000/svg';
const MAX = 10;
const PAD = 36;
const SIZE = 360;
const STEP = (SIZE - PAD * 2) / MAX;

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
): GridController {
  host.replaceChildren();
  let current = initial;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    role: 'application',
    tabindex: '0',
    'aria-label': 'מערכת צירים אינטראקטיבית ברביע הראשון',
    class: 'digital-next-grid',
  });

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

  const point = svgEl('circle', {
    r: '10',
    class: 'draggable-point',
    role: 'button',
    tabindex: '0',
    'aria-label': 'נקודה ניתנת להזזה',
  });
  svg.append(point);
  host.append(svg);

  function render() {
    const pos = toScreen(current);
    point.setAttribute('cx', `${pos.x}`);
    point.setAttribute('cy', `${pos.y}`);
    point.setAttribute('aria-label', `הנקודה (${current.x},${current.y})`);
  }

  function update(next: Point) {
    current = next;
    render();
    onChange(current);
  }

  let activePointerId: number | null = null;

  function onPointerDown(event: PointerEvent) {
    activePointerId = event.pointerId;
    svg.setPointerCapture(event.pointerId);
    update(toPoint(event.clientX, event.clientY, svg));
  }

  function onPointerMove(event: PointerEvent) {
    if (activePointerId !== event.pointerId || !svg.hasPointerCapture(event.pointerId)) return;
    update(toPoint(event.clientX, event.clientY, svg));
  }

  function onPointerUp(event: PointerEvent) {
    if (activePointerId !== event.pointerId) return;
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    activePointerId = null;
  }

  function onKeyDown(event: KeyboardEvent) {
    const delta: Record<string, Point> = {
      ArrowRight: { x: 1, y: 0 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowUp: { x: 0, y: 1 },
      ArrowDown: { x: 0, y: -1 },
    };
    const move = delta[event.key];
    if (!move) return;
    event.preventDefault();
    update({
      x: Math.max(0, Math.min(MAX, current.x + move.x)),
      y: Math.max(0, Math.min(MAX, current.y + move.y)),
    });
  }

  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);
  svg.addEventListener('keydown', onKeyDown);
  render();

  return {
    getPoint: () => current,
    setPoint: update,
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
