const { Appointment, User, Vehicle, Shop, ServiceCatalog, Product } = require('../models/AllModels');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/ShopOwner/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Find the shop owned by the current user
  const shop = await Shop.findOne({ owner_id: req.user.id });

  if (!shop) {
    return next(
      new ErrorResponse(`User ${req.user.id} does not own a shop`, 400)
    );
  }

  req.body.seller = { seller_id: shop._id, seller_model: 'Shop' };

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    'seller.seller_id',
    'name'
  );

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/ShopOwner/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/ShopOwner/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  await product.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

