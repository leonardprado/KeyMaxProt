// backend/api-backend-keymaxprot/controllers/aiController.js
const asyncHandler = require('../middleware/asyncHandler');
const { getAiResponse } = require('../services/aiService'); // Importa tu servicio de IA

exports.askAiAgent = asyncHandler(async (req, res, next) => {
    const { prompt } = req.body;

    if (!prompt) {
        return next(new ErrorResponse('No se proporcionó una consulta (prompt).', 400));
    }

    try {
        // Aquí podrías pasar el historial de conversación si lo gestionas
        const aiResponse = await getAiResponse(prompt); 
        
        res.status(200).json({
            success: true,
            response: aiResponse
        });
    } catch (error) {
        // El error ya se maneja en aiService, pero podrías añadir logs aquí
        console.error('Error en el endpoint de IA:', error);
        next(error); // Pasa el error al middleware de errores general
    }
});