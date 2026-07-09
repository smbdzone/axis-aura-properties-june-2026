import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export type AuthUser = {
  id: string;
  role: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

function getTokenFromRequest(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice(7);
  }
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  return null;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  if (!SECRET) {
    res.status(500).json({ message: 'JWT_SECRET is not configured' });
    return;
  }

  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as AuthUser;
    req.authUser = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.authUser?.role !== 'Super Admin') {
    res.status(403).json({ message: 'Super Admin access required' });
    return;
  }
  next();
}
