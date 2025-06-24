const express = require('express');
const router = express.Router();
const { 
  registro, 
  login, 
  getPerfil, 
  actualizarPerfil, 
  cambiarPassword, 
  desactivarCuenta 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Rutas protegidas
router.use(protect); // Middleware de autenticación para las siguientes rutas

router.get('/perfil', getPerfil);
router.put('/perfil', actualizarPerfil);
router.put('/cambiar-password', cambiarPassword);
router.delete('/desactivar', desactivarCuenta);

module.exports = router;