// routes/notification.routes.ts
import express from 'express';
import {
  getNotifications,
  deleteNotification,
  markAsRead,
} from './notification.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

// Notifications carry submitter details from contacts/enquiries — Super Admin only.
router.use(authenticate, requireSuperAdmin);

router.get('/', getNotifications);
router.delete('/:id', deleteNotification);
router.put('/:id/read', markAsRead);

export default router;
