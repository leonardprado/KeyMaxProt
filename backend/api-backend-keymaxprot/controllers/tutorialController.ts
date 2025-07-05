import { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../models/User';
import Tutorial, { ITutorialDocument } from '../models/Tutorial';
import APIFeatures from '../utils/APIFeatures';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';

// Extiende Request para incluir al usuario autenticado
interface AuthRequest extends Request {
  user: IUserDocument;
}

// @desc    Crear un nuevo tutorial
// @route   POST /api/tutorials
// @access  Private/Admin/Tecnico
export const createTutorial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;

  // Asignamos el ID del usuario autenticado como autor
  const tutorial = await Tutorial.create({
    ...authReq.body,
    user: authReq.user._id,
  });

  res.status(201).json({
    success: true,
    data: tutorial,
  });
});

// @desc    Obtener todos los tutoriales
// @route   GET /api/tutorials
// @access  Public
export const getTutorials = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const features = new APIFeatures(Tutorial.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tutorials = await features.query;

  res.status(200).json({
    success: true,
    count: tutorials.length,
    data: tutorials,
  });
});

// @desc    Obtener un tutorial por ID
// @route   GET /api/tutorials/:id
// @access  Public
export const getTutorial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tutorial = await Tutorial.findById(req.params.id)
    .populate('user', 'name') // poblamos el autor
    .exec() as ITutorialDocument | null;

  if (!tutorial) {
    return next(new ErrorResponse(`Tutorial not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: tutorial,
  });
});

// @desc    Actualizar tutorial
// @route   PUT /api/tutorials/:id
// @access  Private/Admin/Tecnico
export const updateTutorial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;

  let tutorial = await Tutorial.findById(req.params.id).exec() as ITutorialDocument | null;

  if (!tutorial) {
    return next(new ErrorResponse(`Tutorial not found with id ${req.params.id}`, 404));
  }

  // Verifica si el usuario es el autor o tiene permisos
  if (
    tutorial.user.toString() !== authReq.user._id.toString() &&
    authReq.user.role !== 'admin' &&
    authReq.user.role !== 'tecnico'
  ) {
    return next(new ErrorResponse(`User ${authReq.user._id} is not authorized to update this tutorial`, 401));
  }

  tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).exec() as ITutorialDocument;

  res.status(200).json({
    success: true,
    data: tutorial,
  });
});

// @desc    Eliminar un tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private/Admin/Tecnico
export const deleteTutorial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;

  const tutorial = await Tutorial.findById(req.params.id).exec() as ITutorialDocument | null;

  if (!tutorial) {
    return next(new ErrorResponse(`Tutorial not found with id ${req.params.id}`, 404));
  }

  // Verifica si el usuario es el autor o tiene permisos
  if (
    tutorial.user.toString() !== authReq.user._id.toString() &&
    authReq.user.role !== 'admin' &&
    authReq.user.role !== 'tecnico'
  ) {
    return next(new ErrorResponse(`User ${authReq.user._id} is not authorized to delete this tutorial`, 401));
  }

  await tutorial.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
