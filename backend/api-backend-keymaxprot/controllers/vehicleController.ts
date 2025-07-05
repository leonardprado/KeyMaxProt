// controllers/vehicleController.ts
import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import { MaintenancePlan, User, Vehicle } from '../models/AllModels';
import { IUserDocument } from '../models/User';

import APIFeatures from '../utils/APIFeatures';

interface AuthRequest extends Request {
  user?: IUserDocument;
}
interface IPlan {
  recommended_services: Types.ObjectId[];
}

export const registerVehicle = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  req.body.ownership = [{ user_id: req.user!._id, role: 'owner' }];

  const vehicle = await Vehicle.create(req.body);

  await User.findByIdAndUpdate(req.user!._id, {
    $push: { vehicles: vehicle._id }
  });

  res.status(201).json({
    success: true,
    data: vehicle
  });
});

export const getMyVehicles = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const features = new APIFeatures(
    Vehicle.find({ 'ownership.user_id': req.user!._id }),
    req.query
  ).filter().sort().limitFields().paginate();

  const vehicles = await features.query;

  res.status(200).json({
    success: true,
    count: vehicles.length,
    data: vehicles
  });
});

export const getVehicle = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate('ownership.user_id', 'name email');

  if (!vehicle) {
    return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404));
  }

  const isAuthorized = vehicle.ownership.some(owner =>
    owner.user_id._id.toString() === req.user!._id.toString()
  );

  if (!isAuthorized && req.user!.role !== 'admin') {
    return next(new ErrorResponse('No autorizado para ver este vehículo', 403));
  }

  res.status(200).json({
    success: true,
    data: vehicle
  });
});

export const updateVehicle = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404));
  }

  const owner = vehicle.ownership.find(o => o.role === 'owner');

  if (owner && owner.user_id.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new ErrorResponse('No autorizado para actualizar este vehículo', 401));
  }

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: vehicle
  });
});

export const deleteVehicle = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404));
  }

  const owner = vehicle.ownership.find(o => o.role === 'owner');

  if (owner && owner.user_id.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new ErrorResponse('No autorizado para eliminar este vehículo', 401));
  }

  const userIds = vehicle.ownership.map(o => o.user_id);
  await User.updateMany(
    { _id: { $in: userIds } },
    { $pull: { vehicles: vehicle._id } }
  );

  await vehicle.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

export const getVehicleRecommendations = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404));
  }

  const isAuthorized = vehicle.ownership.some(owner =>
    owner.user_id.toString() === req.user!._id.toString()
  );

  if (!isAuthorized && req.user!.role !== 'admin') {
    return next(new ErrorResponse('No autorizado para ver las recomendaciones de este vehículo', 403));
  }

  const { brand, vehicleModel: model, year, mileage } = vehicle;

  const maintenancePlans = await MaintenancePlan.find({
    brand,
    model,
    year_range: { $regex: `^${year.toString().substring(0, 3)}`, $options: 'i' },
    mileage_interval: { $lte: mileage },
  }).sort({ mileage_interval: -1 });

  let recommendedServices: string[] = [];
  let commonIssues: string[] = [];

  if (maintenancePlans.length > 0) {
    const mostRelevantPlan = maintenancePlans[0];
    let recommendedServices: Types.ObjectId[] = mostRelevantPlan.recommended_services;
    commonIssues = mostRelevantPlan.common_issues;
  }

  res.status(200).json({
    success: true,
    data: {
      recommendedServices,
      commonIssues,
    },
  });
});
