const { Post, Review, Product, Appointment, User, Vehicle, Shop, ServiceRecord, Tutorial } = require('../models/AllModels');

const asyncHandler = require('../middleware/asyncHandler'); 
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const ErrorResponse = require('../utils/errorResponse');

// Function to get all reviews for a specific item
// This function fetches reviews based on the item type and ID provided in the request parameters.
exports.getReviewsByItem = asyncHandler(async (req, res, next) => {
  const { itemId, itemType } = req.params;

  // Validate item type
  const validItemTypes = ['Product', 'Shop', 'ServiceRecord', 'Tutorial'];
  if (!validItemTypes.includes(itemType)) {
    return next(new AppError('Tipo de artículo inválido.', 400));
  }

  // Find reviews for the specific item
  const features = new APIFeatures(Review.find({ 'item.id': itemId, 'item.type': itemType }).populate('user', 'name photo'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;

  // Get total count for pagination metadata
  const totalReviews = await Review.countDocuments({ 'item.id': itemId, 'item.type': itemType });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    total: totalReviews,
    data: {
      reviews,
    },
  });
});

// Function to create a new review for an item
// This function allows a logged-in user to submit a review for a product, service, or shop.
exports.createReview = asyncHandler(async (req, res, next) => {
  const { itemId, itemType } = req.params;
  const { rating, comment } = req.body;

  // Validate item type
  const validItemTypes = ['Product', 'Shop', 'ServiceRecord', 'Tutorial'];
  if (!validItemTypes.includes(itemType)) {
    return next(new AppError('Tipo de artículo inválido.', 400));
  }

  // Check if the item exists
  let itemModel;
  switch (itemType) {
    case 'Product': itemModel = Product; break;
    case 'Shop': itemModel = Shop; break;
    case 'ServiceRecord': itemModel = ServiceRecord; break;
    case 'Tutorial': itemModel = Tutorial; break;
    default: return next(new AppError('Tipo de artículo no soportado.', 400));
  }

  const itemExists = await itemModel.findById(itemId);
  if (!itemExists) {
    return next(new AppError('El artículo al que intentas añadir una reseña no existe.', 404));
  }

  // Check if user already reviewed this item
  const existingReview = await Review.findOne({ 'item.id': itemId, 'item.type': itemType, user: req.user._id });
  if (existingReview) {
    return next(new AppError('Ya has enviado una reseña para este artículo.', 400));
  }

  const newReview = await Review.create({
    rating,
    comment,
    user: req.user._id,
    item: {
      id: itemId,
      type: itemType,
    },
  });

  // The post-save hook in the Review model will calculate the average rating

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

// Function to update a specific review
// Allows the author of a review to modify their comment or rating.
exports.updateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new AppError('No se encontró la reseña con ese ID.', 404));
  }

  // Check if the logged-in user is the author of the review
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new AppError('No tienes permiso para actualizar esta reseña.', 403));
  }

  // Update fields if provided
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  review.updatedAt = Date.now(); // Manually update timestamp or rely on pre-save hook if implemented

  await review.save();

  // Recalculate average rating for the item after update
  await review.constructor.calculateAverageRating(review.item.id, review.item.type);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// Function to delete a specific review
// Allows the author of a review (or an admin, if implemented) to delete their review.
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new AppError('No se encontró la reseña con ese ID.', 404));
  }

  // Check if the logged-in user is the author of the review
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new AppError('No tienes permiso para eliminar esta reseña.', 403));
  }

  // Store item details before deleting for recalculation
  const { id: itemId, type: itemType } = review.item;

  await review.remove();

  // Recalculate average rating for the item after deletion
  await Review.calculateAverageRating(itemId, itemType);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});