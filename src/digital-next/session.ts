import { initialSkillState, type SkillState } from './mastery';
import type { PrototypeProgress } from './types';

export const SESSION_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v3';
const V2_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v2';
const LEGACY_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v1';

export type AdaptiveSession = Readonly<{
  version: 3;
  completedIds: string[];
  attemptsByActivity: Record<string, number>;
  hintsUsedByActivity: Record<string, number>;
  mastery: SkillState;
  updatedAt: string;
}>;

export function emptySession(): AdaptiveSession {
  return {
    version: 3,
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
  return Object.values(value as Record<string, unknown>).every(
    (entry) => typeof entry === 'number' && Number.isFinite(entry) && entry >= 0,
  );
}

function normalizeSession(parsed: Partial<AdaptiveSession>): AdaptiveSession | null {
  if (
    parsed.version !== 3 ||
    !Array.isArray(parsed.completedIds) ||
    !isCounterMap(parsed.attemptsByActivity) ||
    !isCounterMap(parsed.hintsUsedByActivity) ||
    !isSkillState(parsed.mastery)
  ) return null;

  return {
    version: 3,
    completedIds: [...new Set(parsed.completedIds)],
    attemptsByActivity: { ...parsed.attemptsByActivity },
    hintsUsedByActivity: { ...parsed.hintsUsedByActivity },
    mastery: { ...parsed.mastery },
    updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
  };
}

export function loadSession(storage: Storage = localStorage): AdaptiveSession {
  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const normalized = normalizeSession(JSON.parse(raw) as Partial<AdaptiveSession>);
      if (normalized) return normalized;
    }
  } catch {
    // fall through to migrations
  }

  try {
    const rawV2 = storage.getItem(V2_STORAGE_KEY);
    if (rawV2) {
      const v2 = JSON.parse(rawV2) as {
        version?: number;
        completedIds?: string[];
        attemptsByActivity?: Record<string, number>;
        mastery?: SkillState;
        updatedAt?: string;
      };
      if (
        v2.version === 2 &&
        Array.isArray(v2.completedIds) &&
        isCounterMap(v2.attemptsByActivity) &&
        isSkillState(v2.mastery)
      ) {
        return {
          version: 3,
          completedIds: [...new Set(v2.completedIds)],
          attemptsByActivity: { ...v2.attemptsByActivity },
          hintsUsedByActivity: {},
          mastery: { ...v2.mastery },
          updatedAt: typeof v2.updatedAt === 'string' ? v2.updatedAt : new Date(0).toISOString(),
        };
      }
    }
  } catch {
    // fall through to legacy migration
  }

  try {
    const rawLegacy = storage.getItem(LEGACY_STORAGE_KEY);
    if (rawLegacy) {
      const legacy = JSON.parse(rawLegacy) as PrototypeProgress;
      if (Array.isArray(legacy.completedIds)) {
        return {
          ...emptySession(),
          completedIds: [...new Set(legacy.completedIds)],
          updatedAt: typeof legacy.updatedAt === 'string' ? legacy.updatedAt : new Date(0).toISOString(),
        };
      }
    }
  } catch {
    // invalid legacy state is ignored
  }

  return emptySession();
}

export function saveSession(session: AdaptiveSession, storage: Storage = localStorage) {
  const normalized: AdaptiveSession = {
    ...session,
    completedIds: [...new Set(session.completedIds)],
    attemptsByActivity: { ...session.attemptsByActivity },
    hintsUsedByActivity: { ...session.hintsUsedByActivity },
    mastery: { ...session.mastery },
    updatedAt: new Date().toISOString(),
  };
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalized));
}

export function recordAttempt(session: AdaptiveSession, activityId: string): AdaptiveSession {
  return {
    ...session,
    attemptsByActivity: {
      ...session.attemptsByActivity,
      [activityId]: (session.attemptsByActivity[activityId] ?? 0) + 1,
    },
  };
}

export function recordHint(session: AdaptiveSession, activityId: string): AdaptiveSession {
  return {
    ...session,
    hintsUsedByActivity: {
      ...session.hintsUsedByActivity,
      [activityId]: (session.hintsUsedByActivity[activityId] ?? 0) + 1,
    },
  };
}
