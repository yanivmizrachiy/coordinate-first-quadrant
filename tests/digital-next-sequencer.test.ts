import { describe, expect, it } from 'vitest';
import { prototypeActivities } from '../src/digital-next/content';
import { initialSkillState } from '../src/digital-next/mastery';
import { explainRecommendation, nextActivity, skillsForActivity } from '../src/digital-next/sequencer';

describe('digital-next adaptive sequencer', () => {
  it('maps activities to explicit skills', () => {
    expect(skillsForActivity(prototypeActivities[0])).toContain('ordered-pair-order');
    expect(skillsForActivity(prototypeActivities[5])).toContain('rectangle-area');
  });

  it('targets the weakest skill among remaining activities', () => {
    const state = { ...initialSkillState, 'rectangle-area': -3 };
    const next = nextActivity(prototypeActivities, state, []);
    expect(next?.id).toBe('rectangle-hijk');
  });

  it('never recommends a completed activity', () => {
    const state = { ...initialSkillState, 'axes-origin': -3 };
    const next = nextActivity(prototypeActivities, state, ['classify-e']);
    expect(next?.id).not.toBe('classify-e');
  });

  it('returns null after every activity is complete', () => {
    const allIds = prototypeActivities.map((activity) => activity.id);
    expect(nextActivity(prototypeActivities, initialSkillState, allIds)).toBeNull();
  });

  it('explains recommendations in pedagogical language', () => {
    const activity = prototypeActivities.find((item) => item.id === 'rectangle-hijk');
    expect(activity).toBeDefined();
    expect(explainRecommendation(activity!, { ...initialSkillState, 'rectangle-area': -2 })).toContain('שטח מלבן');
  });
});
