import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: false,
      default: null,
    },
    username: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
