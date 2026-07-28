import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getDevelopers,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getDeveloperById,
} from './developer.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
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
      cb(null, path.join(__dirname, '..', '..', '..', 'uploads')); // Adjust path for local storage
    },
    filename(req, file, cb) {
      cb(null, safeFilename(file));
    },
  });

// === File Filter (allowlist) ===
// SVG is intentionally not allowed: it can carry script and would execute if the
// file were ever opened directly from the uploads origin.
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname !== 'logo') {
    return cb(new Error(`Unexpected file field: ${file.fieldname}`));
  }

  if (!matchesAllowlist(file, IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)) {
    return cb(new Error('Only jpeg, png, webp, gif, or avif images are allowed for the logo.'));
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024, files: 1 } });

// === Routes ===
// Public read access
router.get('/', getDevelopers);
router.get('/:id', getDeveloperById);

// Write access restricted to Super Admin only
router.post('/', authenticate, requirePermission('developers'), upload.single('logo'), createDeveloper);
router.put('/:id', authenticate, requirePermission('developers'), upload.single('logo'), updateDeveloper);
router.delete('/:id', authenticate, requirePermission('developers'), deleteDeveloper);

export default router;
