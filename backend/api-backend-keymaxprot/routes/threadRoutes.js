const express = require('express');
const {
  createThread,
  getThreads,
  getThread
} = require('../controllers/threadController');

const { protect } = require('../middleware/authMiddleware');

// Importar el router de posts para anidarlo
const postRouter = require('./postRoutes');

const router = express.Router();

// Anidar las rutas de posts.
// Cualquier petición a /api/threads/:threadId/posts será manejada por postRouter.
router.use('/:threadId/posts', postRouter);

// Rutas para los hilos
router.route('/')
  .get(getThreads)
  .post(protect, createThread); // Solo usuarios logueados pueden crear hilos

router.route('/:id')
  .get(getThread);
  
// Aquí añadirías en el futuro las rutas para PUT y DELETE en un hilo específico
// .put(protect, updateThread)
// .delete(protect, deleteThread);

module.exports = router;