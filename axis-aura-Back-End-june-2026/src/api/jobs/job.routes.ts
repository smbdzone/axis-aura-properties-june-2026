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
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'image') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error('Only image files (jpeg, png, webp) are allowed.'));
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

// Public read access
router.get('/', getJobs);
router.get('/positions', getJobTitles);
router.get('/:id', getJobById);

// Write access restricted to Super Admin only
router.post('/', authenticate, requireSuperAdmin, upload.single('image'), createJob);
router.put('/:id', authenticate, requireSuperAdmin, upload.single('image'), updateJob);
router.delete('/:id', authenticate, requireSuperAdmin, deleteJob);

export default router;
