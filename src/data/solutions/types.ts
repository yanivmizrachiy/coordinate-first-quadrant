import type { WorkbookPageContent, WorkbookTopic } from '../workbook/types';

export interface ExerciseSolution {
  /** Stable within its source page; never use a page number here. */
  id: string;
  /** The label the learner sees, e.g. "א" or "פתיח". */
  label: string;
  /** Verified answer. May include acceptance criteria for an open task. */
  answer: string;
  /** Optional short reasoning where the method matters. */
  method?: string;
}

export interface SolutionPageSpec {
  /** The actual authored page object. Its current number is resolved from BOOK. */
  source: WorkbookPageContent;
  /** Source file used by the freshness guard in tests. */
  sourceFile: string;
  /** Git blob SHA of sourceFile when these solutions were verified. */
  sourceBlobSha: string;
  exercises: ExerciseSolution[];
}

export interface ResolvedSolutionPage extends SolutionPageSpec {
  page: WorkbookPageContent;
  topic: WorkbookTopic;
}
