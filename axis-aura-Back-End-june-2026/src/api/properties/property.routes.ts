import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  bulkCreateProperties,
  bulkDeleteProperties,
  createProperty,
  getProperties,
  getPropertyById,
  deleteProperty,
  updateProperty,
} from './property.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import {
  DOCUMENT_EXTENSIONS,
  DOCUMENT_MIME_TYPES,
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

// Allowlist by field purpose: brochures are PDF/DOCX, everything else is an image.
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const { fieldname } = file;
  const isBrochureField = fieldname === 'brochureFile';
  const isImageField =
    fieldname === 'propertyImages' ||
    fieldname === 'seoimage' ||
    fieldname === 'seoImage' ||
    /^floor_\d+_defaultLayout$/.test(fieldname) ||
    /^floor_\d+_unit_.+/.test(fieldname);

  if (isBrochureField) {
    if (!matchesAllowlist(file, DOCUMENT_MIME_TYPES, DOCUMENT_EXTENSIONS)) {
      return cb(new Error('Only PDF or DOCX files are allowed for brochure.'));
    }
    return cb(null, true);
  }

  if (isImageField) {
    if (!matchesAllowlist(file, IMAGE_MIME_TYPES, IMAGE_EXTENSIONS)) {
      return cb(new Error('Only jpeg, png, webp, gif, or avif images are allowed.'));
    }
    return cb(null, true);
  }

  return cb(new Error(`Unexpected file field: ${fieldname}`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024, files: 60 },
});


// === Upload Fields (dynamic floors/units) ===
const uploadFields = [
  { name: 'propertyImages', maxCount: 10 },
  { name: 'brochureFile', maxCount: 1 },
  { name: 'seoimage', maxCount: 1 },
];

for (let i = 0; i < 30; i++) {
  uploadFields.push({ name: `floor_${i}_defaultLayout`, maxCount: 1 });

  const unitTypes = ['Studio', '1_BHK', '2_BHK', '3_BHK', '2_BHK_Duplex', '3_BHK_Duplex', 'Penthouse'];
  for (const unit of unitTypes) {
    uploadFields.push({ name: `floor_${i}_unit_${unit}`, maxCount: 1 });

    for (let variantIndex = 0; variantIndex < 10; variantIndex++) {
      uploadFields.push({ name: `floor_${i}_unit_${unit}_variant_${variantIndex}_image`, maxCount: 1 });
      //uploadFields.push({ name: `floor_${i}_unit_${unit}_variant_${variantIndex}_name`, maxCount: 1 });
    }
  }
}


// === Routes ===
// Public read access
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Write access restricted to Super Admin only
router.post('/bulk-create', authenticate, requirePermission('properties'), bulkCreateProperties);
router.post('/', authenticate, requirePermission('properties'), upload.fields(uploadFields), createProperty);
router.post('/bulk-delete', authenticate, requirePermission('properties'), bulkDeleteProperties);
router.delete('/:id', authenticate, requirePermission('properties'), deleteProperty);
router.put('/:id', authenticate, requirePermission('properties'), upload.fields(uploadFields), updateProperty);

export default router;