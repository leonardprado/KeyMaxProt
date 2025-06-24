const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si hay token en el header de autorización
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado para acceder a esta ruta'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        return res.status(401).json({
          success: false,
          message: 'Usuario desactivado'
        });
      }

      // Añadir usuario a la request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en la autenticación',
      error: error.message
    });
  }
};

// Middleware para verificar roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.rol} no está autorizado para acceder a esta ruta`
      });
    }
    next();
  };
};

// Middleware para verificar propiedad de vehículo
exports.checkVehicleOwnership = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    // Verificar si el usuario es el propietario
    if (vehicle.propietario.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para acceder a este vehículo'
      });
    }

    req.vehicle = vehicle;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar propiedad del vehículo',
      error: error.message
    });
  }
};

// Middleware para verificar propiedad de mensaje
exports.checkMessageAccess = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    // Verificar si el usuario es participante del mensaje
    if (message.emisor.toString() !== req.user.id && 
        message.receptor.toString() !== req.user.id && 
        req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para acceder a este mensaje'
      });
    }

    req.message = message;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al verificar acceso al mensaje',
      error: error.message
    });
  }
};