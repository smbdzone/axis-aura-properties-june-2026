import express from 'express';
import { bulkDeleteApplications, deleteApplication, getApplications, upload, submitApplication } from './submitApplication.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = express.Router();

// Public: anyone can submit a job application
router.post('/', upload, submitApplication);

// Super Admin only: view and manage received applications
router.get('/', authenticate, requirePermission('jobApplications'), getApplications);
router.delete('/:id', authenticate, requirePermission('jobApplications'), deleteApplication);
router.post('/bulk-delete', authenticate, requirePermission('jobApplications'), bulkDeleteApplications);

export default router;
