const asyncHandler = require('../middleware/asyncHandler');
const { Shop, Technician } = require('../models/AllModels');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Crear un nuevo perfil de técnico
// @route   POST /api/technicians
// @access  Private (solo usuarios con rol 'tecnico' o 'admin' o 'shop_owner')
exports.createTechnicianProfile = asyncHandler(async (req, res, next) => {
    const { name, specialty, contact, shops, availability } = req.body;
    const user_id = req.user.id; // ID del usuario autenticado

    // Verificar si ya existe un perfil de técnico para este user_id
    const existingTechnician = await Technician.findOne({ user_id });
    if (existingTechnician) {
        return next(new ErrorResponse('Ya existe un perfil de técnico para este usuario', 400));
    }

    // Crear el perfil del técnico
    const technician = await Technician.create({
        user_id,
        name,
        specialty,
        contact,
        shops,
        availability
    });

    // Asociar el técnico a los talleres si se proporcionan
    if (shops && shops.length > 0) {
        for (const shopId of shops) {
            const shop = await Shop.findById(shopId);
            if (shop) {
                shop.technician_ids.push(technician._id);
                await shop.save();
            }
        }
    }

    res.status(201).json({
        success: true,
        data: technician
    });
});

// @desc    Obtener todos los perfiles de técnicos
// @route   GET /api/technicians
// @access  Public
exports.getTechnicians = asyncHandler(async (req, res, next) => {
    const features = new APIFeatures(Technician.find().populate('user_id', 'name email').populate('shops', 'name address'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const technicians = await features.query;

    res.status(200).json({
        success: true,
        count: technicians.length,
        data: technicians
    });
});

// @desc    Obtener un perfil de técnico por ID
// @route   GET /api/technicians/:id
// @access  Public
exports.getTechnician = asyncHandler(async (req, res, next) => {
    const technician = await Technician.findById(req.params.id).populate('user_id', 'name email').populate('shops', 'name address');

    if (!technician) {
        return next(new ErrorResponse(`No se encontró técnico con ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: technician
    });
});

// @desc    Actualizar un perfil de técnico
// @route   PUT /api/technicians/:id
// @access  Private (solo el propio técnico o admin)
exports.updateTechnician = asyncHandler(async (req, res, next) => {
    let technician = await Technician.findById(req.params.id);

    if (!technician) {
        return next(new ErrorResponse(`No se encontró técnico con ID ${req.params.id}`, 404));
    }

    // Asegurarse de que el usuario es el propietario del perfil o un admin
    if (technician.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Usuario ${req.user.id} no autorizado para actualizar este perfil de técnico`, 401));
    }

    // Manejar la actualización de shops
    if (req.body.shops) {
        const oldShops = technician.shops.map(shop => shop.toString());
        const newShops = req.body.shops;

        // Eliminar técnico de talleres antiguos que ya no están asociados
        for (const shopId of oldShops) {
            if (!newShops.includes(shopId)) {
                const shop = await Shop.findById(shopId);
                if (shop) {
                    shop.technician_ids = shop.technician_ids.filter(techId => techId.toString() !== technician._id.toString());
                    await shop.save();
                }
            }
        }

        // Añadir técnico a nuevos talleres
        for (const shopId of newShops) {
            if (!oldShops.includes(shopId)) {
                const shop = await Shop.findById(shopId);
                if (shop) {
                    shop.technician_ids.push(technician._id);
                    await shop.save();
                }
            }
        }
    }

    technician = await Technician.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: technician
    });
});

// @desc    Eliminar un perfil de técnico
// @route   DELETE /api/technicians/:id
// @access  Private (solo el propio técnico o admin)
exports.deleteTechnicianProfile = asyncHandler(async (req, res, next) => {
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
        return next(new ErrorResponse(`No se encontró técnico con ID ${req.params.id}`, 404));
    }

    // Asegurarse de que el usuario es el propietario del perfil o un admin
    if (technician.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Usuario ${req.user.id} no autorizado para eliminar este perfil de técnico`, 401));
    }

    // Eliminar técnico de todos los talleres asociados
    for (const shopId of technician.shops) {
        const shop = await Shop.findById(shopId);
        if (shop) {
            shop.technician_ids = shop.technician_ids.filter(techId => techId.toString() !== technician._id.toString());
            await shop.save();
        }
    }

    await technician.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Obtener técnicos por shopId (rutas anidadas)
// @route   GET /api/shops/:shopId/technicians
// @access  Public
exports.getTechniciansByShop = asyncHandler(async (req, res, next) => {
    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
        return next(new ErrorResponse(`No se encontró taller con ID ${req.params.shopId}`, 404));
    }

    const features = new APIFeatures(Technician.find({ shops: req.params.shopId }).populate('user_id', 'name email').populate('shops', 'name address'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const technicians = await features.query;

    res.status(200).json({
        success: true,
        count: technicians.length,
        data: technicians
    });
});