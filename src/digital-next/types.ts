export type Point = Readonly<{ x: number; y: number }>;

export type ActivityKind = 'read-point' | 'place-point' | 'segment-length';

export type ValidationCode =
  | 'correct'
  | 'swapped-xy'
  | 'wrong-x'
  | 'wrong-y'
  | 'wrong-point'
  | 'segment-not-axis-aligned'
  | 'wrong-segment-length';

export type ValidationResult = Readonly<{
  ok: boolean;
  code: ValidationCode;
  message: string;
}>;

export type Activity =
  | Readonly<{
      id: string;
      kind: 'read-point';
      prompt: string;
      point: Point;
    }>
  | Readonly<{
      id: string;
      kind: 'place-point';
      prompt: string;
      target: Point;
    }>
  | Readonly<{
      id: string;
      kind: 'segment-length';
      prompt: string;
      start: Point;
      end: Point;
      expectedLength: number;
    }>;

export type PrototypeProgress = Readonly<{
  completedIds: string[];
  updatedAt: string;
}>;
