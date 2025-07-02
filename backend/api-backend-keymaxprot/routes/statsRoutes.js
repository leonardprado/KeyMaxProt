const express = require('express');
const router = express.Router();

// Asegúrate de importar todas las funciones que necesitas del controlador
const { getOverview, getSalesOverTime } = require('../controllers/statsController'); 
const { protect, authorize } = require('../middleware/authMiddleware');

// Aplicar los middlewares a TODAS las rutas en este archivo de una sola vez
router.use(protect, authorize('admin'));

// Ahora define las rutas sin tener que repetir los middlewares
router.route('/overview').get(getOverview);
router.route('/sales-over-time').get(getSalesOverTime);
// Aquí añadirás futuras rutas de estadísticas...

module.exports = router;