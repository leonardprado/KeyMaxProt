
const express = require('express');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').get(getComments).post(protect, createComment);
router.route('/:id').put(protect, updateComment).delete(protect, deleteComment);

module.exports = router;
