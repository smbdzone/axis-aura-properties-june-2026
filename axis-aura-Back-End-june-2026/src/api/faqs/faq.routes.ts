import express from 'express';
import { createFaq, createFaqsBulk, deleteFaq, getFaqs, updateFaq } from './faq.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

// Public: anyone can read FAQs (shown on the public site)
router.get('/', getFaqs);

// Super Admin only: manage FAQs from the dashboard
router.post('/', authenticate, requireSuperAdmin, createFaq);
router.post('/bulk', authenticate, requireSuperAdmin, createFaqsBulk);
router.put('/:id', authenticate, requireSuperAdmin, updateFaq);
router.delete('/:id', authenticate, requireSuperAdmin, deleteFaq);

export default router;
