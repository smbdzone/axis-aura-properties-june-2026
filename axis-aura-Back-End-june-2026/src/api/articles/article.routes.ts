import express from 'express';
import multer from 'multer';
import {
  bulkDeleteArticles,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from './article.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import {
  IMAGE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  matchesAllowlist,
  safeFilename,
} from '../../config/uploadRules';
import path from 'path';
const useCloudinary = process.env.USE_CLOUDINARY === 'true';

const router = express.Router();

// Multer config for file upload
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, path.join(__dirname, '..', '..', '..', 'uploads'));
    },
    filename: function (_req, file, cb) {
      cb(null, safeFilename(file));
    },
  });

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.fieldname !== 'banner' && file.fieldname !== 'seoImage') {
    return cb(new Error(`Unexpected file field: ${file.fieldname}`));
  }
  if (!matchesAllowlist(file, IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)) {
    return cb(new Error('Only jpeg, png, webp, gif, or avif images are allowed.'));
  }
  cb(null, true);
};

// Previously unfiltered — any file type of any size was accepted here.
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024, files: 2 } });

// Routes
// Public read access (shown on the public site)
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Write access restricted to Super Admin only
router.post('/', authenticate, requirePermission('newsAndRegulations'), upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'seoImage', maxCount: 1 }]), createArticle);
router.put('/:id', authenticate, requirePermission('newsAndRegulations'), upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'seoImage', maxCount: 1 }]), updateArticle);
router.delete('/:id', authenticate, requirePermission('newsAndRegulations'), deleteArticle);
router.post('/bulk-delete', authenticate, requirePermission('newsAndRegulations'), bulkDeleteArticles);

export default router;
