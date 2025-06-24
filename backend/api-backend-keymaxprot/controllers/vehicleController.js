const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// Registrar nuevo vehículo
exports.registrarVehiculo = asyncHandler(async (req, res, next) => {
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
});

// Obtener todos los vehículos del usuario
exports.getVehiculosUsuario = asyncHandler(async (req, res, next) => {
  const vehiculos = await Vehicle.find({ propietario: req.user.id });

  res.status(200).json({
    success: true,
    count: vehiculos.length,
    vehiculos
  });
});

// Obtener un vehículo específico
exports.getVehiculo = asyncHandler(async (req, res, next) => {
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
});

// Actualizar vehículo
exports.actualizarVehiculo = asyncHandler(async (req, res, next) => {
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
});

// Eliminar vehículo
exports.eliminarVehiculo = asyncHandler(async (req, res, next) => {
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
});

// Registrar mantenimiento
exports.registrarMantenimiento = asyncHandler(async (req, res, next) => {
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
});

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