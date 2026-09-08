import { describe, expect, it } from 'vitest';
import {
  guidanceForValidation,
  initialSkillState,
  updateSkillState,
  weakestSkill,
} from '../src/digital-next/mastery';

describe('digital-next adaptive mastery', () => {
  it('penalizes swapped coordinates strongly', () => {
    const next = updateSkillState(initialSkillState, {
      activityKind: 'read-point',
      code: 'swapped-xy',
    });
    expect(next['ordered-pair-order']).toBe(-2);
    expect(weakestSkill(next)).toBe('ordered-pair-order');
  });

  it('strengthens the relevant skills after a correct read', () => {
    const next = updateSkillState(initialSkillState, {
      activityKind: 'read-point',
      code: 'correct',
    });
    expect(next['ordered-pair-order']).toBe(1);
    expect(next['x-reading']).toBe(1);
    expect(next['y-reading']).toBe(1);
  });

  it('keeps skill scores bounded', () => {
    let state = initialSkillState;
    for (let i = 0; i < 10; i += 1) {
      state = updateSkillState(state, { activityKind: 'segment-length', code: 'correct' });
    }
    expect(state['axis-segment-length']).toBe(3);
  });

  it('provides targeted remediation text for common errors', () => {
    expect(guidanceForValidation('wrong-x')).toContain('אופקי');
    expect(guidanceForValidation('wrong-y')).toContain('אנכי');
    expect(guidanceForValidation('correct')).toBeNull();
  });
});
