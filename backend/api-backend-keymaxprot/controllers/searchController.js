const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Product, ServiceCatalog, Post } = require('../models/AllModels');

/**
 * @desc    Global search across multiple models (Product, ServiceCatalog, Post)
 * @route   GET /api/search
 * @access  Public
 */
exports.globalSearch = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ErrorResponse('Por favor, proporcione un término de búsqueda.', 400));
  }

  const searchPromises = [];

  // Search in Products
  searchPromises.push(Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  }).limit(5));

  // Search in ServiceCatalog
  searchPromises.push(ServiceCatalog.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ],
  }).limit(5));

  // Search in Posts
  searchPromises.push(Post.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ],
  }).limit(5));

  const [products, services, posts] = await Promise.all(searchPromises);

  res.status(200).json({
    success: true,
    data: {
      products,
      services,
      posts,
    },
  });
});