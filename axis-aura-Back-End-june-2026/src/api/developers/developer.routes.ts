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
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

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
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

// === File Filter (optional) ===
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const blockedExecutableTypes = [
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-dosexec',
  'application/x-executable',
  'application/x-mach-binary',
  'application/x-sh',
  'application/x-bat',
  'application/x-csh',
  'application/x-msi',
  'application/java-archive',
  'application/javascript',
  'text/javascript',
  'text/x-shellscript',
];
const blockedExecutableExtensions = [
  '.exe',
  '.bat',
  '.cmd',
  '.com',
  '.msi',
  '.dll',
  '.sh',
  '.bash',
  '.zsh',
  '.ps1',
  '.jar',
  '.js',
  '.vbs',
  '.scr',
];
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const fileName = (file.originalname || '').toLowerCase();
  const isExecutableType = blockedExecutableTypes.includes(file.mimetype);
  const isExecutableExtension = blockedExecutableExtensions.some(ext => fileName.endsWith(ext));
  if (isExecutableType || isExecutableExtension) {
    return cb(new Error('Executable or script files are not allowed.'));
  }

  if (file.fieldname === 'logo') {
    const isSvg = file.mimetype === 'image/svg+xml' || fileName.endsWith('.svg');
    if (allowedImageTypes.includes(file.mimetype) || isSvg) {
      cb(null, true);
    } else {
      return cb(new Error('Only image files (jpeg, png, webp, svg) are allowed for the logo.'));
    }
  } else {
    cb(null, true); // allow other fields if added later
  }
};

const upload = multer({ storage, fileFilter });

// === Routes ===
// Public read access
router.get('/', getDevelopers);
router.get('/:id', getDeveloperById);

// Write access restricted to Super Admin only
router.post('/', authenticate, requireSuperAdmin, upload.single('logo'), createDeveloper);
router.put('/:id', authenticate, requireSuperAdmin, upload.single('logo'), updateDeveloper);
router.delete('/:id', authenticate, requireSuperAdmin, deleteDeveloper);

export default router;
