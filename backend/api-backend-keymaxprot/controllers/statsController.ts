// controllers/statsController.js (VERSIÓN CORREGIDA Y COMPLETA)

const asyncHandler = require('../middleware/asyncHandler');
const { User, Shop, Product, Order } = require('../models/AllModels'); // Importación centralizada

// @desc    Obtener estadísticas generales
// @route   GET /api/stats/overview
// @access  Admin
exports.getOverview = asyncHandler(async (req, res, next) => { // Nombre corregido a getOverview
    const [userCount, shopCount, productCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: { userCount, shopCount, productCount, orderCount },
    });
});

// @desc    Obtener las ventas totales por mes
// @route   GET /api/stats/sales-over-time
// @access  Admin
exports.getSalesOverTime = asyncHandler(async (req, res, next) => {
    const salesData = await Order.aggregate([
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                totalSales: { $sum: "$total_amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedData = salesData.map(item => ({
        label: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        amount: item.totalSales
    }));

    res.status(200).json({ success: true, data: formattedData });
});

// @desc    Obtener distribución de usuarios por rol
// @route   GET /api/stats/user-roles
// @access  Admin
exports.getUserRoles = asyncHandler(async (req, res, next) => {
    const userRoleData = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, data: userRoleData });
});

// @desc    Obtener distribución de productos por categoría
// @route   GET /api/stats/category-distribution
// @access  Admin
exports.getCategoryDistribution = asyncHandler(async (req, res, next) => {
    const categoryData = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, data: categoryData });
});