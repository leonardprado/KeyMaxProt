const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');

// Generar Token JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Registrar usuario
exports.registro = asyncHandler(async (req, res, next) => {
  const { email, password, nombre, apellido, telefono, direccion } = req.body;

  // Verificar si el usuario ya existe
  const usuarioExistente = await User.findOne({ email });
  if (usuarioExistente) {
    return res.status(400).json({
      success: false,
      message: 'El email ya está registrado'
    });
  }

  // Crear usuario
  const usuario = await User.create({
    email,
    password,
    nombre,
    apellido,
    telefono,
    direccion
  });

  // Generar token
  const token = generarToken(usuario._id);

  res.status(201).json({
    success: true,
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol
    }
  });
});

// Login usuario
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validar email y password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Por favor proporcione email y contraseña'
    });
  }

  // Verificar usuario
  const usuario = await User.findOne({ email });
  if (!usuario) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Verificar contraseña
  const passwordCorrecta = await usuario.compararPassword(password);
  if (!passwordCorrecta) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  // Verificar si el usuario está activo
  if (!usuario.activo) {
    return res.status(401).json({
      success: false,
      message: 'Usuario desactivado'
    });
  }

  // Actualizar último acceso
  usuario.ultimoAcceso = new Date();
  await usuario.save();

  // Generar token
  const token = generarToken(usuario._id);

  res.status(200).json({
    success: true,
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol
    }
  });
});

// Obtener perfil del usuario
exports.getPerfil = asyncHandler(async (req, res, next) => {
  const usuario = await User.findById(req.user.id)
    .select('-password')
    .populate('vehiculos')
    .populate('historialServicios');

  res.status(200).json({
    success: true,
    usuario
  });
});

// Actualizar perfil
exports.actualizarPerfil = asyncHandler(async (req, res, next) => {
  const actualizaciones = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    telefono: req.body.telefono,
    direccion: req.body.direccion
  };

  const usuario = await User.findByIdAndUpdate(
    req.user.id,
    actualizaciones,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  res.status(200).json({
    success: true,
    usuario
  });
});

// Cambiar contraseña
exports.cambiarPassword = asyncHandler(async (req, res, next) => {
  const { passwordActual, nuevaPassword } = req.body;

  const usuario = await User.findById(req.user.id);

  // Verificar contraseña actual
  const passwordCorrecta = await usuario.compararPassword(passwordActual);
  if (!passwordCorrecta) {
    return res.status(401).json({
      success: false,
      message: 'Contraseña actual incorrecta'
    });
  }

  // Actualizar contraseña
  usuario.password = nuevaPassword;
  await usuario.save();

  res.status(200).json({
    success: true,
    message: 'Contraseña actualizada correctamente'
  });
});

// Desactivar cuenta
exports.desactivarCuenta = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { activo: false },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Cuenta desactivada correctamente'
  });
});