import type { Point } from './types';

const NS = 'http://www.w3.org/2000/svg';
const MAX = 10;
const PAD = 36;
const SIZE = 360;
const STEP = (SIZE - PAD * 2) / MAX;

export type RectangleBuilderController = Readonly<{
  getTopRight: () => Point;
  setTopRight: (point: Point) => void;
  destroy: () => void;
}>;

function svgEl<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string>) {
  const el = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

function clampPoint(point: Point): Point {
  return {
    x: Math.max(0, Math.min(MAX, Math.round(point.x))),
    y: Math.max(0, Math.min(MAX, Math.round(point.y))),
  };
}

function toScreen(point: Point) {
  return { x: PAD + point.x * STEP, y: SIZE - PAD - point.y * STEP };
}

function toPoint(clientX: number, clientY: number, svg: SVGSVGElement): Point {
  const rect = svg.getBoundingClientRect();
  const sx = ((clientX - rect.left) / rect.width) * SIZE;
  const sy = ((clientY - rect.top) / rect.height) * SIZE;
  return clampPoint({
    x: (sx - PAD) / STEP,
    y: (SIZE - PAD - sy) / STEP,
  });
}

export function mountRectangleBuilder(
  host: HTMLElement,
  bottomLeft: Point,
  initialTopRight: Point,
  onChange: (topRight: Point) => void,
): RectangleBuilderController {
  host.replaceChildren();
  let topRight = clampPoint(initialTopRight);

  const svg = svgEl('svg', {
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    class: 'digital-next-grid rectangle-builder',
    role: 'application',
    tabindex: '0',
    'aria-label': 'בונה מלבן אינטראקטיבי ברביע הראשון',
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
    svgEl('line', { x1: `${PAD}`, y1: `${SIZE - PAD}`, x2: `${SIZE - PAD + 10}`, y2: `${SIZE - PAD}`, class: 'axis', 'aria-hidden': 'true' }),
    svgEl('line', { x1: `${PAD}`, y1: `${SIZE - PAD}`, x2: `${PAD}`, y2: `${PAD - 10}`, class: 'axis', 'aria-hidden': 'true' }),
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

  const shape = svgEl('rect', { class: 'built-rectangle', 'aria-hidden': 'true' });
  const fixedCorner = svgEl('circle', { r: '9', class: 'fixed-point', 'aria-hidden': 'true' });
  const dragCorner = svgEl('circle', { r: '11', class: 'draggable-point', 'aria-hidden': 'true', focusable: 'false' });
  svg.append(shape, fixedCorner, dragCorner);
  host.append(svg);

  function normalizedTopRight(point: Point): Point {
    return {
      x: Math.max(bottomLeft.x + 1, point.x),
      y: Math.max(bottomLeft.y + 1, point.y),
    };
  }

  function render() {
    const a = toScreen(bottomLeft);
    const b = toScreen(topRight);
    shape.setAttribute('x', `${a.x}`);
    shape.setAttribute('y', `${b.y}`);
    shape.setAttribute('width', `${b.x - a.x}`);
    shape.setAttribute('height', `${a.y - b.y}`);
    fixedCorner.setAttribute('cx', `${a.x}`);
    fixedCorner.setAttribute('cy', `${a.y}`);
    dragCorner.setAttribute('cx', `${b.x}`);
    dragCorner.setAttribute('cy', `${b.y}`);
    svg.setAttribute(
      'aria-label',
      `בונה מלבן. הפינה השמאלית התחתונה (${bottomLeft.x},${bottomLeft.y}), הפינה הימנית העליונה כעת (${topRight.x},${topRight.y}). הזיזו את הפינה בעזרת החצים.`,
    );
  }

  function update(next: Point) {
    topRight = normalizedTopRight(clampPoint(next));
    render();
    onChange(topRight);
  }

  let activePointerId: number | null = null;
  function onPointerDown(event: PointerEvent) {
    activePointerId = event.pointerId;
    svg.setPointerCapture(event.pointerId);
    svg.focus({ preventScroll: true });
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
    const moves: Record<string, Point> = {
      ArrowRight: { x: 1, y: 0 }, ArrowLeft: { x: -1, y: 0 },
      ArrowUp: { x: 0, y: 1 }, ArrowDown: { x: 0, y: -1 },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    update({ x: topRight.x + move.x, y: topRight.y + move.y });
  }

  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);
  svg.addEventListener('keydown', onKeyDown);
  render();

  return {
    getTopRight: () => topRight,
    setTopRight: (next) => update(next),
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
