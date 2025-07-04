
const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Include other resource routers
const commentRouter = require('./commentRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:postId/comments', commentRouter);

router.route('/').get(getPosts).post(protect, authorize('tecnico', 'admin'), createPost);
router.route('/:id').get(getPost).put(protect, authorize('tecnico', 'admin'), updatePost).delete(protect, authorize('tecnico', 'admin'), deletePost);
router.route('/:id/like').put(protect, likePost);

export default router;
