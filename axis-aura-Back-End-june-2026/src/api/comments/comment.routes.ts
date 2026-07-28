import express from 'express';
import {
  getAllCommentsForAdmin,
  getApprovedComments,
  getCommentsByArticle,
  createComment,
  deleteComment,
  toggleLike,
  approveComment,
  rejectComment,
} from './comment.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = express.Router();

// -------- Public routes --------
// Approved comments shown on the public site
router.get('/approved', getApprovedComments);
// Anyone can submit a comment (goes to pending for approval)
router.post('/', createComment);
// Approved comments for a specific article
router.get('/:articleId', getCommentsByArticle);
// Like toggle stays public
router.post('/:id/like', toggleLike);

// -------- Super Admin only --------
// View every comment (all statuses) for moderation
router.get('/', authenticate, requirePermission('comments'), getAllCommentsForAdmin);
// Approve / reject / delete
router.patch('/:id/approve', authenticate, requirePermission('comments'), approveComment);
router.patch('/:id/reject', authenticate, requirePermission('comments'), rejectComment);
router.delete('/:id', authenticate, requirePermission('comments'), deleteComment);

export default router;
