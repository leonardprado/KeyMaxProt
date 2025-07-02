
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: comments.length, data: comments });
});

// @desc    Create comment
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;
  req.body.post = req.params.postId;
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.postId}`, 404));
  }
  const comment = await Comment.create(req.body);
  res.status(201).json({ success: true, data: comment });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this comment`, 401));
  }
  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: comment });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this comment`, 401));
  }
  await comment.remove();
  res.status(200).json({ success: true, data: {} });
});
