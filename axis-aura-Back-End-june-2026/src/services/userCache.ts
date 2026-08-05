import type { AuthUser } from '../middleware/auth.middleware';

/**
 * Short-TTL cache of the per-request user snapshot used by `authenticate`.
 *
 * Without it, every authenticated request does a `User.findById`. That query
 * exists so a deactivated or demoted account loses access immediately rather
 * than at token expiry — a property worth keeping. The cache preserves it for
 * the common case by having every user mutation through the API explicitly
 * invalidate the entry (see user.controller). The TTL then only bounds the
 * window for *out-of-band* database edits (someone changing a row directly).
 *
 * Tunable via AUTH_CACHE_TTL_MS (default 30000). Set it to 0 to disable the
 * cache entirely and always hit the database.
 */

export type CachedUser = {
  role: string;
  status: string;
  email: string;
  permissions?: AuthUser['permissions'];
};

type Entry = { value: CachedUser; expiresAt: number };

const MAX_ENTRIES = 5_000;
const cache = new Map<string, Entry>();

// Read lazily and memoize: process.env may not be populated at module-import
// time (dotenv / container env ordering), but it always is by the first request.
let ttlMs: number | undefined;
function getTtlMs(): number {
  if (ttlMs === undefined) {
    const raw = Number.parseInt(process.env.AUTH_CACHE_TTL_MS ?? '', 10);
    ttlMs = Number.isFinite(raw) && raw >= 0 ? raw : 30_000;
  }
  return ttlMs;
}

export function isAuthCacheEnabled(): boolean {
  return getTtlMs() > 0;
}

export function getCachedUser(id: string): CachedUser | undefined {
  if (!isAuthCacheEnabled()) return undefined;

  const entry = cache.get(id);
  if (!entry) return undefined;

  if (entry.expiresAt <= Date.now()) {
    cache.delete(id);
    return undefined;
  }
  return entry.value;
}

export function setCachedUser(id: string, value: CachedUser): void {
  if (!isAuthCacheEnabled()) return;

  // Bound memory with simple FIFO eviction of the oldest entry.
  if (cache.size >= MAX_ENTRIES && !cache.has(id)) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }

  cache.set(id, { value, expiresAt: Date.now() + getTtlMs() });
}

/** Drop one user — call after any change to their role/status/permissions. */
export function invalidateCachedUser(id: string): void {
  cache.delete(id);
}

/** Drop everything — call after a bulk change (e.g. role-wide permission edit). */
export function invalidateAllCachedUsers(): void {
  cache.clear();
}

/** Test helper: reset both the store and the memoized TTL. */
export function __resetUserCacheForTests(): void {
  cache.clear();
  ttlMs = undefined;
}
