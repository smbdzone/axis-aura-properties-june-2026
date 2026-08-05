import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getDiscoverItems,
  getDiscoverById,
  createDiscover,
  updateDiscover,
  deleteDiscover,
} from './discover.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';
import {
  IMAGE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  VIDEO_EXTENSIONS,
  VIDEO_MIME_TYPES,
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
        cb(null, path.join(__dirname, '..', '..', '..', 'uploads'));
      },
      filename(req, file, cb) {
        cb(null, safeFilename(file));
      },
    });

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.fieldname === 'video') {
    if (!matchesAllowlist(file, VIDEO_MIME_TYPES, VIDEO_EXTENSIONS)) {
      return cb(new Error('Only mp4, webm, or mov videos are allowed.'));
    }
    return cb(null, true);
  }

  if (file.fieldname === 'thumbnail') {
    // `image/*` previously allowed image/svg+xml through.
    if (!matchesAllowlist(file, IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)) {
      return cb(new Error('Only jpeg, png, webp, gif, or avif images are allowed.'));
    }
    return cb(null, true);
  }

  return cb(new Error(`Unexpected file field: ${file.fieldname}`));
};

// Allow up to 150MB video uploads
const upload = multer({ storage, fileFilter, limits: { fileSize: 150 * 1024 * 1024, files: 2 } });

const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// === Routes ===
// Public read access
router.get('/', getDiscoverItems);
router.get('/:id', getDiscoverById);

// Write access restricted to Super Admin only
router.post('/', authenticate, requireSuperAdmin, uploadFields, createDiscover);
router.put('/:id', authenticate, requireSuperAdmin, uploadFields, updateDiscover);
router.delete('/:id', authenticate, requireSuperAdmin, deleteDiscover);

export default router;
