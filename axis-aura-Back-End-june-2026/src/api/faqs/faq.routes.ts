import express from 'express';
import { createFaq, createFaqsBulk, deleteFaq, getFaqs, updateFaq } from './faq.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = express.Router();

// Public: anyone can read FAQs (shown on the public site)
router.get('/', getFaqs);

// Super Admin only: manage FAQs from the dashboard
router.post('/', authenticate, requirePermission('faqs'), createFaq);
router.post('/bulk', authenticate, requirePermission('faqs'), createFaqsBulk);
router.put('/:id', authenticate, requirePermission('faqs'), updateFaq);
router.delete('/:id', authenticate, requirePermission('faqs'), deleteFaq);

export default router;
