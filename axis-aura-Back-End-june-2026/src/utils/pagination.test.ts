import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { buildPageMeta, getPagination, MAX_LIMIT, DEFAULT_LIMIT } from './pagination';

const req = (query: Record<string, unknown>) => ({ query }) as unknown as Request;

describe('getPagination', () => {
  it('is not paginated when no page/limit params are given', () => {
    const p = getPagination(req({}));
    expect(p.paginated).toBe(false);
  });

  it('is paginated when page is present', () => {
    expect(getPagination(req({ page: '2' })).paginated).toBe(true);
  });

  it('is paginated when only limit is present', () => {
    expect(getPagination(req({ limit: '10' })).paginated).toBe(true);
  });

  it('computes skip from page and limit', () => {
    const p = getPagination(req({ page: '3', limit: '10' }));
    expect(p).toMatchObject({ page: 3, limit: 10, skip: 20 });
  });

  it('caps limit at MAX_LIMIT', () => {
    expect(getPagination(req({ page: '1', limit: '99999' })).limit).toBe(MAX_LIMIT);
  });

  it('falls back to defaults for garbage input', () => {
    const p = getPagination(req({ page: 'abc', limit: '-5' }));
    expect(p.page).toBe(1);
    expect(p.limit).toBe(DEFAULT_LIMIT);
    expect(p.skip).toBe(0);
  });

  it('rejects zero and negative pages', () => {
    expect(getPagination(req({ page: '0' })).page).toBe(1);
    expect(getPagination(req({ page: '-3' })).page).toBe(1);
  });
});

describe('buildPageMeta', () => {
  it('computes totalPages via ceiling', () => {
    const meta = buildPageMeta(45, { paginated: true, page: 1, limit: 20, skip: 0 });
    expect(meta).toEqual({ total: 45, page: 1, limit: 20, totalPages: 3 });
  });

  it('never reports fewer than one page', () => {
    expect(buildPageMeta(0, { paginated: true, page: 1, limit: 20, skip: 0 }).totalPages).toBe(1);
  });
});
