import { describe, expect, it } from 'vitest';
import { initialSkillState } from '../src/digital-next/mastery';
import {
  emptySession,
  loadSession,
  recordAttempt,
  saveSession,
  SESSION_STORAGE_KEY,
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
  it('starts with versioned empty mastery state', () => {
    const session = emptySession();
    expect(session.version).toBe(2);
    expect(session.mastery).toEqual(initialSkillState);
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

  it('ignores corrupt state safely', () => {
    const storage = memoryStorage({ [SESSION_STORAGE_KEY]: '{broken' });
    expect(loadSession(storage).completedIds).toEqual([]);
  });

  it('counts attempts per activity and persists a normalized snapshot', () => {
    const storage = memoryStorage();
    const session = recordAttempt(recordAttempt(emptySession(), 'read-a'), 'read-a');
    saveSession(session, storage);
    const loaded = loadSession(storage);
    expect(loaded.attemptsByActivity['read-a']).toBe(2);
  });
});
