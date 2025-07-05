// controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import User, { IUserDocument } from '../models/User'; // ✅ Importa correctamente el tipo con métodos
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/asyncHandler';

// --- Tipado extendido para req.user ---
interface AuthRequest extends Request {
  user?: IUserDocument | null;
}

// --- Registro de Usuario ---
exports.register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse('Por favor, proporciona nombre, email y contraseña.', 400));
  }

  const user = await User.create({
    username: name.trim(),
    email: email.toLowerCase().trim(),
    password: password.trim(),
    role,
  });

  sendTokenResponse(user, 201, res);
});

// --- Login de Usuario ---
exports.login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const email = typeof req.body.email === 'string' ? req.body.email.toLowerCase().trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password.trim() : '';

  if (!email || !password) {
    return next(new ErrorResponse('Por favor, proporciona un email y una contraseña', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  sendTokenResponse(user, 200, res);
});

// --- Logout ---
exports.logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

// --- Cambio de Contraseña ---
exports.cambiarPassword = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ErrorResponse('No autorizado.', 401));

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return next(new ErrorResponse('Usuario no encontrado.', 404));

  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) return next(new ErrorResponse('Contraseña actual incorrecta.', 401));

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// --- Obtener Perfil del Usuario Logueado ---
exports.getMe = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ErrorResponse('No autorizado.', 401));

  res.status(200).json({ success: true, data: req.user });
});

// --- Actualizar Perfil del Usuario ---
exports.actualizarPerfil = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ErrorResponse('No autorizado.', 401));

  const { name, lastName, address, phone, email } = req.body;

  if (typeof name === 'string') req.user.profile.name = name.trim();
  if (typeof lastName === 'string') req.user.profile.lastName = lastName.trim();
  if (typeof address === 'string') req.user.profile.address = address.trim();
  if (typeof phone === 'string') req.user.profile.phone = phone.trim();
  if (typeof email === 'string') req.user.email = email.toLowerCase().trim();

  await req.user.save();

  res.status(200).json({ success: true, data: req.user });
});

// --- Desactivar Cuenta de Usuario ---
exports.desactivarCuenta = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ErrorResponse('No autorizado.', 401));

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    { new: true, runValidators: true }
  );

  if (!updatedUser) return next(new ErrorResponse('Usuario no encontrado.', 404));

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: { message: 'Cuenta desactivada exitosamente.' },
  });
});

// --- Función Auxiliar ---
const sendTokenResponse = (user: IUserDocument, statusCode: number, res: Response): void => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '7', 10) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    (options as any).secure = true;
    // (options as any).sameSite = 'none'; // Descomenta si usás cookies cross-site
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};
