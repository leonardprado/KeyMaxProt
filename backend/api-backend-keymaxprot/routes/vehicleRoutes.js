const express = require('express');
const router = express.Router();
const { 
  registrarVehiculo,
  getVehiculosUsuario,
  getVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
  registrarMantenimiento,
  programarServicio,
  getAlertas
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas base de vehículos
router.route('/')
  .post(registrarVehiculo)
  .get(getVehiculosUsuario);

// Rutas para un vehículo específico
router.route('/:id')
  .get(getVehiculo)
  .put(actualizarVehiculo)
  .delete(eliminarVehiculo);

// Rutas para mantenimiento y servicios
router.post('/:id/mantenimiento', registrarMantenimiento);
router.post('/:id/servicio', programarServicio);
router.get('/:id/alertas', getAlertas);

// Rutas administrativas (solo para admin)
router.get('/admin/todos', authorize('admin'), async (req, res) => {
  try {
    const vehiculos = await Vehicle.find()
      .populate('propietario', 'nombre apellido email');

    res.status(200).json({
      success: true,
      count: vehiculos.length,
      vehiculos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos los vehículos',
      error: error.message
    });
  }
});

module.exports = router;