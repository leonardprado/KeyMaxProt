const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductCategories
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { authorizeProductOwner } = require('../middleware/authzMiddleware');
const Product = require('../models/Product');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering, sorting, and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name (e.g., name=Laptop)
 *       - in: query
 *         name: price[gte]
 *         schema:
 *           type: number
 *         description: Filter by price greater than or equal to (e.g., price[gte]=100)
 *       - in: query
 *         name: price[lte]
 *         schema:
 *           type: number
 *         description: Filter by price less than or equal to (e.g., price[lte]=500)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category (e.g., category=Electronics)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort results by field (e.g., sort=price,-createdAt)
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Select specific fields to return (e.g., select=name,price)
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
 *         description: A list of products
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route('/')
  .post(protect, authorize('shop_owner', 'admin'), createProduct)
  .get(getProducts);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorizeProductOwner, updateProduct)
  .delete(protect, authorizeProductOwner, deleteProduct);

export default router;