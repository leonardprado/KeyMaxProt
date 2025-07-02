const express = require('express');
const router = express.Router();
const {
  getReviewsByItem,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews
 */

// Routes for reviews related to a specific item
router.route('/item/:itemType/:itemId')
  /**
   * @swagger
   * /api/reviews/item/{itemType}/{itemId}:
   *   get:
   *     summary: Get reviews for a specific item (product, service, shop, tutorial)
   *     tags: [Reviews]
   *     parameters:
   *       - in: path
   *         name: itemType
   *         required: true
   *         schema:
   *           type: string
   *           enum: [Product, Shop, ServiceRecord, Tutorial]
   *         description: Type of the item (Product, Shop, ServiceRecord, Tutorial)
   *       - in: path
   *         name: itemId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the item
   *       - in: query
   *         name: rating[gte]
   *         schema:
   *           type: number
   *         description: Filter by rating greater than or equal to (e.g., rating[gte]=3)
   *       - in: query
   *         name: rating[lte]
   *         schema:
   *           type: number
   *         description: Filter by rating less than or equal to (e.g., rating[lte]=5)
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Sort results by field (e.g., sort=-createdAt)
   *       - in: query
   *         name: select
   *         schema:
   *           type: string
   *         description: Select specific fields to return (e.g., select=rating,comment)
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 10
   *         description: Number of results per page
   *     responses:
   *       200:
   *         description: A list of reviews for the specified item
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 results:
   *                   type: number
   *                 total:
   *                   type: number
   *                 data:
   *                   type: object
   *                   properties:
   *                     reviews:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Review'
   *       404:
   *         description: Item not found
   *       500:
   *         description: Server error
   */
  .get(getReviewsByItem)
  /**
   * @swagger
   * /api/reviews/item/{itemType}/{itemId}:
   *   post:
   *     summary: Create a new review for a specific item
   *     tags: [Reviews]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: itemType
   *         required: true
   *         schema:
   *           type: string
   *           enum: [Product, Shop, ServiceRecord, Tutorial]
   *         description: Type of the item (Product, Shop, ServiceRecord, Tutorial)
   *       - in: path
   *         name: itemId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the item
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - rating
   *               - comment
   *             properties:
   *               rating:
   *                 type: number
   *                 format: float
   *                 minimum: 1
   *                 maximum: 5
   *                 description: The rating given (1-5)
   *               comment:
   *                 type: string
   *                 description: The review comment
   *     responses:
   *       201:
   *         description: Review created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     review:
   *                       $ref: '#/components/schemas/Review'
   *       400:
   *         description: Bad request (e.g., invalid item type, already reviewed)
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Item not found
   *       500:
   *         description: Server error
   */
  .post(protect, createReview);

// Routes for a specific review by ID
router.route('/:id')
  /**
   * @swagger
   * /api/reviews/{id}:
   *   patch:
   *     summary: Update a specific review by ID
   *     tags: [Reviews]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the review to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               rating:
   *                 type: number
   *                 format: float
   *                 minimum: 1
   *                 maximum: 5
   *                 description: The new rating (optional)
   *               comment:
   *                 type: string
   *                 description: The new review comment (optional)
   *     responses:
   *       200:
   *         description: Review updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     review:
   *                       $ref: '#/components/schemas/Review'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Review not found
   *       500:
   *         description: Server error
   */
  .patch(protect, updateReview)
  /**
   * @swagger
   * /api/reviews/{id}:
   *   delete:
   *     summary: Delete a specific review by ID
   *     tags: [Reviews]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the review to delete
   *     responses:
   *       200:
   *         description: Review deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                 data:
   *                   type: null
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Review not found
   *       500:
   *         description: Server error
   */
  .delete(protect, deleteReview);

module.exports = router;