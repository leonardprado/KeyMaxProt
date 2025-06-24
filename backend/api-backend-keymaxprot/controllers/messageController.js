const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// Crear nuevo mensaje
exports.enviarMensaje = asyncHandler(async (req, res, next) => {
  const { receptorId, asunto, contenido, tipo, entidadRelacionada } = req.body;

  // Verificar si existe una conversación entre los usuarios
  let conversacion = await Conversation.findOne({
    participantes: { $all: [req.user.id, receptorId] }
  });

  // Si no existe conversación, crear una nueva
  if (!conversacion) {
    conversacion = await Conversation.create({
      participantes: [req.user.id, receptorId],
      tipo: 'privada',
      titulo: asunto
    });
  }

  // Crear el mensaje
  const mensaje = await Message.create({
    emisor: req.user.id,
    receptor: receptorId,
    asunto,
    contenido,
    tipo,
    entidadRelacionada,
    conversacionId: conversacion._id
  });

  // Actualizar la conversación
  conversacion.ultimoMensaje = {
    mensaje: mensaje._id,
    fecha: mensaje.fechaEnvio,
    emisor: req.user.id
  };
  await conversacion.save();

  res.status(201).json({
    success: true,
    mensaje
  });
});

// Obtener mensajes de una conversación
exports.getMensajesConversacion = asyncHandler(async (req, res, next) => {
  const { conversacionId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const conversacion = await Conversation.findById(conversacionId);

  // Verificar que el usuario sea participante de la conversación
  if (!conversacion.participantes.includes(req.user.id)) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para ver esta conversación'
    });
  }

  const mensajes = await Message.find({ conversacionId })
    .sort({ fechaEnvio: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('emisor', 'nombre apellido')
    .populate('receptor', 'nombre apellido');

  // Marcar mensajes como leídos
  await Message.updateMany(
    {
      conversacionId,
      receptor: req.user.id,
      estado: { $ne: 'leido' }
    },
    { estado: 'leido' }
  );

  res.status(200).json({
    success: true,
    count: mensajes.length,
    mensajes
  });
});

// Obtener conversaciones del usuario
exports.getConversaciones = asyncHandler(async (req, res, next) => {
  const conversaciones = await Conversation.find({
    participantes: req.user.id
  })
    .populate('participantes', 'nombre apellido')
    .populate('ultimoMensaje.mensaje')
    .sort({ 'ultimoMensaje.fecha': -1 });

  res.status(200).json({
    success: true,
    count: conversaciones.length,
    conversaciones
  });
});

// Marcar mensaje como destacado
exports.destacarMensaje = asyncHandler(async (req, res, next) => {
  const mensaje = await Message.findById(req.params.id);

  if (!mensaje) {
    return res.status(404).json({
      success: false,
      message: 'Mensaje no encontrado'
    });
  }

  // Verificar que el usuario sea el receptor del mensaje
  if (mensaje.receptor.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para destacar este mensaje'
    });
  }

  mensaje.destacado = !mensaje.destacado;
  await mensaje.save();

  res.status(200).json({
    success: true,
    mensaje
  });
});

// Archivar conversación
exports.archivarConversacion = asyncHandler(async (req, res, next) => {
  const conversacion = await Conversation.findById(req.params.id);

  if (!conversacion) {
    return res.status(404).json({
      success: false,
      message: 'Conversación no encontrada'
    });
  }

  // Verificar que el usuario sea participante de la conversación
  if (!conversacion.participantes.includes(req.user.id)) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para archivar esta conversación'
    });
  }

  // Actualizar configuración del usuario
  const configIndex = conversacion.configuracionUsuarios.findIndex(
    config => config.usuario.toString() === req.user.id
  );

  if (configIndex > -1) {
    conversacion.configuracionUsuarios[configIndex].archivada = true;
  } else {
    conversacion.configuracionUsuarios.push({
      usuario: req.user.id,
      archivada: true
    });
  }

  await conversacion.save();

  res.status(200).json({
    success: true,
    message: 'Conversación archivada'
  });
});

// Obtener mensajes no leídos
exports.getMensajesNoLeidos = async (req, res) => {
  try {
    const mensajesNoLeidos = await Message.find({
      receptor: req.user.id,
      estado: { $ne: 'leido' }
    })
      .populate('emisor', 'nombre apellido')
      .populate('conversacionId')
      .sort({ fechaEnvio: -1 });

    res.status(200).json({
      success: true,
      count: mensajesNoLeidos.length,
      mensajes: mensajesNoLeidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener mensajes no leídos',
      error: error.message
    });
  }
};

// Eliminar mensaje
exports.eliminarMensaje = async (req, res) => {
  try {
    const mensaje = await Message.findById(req.params.id);

    if (!mensaje) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    // Verificar que el usuario sea el emisor o receptor del mensaje
    if (![mensaje.emisor.toString(), mensaje.receptor.toString()].includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este mensaje'
      });
    }

    await mensaje.remove();

    res.status(200).json({
      success: true,
      message: 'Mensaje eliminado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar mensaje',
      error: error.message
    });
  }
};