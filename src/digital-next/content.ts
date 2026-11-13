import type { Activity } from './types';

export const prototypeActivities: readonly Activity[] = [
  {
    id: 'read-a',
    kind: 'read-point',
    prompt: 'קראו את שיעורי הנקודה A.',
    point: { x: 3, y: 7 },
  },
  {
    id: 'place-b',
    kind: 'place-point',
    prompt: 'הזיזו את הנקודה אל B(6,4).',
    target: { x: 6, y: 4 },
  },
  {
    id: 'segment-cd',
    kind: 'segment-length',
    prompt: 'חשבו את אורך הקטע CD באמצעות הפרש שיעורים.',
    start: { x: 2, y: 5 },
    end: { x: 8, y: 5 },
    expectedLength: 6,
  },
  {
    id: 'classify-e',
    kind: 'classify-point',
    prompt: 'סווגו את הנקודה E(0,6).',
    point: { x: 0, y: 6 },
    expectedRegion: 'y-axis',
  },
  {
    id: 'compare-fg',
    kind: 'compare-coordinate',
    prompt: 'השוו בין שיעורי x של F(2,8) ושל G(7,8).',
    first: { x: 2, y: 8 },
    second: { x: 7, y: 8 },
    axis: 'x',
    expected: '<',
  },
  {
    id: 'rectangle-hijk',
    kind: 'rectangle-properties',
    prompt: 'מצאו אורך, רוחב, היקף ושטח של המלבן שקודקודיו הקיצוניים הם H(2,2) ו-J(8,6).',
    bottomLeft: { x: 2, y: 2 },
    topRight: { x: 8, y: 6 },
  },
] as const;
