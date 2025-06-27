const asyncHandler = require('../middleware/asyncHandler'); // Usaremos un wrapper para no repetir try-catch
const ErrorResponse = require('../utils/errorResponse' );
const Shop = require('../models/Shop' );
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/User'); // Necesitamos el modelo User

// @desc    Crear un nuevo taller
// @route   POST /api/shops
// @access  Private (shop_owner, admin)
exports.createShop = asyncHandler(async  (req, res, next) => {
  // Asignar el dueño del taller desde el usuario logueado
  req.body.owner_id = req.user.id;

  // Verificar si el usuario ya tiene un taller
  const existingShop = await Shop.findOne({ owner_id : req.user.id });
  if  (existingShop) {
    return next(new ErrorResponse('Este usuario ya es dueño de un taller', 400 ));
  }

  const shop = await  Shop.create(req.body);

  // Opcional: Actualizar el rol del usuario a 'shop_owner'
  await User.findByIdAndUpdate(req.user.id, { role: 'shop_owner'  });

  res.status(201 ).json({
    success: true ,
    data : shop
  });
});

// @desc    Obtener todos los talleres
// @route   GET /api/shops
// @access  Public
exports.getShops = asyncHandler(async  (req, res, next) => {
  const features = new APIFeatures(Shop.find().populate('owner_id', 'name'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const shops = await features.query;
  
  res.status(200 ).json({
    success: true ,
    count : shops.length,
    data : shops
  });
});

// @desc    Obtener un solo taller
// @route   GET /api/shops/:id
// @access  Public
exports.getShop = asyncHandler(async  (req, res, next) => {
  const shop = await  Shop.findById(req.params.id)
    .populate('owner_id', 'name email' )
    .populate('offered_services_ids'); // Asumiendo que ahora se llama así

  if  (!shop) {
    return next(new ErrorResponse(`Taller no encontrado con el id ${req.params.id}`, 404 ));
  }
  
  res.status(200 ).json({
    success: true ,
    data : shop
  });
});

// @desc    Actualizar un taller
// @route   PUT /api/shops/:id
// @access  Private (shop_owner, admin)
exports.updateShop = asyncHandler(async  (req, res, next) => {
  let shop = await  Shop.findById(req.params.id);

  if  (!shop) {
    return next(new ErrorResponse(`Taller no encontrado con el id ${req.params.id}`, 404 ));
  }

  // Asegurarse de que el usuario es el dueño del taller o un admin
  if (shop.owner_id.toString() !== req.user.id && req.user.role !== 'admin' ) {
      return next(new ErrorResponse('No autorizado para actualizar este taller', 401 ));
  }

  shop = await  Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true ,
    runValidators: true
  });
  
  res.status(200 ).json({
    success: true ,
    data : shop
  });
});

// @desc    Eliminar un taller
// @route   DELETE /api/shops/:id
// @access  Private (shop_owner, admin)
exports.deleteShop = asyncHandler(async  (req, res, next) => {
  const shop = await  Shop.findById(req.params.id);

  if  (!shop) {
    return next(new ErrorResponse(`Taller no encontrado con el id ${req.params.id}`, 404 ));
  }

  // Asegurarse de que el usuario es el dueño del taller o un admin
  if (shop.owner_id.toString() !== req.user.id && req.user.role !== 'admin' ) {
      return next(new ErrorResponse('No autorizado para eliminar este taller', 401 ));
  }
  
  // Aquí se podría usar el hook pre('remove') para borrar productos asociados, etc. 
  await  shop.remove(); 
  
  res.status(200 ).json({
    success: true ,
    data : {}
  });
});