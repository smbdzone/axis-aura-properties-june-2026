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
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
      },
    });

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for the video field.'));
    }
    return;
  }

  if (file.fieldname === 'thumbnail') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for the thumbnail.'));
    }
    return;
  }

  cb(null, true);
};

// Allow up to 150MB video uploads
const upload = multer({ storage, fileFilter, limits: { fileSize: 150 * 1024 * 1024 } });

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
