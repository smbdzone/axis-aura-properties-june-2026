import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCachedUser,
  setCachedUser,
  invalidateCachedUser,
  invalidateAllCachedUsers,
  isAuthCacheEnabled,
  __resetUserCacheForTests,
  type CachedUser,
} from './userCache';

const sample: CachedUser = { role: 'Marketing', status: 'active', email: 'm@b.c' };

describe('userCache (enabled, default TTL)', () => {
  beforeEach(() => {
    delete process.env.AUTH_CACHE_TTL_MS; // fall back to the 30s default
    __resetUserCacheForTests();
  });

  it('returns undefined on a miss', () => {
    expect(getCachedUser('x')).toBeUndefined();
  });

  it('stores and returns a snapshot', () => {
    setCachedUser('u1', sample);
    expect(getCachedUser('u1')).toEqual(sample);
  });

  it('invalidates a single user', () => {
    setCachedUser('u1', sample);
    invalidateCachedUser('u1');
    expect(getCachedUser('u1')).toBeUndefined();
  });

  it('invalidates everything', () => {
    setCachedUser('u1', sample);
    setCachedUser('u2', sample);
    invalidateAllCachedUsers();
    expect(getCachedUser('u1')).toBeUndefined();
    expect(getCachedUser('u2')).toBeUndefined();
  });

  it('expires an entry after the TTL', () => {
    vi.useFakeTimers();
    try {
      setCachedUser('u1', sample);
      expect(getCachedUser('u1')).toEqual(sample);
      vi.advanceTimersByTime(30_000 + 1);
      expect(getCachedUser('u1')).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('userCache (disabled via AUTH_CACHE_TTL_MS=0)', () => {
  beforeEach(() => {
    process.env.AUTH_CACHE_TTL_MS = '0';
    __resetUserCacheForTests();
  });
  afterEach(() => {
    delete process.env.AUTH_CACHE_TTL_MS;
    __resetUserCacheForTests();
  });

  it('reports disabled', () => {
    expect(isAuthCacheEnabled()).toBe(false);
  });

  it('never stores or returns anything', () => {
    setCachedUser('u1', sample);
    expect(getCachedUser('u1')).toBeUndefined();
  });
});
