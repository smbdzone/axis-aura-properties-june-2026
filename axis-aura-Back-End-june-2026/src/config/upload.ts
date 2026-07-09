// src/config/upload.ts

import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

let storage;

if (useCloudinary) {
  // In-memory storage for Cloudinary uploads
  storage = multer.memoryStorage();
} else {
  // Local disk storage
  storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
}

const upload = multer({ storage });

export default upload;
