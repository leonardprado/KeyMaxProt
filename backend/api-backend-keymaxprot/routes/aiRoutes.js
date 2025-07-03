// backend/api-backend-keymaxprot/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { askAiAgent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware'); // Protege la ruta si solo usuarios autenticados pueden consultarla

router.post('/ask', protect, askAiAgent); // Ruta para hacer consultas

module.exports = router;