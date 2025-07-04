
const { Appointment, User, Vehicle, Shop, ServiceCatalog, Post } = require('../models/AllModels');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/APIFeatures');
// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Post.find().populate('user', 'name'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  res.status(200).json({ success: true, count: posts.length, data: posts });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('user', 'name').populate('likes', 'name');
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }
  post.views += 1;
  await post.save();
  res.status(200).json({ success: true, data: post });
});

// @desc    Create post
// @route   POST /api/posts
// @access  Private/Technician
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private/Technician
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
  }
  post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: post });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private/Technician
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }
  if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
  }
  await post.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }
  if (post.likes.includes(req.user.id)) {
    post.likes = post.likes.filter(like => like.toString() !== req.user.id);
  } else {
    post.likes.push(req.user.id);
  }
  await post.save();
  res.status(200).json({ success: true, data: post.likes });
});
