const express = require('express');
const router = express.Router();
const {
  enviarMensaje,
  getMensajesConversacion,
  getConversaciones,
  destacarMensaje,
  archivarConversacion,
  getMensajesNoLeidos,
  eliminarMensaje
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');



// Rutas de mensajes
/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a new message
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageInput'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, enviarMensaje);
/**
 * @swagger
 * /api/messages/conversaciones:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized
 */
router.get('/conversaciones', protect, getConversaciones);
/**
 * @swagger
 * /api/messages/no-leidos:
 *   get:
 *     summary: Get all unread messages for the authenticated user
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of unread messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 */
router.get('/no-leidos', protect, getMensajesNoLeidos);
/**
 * @swagger
 * /api/messages/conversacion/{conversacionId}:
 *   get:
 *     summary: Get messages for a specific conversation
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversacionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to retrieve messages from
 *     responses:
 *       200:
 *         description: A list of messages in the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.get('/conversacion/:conversacionId', protect, getMensajesConversacion);
/**
 * @swagger
 * /api/messages/{id}/destacar:
 *   put:
 *     summary: Mark a message as highlighted/starred
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to highlight
 *     responses:
 *       200:
 *         description: Message highlighted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
router.put('/:id/destacar', protect, destacarMensaje);
/**
 * @swagger
 * /api/messages/conversacion/{id}/archivar:
 *   put:
 *     summary: Archive a conversation
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to archive
 *     responses:
 *       200:
 *         description: Conversation archived successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.put('/conversacion/:id/archivar', protect, archivarConversacion);
/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
router.delete('/:id', protect, eliminarMensaje);

/**
 * @swagger
 * /api/messages/buscar:
 *   get:
 *     summary: Search and filter messages for the authenticated user
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Search term for message subject or content
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Type of message to filter by
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for message search (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for message search (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: A list of messages matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 count: { type: 'number' }
 *                 mensajes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/buscar', async (req, res) => {
  try {
    const { busqueda, tipo, fechaInicio, fechaFin } = req.query;
    let query = {
      $or: [
        { receptor: req.user.id },
        { emisor: req.user.id }
      ]
    };

    if (busqueda) {
      query.$or.push(
        { asunto: { $regex: busqueda, $options: 'i' } },
        { contenido: { $regex: busqueda, $options: 'i' } }
      );
    }

    if (tipo) {
      query.tipo = tipo;
    }

    if (fechaInicio || fechaFin) {
      query.fechaEnvio = {};
      if (fechaInicio) query.fechaEnvio.$gte = new Date(fechaInicio);
      if (fechaFin) query.fechaEnvio.$lte = new Date(fechaFin);
    }

    const mensajes = await Message.find(query)
      .populate('emisor', 'nombre apellido')
      .populate('receptor', 'nombre apellido')
      .sort({ fechaEnvio: -1 });

    res.status(200).json({
      success: true,
      count: mensajes.length,
      mensajes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar mensajes',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/messages/destacados:
 *   get:
 *     summary: Get all highlighted/starred messages for the authenticated user
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of highlighted messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 count: { type: 'number' }
 *                 mensajes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/destacados', async (req, res) => {
  try {
    const mensajesDestacados = await Message.find({
      receptor: req.user.id,
      destacado: true
    })
      .populate('emisor', 'nombre apellido')
      .populate('conversacionId')
      .sort({ fechaEnvio: -1 });

    res.status(200).json({
      success: true,
      count: mensajesDestacados.length,
      mensajes: mensajesDestacados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener mensajes destacados',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/messages/estadisticas:
 *   get:
 *     summary: Get message statistics for the authenticated user
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Message statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 estadisticas:
 *                   type: object
 *                   properties:
 *                     totalEnviados: { type: 'number', description: 'Total messages sent' }
 *                     totalRecibidos: { type: 'number', description: 'Total messages received' }
 *                     noLeidos: { type: 'number', description: 'Total unread messages' }
 *                     destacados: { type: 'number', description: 'Total highlighted messages' }
 *                     porTipo:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id: { type: 'string', description: 'Message type' }
 *                           cantidad: { type: 'number', description: 'Count for the message type' }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/estadisticas', async (req, res) => {
  try {
    const totalEnviados = await Message.countDocuments({ emisor: req.user.id });
    const totalRecibidos = await Message.countDocuments({ receptor: req.user.id });
    const noLeidos = await Message.countDocuments({
      receptor: req.user.id,
      estado: { $ne: 'leido' }
    });
    const destacados = await Message.countDocuments({
      receptor: req.user.id,
      destacado: true
    });

    // Estadísticas por tipo de mensaje
    const estadisticasPorTipo = await Message.aggregate([
      {
        $match: {
          $or: [
            { emisor: req.user._id },
            { receptor: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: '$tipo',
          cantidad: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      estadisticas: {
        totalEnviados,
        totalRecibidos,
        noLeidos,
        destacados,
        porTipo: estadisticasPorTipo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

export default router;