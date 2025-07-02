const asyncHandler = require('../middleware/asyncHandler');
const { Thread, Post } = require('../models/AllModels');


// @desc    Crear un nuevo hilo/pregunta 
// @route   POST /api/threads 
// @access  Private 
exports.createThread = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;
  const thread = await Thread.create(req.body);
  res.status(201).json({ success: true, data: thread });
});

// @desc    Obtener todos los hilos 
// @route   GET /api/threads 
// @access  Public 
exports.getThreads = asyncHandler(async (req, res, next) => {
  // Aquí puedes usar tu clase APIFeatures para filtrar por tags, ordenar por fecha, etc. 
  const features = new APIFeatures(Thread.find().populate('author', 'name'), req.query)
    .filter().sort().limitFields().paginate();
  const threads = await features.query;
  res.status(200).json({ success: true, count: threads.length, data: threads });
});

// @desc    Obtener un hilo y sus respuestas 
// @route   GET /api/threads/:id 
// @access  Public 
exports.getThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id).populate('author', 'name');
  if (!thread) {
    return next(new ErrorResponse(`Hilo no encontrado con id ${req.params.id}`, 404));
  }
  const posts = await Post.find({ thread: req.params.id }).populate('author', 'name');
  res.status(200).json({ success: true, data: { thread, posts } });
});

// ... aquí irían las funciones para actualizar y eliminar hilos