// controllers/aiController.ts 
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';
import { getGeminiResponse } from '../services/geminiService'; 

// ... (resto de las importaciones) ...

exports.askAiAgent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { prompt } = req.body as { prompt: string };

  if (!prompt) {
    return next(new ErrorResponse('No se proporcionó una consulta (prompt).', 400));
  }

  try {
    // --- Llamada corregida ---
    const aiResponse = await getGeminiResponse(prompt); 
    
    res.status(200).json({
      success: true,
      response: aiResponse
    });
  } catch (error: any) { // Tipamos el error aquí también para consistencia
    console.error('Error en el endpoint de IA:', error);
    // Pasamos el error (que ahora puede ser un Error tipado) al middleware
    next(error); 
  }
});