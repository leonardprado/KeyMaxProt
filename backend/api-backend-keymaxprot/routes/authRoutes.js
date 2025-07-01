// routes/authRoutes.js

const express = require('express');
const router = express.Router();

const { 
  register, 
  login, 
  logout, 
  getMe, 
  actualizarPerfil, 
  cambiarPassword, 
  desactivarCuenta 
} = require('../controllers/authController');

// ¡VERIFICA ESTA LÍNEA! Asegúrate de que el nombre del archivo es correcto.
// Si tu archivo se llama 'authMiddleware.js', cambia 'auth' por 'authMiddleware'.
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y autorización de usuarios
 */

// ===============================================
// ---          RUTAS PÚBLICAS                 ---
// ===============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                name: { type: string, example: "Leonardo Prado" }
 *                email: { type: string, example: "test@example.com" }
 *                password: { type: string, example: "password123" }
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email, example: "test@example.com" }
 *               password: { type: string, format: password, example: "password123" }
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */
router.post('/login', login);


// ===============================================
// ---          RUTAS PRIVADAS (protegidas)    ---
// ===============================================

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener el perfil del usuario actualmente logueado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente
 *       401:
 *         description: No autorizado
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/perfil:
 *   put:
 *     summary: Actualizar el perfil del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                name: { type: string, example: "Leo Prado" }
 *                lastName: { type: string, example: "Developer" }
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 */
router.put('/perfil', protect, actualizarPerfil);

/**
 * @swagger
 * /api/auth/cambiar-password:
 *   put:
 *     summary: Cambiar la contraseña del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword: { type: string, format: password }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 */
router.put('/cambiar-password', protect, cambiarPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Cerrar la sesión del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.get('/logout', protect, logout);

/**
 * @swagger
 * /api/auth/desactivar:
 *   delete:
 *     summary: Desactivar la cuenta del usuario (acción destructiva)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta desactivada exitosamente
 */
router.delete('/desactivar', protect, desactivarCuenta);


// He eliminado la ruta duplicada /perfil que apuntaba a getMe
// He eliminado las rutas duplicadas sin protección

module.exports = router;