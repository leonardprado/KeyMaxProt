const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// Registrar nuevo vehículo
exports.registrarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehicle.create({
      ...req.body,
      propietario: req.user.id
    });

    // Añadir vehículo a la lista de vehículos del usuario
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { vehiculos: vehiculo._id } }
    );

    res.status(201).json({
      success: true,
      vehiculo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar vehículo',
      error: error.message
    });
  }
};

// Obtener todos los vehículos del usuario
exports.getVehiculosUsuario = async (req, res) => {
  try {
    const vehiculos = await Vehicle.find({ propietario: req.user.id });

    res.status(200).json({
      success: true,
      count: vehiculos.length,
      vehiculos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos',
      error: error.message
    });
  }
};

// Obtener un vehículo específico
exports.getVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehicle.findById(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar propiedad
    if (vehiculo.propietario.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este vehículo'
      });
    }

    res.status(200).json({
      success: true,
      vehiculo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículo',
      error: error.message
    });
  }
};

// Actualizar vehículo
exports.actualizarVehiculo = async (req, res) => {
  try {
    let vehiculo = await Vehicle.findById(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar propiedad
    if (vehiculo.propietario.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este vehículo'
      });
    }

    vehiculo = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      vehiculo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar vehículo',
      error: error.message
    });
  }
};

// Eliminar vehículo
exports.eliminarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehicle.findById(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar propiedad
    if (vehiculo.propietario.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este vehículo'
      });
    }

    // Eliminar referencia del vehículo en el usuario
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { vehiculos: req.params.id } }
    );

    await vehiculo.remove();

    res.status(200).json({
      success: true,
      message: 'Vehículo eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar vehículo',
      error: error.message
    });
  }
};

// Registrar mantenimiento
exports.registrarMantenimiento = async (req, res) => {
  try {
    const vehiculo = await Vehicle.findById(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar propiedad
    if (vehiculo.propietario.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para registrar mantenimiento'
      });
    }

    vehiculo.historialMantenimiento.push(req.body);
    await vehiculo.save();

    res.status(200).json({
      success: true,
      vehiculo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar mantenimiento',
      error: error.message
    });
  }
};

// Programar servicio
exports.programarServicio = async (req, res) => {
  try {
    const vehiculo = await Vehicle.findById(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar propiedad
    if (vehiculo.propietario.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para programar servicio'
      });
    }

    vehiculo.proximosServicios.push(req.body);
    await vehiculo.save();

    res.status(200).json({
      success: true,
      vehiculo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al programar servicio',
      error: error.message
    });
  }
};

// Obtener alertas de mantenimiento
exports.getAlertas = async (req, res) => {
  try {
    const vehiculo = await Vehicle.findById(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar propiedad
    if (vehiculo.propietario.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver alertas'
      });
    }

    const alertas = vehiculo.necesitaMantenimiento();

    res.status(200).json({
      success: true,
      alertas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener alertas',
      error: error.message
    });
  }
};