const asyncHandler = require('../middleware/asyncHandler'); 
 const ErrorResponse = require('../utils/errorResponse');  
const { MaintenancePlan, User, Vehicle } = require('../models/AllModels');
const APIFeatures = require('../utils/apiFeatures'); 
 
 // @desc    Registrar un nuevo vehículo 
 // @route   POST /api/vehicles 
 // @access  Private 
 exports.registerVehicle = asyncHandler(async (req, res, next) => { 
   // El ownership array se crea con el usuario logueado como 'owner' 
   req.body.ownership = [{ user_id: req.user.id, role: 'owner' }]; 
   
   const vehicle = await Vehicle.create(req.body); 
 
   // Añadir la referencia del vehículo al documento del usuario 
   await User.findByIdAndUpdate(req.user.id, { 
     $push: { vehicle_ids: vehicle._id } 
   }); 
   
   res.status(201).json({ 
     success: true, 
     data: vehicle 
   }); 
 }); 
 
 // @desc    Obtener los vehículos del usuario logueado 
 // @route   GET /api/vehicles/my-vehicles 
 // @access  Private 
 exports.getMyVehicles = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Vehicle.find({ 'ownership.user_id': req.user.id }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const vehicles = await features.query;

  res.status(200).json({
    success: true,
    count: vehicles.length,
    data: vehicles
  });
}); 
 
 // @desc    Obtener detalles de un vehículo específico 
 // @route   GET /api/vehicles/:id 
 // @access  Private 
 exports.getVehicle = asyncHandler(async (req, res, next) => { 
   const vehicle = await Vehicle.findById(req.params.id) 
     .populate('ownership.user_id', 'name email'); 
 
   if (!vehicle) { 
     return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404)); 
   } 
 
   // Verificar si el usuario actual está en la lista de ownership 
   const isAuthorized = vehicle.ownership.some(owner => owner.user_id._id.toString() === req.user.id); 
 
   if (!isAuthorized && req.user.role !== 'admin') { 
       return next(new ErrorResponse('No autorizado para ver este vehículo', 403)); 
   } 
 
   res.status(200).json({ 
     success: true, 
     data: vehicle 
   }); 
 }); 
 
 // @desc    Actualizar un vehículo 
 // @route   PUT /api/vehicles/:id 
 // @access  Private 
 exports.updateVehicle = asyncHandler(async (req, res, next) => { 
   let vehicle = await Vehicle.findById(req.params.id); 
 
   if (!vehicle) { 
     return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404)); 
   } 
 
   // Encontrar el 'owner' del vehículo 
   const owner = vehicle.ownership.find(o => o.role === 'owner'); 
 
   // Verificar si el usuario actual es el 'owner' 
   if (owner.user_id.toString() !== req.user.id && req.user.role !== 'admin') { 
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
 
 // @desc    Eliminar un vehículo 
 // @route   DELETE /api/vehicles/:id 
 // @access  Private 
 exports.deleteVehicle = asyncHandler(async (req, res, next) => { 
   const vehicle = await Vehicle.findById(req.params.id); 
 
   if (!vehicle) { 
     return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404)); 
   } 
 
   const owner = vehicle.ownership.find(o => o.role === 'owner'); 
   
   if (owner.user_id.toString() !== req.user.id && req.user.role !== 'admin') { 
       return next(new ErrorResponse('No autorizado para eliminar este vehículo', 401)); 
   } 
 
   // Quitar la referencia del vehículo del documento de todos los usuarios asociados 
   const userIds = vehicle.ownership.map(o => o.user_id); 
   await User.updateMany( 
     { _id: { $in: userIds } }, 
     { $pull: { vehicle_ids: vehicle._id } } 
   ); 
 
   await vehicle.remove(); 
 
   res.status(200).json({
     success: true,
     data: {}
   });
 });

// @desc    Get maintenance recommendations for a vehicle
// @route   GET /api/vehicles/:id/recommendations
// @access  Private
exports.getVehicleRecommendations = asyncHandler(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new ErrorResponse(`Vehículo no encontrado con el id ${req.params.id}`, 404));
  }

  // Check if the user owns the vehicle or is an admin
  const isAuthorized = vehicle.ownership.some(owner => owner.user_id.toString() === req.user.id);

  if (!isAuthorized && req.user.role !== 'admin') {
    return next(new ErrorResponse('No autorizado para ver las recomendaciones de este vehículo', 403));
  }

  const { brand, model, year, mileage } = vehicle;

  // Find matching maintenance plans
  const maintenancePlans = await MaintenancePlan.find({
    brand: brand,
    model: model,
    year_range: { $regex: `^${year.toString().substring(0, 3)}`, $options: 'i' }, // Match year range (e.g., 201X)
    mileage_interval: { $lte: mileage },
  }).sort({ mileage_interval: -1 });

  let recommendedServices = [];
  let commonIssues = [];

  if (maintenancePlans.length > 0) {
    // Get the most relevant plan based on mileage (the one closest to current mileage without exceeding it)
    const mostRelevantPlan = maintenancePlans[0];
    recommendedServices = mostRelevantPlan.recommended_services;
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
