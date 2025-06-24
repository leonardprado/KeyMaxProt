const express = require('express');
const router = express.Router();
const {
  crearTutorial,
  getTutoriales,
  getTutorial,
  actualizarTutorial,
  eliminarTutorial,
  agregarComentario,
  marcarCompletado,
  votarComentario
} = require('../controllers/tutorialController');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/', getTutoriales);
router.get('/:id', getTutorial);

// Rutas protegidas
router.use(protect);

// Rutas que requieren autenticación
router.post('/:id/comentarios', agregarComentario);
router.post('/:id/completado', marcarCompletado);
router.post('/:id/comentarios/:comentarioId/votar', votarComentario);

// Rutas para técnicos y administradores
router.post('/', authorize('admin', 'tecnico'), crearTutorial);
router.put('/:id', authorize('admin', 'tecnico'), actualizarTutorial);
router.delete('/:id', authorize('admin', 'tecnico'), eliminarTutorial);

// Rutas adicionales
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const tutoriales = await Tutorial.find({ 
      categoria: req.params.categoria,
      activo: true 
    })
    .populate('autor', 'nombre apellido')
    .sort({ fechaPublicacion: -1 });

    res.status(200).json({
      success: true,
      count: tutoriales.length,
      tutoriales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tutoriales por categoría',
      error: error.message
    });
  }
});

router.get('/destacados', async (req, res) => {
  try {
    const tutorialesDestacados = await Tutorial.find({ 
      destacado: true,
      activo: true 
    })
    .populate('autor', 'nombre apellido')
    .sort({ 'estadisticas.vistas': -1 })
    .limit(5);

    res.status(200).json({
      success: true,
      count: tutorialesDestacados.length,
      tutoriales: tutorialesDestacados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tutoriales destacados',
      error: error.message
    });
  }
});

router.get('/usuario/:userId/completados', protect, async (req, res) => {
  try {
    // Verificar que el usuario solo pueda ver sus propios tutoriales completados
    if (req.params.userId !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver tutoriales completados de otros usuarios'
      });
    }

    const usuario = await User.findById(req.params.userId)
      .populate({
        path: 'tutorialesVistos',
        select: 'titulo descripcion categoria nivel estadisticas',
        populate: {
          path: 'autor',
          select: 'nombre apellido'
        }
      });

    res.status(200).json({
      success: true,
      count: usuario.tutorialesVistos.length,
      tutoriales: usuario.tutorialesVistos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tutoriales completados',
      error: error.message
    });
  }
});

// Ruta para estadísticas (solo admin)
router.get('/admin/estadisticas', authorize('admin'), async (req, res) => {
  try {
    const estadisticas = await Tutorial.aggregate([
      {
        $group: {
          _id: '$categoria',
          totalTutoriales: { $sum: 1 },
          promedioCalificacion: { $avg: '$estadisticas.calificacionPromedio' },
          totalVistas: { $sum: '$estadisticas.vistas' },
          totalCompletados: { $sum: '$estadisticas.completados' }
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

module.exports = router;