import { initialSkillState, type SkillState } from './mastery';
import type { PrototypeProgress } from './types';

export const SESSION_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v4';
const V3_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v3';
const V2_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v2';
const LEGACY_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v1';

export type AdaptiveSession = Readonly<{
  version: 4;
  variantSeed: number;
  currentActivityId: string | null;
  completedIds: string[];
  attemptsByActivity: Record<string, number>;
  hintsUsedByActivity: Record<string, number>;
  mastery: SkillState;
  updatedAt: string;
}>;

export function createVariantSeed(): number {
  try {
    const values = new Uint32Array(1);
    globalThis.crypto?.getRandomValues(values);
    if (values[0] !== undefined) return values[0] >>> 0;
  } catch { /* deterministic fallback below */ }
  return Math.abs(Date.now()) >>> 0;
}

export function emptySession(variantSeed = createVariantSeed()): AdaptiveSession {
  return {
    version: 4,
    variantSeed: variantSeed >>> 0,
    currentActivityId: null,
    completedIds: [],
    attemptsByActivity: {},
    hintsUsedByActivity: {},
    mastery: { ...initialSkillState },
    updatedAt: new Date(0).toISOString(),
  };
}

function isSkillState(value: unknown): value is SkillState {
  if (!value || typeof value !== 'object') return false;
  return Object.keys(initialSkillState).every((key) => typeof (value as Record<string, unknown>)[key] === 'number');
}
function isCounterMap(value: unknown): value is Record<string, number> {
  if (!value || typeof value !== 'object') return false;
  return Object.values(value as Record<string, unknown>).every((entry) => typeof entry === 'number' && Number.isFinite(entry) && entry >= 0);
}
function validCommon(parsed: { completedIds?: unknown; attemptsByActivity?: unknown; mastery?: unknown }) {
  return Array.isArray(parsed.completedIds) && isCounterMap(parsed.attemptsByActivity) && isSkillState(parsed.mastery);
}

function normalizeV4(parsed: Partial<AdaptiveSession>): AdaptiveSession | null {
  if (parsed.version !== 4 || !Number.isInteger(parsed.variantSeed) || !validCommon(parsed) || !isCounterMap(parsed.hintsUsedByActivity) || !(typeof parsed.currentActivityId === 'string' || parsed.currentActivityId === null || parsed.currentActivityId === undefined)) return null;
  return {
    version: 4,
    variantSeed: (parsed.variantSeed as number) >>> 0,
    currentActivityId: parsed.currentActivityId ?? null,
    completedIds: [...new Set(parsed.completedIds as string[])],
    attemptsByActivity: { ...(parsed.attemptsByActivity as Record<string, number>) },
    hintsUsedByActivity: { ...(parsed.hintsUsedByActivity as Record<string, number>) },
    mastery: { ...(parsed.mastery as SkillState) },
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
  };
}

export function loadSession(storage: Storage = localStorage): AdaptiveSession {
  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (raw) { const normalized = normalizeV4(JSON.parse(raw) as Partial<AdaptiveSession>); if (normalized) return normalized; }
  } catch { /* migrate */ }

  try {
    const raw = storage.getItem(V3_STORAGE_KEY);
    if (raw) {
      const v3 = JSON.parse(raw) as any;
      if (v3.version === 3 && validCommon(v3) && isCounterMap(v3.hintsUsedByActivity)) {
        return { ...v3, version: 4, variantSeed: 0, currentActivityId: v3.currentActivityId ?? null } as AdaptiveSession;
      }
    }
  } catch { /* migrate */ }

  try {
    const raw = storage.getItem(V2_STORAGE_KEY);
    if (raw) {
      const v2 = JSON.parse(raw) as any;
      if (v2.version === 2 && validCommon(v2)) return {
        version: 4, variantSeed: 0, currentActivityId: null,
        completedIds: [...new Set(v2.completedIds)], attemptsByActivity: { ...v2.attemptsByActivity }, hintsUsedByActivity: {}, mastery: { ...v2.mastery },
        updatedAt: typeof v2.updatedAt === 'string' ? v2.updatedAt : new Date(0).toISOString(),
      };
    }
  } catch { /* migrate */ }

  try {
    const raw = storage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const legacy = JSON.parse(raw) as PrototypeProgress;
      if (Array.isArray(legacy.completedIds)) return { ...emptySession(0), completedIds: [...new Set(legacy.completedIds)], updatedAt: typeof legacy.updatedAt === 'string' ? legacy.updatedAt : new Date(0).toISOString() };
    }
  } catch { /* ignore */ }
  return emptySession();
}

export function saveSession(session: AdaptiveSession, storage: Storage = localStorage) {
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ ...session, variantSeed: session.variantSeed >>> 0, completedIds: [...new Set(session.completedIds)], attemptsByActivity: { ...session.attemptsByActivity }, hintsUsedByActivity: { ...session.hintsUsedByActivity }, mastery: { ...session.mastery }, updatedAt: new Date().toISOString() }));
}
export function recordAttempt(session: AdaptiveSession, activityId: string): AdaptiveSession { return { ...session, attemptsByActivity: { ...session.attemptsByActivity, [activityId]: (session.attemptsByActivity[activityId] ?? 0) + 1 } }; }
export function recordHint(session: AdaptiveSession, activityId: string): AdaptiveSession { return { ...session, hintsUsedByActivity: { ...session.hintsUsedByActivity, [activityId]: (session.hintsUsedByActivity[activityId] ?? 0) + 1 } }; }
export function setCurrentActivity(session: AdaptiveSession, activityId: string | null): AdaptiveSession { return { ...session, currentActivityId: activityId }; }
