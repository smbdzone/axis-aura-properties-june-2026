import express from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  bootstrapSuperAdmin,
  registerAdmin,
} from './auth.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/bootstrap', bootstrapSuperAdmin);
router.post('/register', authenticate, requireSuperAdmin, registerAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', getAdminProfile);

export default router;
