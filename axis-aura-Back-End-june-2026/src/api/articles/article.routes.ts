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
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';
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
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const upload = multer({ storage });

// Routes
// Public read access (shown on the public site)
router.get('/', getArticles);
router.get('/:id', getArticleById);

// Write access restricted to Super Admin only
router.post('/', authenticate, requireSuperAdmin, upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'seoImage', maxCount: 1 }]), createArticle);
router.put('/:id', authenticate, requireSuperAdmin, upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'seoImage', maxCount: 1 }]), updateArticle);
router.delete('/:id', authenticate, requireSuperAdmin, deleteArticle);
router.post('/bulk-delete', authenticate, requireSuperAdmin, bulkDeleteArticles);

export default router;
