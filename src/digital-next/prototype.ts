import './styles.css';
import { prototypeActivities } from './content';
import { mountInteractiveGrid } from './grid';
import { guidanceForValidation } from './mastery';
import type { Point, PointRegion, PrototypeProgress, ValidationResult } from './types';
import {
  validateCoordinateComparison,
  validatePointAnswer,
  validatePointRegion,
  validateRectangleMeasure,
  validateSegmentLength,
} from './validators';

const STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v1';

function loadProgress(): PrototypeProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedIds: [], updatedAt: new Date(0).toISOString() };
    const parsed = JSON.parse(raw) as PrototypeProgress;
    if (!Array.isArray(parsed.completedIds)) throw new Error('invalid progress');
    return parsed;
  } catch {
    return { completedIds: [], updatedAt: new Date(0).toISOString() };
  }
}

function saveProgress(completedIds: string[]) {
  const progress: PrototypeProgress = {
    completedIds: [...new Set(completedIds)],
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function pointText(point: Point) {
  return `(${point.x},${point.y})`;
}

function inputNumber(label: string, max = 100) {
  const wrapper = document.createElement('label');
  wrapper.className = 'number-field';
  const span = document.createElement('span');
  span.textContent = label;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = String(max);
  input.inputMode = 'numeric';
  wrapper.append(span, input);
  return { wrapper, input };
}

function selectField<T extends string>(label: string, options: readonly { value: T; label: string }[]) {
  const wrapper = document.createElement('label');
  wrapper.className = 'number-field';
  const span = document.createElement('span');
  span.textContent = label;
  const select = document.createElement('select');
  for (const option of options) {
    const element = document.createElement('option');
    element.value = option.value;
    element.textContent = option.label;
    select.append(element);
  }
  wrapper.append(span, select);
  return { wrapper, select };
}

function feedbackBox() {
  const box = document.createElement('div');
  box.className = 'feedback';
  box.setAttribute('role', 'status');
  box.setAttribute('aria-live', 'polite');
  return box;
}

function showFeedback(box: HTMLElement, result: ValidationResult) {
  const guidance = guidanceForValidation(result.code);
  box.textContent = guidance ? `${result.message} ${guidance}` : result.message;
  box.dataset.state = result.ok ? 'ok' : 'error';
}

function actionButton(text: string, onClick: () => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'primary-action';
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

const app = document.querySelector<HTMLElement>('#digital-next-app');
if (!app) throw new Error('Missing #digital-next-app');

const progress = loadProgress();
let completed = [...progress.completedIds];

const header = document.createElement('header');
header.className = 'prototype-header';
header.innerHTML = `
  <p class="eyebrow">אב־טיפוס מבודד — אינו חלק מהאתר הפעיל</p>
  <h1>מערכת צירים — הרביע הראשון</h1>
  <p>שש פעילויות לבדיקת אינטראקציה, משוב אדפטיבי, מגע ומקלדת.</p>
`;

const progressText = document.createElement('p');
progressText.className = 'progress-text';
header.append(progressText);

const list = document.createElement('main');
list.className = 'activity-list';

function refreshProgress() {
  progressText.textContent = `הושלמו ${completed.length} מתוך ${prototypeActivities.length} פעילויות`;
  saveProgress(completed);
}

function markComplete(id: string) {
  if (!completed.includes(id)) completed.push(id);
  refreshProgress();
}

for (const activity of prototypeActivities) {
  const card = document.createElement('section');
  card.className = 'activity-card';
  card.dataset.activityId = activity.id;

  const title = document.createElement('h2');
  title.textContent = activity.prompt;
  card.append(title);

  const feedback = feedbackBox();

  if (activity.kind === 'read-point') {
    const visual = document.createElement('div');
    visual.className = 'grid-host read-only-grid';
    const grid = mountInteractiveGrid(visual, activity.point, () => undefined);
    const fields = document.createElement('div');
    fields.className = 'fields-row';
    const x = inputNumber('שיעור x', 10);
    const y = inputNumber('שיעור y', 10);
    fields.append(x.wrapper, y.wrapper);
    const check = actionButton('בדיקה', () => {
      const result = validatePointAnswer(activity.point, { x: Number(x.input.value), y: Number(y.input.value) });
      showFeedback(feedback, result);
      if (result.ok) markComplete(activity.id);
    });
    card.append(visual, fields, check, feedback);
    grid.setPoint(activity.point);
  }

  if (activity.kind === 'place-point') {
    const visual = document.createElement('div');
    visual.className = 'grid-host';
    let current: Point = { x: 1, y: 1 };
    const coords = document.createElement('p');
    coords.className = 'coordinate-readout';
    coords.textContent = `הנקודה כעת ${pointText(current)}`;
    mountInteractiveGrid(visual, current, (point) => {
      current = point;
      coords.textContent = `הנקודה כעת ${pointText(point)}`;
    });
    const check = actionButton('בדיקה', () => {
      const result = validatePointAnswer(activity.target, current);
      showFeedback(feedback, result);
      if (result.ok) markComplete(activity.id);
    });
    card.append(visual, coords, check, feedback);
  }

  if (activity.kind === 'segment-length') {
    const instruction = document.createElement('p');
    instruction.className = 'segment-data';
    instruction.textContent = `C${pointText(activity.start)}  ·  D${pointText(activity.end)}`;
    const field = inputNumber('אורך הקטע');
    const check = actionButton('בדיקה', () => {
      const result = validateSegmentLength(activity.start, activity.end, Number(field.input.value));
      showFeedback(feedback, result);
      if (result.ok) markComplete(activity.id);
    });
    card.append(instruction, field.wrapper, check, feedback);
  }

  if (activity.kind === 'classify-point') {
    const data = document.createElement('p');
    data.className = 'segment-data';
    data.textContent = `E${pointText(activity.point)}`;
    const field = selectField<PointRegion>('מיקום הנקודה', [
      { value: 'first-quadrant', label: 'בתוך הרביע הראשון' },
      { value: 'x-axis', label: 'על ציר x' },
      { value: 'y-axis', label: 'על ציר y' },
      { value: 'origin', label: 'בראשית הצירים' },
    ]);
    const check = actionButton('בדיקה', () => {
      const result = validatePointRegion(activity.point, field.select.value as PointRegion);
      showFeedback(feedback, result);
      if (result.ok) markComplete(activity.id);
    });
    card.append(data, field.wrapper, check, feedback);
  }

  if (activity.kind === 'compare-coordinate') {
    const data = document.createElement('p');
    data.className = 'segment-data';
    data.textContent = `F${pointText(activity.first)}  ·  G${pointText(activity.second)}`;
    const field = selectField<'<' | '=' | '>'>('סימן ההשוואה', [
      { value: '<', label: '<' },
      { value: '=', label: '=' },
      { value: '>', label: '>' },
    ]);
    const check = actionButton('בדיקה', () => {
      const result = validateCoordinateComparison(activity.first, activity.second, activity.axis, field.select.value as '<' | '=' | '>');
      showFeedback(feedback, result);
      if (result.ok) markComplete(activity.id);
    });
    card.append(data, field.wrapper, check, feedback);
  }

  if (activity.kind === 'rectangle-properties') {
    const data = document.createElement('p');
    data.className = 'segment-data';
    data.textContent = `H${pointText(activity.bottomLeft)}  ·  J${pointText(activity.topRight)}`;
    const fields = document.createElement('div');
    fields.className = 'rectangle-fields';
    const length = inputNumber('אורך');
    const width = inputNumber('רוחב');
    const perimeter = inputNumber('היקף P');
    const area = inputNumber('שטח S');
    fields.append(length.wrapper, width.wrapper, perimeter.wrapper, area.wrapper);
    const check = actionButton('בדיקת המלבן', () => {
      const checks = [
        validateRectangleMeasure(activity.bottomLeft, activity.topRight, 'length', Number(length.input.value)),
        validateRectangleMeasure(activity.bottomLeft, activity.topRight, 'width', Number(width.input.value)),
        validateRectangleMeasure(activity.bottomLeft, activity.topRight, 'perimeter', Number(perimeter.input.value)),
        validateRectangleMeasure(activity.bottomLeft, activity.topRight, 'area', Number(area.input.value)),
      ];
      const firstError = checks.find((result) => !result.ok);
      if (firstError) showFeedback(feedback, firstError);
      else {
        showFeedback(feedback, { ok: true, code: 'correct', message: 'נכון. כל ארבעת הגדלים חושבו מהשיעורים.' });
        markComplete(activity.id);
      }
    });
    card.append(data, fields, check, feedback);
  }

  list.append(card);
}

app.append(header, list);
refreshProgress();
