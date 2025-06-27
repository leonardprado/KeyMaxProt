const express = require('express');
const router = express.Router();
const {
  createTutorial,
  getTutorials,
  getTutorial,
  updateTutorial,
  deleteTutorial,
} = require('../controllers/tutorialController');

const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/tutorials:
 *   post:
 *     summary: Create a new tutorial
 *     tags:
 *       - Tutorials
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorialInput'
 *     responses:
 *       201:
 *         description: Tutorial created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutorial'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user not authorized
 *   get:
 *     summary: Get all tutorials with filtering, sorting, and pagination
 *     tags:
 *       - Tutorials
 *     parameters:
 *       - $ref: '#/components/parameters/filter'
 *       - $ref: '#/components/parameters/sort'
 *       - $ref: '#/components/parameters/select'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: A list of tutorials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 count: { type: 'number' }
 *                 pagination: { type: 'object' }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tutorial'
 *       500:
 *         description: Server error
 */
router
  .route('/')
  .post(protect, authorize('admin', 'tecnico'), createTutorial)
  .get(getTutorials);

/**
 * @swagger
 * /api/tutorials/{id}:
 *   get:
 *     summary: Get a single tutorial by ID
 *     tags:
 *       - Tutorials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tutorial to retrieve
 *     responses:
 *       200:
 *         description: Tutorial details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutorial'
 *       404:
 *         description: Tutorial not found
 *   put:
 *     summary: Update a tutorial by ID
 *     tags:
 *       - Tutorials
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tutorial to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorialInput'
 *     responses:
 *       200:
 *         description: Tutorial updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutorial'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user not authorized
 *       404:
 *         description: Tutorial not found
 *   delete:
 *     summary: Delete a tutorial by ID
 *     tags:
 *       - Tutorials
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tutorial to delete
 *     responses:
 *       200:
 *         description: Tutorial deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user not authorized
 *       404:
 *         description: Tutorial not found
 */
router
  .route('/:id')
  .get(getTutorial)
  .put(protect, authorize('admin', 'tecnico'), updateTutorial)
  .delete(protect, authorize('admin', 'tecnico'), deleteTutorial);

module.exports = router;