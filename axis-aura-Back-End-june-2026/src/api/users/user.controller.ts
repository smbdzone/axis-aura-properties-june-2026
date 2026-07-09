import { Request, Response } from 'express';
import User from '../../models/user.model';
import cloudinary from '../../services/cloudinaryClient';
import { Readable } from 'stream';

const useCloudinary = process.env.USE_CLOUDINARY === 'true';
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
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
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

    let profilePictureUrl = '';
    if (profilePictureFile) {
      profilePictureUrl = useCloudinary
        ? await uploadProfilePictureToCloudinary(profilePictureFile)
        : `/uploads/${profilePictureFile.filename}`;
    }

    const newUser = new User({
      fullName,
      email,
      password, // Make sure to hash this in production!
      role,
      status,
      profilePicture: profilePictureUrl || undefined,
      permissions: getDefaultPermissionsByRole(role as Role),
    });

    await newUser.save();
    res.status(201).json(newUser);
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

    const updateData: any = {
      fullName,
      email,
      password,
      role,
      status,
    };

    if (profilePictureFile) {
      updateData.profilePicture = useCloudinary
        ? await uploadProfilePictureToCloudinary(profilePictureFile)
        : `/uploads/${profilePictureFile.filename}`;
    }

    if (role && role !== existingUser.role) {
      updateData.permissions = getDefaultPermissionsByRole(role as Role);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
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
    await User.findByIdAndDelete(req.params.id);
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
    const user = await User.findById(req.params.id);
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

    res.status(200).json({ role, permissions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
