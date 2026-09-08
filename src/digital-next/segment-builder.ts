import type { Point } from './types';

const NS = 'http://www.w3.org/2000/svg';
const MAX = 10;
const PAD = 36;
const SIZE = 360;
const STEP = (SIZE - PAD * 2) / MAX;

export type SegmentBuilderController = Readonly<{
  getEnd: () => Point;
  setEnd: (point: Point) => void;
  destroy: () => void;
}>;

function svgEl<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string>) {
  const el = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

function toScreen(point: Point) {
  return { x: PAD + point.x * STEP, y: SIZE - PAD - point.y * STEP };
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

export function mountSegmentBuilder(
  host: HTMLElement,
  start: Point,
  initialEnd: Point,
  onChange: (end: Point) => void,
): SegmentBuilderController {
  host.replaceChildren();
  let end = initialEnd;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    class: 'digital-next-grid segment-builder',
    role: 'application',
    tabindex: '0',
    'aria-label': 'בונה קטע אינטראקטיבי ברביע הראשון',
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

  const segment = svgEl('line', { class: 'built-segment', 'aria-hidden': 'true' });
  const startMarker = svgEl('circle', { r: '9', class: 'fixed-point', 'aria-hidden': 'true' });
  const endMarker = svgEl('circle', { r: '11', class: 'draggable-point', 'aria-hidden': 'true', focusable: 'false' });
  svg.append(segment, startMarker, endMarker);
  host.append(svg);

  function render() {
    const a = toScreen(start);
    const b = toScreen(end);
    segment.setAttribute('x1', `${a.x}`);
    segment.setAttribute('y1', `${a.y}`);
    segment.setAttribute('x2', `${b.x}`);
    segment.setAttribute('y2', `${b.y}`);
    startMarker.setAttribute('cx', `${a.x}`);
    startMarker.setAttribute('cy', `${a.y}`);
    endMarker.setAttribute('cx', `${b.x}`);
    endMarker.setAttribute('cy', `${b.y}`);
    svg.setAttribute('aria-label', `בונה קטע. נקודת ההתחלה (${start.x},${start.y}), נקודת הקצה כעת (${end.x},${end.y}). הזיזו את הקצה בעזרת החצים.`);
  }

  function update(next: Point) {
    end = next;
    render();
    onChange(end);
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
    update({
      x: Math.max(0, Math.min(MAX, end.x + move.x)),
      y: Math.max(0, Math.min(MAX, end.y + move.y)),
    });
  }

  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);
  svg.addEventListener('keydown', onKeyDown);
  render();

  return {
    getEnd: () => end,
    setEnd: (next) => { end = next; render(); },
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
