"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// -------- Public routes --------
// Approved comments shown on the public site
router.get('/approved', comment_controller_1.getApprovedComments);
// Anyone can submit a comment (goes to pending for approval)
router.post('/', comment_controller_1.createComment);
// Approved comments for a specific article
router.get('/:articleId', comment_controller_1.getCommentsByArticle);
// Like toggle stays public
router.post('/:id/like', comment_controller_1.toggleLike);
// -------- Super Admin only --------
// View every comment (all statuses) for moderation
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, comment_controller_1.getAllCommentsForAdmin);
// Approve / reject / delete
router.patch('/:id/approve', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, comment_controller_1.approveComment);
router.patch('/:id/reject', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, comment_controller_1.rejectComment);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.requireSuperAdmin, comment_controller_1.deleteComment);
exports.default = router;
