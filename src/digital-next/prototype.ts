import './styles.css';
import { prototypeActivities } from './content';
import { mountInteractiveGrid } from './grid';
import type { Point, PrototypeProgress } from './types';
import { validatePointAnswer, validateSegmentLength } from './validators';

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

function inputNumber(label: string) {
  const wrapper = document.createElement('label');
  wrapper.className = 'number-field';
  const span = document.createElement('span');
  span.textContent = label;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = '10';
  input.inputMode = 'numeric';
  wrapper.append(span, input);
  return { wrapper, input };
}

function feedbackBox() {
  const box = document.createElement('div');
  box.className = 'feedback';
  box.setAttribute('role', 'status');
  box.setAttribute('aria-live', 'polite');
  return box;
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
  <p>שלוש פעילויות ראשונות לבדיקת אינטראקציה, משוב ומגע.</p>
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
    visual.className = 'grid-host';
    const grid = mountInteractiveGrid(visual, activity.point, () => undefined);
    visual.classList.add('read-only-grid');

    const fields = document.createElement('div');
    fields.className = 'fields-row';
    const x = inputNumber('שיעור x');
    const y = inputNumber('שיעור y');
    fields.append(x.wrapper, y.wrapper);

    const check = actionButton('בדיקה', () => {
      const actual = { x: Number(x.input.value), y: Number(y.input.value) };
      const result = validatePointAnswer(activity.point, actual);
      feedback.textContent = result.message;
      feedback.dataset.state = result.ok ? 'ok' : 'error';
      if (result.ok) markComplete(activity.id);
    });

    card.append(visual, fields, check, feedback);
    grid.setPoint(activity.point);
  }

  if (activity.kind === 'place-point') {
    const visual = document.createElement('div');
    visual.className = 'grid-host';
    let current: Point = { x: 1, y: 1 };
    mountInteractiveGrid(visual, current, (point) => {
      current = point;
      coords.textContent = `הנקודה כעת ${pointText(point)}`;
    });

    const coords = document.createElement('p');
    coords.className = 'coordinate-readout';
    coords.textContent = `הנקודה כעת ${pointText(current)}`;

    const check = actionButton('בדיקה', () => {
      const result = validatePointAnswer(activity.target, current);
      feedback.textContent = result.message;
      feedback.dataset.state = result.ok ? 'ok' : 'error';
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
      const result = validateSegmentLength(
        activity.start,
        activity.end,
        Number(field.input.value),
      );
      feedback.textContent = result.message;
      feedback.dataset.state = result.ok ? 'ok' : 'error';
      if (result.ok) markComplete(activity.id);
    });

    card.append(instruction, field.wrapper, check, feedback);
  }

  list.append(card);
}

app.append(header, list);
refreshProgress();
