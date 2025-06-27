const ServiceCatalog = require('../models/AllModels').ServiceCatalog;
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new service in the catalog
// @route   POST /api/services
// @access  Admin
exports.createService = asyncHandler(async (req, res) => {
    const { name, category, default_price, description } = req.body;

    const service = await ServiceCatalog.create({
        name,
        category,
        default_price,
        description
    });

    res.status(201).json({
        success: true,
        data: service
    });
});

// @desc    Get all services from the catalog
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res) => {
    const features = new APIFeatures(ServiceCatalog.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const services = await features.query;

    res.status(200).json({
        success: true,
        count: services.length,
        data: services
    });
});