import { topicOfSource, workbookPageOfSource } from '../workbook';
import { SOLUTION_SPECS as SOLUTION_SPECS_1_16 } from './registry';
import { SOLUTION_SPECS_17_29 } from './registry-17-29';
import { SOLUTION_SPECS_30_38 } from './registry-30-38';
import type { ResolvedSolutionPage } from './types';

export type { ExerciseSolution, SolutionPageSpec, ResolvedSolutionPage } from './types';

export const SOLUTION_SPECS = [
  ...SOLUTION_SPECS_1_16,
  ...SOLUTION_SPECS_17_29,
  ...SOLUTION_SPECS_30_38,
];

/**
 * Resolve current page number/title/chapter from the canonical workbook.
 * Nothing in the solution registry owns a page number.
 */
export const SOLUTION_PAGES: ResolvedSolutionPage[] = SOLUTION_SPECS.map((spec) => {
  const page = workbookPageOfSource(spec.source);
  const topic = topicOfSource(spec.source);
  if (!page || !topic) {
    throw new Error(`Solution source is not present in BOOK: ${spec.sourceFile}`);
  }
  return { ...spec, page, topic };
});

export const solutionPageByNumber = (pageNumber: number): ResolvedSolutionPage | undefined =>
  SOLUTION_PAGES.find((entry) => entry.page.n === pageNumber);
