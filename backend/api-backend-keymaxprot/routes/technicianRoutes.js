const express = require('express');
const {
    createTechnicianProfile,
    getTechnicians,
    getTechnician,
    updateTechnician,
    deleteTechnicianProfile,
    getTechniciansByShop
} = require('../controllers/technicianController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Technicians
 *   description: API for managing technicians
 */


router.route('/')
    /**
     * @swagger
     * /api/technicians:
     *   post:
     *     summary: Create a new technician profile
     *     tags: [Technicians]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TechnicianInput'
     *     responses:
     *       201:
     *         description: Technician profile created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Technician'
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    .post(protect, authorize(['tecnico', 'admin', 'shop_owner']), createTechnicianProfile)
    /**
     * @swagger
     * /api/technicians:
     *   get:
     *     summary: Get all technicians
     *     tags: [Technicians]
     *     parameters:
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: Filter by technician name
     *       - in: query
     *         name: specialization
     *         schema:
     *           type: string
     *         description: Filter by technician specialization
     *       - in: query
     *         name: shop
     *         schema:
     *           type: string
     *         description: Filter by shop ID
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *         description: Sort results by field (e.g., sort=-createdAt)
     *       - in: query
     *         name: select
     *         schema:
     *           type: string
     *         description: Select specific fields to return (e.g., select=name,specialization)
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
     *         description: A list of technicians
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
     *                     $ref: '#/components/schemas/Technician'
     *       500:
     *         description: Server error
     */
    .get(getTechnicians);

router.route('/:id')
  .get(getTechnician)
  .put(protect, updateTechnician);

module.exports = router;