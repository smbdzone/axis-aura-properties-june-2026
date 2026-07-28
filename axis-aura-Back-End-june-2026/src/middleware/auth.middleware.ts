import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { getCachedUser, setCachedUser, type CachedUser } from '../services/userCache';

const SECRET = process.env.JWT_SECRET;

export type PermissionKey =
  | 'dashboard'
  | 'properties'
  | 'newsAndRegulations'
  | 'developers'
  | 'careers'
  | 'jobApplications'
  | 'comments'
  | 'faqs'
  | 'manageUsers';

export type Access = { view: boolean; edit: boolean };

export type AuthUser = {
  id: string;
  role: string;
  email: string;
  permissions?: Partial<Record<PermissionKey, Access>>;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getAllowedOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getTokenFromRequest(req: Request): { token: string | null; fromCookie: boolean } {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return { token: header.slice(7), fromCookie: false };
  }
  if (req.cookies?.token) {
    return { token: req.cookies.token, fromCookie: true };
  }
  return { token: null, fromCookie: false };
}

/**
 * Verifies the JWT, then resolves the user (from a short-TTL cache, falling back
 * to the database) so a deactivated or demoted account loses access almost
 * immediately instead of at token expiry (up to 8h later). API-driven changes
 * invalidate the cache entry, so those take effect on the next request; the TTL
 * only bounds out-of-band database edits.
 *
 * For cookie-authenticated writes the request Origin must be on the allowlist —
 * multipart form posts are CORS-"simple" and would otherwise be CSRF-able.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!SECRET) {
    res.status(500).json({ message: 'JWT_SECRET is not configured' });
    return;
  }

  const { token, fromCookie } = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (fromCookie && !SAFE_METHODS.has(req.method)) {
    const origin = req.headers.origin;
    const allowed = getAllowedOrigins();
    const permitLocalhost = process.env.NODE_ENV !== 'production';
    const originAllowed =
      typeof origin === 'string' &&
      (allowed.includes(origin) || (permitLocalhost && /^http:\/\/localhost:\d+$/.test(origin)));

    if (!originAllowed) {
      res.status(403).json({ message: 'Cross-origin request rejected' });
      return;
    }
  }

  let decoded: AuthUser;
  try {
    decoded = jwt.verify(token, SECRET) as AuthUser;
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }

  try {
    let snapshot = getCachedUser(decoded.id);
    if (!snapshot) {
      const user = await User.findById(decoded.id).select('role status email permissions');
      if (user) {
        snapshot = {
          role: user.role,
          status: user.status,
          email: user.email,
          permissions: user.permissions as CachedUser['permissions'],
        };
        setCachedUser(decoded.id, snapshot);
      }
    }

    if (!snapshot || snapshot.status !== 'active') {
      res.status(401).json({ message: 'Account is inactive or no longer exists' });
      return;
    }

    // Trust the database snapshot, not the token payload, for role and permissions.
    req.authUser = {
      id: decoded.id,
      role: snapshot.role,
      email: snapshot.email,
      permissions: snapshot.permissions,
    };
    next();
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.authUser?.role !== 'Super Admin') {
    res.status(403).json({ message: 'Super Admin access required' });
    return;
  }
  next();
}

/**
 * Enforces the per-user permission matrix that the settings screen edits.
 *
 * Super Admin always passes. Everyone else needs the named permission, and the
 * required level is derived from the HTTP method: reads need `view`, writes need
 * `edit`. Absent or malformed permissions deny — the matrix defaults to all-false
 * for non-Super-Admin roles, so a new account starts with no access.
 */
export function requirePermission(key: PermissionKey) {
  return function permissionGuard(req: Request, res: Response, next: NextFunction): void {
    const user = req.authUser;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (user.role === 'Super Admin') {
      next();
      return;
    }

    const needed: keyof Access = SAFE_METHODS.has(req.method) ? 'view' : 'edit';
    const access = user.permissions?.[key];

    if (!access || access[needed] !== true) {
      res.status(403).json({
        message: `You do not have ${needed} permission for ${key}.`,
      });
      return;
    }

    next();
  };
}
