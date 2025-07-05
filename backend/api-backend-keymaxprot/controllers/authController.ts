// controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
// ¡Importa IUser explícitamente desde el modelo User!
import User, { IUser } from '../models/User'; // <-- Asegúrate que IUser se exporta desde User.ts
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken'; 

// --- Tipado para la Request con `user` adjunto ---
// Definimos la interfaz `AuthRequest` localmente para tipar `req` en nuestras funciones.
interface AuthRequest extends Request {
    user?: IUser | null; // El usuario adjuntado por el middleware `protect`
}

// --- Registro de Usuario ---
exports.register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const originalName = req.body.name;
  const originalEmail = req.body.email;
  const originalPassword = req.body.password;
  const role = req.body.role;

  const name = typeof originalName === 'string' ? originalName.trim() : '';
  const email = typeof originalEmail === 'string' ? originalEmail.toLowerCase().trim() : '';
  const password = typeof originalPassword === 'string' ? originalPassword.trim() : '';
  
  if (!email || !password || !name) {
      return next(new ErrorResponse('Por favor, proporciona un nombre, email y contraseña válidos.', 400));
  }

  try {
    // Creamos el usuario. Mongoose usará `IUser` para la validación si el schema está bien tipado.
    const user = await User.create({
      username: name,
      email: email,
      password: password, // `bcryptjs` se encargará del hashing en el hook pre('save')
      role: role,
    });

    // `sendTokenResponse` espera el objeto de usuario completo.
    // Si `user.getSignedJwtToken()` falla, se lanzará un error.
    sendTokenResponse(user, 201, res); 

  } catch (error: any) { 
    console.error('Error during user registration:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return next(new ErrorResponse(messages.join(', '), 400));
    } else if (error.code === 11000) { 
      return next(new ErrorResponse('El usuario o correo electrónico ya existe.', 400));
    } else {
      return next(new ErrorResponse('Error al registrar usuario.', 500));
    }
  }
});

// --- Login de Usuario ---
exports.login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const email = typeof req.body.email === 'string' ? req.body.email.toLowerCase().trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password.trim() : '';

  if (!email || !password) {
    return next(new ErrorResponse('Por favor, proporciona un email y una contraseña', 400));
  }

  // `User.findOne({ email }).select('+password')` debería devolver `IUser | null`.
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // `user.comparePassword` es un método de instancia que espera un `string` y devuelve `Promise<boolean>`.
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // Si todo es correcto, enviar el token y la información del usuario.
  sendTokenResponse(user, 200, res);
});

// --- Logout ---
exports.logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// --- Cambio de Contraseña ---
exports.cambiarPassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // `req.user` debe estar presente gracias a `protect`.
  if (!req.user) { // Verificación de seguridad
    return next(new ErrorResponse('No autorizado para cambiar contraseña.', 401));
  }
  
  // `User.findById` busca por el `_id` que viene de `req.user.id`.
  // `select('+password')` es importante para obtener el hash.
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('Usuario no encontrado.', 404));
  }

  // Verificar contraseña actual usando el método de instancia `comparePassword`.
  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('La contraseña actual es incorrecta', 401));
  }

  // Actualizar contraseña. El hook `pre('save')` se encargará del hashing.
  user.password = req.body.newPassword;
  await user.save();

  // Enviar una nueva respuesta con el token actualizado.
  sendTokenResponse(user, 200, res);
});

// --- Obtener Perfil del Usuario Logueado ---
exports.getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // `req.user` ya está adjuntado por `protect`.
  if (!req.user) {
    return next(new ErrorResponse('No autorizado para ver el perfil.', 401));
  }
  
  // `req.user` ya contiene la información del usuario (sin contraseña).
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

// --- Actualizar Perfil del Usuario ---
exports.actualizarPerfil = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // `req.user` debe estar presente gracias a `protect`.
  if (!req.user) {
    return next(new ErrorResponse('No autorizado para actualizar el perfil.', 401));
  }

  // Actualizar campos del perfil. Usar `req.body` y hacer validaciones/sanitizaciones.
  // Es crucial verificar que los campos existan y sean del tipo correcto antes de asignar.
  if (req.body.name && typeof req.body.name === 'string') {
      req.user.profile.name = req.body.name.trim(); // Usar `req.user` y `trim()`
  }
  if (req.body.lastName && typeof req.body.lastName === 'string') {
      req.user.profile.lastName = req.body.lastName.trim();
  }
  if (req.body.address && typeof req.body.address === 'string') {
      req.user.profile.address = req.body.address.trim();
  }
  if (req.body.phone && typeof req.body.phone === 'string') {
      req.user.profile.phone = req.body.phone.trim();
  }

  // Actualizar email si se proporciona y es válido. Considera una validación más robusta.
  if (req.body.email && typeof req.body.email === 'string') {
      req.user.email = req.body.email.toLowerCase().trim();
  }
  
  // Guardar los cambios en la base de datos
  await req.user.save(); // Llamar `save()` en el documento `req.user`

  // Responder con los datos actualizados del usuario
  res.status(200).json({
    success: true,
    data: req.user // Devolver el usuario actualizado
  });
});

// --- Desactivar Cuenta de Usuario ---
exports.desactivarCuenta = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ErrorResponse('No autorizado para desactivar la cuenta.', 401));
  }

  // Encuentra y actualiza el usuario para marcarlo como inactivo.
  // Usar `findByIdAndUpdate` es una buena opción aquí, o actualizar `req.user` y guardarlo.
  // Opción 1: Usando `findByIdAndUpdate` (más directo)
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id, // El ID del usuario actual
    { active: false }, // Campo a actualizar
    { 
      new: true, // Devuelve el documento actualizado
      runValidators: true // Ejecuta las validaciones del schema
    }
  );

  if (!updatedUser) {
      return next(new ErrorResponse('Usuario no encontrado para desactivar la cuenta.', 404));
  }

  // Limpia la cookie del token al cerrar sesión
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: { message: 'Cuenta desactivada exitosamente.' }
  });
});


// --- Función Auxiliar `sendTokenResponse` ---
// Esta función es crucial para el flujo de autenticación. Debe estar correctamente tipada.
const sendTokenResponse = (user: IUser, statusCode: number, res: Response): void => {

  const token = user.getSignedJwtToken();

  // --- Corrección de Opciones de Cookie ---
  // Las opciones para `res.cookie()` provienen de Express, no de jsonwebtoken.
  // Definimos las opciones usando tipos compatibles con la respuesta de Express.
  const options = {
    expires: new Date(
      // `process.env.JWT_COOKIE_EXPIRE!` ya debería estar validado antes de llegar aquí.
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE!, 10) * 24 * 60 * 60 * 1000 
    ),
    httpOnly: true,
    // `secure` y `sameSite` son para producción y se manejan condicionalmente.
    // Estos campos son propiedades de `CookieOptions` de Express.
  };

  // Configuración condicional para entornos de producción
  if (process.env.NODE_ENV === 'production') {
    // `secure: true` es necesario para HTTPS.
    // `sameSite: 'none'` es necesario para cookies cross-site (si el frontend está en otro dominio).
    // Necesitarás añadir `secure` y `sameSite` al tipo `options` si los usas.
    // Para simplificar, los añadimos aquí con aserción si no están en el tipo base.
    (options as any).secure = true; 
    // (options as any).sameSite = 'none'; // Descomentar si aplica
  }

  // --- Llamada a res.cookie() ---
  // `res.cookie` acepta estas opciones. No necesitamos aserción a `jwt.CookieOptions`.
  // Si el tipo `secure` o `sameSite` causa problemas, podrías necesitar definir una interfaz
  // más completa para `options` si `express` no la expone directamente de forma trivial.
  res.cookie('token', token, options).json({ 
    success: true,
    token,
    user: user, 
  });
};