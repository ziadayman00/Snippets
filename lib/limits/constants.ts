/**
 * Usage limits for free and pro tiers
 */

export const FREE_LIMITS = {
  snippets: 50,
  technologies: 3,
  aiQueriesPerMonth: 10,
} as const;

export const PRO_LIMITS = {
  snippets: Infinity,
  technologies: Infinity,
  aiQueriesPerMonth: Infinity,
} as const;

export type LimitType = 'snippets' | 'technologies' | 'aiQueries';

export interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  limitType: LimitType;
}
