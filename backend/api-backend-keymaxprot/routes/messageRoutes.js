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
const { protect } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de mensajes
router.post('/', enviarMensaje);
router.get('/conversaciones', getConversaciones);
router.get('/no-leidos', getMensajesNoLeidos);
router.get('/conversacion/:conversacionId', getMensajesConversacion);
router.put('/:id/destacar', destacarMensaje);
router.put('/conversacion/:id/archivar', archivarConversacion);
router.delete('/:id', eliminarMensaje);

// Rutas adicionales para búsqueda y filtrado
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

// Ruta para mensajes destacados
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

// Ruta para estadísticas de mensajes
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

module.exports = router;