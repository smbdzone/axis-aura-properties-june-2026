import express from 'express';
import {
  bulkDeleteContacts,
  deleteContact,
  getAllContacts,
  submitContact,
} from './contact.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

// Public: anyone can send a contact message
router.post('/', submitContact);

// Super Admin only: view and manage received messages
router.get('/', authenticate, requireSuperAdmin, getAllContacts);
router.delete('/:id', authenticate, requireSuperAdmin, deleteContact);
router.post('/bulk-delete', authenticate, requireSuperAdmin, bulkDeleteContacts);

export default router;
