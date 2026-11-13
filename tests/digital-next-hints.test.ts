import { describe, expect, it } from 'vitest';
import { prototypeActivities } from '../src/digital-next/content';
import { stagedHint } from '../src/digital-next/hints';

function activity(id: string) {
  const found = prototypeActivities.find((item) => item.id === id);
  expect(found).toBeDefined();
  return found!;
}

describe('digital-next staged hints', () => {
  it('shows a concise activity hint after an early mistake', () => {
    const hint = stagedHint(activity('read-a'), 'swapped-xy', 1);
    expect(hint?.level).toBe('hint');
    expect(hint?.text).toContain('קודם x ואז y');
  });

  it('escalates to guided misconception-specific support on the third attempt', () => {
    const hint = stagedHint(activity('read-a'), 'swapped-xy', 3);
    expect(hint?.level).toBe('guided');
    expect(hint?.text).toContain('המספר הראשון');
  });

  it('never shows a hint for a correct answer', () => {
    expect(stagedHint(activity('rectangle-hijk'), 'correct', 5)).toBeNull();
  });
});
