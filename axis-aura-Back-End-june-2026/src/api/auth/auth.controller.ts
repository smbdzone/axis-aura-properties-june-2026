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

async function verifyPassword(stored: string, input: string): Promise<boolean> {
  if (stored.startsWith('$2b$') || stored.startsWith('$2a$')) {
    return bcrypt.compare(input, stored);
  }
  return stored === input;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function issueToken(user: { _id: unknown; role: string; email: string }) {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, SECRET as string, {
    expiresIn: '8h',
  });
}

function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  });
}

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

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

    res.status(200).json({
      success: true,
      token,
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
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ message });
  }
};

export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, role, status } = req.body;

    if (!fullName || !email || !password || !role) {
      res.status(400).json({ message: 'fullName, email, password, and role are required' });
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
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ message });
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

    res.status(200).json({ user });
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
