import { initialSkillState, type SkillState } from './mastery';
import type { PrototypeProgress } from './types';

export const SESSION_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v2';
const LEGACY_STORAGE_KEY = 'coordinate-first-quadrant:digital-next:v1';

export type AdaptiveSession = Readonly<{
  version: 2;
  completedIds: string[];
  attemptsByActivity: Record<string, number>;
  mastery: SkillState;
  updatedAt: string;
}>;

export function emptySession(): AdaptiveSession {
  return {
    version: 2,
    completedIds: [],
    attemptsByActivity: {},
    mastery: { ...initialSkillState },
    updatedAt: new Date(0).toISOString(),
  };
}

function isSkillState(value: unknown): value is SkillState {
  if (!value || typeof value !== 'object') return false;
  return Object.keys(initialSkillState).every((key) => typeof (value as Record<string, unknown>)[key] === 'number');
}

export function loadSession(storage: Storage = localStorage): AdaptiveSession {
  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AdaptiveSession>;
      if (
        parsed.version === 2 &&
        Array.isArray(parsed.completedIds) &&
        parsed.attemptsByActivity &&
        typeof parsed.attemptsByActivity === 'object' &&
        isSkillState(parsed.mastery)
      ) {
        return {
          version: 2,
          completedIds: [...new Set(parsed.completedIds)],
          attemptsByActivity: { ...parsed.attemptsByActivity },
          mastery: { ...parsed.mastery },
          updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date(0).toISOString(),
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
