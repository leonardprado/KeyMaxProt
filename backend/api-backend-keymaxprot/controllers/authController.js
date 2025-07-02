const { User } = require('../models/AllModels');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  // --- INICIO DE LA SANITIZACIÓN ---
  // Extraemos los datos del body a variables temporales
  const originalName = req.body.name;
  const originalEmail = req.body.email;
  const originalPassword = req.body.password;
  const role = req.body.role;

  // Creamos nuevas variables limpias y saneadas
  // Usamos .trim() para quitar espacios al principio y al final
  // Usamos .toLowerCase() en el email para estandarizarlo
  const name = originalName ? originalName.trim() : '';
  const email = originalEmail ? originalEmail.toLowerCase().trim() : '';
  const password = originalPassword ? originalPassword.trim() : ''; // ¡Crucial para la comparación!
  // --- FIN DE LA SANITIZACIÓN ---

  try {
    // AHORA, usamos las variables limpias para crear el usuario
    const user = await User.create({
      username: name,
      email: email,
      password: password,
      role: role,
    });

    sendTokenResponse(user, 201, res); // He cambiado el 200 por 201 Created, que es más correcto para un registro
  } catch (error) {
    console.error('Error during user registration:', error);
    // Check for specific Mongoose validation errors or duplicate key errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return next(new ErrorResponse(message, 400));
    } else if (error.code === 11000) {
      const message = 'El usuario o correo electrónico ya existe.';
      return next(new ErrorResponse(message, 400));
    } else {
      return next(new ErrorResponse('Error al registrar usuario.', 500));
    }
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // Limpiamos los datos en cuanto llegan
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  const password = req.body.password ? req.body.password.trim() : '';

  // 1. Validar que el email y la contraseña lleguen
  if (!email || !password) {
    return next(new ErrorResponse('Por favor, proporciona un email y una contraseña', 400));
  }

  // 2. Buscar al usuario en la BD, incluyendo el campo 'password'
  const user = await User.findOne({ email }).select('+password');

  // Si no se encuentra el usuario, las credenciales son inválidas
  if (!user) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // 3. Comparar la contraseña del formulario con el hash de la BD
  const isMatch = await bcrypt.compare(password, user.password);

  // Si no coinciden, las credenciales son inválidas
  if (!isMatch) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // 4. Si todo es correcto, enviar el token
  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Change user password
// @route   PUT /api/auth/cambiar-password
// @access  Private
exports.cambiarPassword = asyncHandler(async (req, res, next) => {
  // Placeholder for changing user password logic
  res.status(200).json({
    success: true,
    message: 'cambiarPassword function placeholder',
  });
});



// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {

  // Create token
  const token = user.getSignedJwtToken();


  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }



  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: user, // Incluir el objeto de usuario en la respuesta
  });

};

// @desc    Update user profile
// @route   PUT /api/auth/perfil
// @access  Private
exports.actualizarPerfil = asyncHandler(async (req, res, next) => {
  // Placeholder for updating user profile logic
  res.status(200).json({
    success: true,
    message: 'actualizarPerfil function placeholder',
  });
});

// @desc    Deactivate user account
// @route   DELETE /api/auth/desactivar
// @access  Private
exports.desactivarCuenta = asyncHandler(async (req, res, next) => {
  // Placeholder for deactivating user account logic
  res.status(200).json({
    success: true,
    message: 'desactivarCuenta function placeholder',
  });
});