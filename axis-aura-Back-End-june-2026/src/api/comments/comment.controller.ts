import { Request, Response } from 'express';
import Comment from '../../models/comment.model';
import Notification from '../../models/notification.model';
import { stripHtml } from '../../utils/sanitizeHtml';
import { buildPageMeta, getPagination, MAX_UNPAGINATED } from '../../utils/pagination';

// =============================
// GET ALL COMMENTS FOR ADMIN
// =============================
export const getAllCommentsForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;
    const filter = status && ['pending', 'approved', 'rejected'].includes(status) ? { status } : {};

    const pagination = getPagination(req);
    const query = Comment.find(filter).sort({ createdAt: -1 });

    if (!pagination.paginated) {
      res.status(200).json(await query.limit(MAX_UNPAGINATED));
      return;
    }

    const [comments, total] = await Promise.all([
      query.skip(pagination.skip).limit(pagination.limit),
      Comment.countDocuments(filter),
    ]);
    res.status(200).json({ data: comments, pagination: buildPageMeta(total, pagination) });
  } catch (error) {
    console.error('Get All Comments For Admin Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// GET APPROVED COMMENTS (PUBLIC)
// =============================
export const getApprovedComments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get Approved Comments Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// GET COMMENTS BY ARTICLE
// =============================
export const getCommentsByArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId, status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// TOGGLE LIKE ON COMMENT
// =============================
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    // Toggle like
    comment.isLiked = !comment.isLiked;
    comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// =============================
// CREATE COMMENT + NOTIFICATION
// =============================
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId, username, email, content, parentId } = req.body;

    if (!username || !email || !content) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }

    // Anonymous input — store as plain text only.
    const safeUsername = stripHtml(username).slice(0, 120);
    const safeEmail = stripHtml(email).slice(0, 254);
    const safeContent = stripHtml(content).slice(0, 5000);

    if (!safeUsername || !safeEmail || !safeContent) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }

    const comment = new Comment({
      articleId: articleId || null,
      username: safeUsername,
      email: safeEmail,
      content: safeContent,
      parentId: parentId || null,
      status: 'pending',
    });
    await comment.save();

    // Create notification (best-effort; never block the submission on it)
    try {
      const notification = new Notification({
        type: 'comment',
        user: {
          name: safeUsername,
          avatar: '',
        },
        articleId: articleId || undefined,
        articleTitle: 'News & Regulations',
        description: `${safeUsername} commented: "${safeContent.substring(0, 50)}..."`,
      });
      await notification.save();
    } catch (notificationError) {
      console.error('Comment notification failed:', notificationError);
    }

    res.status(201).json({ message: 'Comment submitted for admin approval.' });
  } catch (error) {
    console.error('Create Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// APPROVE COMMENT
// =============================
export const approveComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Comment.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Approve Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// REJECT COMMENT
// =============================
export const rejectComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Comment.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Reject Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// =============================
// DELETE COMMENT
// =============================
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
