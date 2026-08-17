import { topicOfSource, workbookPageOfSource } from '../workbook';
import { SOLUTION_SPECS } from './registry';
import type { ResolvedSolutionPage } from './types';

export type { ExerciseSolution, SolutionPageSpec, ResolvedSolutionPage } from './types';
export { SOLUTION_SPECS } from './registry';

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
