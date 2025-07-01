// middleware/authMiddleware.js (VERSIÓN FINAL Y UNIFICADA)

const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler'); // Usamos asyncHandler para un código más limpio
const ErrorResponse = require('../utils/errorResponse'); // Usamos nuestra clase de error personalizada

// Importamos todos los modelos que podamos necesitar aquí
const { User, Vehicle, Message } = require('../models/AllModels');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    } 
    // Set token from cookie (opcional, pero útil si lo usas en el futuro)
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('No autorizado para acceder a esta ruta (sin token)', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to the request object
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new ErrorResponse('Usuario no encontrado, token inválido', 401));
        }

        // Aquí puedes añadir verificaciones adicionales si las necesitas en el futuro
        // if (!req.user.activo) {
        //     return next(new ErrorResponse('La cuenta de usuario está desactivada', 401));
        // }

        next();
    } catch (error) {
        return next(new ErrorResponse('No autorizado, token inválido o expirado', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { // He cambiado 'rol' a 'role' para que coincida con tu esquema
            return next(new ErrorResponse(`El rol de usuario '${req.user.role}' no está autorizado para acceder a esta ruta`, 403));
        }
        next();
    };
};

// Middleware para verificar propiedad de vehículo
exports.checkVehicleOwnership = asyncHandler(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id); // Asumo que el ID viene como :id

    if (!vehicle) {
        return next(new ErrorResponse(`Vehículo no encontrado con id ${req.params.id}`, 404));
    }

    // Encontrar el 'owner' en el array de ownership
    const ownerInfo = vehicle.ownership.find(o => o.role === 'owner');

    // Verificar si el usuario es el propietario
    if (!ownerInfo || (ownerInfo.user_id.toString() !== req.user.id && req.user.role !== 'admin')) {
        return next(new ErrorResponse('No autorizado para realizar acciones en este vehículo', 403));
    }
    
    req.vehicle = vehicle;
    next();
});

// Aquí puedes añadir el checkMessageAccess si lo necesitas, siguiendo el mismo patrón