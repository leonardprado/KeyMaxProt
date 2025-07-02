const express = require('express');
const router = express.Router();
const {
  crearServicio,
  getServicios,
  getServicio,
  actualizarServicio,
  eliminarServicio,
  calificarServicio,
  verificarDisponibilidad,
  asignarTecnico,
  getServiceCategories
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rutas públicas
/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API for managing services
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services with filtering, sorting, and pagination
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by service name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by service category
 *       - in: query
 *         name: price[gte]
 *         schema:
 *           type: number
 *         description: Filter by price greater than or equal to
 *       - in: query
 *         name: price[lte]
 *         schema:
 *           type: number
 *         description: Filter by price less than or equal to
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
 *         description: A list of services
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
 *                     $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get('/', getServicios);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a single service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getServicio);

/**
 * @swagger
 * /api/services/{id}/disponibilidad:
 *   get:
 *     summary: Check service availability
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 available:
 *                   type: boolean
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get('/:id/disponibilidad', verificarDisponibilidad);

router.get('/categories', getServiceCategories);

// Rutas protegidas que requieren autenticación y/o autorización

/**
 * @swagger
 * /api/services/{id}/calificar:
 *   post:
 *     summary: Rate a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating for the service (1-5)
 *               comment:
 *                 type: string
 *                 description: Optional comment for the rating
 *     responses:
 *       200:
 *         description: Service rated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.post('/:id/calificar', protect, calificarServicio);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service (Admin/Technician only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', protect, authorize('admin'), crearServicio);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service by ID (Admin/Technician only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found
 */
router.put('/:id', protect, authorize('admin'), actualizarServicio);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service by ID (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found
 */
router.delete('/:id', protect, authorize('admin'), eliminarServicio);

/**
 * @swagger
 * /api/services/{id}/tecnicos:
 *   post:
 *     summary: Assign technicians to a service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicians
 *             properties:
 *               technicians:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of technician IDs to assign
 *     responses:
 *       200:
 *         description: Technicians assigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found
 */
router.put('/:id/asignar-tecnico', protect, authorize('admin'), asignarTecnico);

/**
 * @swagger
 * /api/services/admin/estadisticas:
 *   get:
 *     summary: Get service statistics (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 estadisticas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Category name
 *                       totalServicios:
 *                         type: number
 *                         description: Total services in category
 *                       promedioCalificacion:
 *                         type: number
 *                         description: Average rating for category
 *                       serviciosActivos:
 *                         type: number
 *                         description: Number of active services in category
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/admin/estadisticas', authorize('admin'), async (req, res) => {
  try {
    const estadisticas = await Service.aggregate([
      {
        $group: {
          _id: '$categoria',
          totalServicios: { $sum: 1 },
          promedioCalificacion: { $avg: '$calificacionPromedio' },
          serviciosActivos: {
            $sum: { $cond: [{ $eq: ['$activo', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/services/tecnico/{tecnicoId}:
 *   get:
 *     summary: Get services by technician ID (Admin/Technician only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tecnicoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Technician ID
 *     responses:
 *       200:
 *         description: A list of services for the specified technician
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 servicios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Technician not found
 *       500:
 *         description: Server error
 */
router.get('/tecnico/:tecnicoId', authorize('admin', 'tecnico'), async (req, res) => {
  try {
    // Verificar que el técnico solo pueda ver sus propios servicios
    if (req.user.rol === 'tecnico' && req.params.tecnicoId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver servicios de otros técnicos'
      });
    }

    const servicios = await Service.find({
      tecnicos: req.params.tecnicoId
    }).populate('tecnicos', 'nombre apellido');

    res.status(200).json({
      success: true,
      count: servicios.length,
      servicios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios del técnico',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/services/destacados:
 *   get:
 *     summary: Get featured services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: A list of featured services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 servicios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get('/destacados', async (req, res) => {
  try {
    const serviciosDestacados = await Service.find({ destacado: true })
      .populate('tecnicos', 'nombre apellido')
      .limit(5);

    res.status(200).json({
      success: true,
      count: serviciosDestacados.length,
      servicios: serviciosDestacados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios destacados',
      error: error.message
    });
  }
});

module.exports = router;