const express = require('express'); 
 const { 
   registerVehicle, 
   getMyVehicles, 
   getVehicle, 
   updateVehicle, 
   deleteVehicle 
 } = require('../controllers/vehicleController'); 
 
 const { protect } = require('../middleware/authMiddleware'); 
 
 const router = express.Router(); 
 
 // Todas las rutas aquí están protegidas, requieren un usuario logueado 
 router.use(protect); 
 
 /**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Register a new vehicle for the authenticated user
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       201:
 *         description: Vehicle registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/')
  .post(registerVehicle); 
 
 /**
 * @swagger
 * /api/vehicles/my-vehicles:
 *   get:
 *     summary: Get all vehicles for the authenticated user
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-vehicles', getMyVehicles); 
 
 /**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID for the authenticated user
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the vehicle to retrieve
 *     responses:
 *       200:
 *         description: Vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 *   put:
 *     summary: Update a vehicle by ID for the authenticated user
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInput'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 *   delete:
 *     summary: Delete a vehicle by ID for the authenticated user
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the vehicle to delete
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 */
router.route('/:id')
  .get(getVehicle)
  .put(updateVehicle)
  .delete(deleteVehicle); 
 
 module.exports = router;