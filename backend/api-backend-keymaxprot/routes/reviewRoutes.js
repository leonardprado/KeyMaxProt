const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByItem
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route('/').post(protect, createReview);

/**
 * @swagger
 * /api/reviews/item/{itemType}/{itemId}:
 *   get:
 *     summary: Get reviews for a specific item (product, service, etc.)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: itemType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Product, Service, Shop]
 *         description: Type of the item (e.g., Product, Service, Shop)
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
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
router.route('/item/:itemType/:itemId').get(getReviewsByItem);

module.exports = router;