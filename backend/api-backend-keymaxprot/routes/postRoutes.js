const express = require('express');
const { createPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// La opción { mergeParams: true } permite acceder a los parámetros de la ruta padre (ej. :threadId)
const router = express.Router({ mergeParams: true });

// Todas las rutas de posts requieren que el usuario esté autenticado
router.use(protect);

router.route('/')
  .post(createPost);

// Aquí añadirías en el futuro las rutas para PUT y DELETE en un post específico
// router.route('/:postId')
//   .put(updatePost)
//   .delete(deletePost);

module.exports = router;