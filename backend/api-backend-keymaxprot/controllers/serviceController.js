const User = require('../models/User');
const Service = require('../models/Service');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../middleware/asyncHandler');

// Crear nuevo servicio
exports.crearServicio = asyncHandler(async (req, res, next) => {
  // Solo admins y técnicos pueden crear servicios
  if (!['admin', 'tecnico'].includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para crear servicios'
    });
  }

  const servicio = await Service.create({
    ...req.body,
    tecnicos: [req.user.id]
  });

  res.status(201).json({
    success: true,
    servicio
  });
});

// Obtener todos los servicios
exports.getServicios = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Service.find().populate('tecnicos', 'nombre apellido'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const servicios = await features.query;

  res.status(200).json({
    success: true,
    count: servicios.length,
    servicios
  });
});

// Obtener un servicio específico
exports.getServicio = asyncHandler(async (req, res, next) => {
  const servicio = await Service.findById(req.params.id)
    .populate('tecnicos', 'nombre apellido')
    .populate('calificaciones.usuario', 'nombre apellido');

  if (!servicio) {
    return res.status(404).json({
      success: false,
      message: 'Servicio no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    servicio
  });
});

// Actualizar servicio
exports.actualizarServicio = asyncHandler(async (req, res, next) => {
  // Solo admins y técnicos asignados pueden actualizar
  const servicio = await Service.findById(req.params.id);

  if (!servicio) {
    return res.status(404).json({
      success: false,
      message: 'Servicio no encontrado'
    });
  }

  if (req.user.rol !== 'admin' && !servicio.tecnicos.includes(req.user.id)) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para actualizar este servicio'
    });
  }

  const servicioActualizado = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    servicio: servicioActualizado
  });
});

// Eliminar servicio
exports.eliminarServicio = asyncHandler(async (req, res, next) => {
  // Solo admins pueden eliminar servicios
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para eliminar servicios'
    });
  }

  const servicio = await Service.findById(req.params.id);

  if (!servicio) {
    return res.status(404).json({
      success: false,
      message: 'Servicio no encontrado'
    });
  }

  await servicio.remove();

  res.status(200).json({
    success: true,
    message: 'Servicio eliminado correctamente'
  });
});

// Calificar servicio
exports.calificarServicio = asyncHandler(async (req, res, next) => {
  const servicio = await Service.findById(req.params.id);

  if (!servicio) {
    return res.status(404).json({
      success: false,
      message: 'Servicio no encontrado'
    });
  }

  // Verificar si el usuario ya calificó este servicio
  const calificacionExistente = servicio.calificaciones
    .find(cal => cal.usuario.toString() === req.user.id);

  if (calificacionExistente) {
    return res.status(400).json({
      success: false,
      message: 'Ya has calificado este servicio'
    });
  }

  servicio.calificaciones.push({
    usuario: req.user.id,
    puntuacion: req.body.puntuacion,
    comentario: req.body.comentario
  });

  await servicio.save();

  res.status(200).json({
    success: true,
    servicio
  });
});

exports.verificarDisponibilidad = async (req, res) => {
  try {
    console.log('Received service ID:', req.params.id);
    const servicio = await Service.findById(req.params.id);
    console.log('Service found by ID:', servicio ? 'Yes' : 'No');
    
    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    const { date } = req.query;

    // Lógica de ejemplo para generar slots disponibles
    // Esto debería ser más sofisticado y basarse en la disponibilidad real del servicio y técnicos
    const availableSlots = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '12:00', available: true },
      { time: '13:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: false }
    ];

    res.status(200).json({
      success: true,
      slots: availableSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar disponibilidad',
      error: error.message
    });
  }
};

// Asignar técnico
exports.asignarTecnico = async (req, res) => {
  try {
    // Solo admins pueden asignar técnicos
    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para asignar técnicos'
      });
    }

    const servicio = await Service.findById(req.params.id);

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    const tecnico = await User.findById(req.body.tecnicoId);

    if (!tecnico || tecnico.rol !== 'tecnico') {
      return res.status(400).json({
        success: false,
        message: 'Técnico no válido'
      });
    }

    if (!servicio.tecnicos.includes(tecnico._id)) {
      servicio.tecnicos.push(tecnico._id);
      await servicio.save();
    }

    res.status(200).json({
      success: true,
      servicio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al asignar técnico',
      error: error.message
    });
  }
};