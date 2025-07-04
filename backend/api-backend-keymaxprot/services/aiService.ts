// backend/api-backend-keymaxprot/services/aiService.js
const OpenAI = require('openai');
require('dotenv').config(); // Asegúrate de que dotenv esté cargado para acceder a process.env

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getAiResponse = async (prompt, conversationHistory = []) => {
    if (!process.env.OPENAI_API_KEY) {
        console.error("Error: OPENAI_API_KEY no está configurado.");
        throw new Error("Configuración de IA incompleta.");
    }

    try {
        // Para una conversación más compleja, usarías el endpoint de chat completions
        // y pasarías el historial y el mensaje actual.
        // Aquí un ejemplo simplificado para una sola llamada:
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // o "gpt-4" u otro modelo disponible
            messages: [
                // Mensaje del sistema para definir el rol del asistente
                { role: "system", content: "Eres un técnico experto en mecánica automotriz, electricidad y electrónica. Responde de forma clara, concisa y útil." },
                // Añadir historial de conversación si lo tienes
                ...conversationHistory,
                // Mensaje del usuario
                { role: "user", content: prompt }
            ],
            max_tokens: 150, // Limita la longitud de la respuesta
            temperature: 0.7, // Controla la creatividad de la respuesta (0.2 para más concisión, 0.8 para más creatividad)
        });

        return completion.choices[0].message.content.trim();

    } catch (error) {
        console.error('Error al llamar a la API de OpenAI:', error);
        throw new Error(`Error de IA: ${error.message}`);
    }
};

module.exports = { getAiResponse };