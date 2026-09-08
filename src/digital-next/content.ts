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
    prompt: 'בנו את הקטע CD וחישבו את אורכו באמצעות הפרש שיעורים.',
    start: { x: 2, y: 5 },
    end: { x: 8, y: 5 },
    expectedLength: 6,
  },
] as const;
