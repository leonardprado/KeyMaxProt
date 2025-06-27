const express = require('express');

const {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop
} = require('../controllers/shopController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: API for managing shops
 */


// Re-route a otros recursos
router.use('/:shopId/technicians', require('./technicianRoutes'));

router.route('/')
  /**
   * @swagger
   * /shops:
   *   post:
   *     summary: Crea un nuevo taller
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Shop'
   *     responses:
   *       201:
   *         description: Taller creado exitosamente
   *       400:
   *         description: Datos inválidos
   *       401:
   *         description: No autorizado (token inválido o rol incorrecto)
   */
  .post(protect, authorize('shop_owner', 'admin'), createShop)
  /**
   * @swagger
   * /shops:
   *   get:
   *     summary: Retorna una lista de todos los talleres
   *     tags: [Shops]
   *     parameters:
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Campo por el cual ordenar (ej. -average_rating para descendente)
   *       - in: query
   *         name: select
   *         schema:
   *           type: string
   *         description: Campos a seleccionar, separados por comas (ej. name,address)
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Número de resultados por página
   *       - in: query
   *         name: city
   *         schema:
   *           type: string
   *         description: Filtrar talleres por ciudad
   *     responses:
   *       200:
   *         description: A list of shops
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
   *                     $ref: '#/components/schemas/Shop'
   *       500:
   *         description: Server error
   */
  .get(getShops);

router.route('/:id')
  /**
   * @swagger
   * /shops/{id}:
   *   get:
   *     summary: Retorna un taller por su ID
   *     tags: [Shops]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del taller a recuperar
   *     responses:
   *       200:
   *         description: Un objeto de taller
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shop'
   *       404:
   *         description: Taller no encontrado
   *       500:
   *         description: Error del servidor
   */
  .get(getShop)
  /**
   * @swagger
   * /shops/{id}:
   *   put:
   *     summary: Actualiza un taller por su ID
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del taller a actualizar
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ShopInput'
   *     responses:
   *       200:
   *         description: Taller actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shop'
   *       400:
   *         description: Datos inválidos
   *       401:
   *         description: No autorizado (token inválido o rol incorrecto)
   *       403:
   *         description: Prohibido (el usuario no tiene permisos)
   *       404:
   *         description: Taller no encontrado
   *       500:
   *         description: Error del servidor
   */
  .put(protect, authorize('shop_owner', 'admin'), updateShop)
  /**
   * @swagger
   * /shops/{id}:
   *   delete:
   *     summary: Elimina un taller por su ID
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del taller a eliminar
   *     responses:
   *       200:
   *         description: Taller eliminado exitosamente
   *       401:
   *         description: No autorizado (token inválido o rol incorrecto)
   *       403:
   *         description: Prohibido (el usuario no tiene permisos)
   *       404:
   *         description: Taller no encontrado
   *       500:
   *         description: Error del servidor
   */
  .delete(protect, authorize('shop_owner', 'admin'), deleteShop);

module.exports = router;