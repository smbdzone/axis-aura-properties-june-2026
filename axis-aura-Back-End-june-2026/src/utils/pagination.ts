import type { Request } from 'express';

/**
 * Opt-in, backward-compatible pagination for list endpoints.
 *
 * - No `?page`/`?limit` in the query  → callers return a plain array (as before),
 *   but bounded by MAX_UNPAGINATED so a query can never be unbounded.
 * - `?page` and/or `?limit` present   → callers return a { data, pagination }
 *   envelope with the page slice.
 *
 * This keeps every existing consumer (which expects an array) working while
 * closing the unbounded-query risk and giving new clients real paging.
 */

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
/** Safety ceiling for the un-paginated array path. */
export const MAX_UNPAGINATED = 500;

export type PaginationParams = {
  /** True when the caller explicitly requested a page. */
  paginated: boolean;
  page: number;
  limit: number;
  skip: number;
};

function toPositiveInt(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPagination(req: Request): PaginationParams {
  const { page: rawPage, limit: rawLimit } = req.query;
  const paginated = rawPage !== undefined || rawLimit !== undefined;

  const page = toPositiveInt(rawPage, 1);
  const limit = Math.min(toPositiveInt(rawLimit, DEFAULT_LIMIT), MAX_LIMIT);

  return { paginated, page, limit, skip: (page - 1) * limit };
}

export function buildPageMeta(total: number, params: PaginationParams) {
  return {
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.max(1, Math.ceil(total / params.limit)),
  };
}
