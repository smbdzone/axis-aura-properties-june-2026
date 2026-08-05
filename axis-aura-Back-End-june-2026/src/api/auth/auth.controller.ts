import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../models/user.model';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const defaultSuperAdminPermissions = {
  dashboard: { view: true, edit: true },
  properties: { view: true, edit: true },
  newsAndRegulations: { view: true, edit: true },
  developers: { view: true, edit: true },
  careers: { view: true, edit: true },
  jobApplications: { view: true, edit: true },
  comments: { view: true, edit: true },
  faqs: { view: true, edit: true },
  manageUsers: { view: true, edit: true },
};

const BCRYPT_PREFIXES = ['$2a$', '$2b$', '$2y$'];

async function verifyPassword(stored: string, input: string): Promise<boolean> {
  // Only bcrypt hashes are accepted. A legacy plaintext row can never authenticate;
  // such accounts must have their password reset by a Super Admin.
  if (typeof stored !== 'string' || !BCRYPT_PREFIXES.some((prefix) => stored.startsWith(prefix))) {
    return false;
  }
  return bcrypt.compare(input, stored);
}

const MIN_PASSWORD_LENGTH = 8;

/** Rejects non-string credentials (Mongo operator injection) and weak passwords. */
function validateCredentials(email: unknown, password: unknown): string | null {
  if (typeof email !== 'string' || !email.includes('@')) {
    return 'A valid email address is required';
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function issueToken(user: { _id: unknown; role: string; email: string }) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, SECRET as string, {
    expiresIn: '8h',
  });
}

// 'strict' blocks the cookie on every cross-site request, which kills CSRF.
// Override to 'none' (requires HTTPS) only if the dashboard is deployed on a
// different registrable domain than the API.
const COOKIE_SAMESITE = (process.env.COOKIE_SAMESITE as 'strict' | 'lax' | 'none') || 'strict';

function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || COOKIE_SAMESITE === 'none',
    sameSite: COOKIE_SAMESITE,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Reject non-string input so query operators (e.g. {"$ne": null}) can never reach Mongo.
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.status !== 'active') {
      res.status(401).json({ message: 'Invalid credentials or inactive user' });
      return;
    }

    const valid = await verifyPassword(user.password, password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = issueToken(user);
    setAuthCookie(res, token);

    // The token is deliberately NOT in the response body — it lives only in the
    // httpOnly cookie, so XSS in the dashboard cannot read or exfiltrate it.
    res.status(200).json({
      success: true,
      role: user.role,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const bootstrapSuperAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      res.status(403).json({ message: 'Bootstrap disabled. Super Admin already exists.' });
      return;
    }

    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'fullName, email, and password are required' });
      return;
    }

    const credentialError = validateCredentials(email, password);
    if (credentialError) {
      res.status(400).json({ message: credentialError });
      return;
    }

    const hashed = await hashPassword(password);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: 'Super Admin',
      status: 'active',
      permissions: defaultSuperAdminPermissions,
    });

    const token = issueToken(user);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Super Admin created',
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    // Log the detail, return a generic message — driver/validation errors can
    // disclose schema and connection internals.
    console.error('Bootstrap Super Admin Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, role, status } = req.body;

    if (!fullName || !email || !password || !role) {
      res.status(400).json({ message: 'fullName, email, password, and role are required' });
      return;
    }

    const credentialError = validateCredentials(email, password);
    if (credentialError) {
      res.status(400).json({ message: credentialError });
      return;
    }

    const allowedRoles = ['Super Admin', 'Maintenance', 'Marketing'];
    if (!allowedRoles.includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    const hashed = await hashPassword(password);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role,
      status: status === 'inactive' ? 'inactive' : 'active',
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: unknown) {
    console.error('Register Admin Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutAdmin = (_req: Request, res: Response): void => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Logged out' });
};

export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  const token =
    req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };

    const user = await User.findById(decoded.id).select(
      'fullName role email profilePicture phone permissions status',
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // A deactivated account must not keep a usable session until token expiry.
    if (user.status !== 'active') {
      res.clearCookie('token', { path: '/' });
      res.status(401).json({ message: 'Account is inactive' });
      return;
    }

    res.status(200).json({ user });
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
