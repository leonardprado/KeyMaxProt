const { ServiceCatalog } = require('../models/AllModels');
const ErrorResponse = require('../utils/errorResponse');
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

// @desc    Delete a service from the catalog
// @route   DELETE /api/services/:id
// @access  Admin
exports.deleteService = asyncHandler(async (req, res, next) => {
    const service = await ServiceCatalog.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }

    await service.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Update a service in the catalog
// @route   PUT /api/services/:id
// @access  Admin
exports.updateService = asyncHandler(async (req, res, next) => {
    let service = await ServiceCatalog.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }

    service = await ServiceCatalog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: service
    });
});

// @desc    Get single service from the catalog
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res, next) => {
    const service = await ServiceCatalog.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
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