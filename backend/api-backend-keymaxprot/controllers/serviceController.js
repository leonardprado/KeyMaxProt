const Service = require('../models/Service');
const User = require('../models/User');

// Crear nuevo servicio
exports.crearServicio = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear servicio',
      error: error.message
    });
  }
};

// Obtener todos los servicios
exports.getServicios = async (req, res) => {
  try {
    const { categoria, subcategoria, destacado } = req.query;
    let query = {};

    if (categoria) query.categoria = categoria;
    if (subcategoria) query.subcategoria = subcategoria;
    if (destacado) query.destacado = destacado === 'true';

    const servicios = await Service.find(query)
      .populate('tecnicos', 'nombre apellido');

    res.status(200).json({
      success: true,
      count: servicios.length,
      servicios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios',
      error: error.message
    });
  }
};

// Obtener un servicio específico
exports.getServicio = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicio',
      error: error.message
    });
  }
};

// Actualizar servicio
exports.actualizarServicio = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar servicio',
      error: error.message
    });
  }
};

// Eliminar servicio
exports.eliminarServicio = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar servicio',
      error: error.message
    });
  }
};

// Calificar servicio
exports.calificarServicio = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al calificar servicio',
      error: error.message
    });
  }
};

// Verificar disponibilidad
exports.verificarDisponibilidad = async (req, res) => {
  try {
    const servicio = await Service.findById(req.params.id);

    if (!servicio) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    const { fecha, hora } = req.query;
    const disponible = servicio.verificarDisponibilidad(fecha, hora);

    res.status(200).json({
      success: true,
      disponible
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