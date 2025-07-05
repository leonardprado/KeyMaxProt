// services/geminiService.ts

// Importar las dependencias necesarias con tipos específicos de la SDK de Google Generative AI para Node.js
// Asegúrate de que esta línea de importación sea la correcta y que todos los tipos existan.
// Si algún tipo específico (como GenerativeModel, Content, Part, GenerationConfig) da error,
// consulta la documentación oficial de la SDK para Node.js para su correcta importación.
import { GoogleGenerativeAI, GenerativeModel, Content, Part, GenerationConfig } from '@google/generative-ai';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// --- Configuración de Gemini ---
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY no está definido en las variables de entorno.");
    throw new Error('GEMINI_API_KEY no está definido. Por favor, configúralo en tus variables de entorno.');
}

// Inicializar el cliente de GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(API_KEY);

// --- Definición de Tipos ---
// Definimos un tipo para los mensajes de la conversación, que es compatible con la estructura de Gemini
interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>; // `parts` es un array, incluso para texto simple
}

// --- Función Principal para obtener respuesta de Gemini ---
/**
 * Obtiene una respuesta de la IA de Google Gemini.
 * @param {string} prompt - La consulta del usuario.
 * @param {GeminiMessage[]} [conversationHistory=[]] - El historial de conversación, en formato esperado por Gemini.
 * @returns {Promise<string>} La respuesta generada por Gemini.
 * @throws {Error} Si la configuración de Gemini está incompleta o si hay un error en la llamada a la API.
 */
const getGeminiResponse = async (
  prompt: string,
  conversationHistory: GeminiMessage[] = []
): Promise<string> => {
    
    try {
        // Seleccionar el modelo. "gemini-1.5-flash-latest" es una buena opción para empezar.
        // `GenerativeModel` es el tipo correcto para el modelo.
        const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // --- Preparar los datos para la llamada a la API ---

        // 1. Formatear el historial de conversación si es necesario.
        // Asegúrate de que `conversationHistory` tenga la estructura `Array<GeminiMessage>`
        // y que cada `GeminiMessage` tenga `role` y `parts`.
        const formattedHistory: Content[] = conversationHistory.map(msg => ({
            role: msg.role,
            parts: msg.parts // Asumimos que msg.parts ya es un array de { text: string }
        }));

        // 2. Preparar el prompt actual del usuario en el formato esperado por Gemini
        const userPromptContent: Content = {
            role: "user",
            parts: [{ text: prompt }] // El texto debe estar dentro de `parts` como un objeto con propiedad `text`
        };

        // 3. Combinar el historial (si existe) con el prompt actual
        // `contents` es un array de `Content` (los mensajes de la conversación)
        const allContents: Content[] = [...formattedHistory, userPromptContent];

        // --- Configuración de Generación Corregida ---
        // Usa `GenerationConfig` y la propiedad `responseMimeType` (camelCase).
        const generateContentConfig: GenerationConfig = {
            responseMimeType: "text/plain", // <-- ¡Aquí está el cambio aplicado!
        };

        // --- Realizar la llamada a la API de Gemini ---
        // `generateContent` espera `contents` y opcionalmente `generationConfig`.
        const result = await model.generateContent({
            contents: allContents,
            generationConfig: generateContentConfig, // Usamos la configuración con el nombre de propiedad correcto
        });

        // --- Extraer el texto de la respuesta de forma segura ---
        // La estructura de respuesta de Gemini es diferente a la de OpenAI.
        // El texto suele estar en `result.response.candidates?.[0]?.content?.parts?.[0]?.text`.
        const candidate = result.response.candidates?.[0]; // Puede ser undefined
        const responseText: string | undefined = candidate?.content?.parts?.[0]?.text;
        
        // Validar que obtuvimos texto y que es un string válido
        if (typeof responseText !== 'string') {
            console.error("Respuesta inesperada de Gemini:", result.response);
            throw new Error("La respuesta de Gemini no contiene el texto esperado o es inválida.");
        }

        return responseText.trim();

    } catch (error: any) { // Tipamos el error como 'any' para capturar errores de la librería o red
        console.error('Error al llamar a la API de Google Gemini:', error);
        // Lanza un error más descriptivo
        throw new Error(`Error de Gemini: ${error.message || 'Ocurrió un problema desconocido.'}`);
    }
};

// --- Exportación Nombrada ---
export { getGeminiResponse };