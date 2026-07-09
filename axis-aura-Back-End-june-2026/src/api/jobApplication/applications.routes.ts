import express from 'express';
import { bulkDeleteApplications, deleteApplication, getApplications, upload, submitApplication } from './submitApplication.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

// Public: anyone can submit a job application
router.post('/', upload, submitApplication);

// Super Admin only: view and manage received applications
router.get('/', authenticate, requireSuperAdmin, getApplications);
router.delete('/:id', authenticate, requireSuperAdmin, deleteApplication);
router.post('/bulk-delete', authenticate, requireSuperAdmin, bulkDeleteApplications);

export default router;
