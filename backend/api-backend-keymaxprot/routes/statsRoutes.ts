// routes/statsRoutes.js (VERSIÓN CORREGIDA Y COMPLETA)

const express = require('express');
const router = express.Router();

// Importamos todas las funciones del controlador con los nombres correctos
const { 
    getOverview, 
    getSalesOverTime, 
    getUserRoles, 
    getCategoryDistribution 
} = require('../controllers/statsController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Aplicamos protección de admin a todas las rutas de este archivo
router.use(protect, authorize('admin'));

// Definimos todas las rutas que el frontend necesita
router.route('/overview').get(getOverview);
router.route('/sales-over-time').get(getSalesOverTime); // Ruta para el gráfico de ventas
router.route('/user-roles').get(getUserRoles); // Ruta para el gráfico de roles
router.route('/category-distribution').get(getCategoryDistribution); // Ruta para el gráfico de categorías

export default router;