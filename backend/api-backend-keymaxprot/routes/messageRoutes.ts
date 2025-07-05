import express, { Request, Response } from 'express';
import { AuthRequest } from '../types/AuthRequest'; // crea este archivo si no lo tienes
import {
  enviarMensaje,
  getMensajesConversacion,
  getConversaciones,
  destacarMensaje,
  archivarConversacion,
  getMensajesNoLeidos,
  eliminarMensaje
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';
import Message from '../models/Message'; // Asegúrate que exista y exporte bien

const router = express.Router();

router.post('/', protect, enviarMensaje);
router.get('/conversaciones', protect, getConversaciones);
router.get('/no-leidos', protect, getMensajesNoLeidos);
router.get('/conversacion/:conversacionId', protect, getMensajesConversacion);
router.put('/:id/destacar', protect, destacarMensaje);
router.put('/conversacion/:id/archivar', protect, archivarConversacion);
router.delete('/:id', protect, eliminarMensaje);

router.get('/buscar', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { busqueda, tipo, fechaInicio, fechaFin } = req.query;
    const query: any = {
      $or: [
        { receptor: req.user._id },
        { emisor: req.user._id }
      ]
    };

    if (busqueda) {
      query.$or.push(
        { asunto: { $regex: busqueda, $options: 'i' } },
        { contenido: { $regex: busqueda, $options: 'i' } }
      );
    }

    if (tipo) query.tipo = tipo;
    if (fechaInicio || fechaFin) {
      query.fechaEnvio = {};
      if (fechaInicio) query.fechaEnvio.$gte = new Date(fechaInicio as string);
      if (fechaFin) query.fechaEnvio.$lte = new Date(fechaFin as string);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar mensajes',
      error: error.message
    });
  }
});

router.get('/destacados', protect, async (req: AuthRequest, res: Response) => {
  try {
    const mensajesDestacados = await Message.find({
      receptor: req.user._id,
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener mensajes destacados',
      error: error.message
    });
  }
});

router.get('/estadisticas', protect, async (req: AuthRequest, res: Response) => {
  try {
    const totalEnviados = await Message.countDocuments({ emisor: req.user._id });
    const totalRecibidos = await Message.countDocuments({ receptor: req.user._id });
    const noLeidos = await Message.countDocuments({
      receptor: req.user._id,
      estado: { $ne: 'leido' }
    });
    const destacados = await Message.countDocuments({
      receptor: req.user._id,
      destacado: true
    });

    const porTipo = await Message.aggregate([
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
        porTipo
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

export default router;
