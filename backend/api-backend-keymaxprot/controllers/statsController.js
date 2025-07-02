const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get overview statistics
// @route   GET /api/stats/overview
// @access  Admin
exports.getOverviewStats = async (req, res) => {
  try {
    const [userCount, shopCount, productCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        userCount,
        shopCount,
        productCount,
        orderCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};