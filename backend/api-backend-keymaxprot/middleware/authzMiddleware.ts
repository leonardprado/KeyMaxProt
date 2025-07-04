const { Shop, Product } = require('../models/AllModels');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc Middleware to authorize if a user is the owner of a product or an admin.
 * This must be used AFTER the authMiddleware so that req.user is available.
 */
exports.authorizeProductOwner = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${productId}`, 404)
    );
  }

  // Find the shop owned by the logged-in user
  const shop = await Shop.findOne({ owner_id: req.user.id });

  // Check if the user is an admin
  const isAdmin = req.user.role === 'admin';

  // Check if the user owns the shop that the product belongs to
  const isOwner = shop && product.seller.seller_id.toString() === shop._id.toString();

  if (isOwner || isAdmin) {
    return next(); // Authorized
  }

  // If not owner and not admin, then deny access
  return next(
    new ErrorResponse(
      `User ${req.user.id} is not authorized to modify product ${productId}`,
      401
    )
  );
});
