import { Router } from 'express';
import {
  bulkDeleteNewsletterSubscribers,
  deleteNewsletterSubscriber,
  getNewsletterSubscribers,
  subscribeNewsletter,
} from './newsletter.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Public: anyone can subscribe to the newsletter
router.post('/', subscribeNewsletter);

// Super Admin only: view and manage subscribers
router.get('/', authenticate, requireSuperAdmin, getNewsletterSubscribers);
router.delete('/:id', authenticate, requireSuperAdmin, deleteNewsletterSubscriber);
router.post('/bulk-delete', authenticate, requireSuperAdmin, bulkDeleteNewsletterSubscribers);

export default router;
