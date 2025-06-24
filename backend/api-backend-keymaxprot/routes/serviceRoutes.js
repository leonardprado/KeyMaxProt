const express = require('express');
const router = express.Router();
const {
  crearServicio,
  getServicios,
  getServicio,
  actualizarServicio,
  eliminarServicio,
  calificarServicio,
  verificarDisponibilidad,
  asignarTecnico
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/', getServicios);
router.get('/:id', getServicio);
router.get('/:id/disponibilidad', verificarDisponibilidad);

// Rutas protegidas
router.use(protect);

// Rutas que requieren autenticación
router.post('/:id/calificar', calificarServicio);

// Rutas para técnicos y administradores
router.post('/', authorize('admin', 'tecnico'), crearServicio);
router.put('/:id', authorize('admin', 'tecnico'), actualizarServicio);

// Rutas exclusivas para administradores
router.delete('/:id', authorize('admin'), eliminarServicio);
router.post('/:id/tecnicos', authorize('admin'), asignarTecnico);

// Rutas adicionales para administración
router.get('/admin/estadisticas', authorize('admin'), async (req, res) => {
  try {
    const estadisticas = await Service.aggregate([
      {
        $group: {
          _id: '$categoria',
          totalServicios: { $sum: 1 },
          promedioCalificacion: { $avg: '$calificacionPromedio' },
          serviciosActivos: {
            $sum: { $cond: [{ $eq: ['$activo', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// Ruta para obtener servicios por técnico
router.get('/tecnico/:tecnicoId', authorize('admin', 'tecnico'), async (req, res) => {
  try {
    // Verificar que el técnico solo pueda ver sus propios servicios
    if (req.user.rol === 'tecnico' && req.params.tecnicoId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver servicios de otros técnicos'
      });
    }

    const servicios = await Service.find({
      tecnicos: req.params.tecnicoId
    }).populate('tecnicos', 'nombre apellido');

    res.status(200).json({
      success: true,
      count: servicios.length,
      servicios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios del técnico',
      error: error.message
    });
  }
});

// Ruta para servicios destacados
router.get('/destacados', async (req, res) => {
  try {
    const serviciosDestacados = await Service.find({ destacado: true })
      .populate('tecnicos', 'nombre apellido')
      .limit(5);

    res.status(200).json({
      success: true,
      count: serviciosDestacados.length,
      servicios: serviciosDestacados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios destacados',
      error: error.message
    });
  }
});

module.exports = router;