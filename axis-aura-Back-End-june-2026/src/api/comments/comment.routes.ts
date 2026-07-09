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
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

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
router.get('/', authenticate, requireSuperAdmin, getAllCommentsForAdmin);
// Approve / reject / delete
router.patch('/:id/approve', authenticate, requireSuperAdmin, approveComment);
router.patch('/:id/reject', authenticate, requireSuperAdmin, rejectComment);
router.delete('/:id', authenticate, requireSuperAdmin, deleteComment);

export default router;
