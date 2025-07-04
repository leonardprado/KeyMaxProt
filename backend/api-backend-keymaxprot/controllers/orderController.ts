const { Appointment, User, Vehicle, Shop, ServiceCatalog } = require('../models/AllModels');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return next(new ErrorResponse('No order items provided', 400));
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product_id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id ${item.product_id}`, 404));
    }

    if (product.stock_quantity < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for product ${product.name}`, 400));
    }

    totalAmount += product.price * item.quantity;
    orderItems.push({
      product_id: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    // Decrease stock quantity
    product.stock_quantity -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user_id: req.user.id,
    items: orderItems,
    total_amount: totalAmount,
    status: 'pending',
  });

  // Create a pending payment for the order
  await Payment.create({
    order_id: order._id,
    user_id: req.user.id,
    amount: totalAmount,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Order.find({ user_id: req.user.id }).populate(
    'items.product_id',
    'name image_url'
  ), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/Admin
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order owner or admin
  if (order.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this order`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});