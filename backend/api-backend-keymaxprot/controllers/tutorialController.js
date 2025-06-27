const Tutorial = require('../models/Tutorial');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new tutorial
// @route   POST /api/tutorials
// @access  Private/Admin/Tecnico
exports.createTutorial = asyncHandler(async (req, res, next) => {
  req.body.author_id = req.user.id;

  const tutorial = await Tutorial.create(req.body);

  res.status(201).json({
    success: true,
    data: tutorial,
  });
});

// @desc    Get all tutorials
// @route   GET /api/tutorials
// @access  Public
exports.getTutorials = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Tutorial.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tutorials = await features.query;

  res.status(200).json({
    success: true,
    count: tutorials.length,
    data: tutorials,
  });
});

// @desc    Get single tutorial
// @route   GET /api/tutorials/:id
// @access  Public
exports.getTutorial = asyncHandler(async (req, res, next) => {
  const tutorial = await Tutorial.findById(req.params.id).populate(
    'author_id',
    'name'
  );

  if (!tutorial) {
    return next(
      new ErrorResponse(`Tutorial not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: tutorial,
  });
});

// @desc    Update tutorial
// @route   PUT /api/tutorials/:id
// @access  Private/Admin/Tecnico
exports.updateTutorial = asyncHandler(async (req, res, next) => {
  let tutorial = await Tutorial.findById(req.params.id);

  if (!tutorial) {
    return next(
      new ErrorResponse(`Tutorial not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is tutorial owner or admin
  if (
    tutorial.author_id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'tecnico'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this tutorial`,
        401
      )
    );
  }

  tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: tutorial,
  });
});

// @desc    Delete tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private/Admin/Tecnico
exports.deleteTutorial = asyncHandler(async (req, res, next) => {
  const tutorial = await Tutorial.findById(req.params.id);

  if (!tutorial) {
    return next(
      new ErrorResponse(`Tutorial not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is tutorial owner or admin
  if (
    tutorial.author_id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'tecnico'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this tutorial`,
        401
      )
    );
  }

  await tutorial.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});