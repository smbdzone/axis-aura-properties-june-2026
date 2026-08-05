import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getRolePermissions,
  updateRolePermissions,
} from './user.controller';
import {
  authenticate,
  requirePermission,
  requireSuperAdmin,
} from '../../middleware/auth.middleware';
import {
  IMAGE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  matchesAllowlist,
  safeFilename,
} from '../../config/uploadRules';

const router = express.Router();
const useCloudinary = process.env.USE_CLOUDINARY === 'true';

// === Multer Config ===
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, '..', '..', '..', 'uploads')); // Adjust as needed
    },
    filename(req, file, cb) {
      cb(null, safeFilename(file));
    },
  });

// === File Filter (allowlist) ===
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname !== 'profilePicture') {
    return cb(new Error(`Unexpected file field: ${file.fieldname}`));
  }
  if (!matchesAllowlist(file, IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)) {
    return cb(new Error('Only jpeg, png, webp, gif, or avif images are allowed.'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

// === Routes ===
// Every route here is privileged; nothing is public.
router.use(authenticate);

// Rewriting the permission matrix itself is Super Admin only — a user with
// manageUsers.edit must not be able to grant themselves more access.
router.get('/permissions/roles', requireSuperAdmin, getRolePermissions);
router.put('/permissions/roles/:role', requireSuperAdmin, updateRolePermissions);

// Account administration follows the manageUsers permission.
router.use(requirePermission('manageUsers'));

router.get('/', getUsers);
router.post('/', upload.single('profilePicture'), createUser);
router.put('/:id', upload.single('profilePicture'), updateUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;
