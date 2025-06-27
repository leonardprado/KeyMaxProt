const Review = require('../models/Review');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.author_id = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Get reviews for a specific item
// @route   GET /api/reviews/item/:itemType/:itemId
// @access  Public
exports.getReviewsByItem = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Review.find({
    item_type: req.params.itemType,
    item_id: req.params.itemId
  }).populate('author_id', 'name'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});