// Asegúrate de que el nombre del archivo 'APIFeatures' coincida exactamente con la capitalización
// y que 'Post' y 'Review' estén importados desde AllModels.js

const { Post, Review, Product, Appointment, User, Vehicle, Shop, ServiceRecord, Tutorial } = require('../models/AllModels');

// Importa asyncHandler UNA VEZ y con el nombre correcto
const asyncHandler = require('../middleware/asyncHandler'); // O la ruta correcta a tu asyncHandler

// Usa ErrorResponse en lugar de AppError
const ErrorResponse = require('../utils/errorResponse'); 
const APIFeatures = require('../utils/APIFeatures'); // <-- Asegúrate de que la ruta sea correcta y la capitalización coincida

// Function to get all reviews for a specific item
// This function fetches reviews based on the item type and ID provided in the request parameters.
// Usando asyncHandler en lugar de catchAsync
exports.getReviewsByItem = asyncHandler(async (req, res, next) => {
  let { itemId, itemType } = req.params;

  // If itemType is not provided, assume it's a Product and use productId
  if (!itemType && req.params.productId) {
    itemType = 'Product';
    itemId = req.params.productId;
  }

  // Validate item type
  const validItemTypes = ['Product', 'Shop', 'ServiceRecord', 'Tutorial'];
  if (!itemType || !validItemTypes.includes(itemType)) {
    // Usa ErrorResponse en lugar de AppError
    return next(new ErrorResponse('Tipo de artículo inválido o no especificado.', 400)); 
  }

  // Find reviews for the specific item
  // Asegúrate que el populate sea 'user' y no 'author' si ya estandarizamos los modelos
  const features = new APIFeatures(Review.find({ 'item.id': itemId, 'item.type': itemType }).populate('user', 'name photo'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;

  // Get total count for pagination metadata
  const totalReviews = await Review.countDocuments({ 'item.id': itemId, 'item.type': itemType });

  res.status(200).json({
    success: true, // <-- Usa 'success' en lugar de 'status' si es tu convención
    results: reviews.length,
    total: totalReviews,
    data: {
      reviews,
    },
  });
});

// Function to create a new review for an item
// This function allows a logged-in user to submit a review for a product, service, or shop.
// Usando asyncHandler en lugar de catchAsync
exports.createReview = asyncHandler(async (req, res, next) => {
  const { itemId, itemType } = req.params;
  const { rating, comment } = req.body;

  // Validate item type
  const validItemTypes = ['Product', 'Shop', 'ServiceRecord', 'Tutorial'];
  if (!validItemTypes.includes(itemType)) {
    return next(new ErrorResponse('Tipo de artículo inválido.', 400));
  }

  // Check if the item exists
  let itemModel;
  switch (itemType) {
    case 'Product': itemModel = Product; break;
    case 'Shop': itemModel = Shop; break;
    case 'ServiceRecord': itemModel = ServiceRecord; break;
    case 'Tutorial': itemModel = Tutorial; break;
    default: return next(new ErrorResponse('Tipo de artículo no soportado.', 400));
  }

  const itemExists = await itemModel.findById(itemId);
    // Usa ErrorResponse en lugar de AppError
  if (!itemExists) {
    return next(new ErrorResponse('El artículo al que intentas añadir una reseña no existe.', 404));
  }

  // Check if user already reviewed this item
  // Asegúrate de que el campo en el modelo Review para el usuario sea 'user' y no 'author'
  const existingReview = await Review.findOne({ 'item.id': itemId, 'item.type': itemType, user: req.user._id });
  if (existingReview) {
    return next(new ErrorResponse('Ya has enviado una reseña para este artículo.', 400));
  }

  const newReview = await Review.create({
    rating,
    comment,
    user: req.user._id, // Asumiendo que el campo en el modelo Review es 'user'
    item: {
      id: itemId,
      type: itemType,
    },
  });

  // The post-save hook in the Review model will calculate the average rating

  res.status(201).json({
    success: true, // <-- Usa 'success' en lugar de 'status' si es tu convención
    data: {
      review: newReview,
    },
  });
});

// Function to update a specific review
// Allows the author of a review to modify their comment or rating.
// Usando asyncHandler en lugar de catchAsync
exports.updateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new ErrorResponse('No se encontró la reseña con ese ID.', 404));
  }

  // Check if the logged-in user is the author of the review
  // Asegúrate que el campo en el modelo Review para el autor sea 'user'
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('No tienes permiso para actualizar esta reseña.', 403));
  }

  // Update fields if provided
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  // review.updatedAt = Date.now(); // Si el esquema usa timestamps, Mongoose lo maneja. Si no, puedes actualizarlo manualmente.

  await review.save();

  // Recalculate average rating for the item after update
  // Asegúrate de que el método estático calculateAverageRating esté en el modelo Review.
  // Y que se llame con los campos correctos (item.id, item.type)
  await Review.calculateAverageRating(review.item.id, review.item.type);

  res.status(200).json({
    success: true,
    data: {
      review,
    },
  });
});

// Function to delete a specific review
// Allows the author of a review (or an admin, if implemented) to delete their review.
// Usando asyncHandler en lugar de catchAsync
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new ErrorResponse('No se encontró la reseña con ese ID.', 404));
  }

  // Check if the logged-in user is the author of the review
  // Asegúrate que el campo en el modelo Review para el autor sea 'user'
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('No tienes permiso para eliminar esta reseña.', 403));
  }

  // Store item details before deleting for recalculation
  const { id: itemId, type: itemType } = review.item;

  await review.remove(); // Esto es correcto para Mongoose. Si usas deleteOne, la lógica es diferente

  // Recalculate average rating for the item after deletion
  await Review.calculateAverageRating(itemId, itemType);

  res.status(204).json({
    success: true,
    data: null,
  });
});