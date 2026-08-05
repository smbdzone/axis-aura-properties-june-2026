import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getJobs, 
  createJob, 
  updateJob, 
  deleteJob, 
  getJobById,
  getJobTitles
} from './job.controller';
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
      cb(null, path.join(__dirname, '..', '..', '..', 'uploads'));
    },
    filename(req, file, cb) {
      cb(null, safeFilename(file));
    },
  });

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname !== 'image') {
    return cb(new Error(`Unexpected file field: ${file.fieldname}`));
  }
  if (!matchesAllowlist(file, IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)) {
    return cb(new Error('Only jpeg, png, webp, gif, or avif images are allowed.'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024, files: 1 } });

// Public read access
router.get('/', getJobs);
router.get('/positions', getJobTitles);
router.get('/:id', getJobById);

// Write access restricted to Super Admin only
router.post('/', authenticate, requirePermission('careers'), upload.single('image'), createJob);
router.put('/:id', authenticate, requirePermission('careers'), upload.single('image'), updateJob);
router.delete('/:id', authenticate, requirePermission('careers'), deleteJob);

export default router;
