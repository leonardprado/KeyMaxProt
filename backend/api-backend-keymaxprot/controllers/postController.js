const asyncHandler = require('../middleware/asyncHandler');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
// ... otros imports 

// @desc    Crear una nueva respuesta en un hilo 
// @route   POST /api/threads/:threadId/posts 
// @access  Private 
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.id;
  req.body.thread = req.params.threadId;

  // Verificar que el hilo exista 
  const thread = await Thread.findById(req.params.threadId);
  if (!thread) {
    return next(new ErrorResponse(`Hilo no encontrado con id ${req.params.threadId}`, 404));
  }
  
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

// ... aquí irían las funciones para obtener, actualizar y eliminar posts