import { describe, expect, it } from 'vitest';
import { initialSkillState } from '../src/digital-next/mastery';
import {
  emptySession,
  loadSession,
  recordAttempt,
  recordHint,
  saveSession,
  SESSION_STORAGE_KEY,
  setCurrentActivity,
} from '../src/digital-next/session';

function memoryStorage(seed: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(seed));
  return {
    get length() { return data.size; },
    clear() { data.clear(); },
    getItem(key) { return data.get(key) ?? null; },
    key(index) { return [...data.keys()][index] ?? null; },
    removeItem(key) { data.delete(key); },
    setItem(key, value) { data.set(key, value); },
  };
}

describe('digital-next adaptive session', () => {
  it('starts with versioned empty mastery, hint and current-activity state', () => {
    const session = emptySession();
    expect(session.version).toBe(3);
    expect(session.currentActivityId).toBeNull();
    expect(session.mastery).toEqual(initialSkillState);
    expect(session.hintsUsedByActivity).toEqual({});
  });

  it('migrates completed ids from legacy v1 progress', () => {
    const storage = memoryStorage({
      'coordinate-first-quadrant:digital-next:v1': JSON.stringify({
        completedIds: ['read-a'],
        updatedAt: '2026-09-08T00:00:00.000Z',
      }),
    });
    expect(loadSession(storage).completedIds).toEqual(['read-a']);
  });

  it('migrates v2 attempts and mastery into v3 without inventing hints or current activity', () => {
    const storage = memoryStorage({
      'coordinate-first-quadrant:digital-next:v2': JSON.stringify({
        version: 2,
        completedIds: ['read-a'],
        attemptsByActivity: { 'read-a': 2 },
        mastery: initialSkillState,
        updatedAt: '2026-09-08T00:00:00.000Z',
      }),
    });
    const loaded = loadSession(storage);
    expect(loaded.version).toBe(3);
    expect(loaded.currentActivityId).toBeNull();
    expect(loaded.attemptsByActivity['read-a']).toBe(2);
    expect(loaded.hintsUsedByActivity).toEqual({});
  });

  it('ignores corrupt state safely', () => {
    const storage = memoryStorage({ [SESSION_STORAGE_KEY]: '{broken' });
    expect(loadSession(storage).completedIds).toEqual([]);
  });

  it('counts attempts and hints and persists the current activity', () => {
    const storage = memoryStorage();
    let session = setCurrentActivity(emptySession(), 'read-a');
    session = recordAttempt(recordAttempt(session, 'read-a'), 'read-a');
    session = recordHint(recordHint(session, 'read-a'), 'read-a');
    saveSession(session, storage);
    const loaded = loadSession(storage);
    expect(loaded.currentActivityId).toBe('read-a');
    expect(loaded.attemptsByActivity['read-a']).toBe(2);
    expect(loaded.hintsUsedByActivity['read-a']).toBe(2);
  });
});
