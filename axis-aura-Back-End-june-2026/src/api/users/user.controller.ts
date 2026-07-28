import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/user.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';
import { invalidateAllCachedUsers, invalidateCachedUser } from '../../services/userCache';

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

// Never send password hashes to the client.
const PUBLIC_USER_FIELDS = '-password';
const BCRYPT_ROUNDS = 10;

const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, BCRYPT_ROUNDS);
type Role = 'Super Admin' | 'Maintenance' | 'Marketing';
type PermissionKey =
  | 'dashboard'
  | 'properties'
  | 'newsAndRegulations'
  | 'developers'
  | 'careers'
  | 'jobApplications'
  | 'comments'
  | 'faqs'
  | 'manageUsers';

type AccessType = { view: boolean; edit: boolean };
type PermissionMap = Record<PermissionKey, AccessType>;

const PERMISSION_KEYS: PermissionKey[] = [
  'dashboard',
  'properties',
  'newsAndRegulations',
  'developers',
  'careers',
  'jobApplications',
  'comments',
  'faqs',
  'manageUsers',
];

const getDefaultPermissionsByRole = (role: Role): PermissionMap => {
  if (role === 'Super Admin') {
    return PERMISSION_KEYS.reduce((acc, key) => {
      acc[key] = { view: true, edit: true };
      return acc;
    }, {} as PermissionMap);
  }

  return PERMISSION_KEYS.reduce((acc, key) => {
    acc[key] = { view: false, edit: false };
    return acc;
  }, {} as PermissionMap);
};

const normalizePermissions = (input: any, role: Role): PermissionMap => {
  const base = getDefaultPermissionsByRole(role);
  if (!input || typeof input !== 'object') return base;

  const normalized = { ...base };
  for (const key of PERMISSION_KEYS) {
    const access = input[key];
    if (access && typeof access === 'object') {
      normalized[key] = {
        view: !!access.view,
        edit: !!access.edit,
      };
    }
  }

  if (role === 'Super Admin') {
    return getDefaultPermissionsByRole(role);
  }

  return normalized;
};

const uploadProfilePictureToCloudinary = async (file: Express.Multer.File): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'suits-and-sand/users', resource_type: 'image' },
      (error, result) => {
        if (error || !result?.secure_url) {
          return reject(error || new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

// =============================
// GET ALL USERS
// =============================
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagination = getPagination(req);
    const query = User.find().select(PUBLIC_USER_FIELDS).sort({ createdAt: -1 });

    if (!pagination.paginated) {
      res.json(await query.limit(MAX_UNPAGINATED));
      return;
    }

    const [users, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      User.countDocuments(),
    ]);
    res.json({ data: users, pagination: buildPageMeta(total, pagination) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// CREATE USER
// =============================
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, role, status } = req.body;
    const profilePictureFile = req.file;

    if (!fullName || !email || !password || !role || typeof status === 'undefined') {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters.' });
      return;
    }

    if (typeof email !== 'string') {
      res.status(400).json({ message: 'Invalid email.' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    let profilePictureUrl = '';
    if (profilePictureFile) {
      profilePictureUrl = useCloudinary
        ? await uploadProfilePictureToCloudinary(profilePictureFile)
        : `/uploads/${profilePictureFile.filename}`;
    }

    const newUser = new User({
      fullName,
      email,
      password: await hashPassword(password),
      role,
      status,
      profilePicture: profilePictureUrl || undefined,
      permissions: getDefaultPermissionsByRole(role as Role),
    });

    await newUser.save();

    const created = newUser.toObject();
    delete (created as { password?: string }).password;
    res.status(201).json(created);
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// UPDATE USER
// =============================
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role, status } = req.body;
    const profilePictureFile = req.file;
    const existingUser = await User.findById(id);

    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updateData: any = {};

    if (typeof fullName === 'string') updateData.fullName = fullName;
    if (typeof email === 'string') updateData.email = email;
    if (typeof role === 'string') updateData.role = role;
    if (typeof status === 'string') updateData.status = status;

    // Only touch the password when a new one was actually submitted, and never store it raw.
    if (password !== undefined && password !== null && password !== '') {
      if (typeof password !== 'string' || password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters.' });
        return;
      }
      updateData.password = await hashPassword(password);
    }

    if (profilePictureFile) {
      updateData.profilePicture = useCloudinary
        ? await uploadProfilePictureToCloudinary(profilePictureFile)
        : `/uploads/${profilePictureFile.filename}`;
    }

    if (role && role !== existingUser.role) {
      updateData.permissions = getDefaultPermissionsByRole(role as Role);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select(
      PUBLIC_USER_FIELDS,
    );
    // Role/status/permission changes must take effect on this user's next request.
    invalidateCachedUser(id);
    res.json(updatedUser);
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// DELETE USER
// =============================
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const target = await User.findById(req.params.id).select('role');
    if (!target) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Don't allow the last Super Admin to be removed — that would lock everyone out.
    if (target.role === 'Super Admin') {
      const superAdmins = await User.countDocuments({ role: 'Super Admin' });
      if (superAdmins <= 1) {
        res.status(400).json({ message: 'Cannot delete the last Super Admin.' });
        return;
      }
    }

    await User.findByIdAndDelete(req.params.id);
    // Revoke any live session immediately.
    invalidateCachedUser(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// GET USER BY ID
// =============================
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select(PUBLIC_USER_FIELDS);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRolePermissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const roles: Role[] = ['Super Admin', 'Maintenance', 'Marketing'];
    const response: Record<string, PermissionMap> = {};

    for (const role of roles) {
      const anyUser = await User.findOne({ role }).select('permissions');
      response[role] = normalizePermissions(anyUser?.permissions, role);
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRolePermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.params as { role: Role };
    if (!['Super Admin', 'Maintenance', 'Marketing'].includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const permissions = normalizePermissions(req.body.permissions, role);
    await User.updateMany({ role }, { $set: { permissions } });
    // Affects an unknown set of users by role — flush the whole cache.
    invalidateAllCachedUsers();

    res.status(200).json({ role, permissions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
