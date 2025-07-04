const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API for global search functionality
 */

router.route('/')
  /**
   * @swagger
   * /api/search:
   *   get:
   *     summary: Perform a global search across products, services, and posts
   *     tags: [Search]
   *     parameters:
   *       - in: query
   *         name: query
   *         required: true
   *         schema:
   *           type: string
   *         description: The search term
   *     responses:
   *       200:
   *         description: Search results
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     products:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Product'
   *                     services:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/ServiceCatalog'
   *                     posts:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Post'
   *       400:
   *         description: Bad request (e.g., missing query)
   *       500:
   *         description: Server error
   */
  .get(globalSearch);

export default router;