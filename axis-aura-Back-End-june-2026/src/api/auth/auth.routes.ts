import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  bootstrapSuperAdmin,
  registerAdmin,
} from './auth.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

// Throttle credential guessing. Successful logins don't count against the budget.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

const bootstrapLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

router.post('/login', loginLimiter, loginAdmin);
router.post('/bootstrap', bootstrapLimiter, bootstrapSuperAdmin);
router.post('/register', authenticate, requireSuperAdmin, registerAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', getAdminProfile);

export default router;
