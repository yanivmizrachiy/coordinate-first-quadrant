import './styles.css';
import { prototypeActivities } from './content';
import { mountInteractiveGrid } from './grid';
import { guidanceForValidation, updateSkillState } from './mastery';
import { mountSegmentBuilder } from './segment-builder';
import { explainRecommendation, nextActivity } from './sequencer';
import { loadSession, recordAttempt, saveSession, type AdaptiveSession } from './session';
import type { Activity, Point, PointRegion, ValidationResult } from './types';
import {
  validateCoordinateComparison,
  validatePointAnswer,
  validatePointRegion,
  validateRectangleMeasure,
  validateSegmentLength,
} from './validators';

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

let session: AdaptiveSession = loadSession();

const header = document.createElement('header');
header.className = 'prototype-header';
header.innerHTML = `
  <p class="eyebrow">אב־טיפוס מבודד — אינו חלק מהאתר הפעיל</p>
  <h1>מערכת צירים — הרביע הראשון</h1>
  <p>מסלול למידה אדפטיבי: פעילות אחת בכל פעם, לפי המיומנות שזקוקה לחיזוק.</p>
`;

const progressText = document.createElement('p');
progressText.className = 'progress-text';
const recommendation = document.createElement('p');
recommendation.className = 'recommendation-text';
header.append(progressText, recommendation);

const stage = document.createElement('main');
stage.className = 'adaptive-stage';
app.append(header, stage);

function persist() { saveSession(session); }

function updateHeader(activity: Activity | null) {
  progressText.textContent = `הושלמו ${session.completedIds.length} מתוך ${prototypeActivities.length} פעילויות`;
  recommendation.textContent = activity ? explainRecommendation(activity, session.mastery) : 'כל פעילויות האב־טיפוס הושלמו.';
}

function applyAttempt(activity: Activity, result: ValidationResult) {
  session = recordAttempt(session, activity.id);
  session = {
    ...session,
    mastery: updateSkillState(session.mastery, { activityKind: activity.kind, code: result.code }),
  };
  if (result.ok && !session.completedIds.includes(activity.id)) {
    session = { ...session, completedIds: [...session.completedIds, activity.id] };
  }
  persist();
}

function completeAndContinue(activity: Activity, result: ValidationResult, feedback: HTMLElement) {
  showFeedback(feedback, result);
  applyAttempt(activity, result);
  updateHeader(activity);
  if (!result.ok) return;
  const existing = feedback.parentElement?.querySelector<HTMLButtonElement>('.continue-action');
  if (existing) return;
  const continueButton = actionButton('להמשך הפעילות המומלצת', () => renderCurrentActivity());
  continueButton.classList.add('continue-action');
  feedback.after(continueButton);
}

function renderActivity(activity: Activity) {
  const card = document.createElement('section');
  card.className = 'activity-card adaptive-card';
  card.dataset.activityId = activity.id;
  const title = document.createElement('h2');
  title.textContent = activity.prompt;
  const attemptCount = document.createElement('p');
  attemptCount.className = 'attempt-count';
  const currentAttempts = session.attemptsByActivity[activity.id] ?? 0;
  attemptCount.textContent = currentAttempts === 0 ? 'ניסיון ראשון' : `ניסיונות קודמים: ${currentAttempts}`;
  card.append(title, attemptCount);
  const feedback = feedbackBox();

  if (activity.kind === 'read-point') {
    const visual = document.createElement('div');
    visual.className = 'grid-host';
    mountInteractiveGrid(visual, activity.point, () => undefined, {
      interactive: false,
      ariaLabel: `מערכת צירים עם הנקודה A בשיעורים ${pointText(activity.point)}`,
    });
    const fields = document.createElement('div');
    fields.className = 'fields-row';
    const x = inputNumber('שיעור x', 10);
    const y = inputNumber('שיעור y', 10);
    fields.append(x.wrapper, y.wrapper);
    const check = actionButton('בדיקה', () => {
      completeAndContinue(activity, validatePointAnswer(activity.point, { x: Number(x.input.value), y: Number(y.input.value) }), feedback);
    });
    card.append(visual, fields, check, feedback);
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
    const check = actionButton('בדיקה', () => completeAndContinue(activity, validatePointAnswer(activity.target, current), feedback));
    card.append(visual, coords, check, feedback);
  }

  if (activity.kind === 'segment-length') {
    const instruction = document.createElement('p');
    instruction.className = 'segment-data';
    instruction.textContent = `בנו קטע מ־C${pointText(activity.start)} אל D${pointText(activity.end)}, ואז חשבו את אורכו.`;
    const visual = document.createElement('div');
    visual.className = 'grid-host';
    let currentEnd: Point = { x: Math.min(10, activity.start.x + 2), y: activity.start.y };
    const readout = document.createElement('p');
    readout.className = 'coordinate-readout';
    readout.textContent = `נקודת הקצה כעת ${pointText(currentEnd)}`;
    mountSegmentBuilder(visual, activity.start, currentEnd, (point) => {
      currentEnd = point;
      readout.textContent = `נקודת הקצה כעת ${pointText(point)}`;
    });
    const field = inputNumber('אורך הקטע');
    const check = actionButton('בדיקת הקטע', () => {
      if (currentEnd.x !== activity.end.x || currentEnd.y !== activity.end.y) {
        completeAndContinue(activity, {
          ok: false,
          code: 'wrong-segment-length',
          message: `בנו קודם את הקטע עד D${pointText(activity.end)}. נקודת הקצה עדיין אינה במקומה.`,
        }, feedback);
        return;
      }
      completeAndContinue(activity, validateSegmentLength(activity.start, currentEnd, Number(field.input.value)), feedback);
    });
    card.append(instruction, visual, readout, field.wrapper, check, feedback);
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
    const check = actionButton('בדיקה', () => completeAndContinue(activity, validatePointRegion(activity.point, field.select.value as PointRegion), feedback));
    card.append(data, field.wrapper, check, feedback);
  }

  if (activity.kind === 'compare-coordinate') {
    const data = document.createElement('p');
    data.className = 'segment-data';
    data.textContent = `F${pointText(activity.first)}  ·  G${pointText(activity.second)}`;
    const field = selectField<'<' | '=' | '>'>('סימן ההשוואה', [
      { value: '<', label: '<' }, { value: '=', label: '=' }, { value: '>', label: '>' },
    ]);
    const check = actionButton('בדיקה', () => completeAndContinue(
      activity,
      validateCoordinateComparison(activity.first, activity.second, activity.axis, field.select.value as '<' | '=' | '>'),
      feedback,
    ));
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
      const result = checks.find((item) => !item.ok) ?? { ok: true, code: 'correct' as const, message: 'נכון. כל ארבעת הגדלים חושבו מהשיעורים.' };
      completeAndContinue(activity, result, feedback);
    });
    card.append(data, fields, check, feedback);
  }

  return card;
}

function renderCurrentActivity() {
  const activity = nextActivity(prototypeActivities, session.mastery, session.completedIds);
  updateHeader(activity);
  stage.replaceChildren();
  if (!activity) {
    const done = document.createElement('section');
    done.className = 'activity-card completion-card';
    done.innerHTML = '<h2>המסלול הושלם</h2><p>כל שש פעילויות האב־טיפוס הושלמו. נתוני המיומנויות נשמרו במכשיר בלבד.</p>';
    stage.append(done);
    return;
  }
  stage.append(renderActivity(activity));
}

renderCurrentActivity();
