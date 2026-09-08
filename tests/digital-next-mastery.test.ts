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

  it('tracks axes classification and coordinate comparison independently', () => {
    const axes = updateSkillState(initialSkillState, {
      activityKind: 'classify-point',
      code: 'wrong-point-region',
    });
    expect(axes['axes-origin']).toBe(-1);

    const comparison = updateSkillState(initialSkillState, {
      activityKind: 'compare-coordinate',
      code: 'wrong-coordinate-comparison',
    });
    expect(comparison['coordinate-comparison']).toBe(-1);
  });

  it('separates rectangle dimensions perimeter and area', () => {
    const dimensions = updateSkillState(initialSkillState, {
      activityKind: 'rectangle-properties',
      code: 'wrong-rectangle-width',
    });
    expect(dimensions['rectangle-dimensions']).toBe(-1);
    expect(dimensions['rectangle-perimeter']).toBe(0);
    expect(dimensions['rectangle-area']).toBe(0);

    const perimeter = updateSkillState(initialSkillState, {
      activityKind: 'rectangle-properties',
      code: 'wrong-rectangle-perimeter',
    });
    expect(perimeter['rectangle-perimeter']).toBe(-1);
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
    expect(guidanceForValidation('wrong-point-region')).toContain('שיעור 0');
    expect(guidanceForValidation('wrong-rectangle-area')).toContain('S =');
    expect(guidanceForValidation('correct')).toBeNull();
  });
});
