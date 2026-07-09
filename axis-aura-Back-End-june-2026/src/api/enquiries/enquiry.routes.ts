import express from 'express';
import {
  bulkDeleteEnquiries,
  deleteEnquiry,
  getAllEnquiries,
  getEnquiryOptions,
  submitEnquiries
} from './enquiry.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

// Public: anyone can submit an enquiry and read the available options
router.post('/', submitEnquiries);
router.get('/options', getEnquiryOptions);

// Super Admin only: view and manage received enquiries
router.get('/', authenticate, requireSuperAdmin, getAllEnquiries);
router.delete('/:id', authenticate, requireSuperAdmin, deleteEnquiry);
router.post('/bulk-delete', authenticate, requireSuperAdmin, bulkDeleteEnquiries);

export default router;
