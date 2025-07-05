// services/notificationService.ts

// Usar `import` es la práctica moderna en TypeScript.
// Si tu tsconfig.json lo permite (y parece que sí al incluir .ts), es preferible.
// Si no, puedes seguir usando `require`.
import admin from '../config/firebaseAdmin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api'; // Importar tipo de mensaje de Firebase

// --- Definiciones de Tipos ---

// Define un tipo para los datos adicionales de la notificación
// FCM espera que los valores de 'data' sean strings.
interface NotificationData {
  [key: string]: string;
}

// Tipamos los parámetros de la función de manera explícita
const sendPushNotification = async (
  token: string | null | undefined, // El token puede ser nulo o indefinido
  title: string,
  body: string,
  data: NotificationData = {} // Valor por defecto es un objeto vacío de tipo NotificationData
): Promise<void> => { // La función no devuelve nada explícitamente
  
  // 1. Validación: Verificar si el token es válido antes de continuar
  if (!token) {
    console.log('No se encontró FCM token para este usuario. Saltando notificación.');
    return;
  }

  // 2. Preparación del mensaje
  // Firebase Admin SDK tiene tipos específicos para el mensaje.
  // Usar estos tipos mejora la robustez y la autocompletación.
  const message: Message = {
    notification: {
      title: title,
      body: body,
    },
    data: data, // Los datos adicionales deben ser strings en FCM
    token: token, // El token del dispositivo
  };

  // 3. Envío de la notificación
  try {
    const response = await admin.messaging().send(message);
    console.log(`Notificación enviada exitosamente a ${token}:`, response);
  } catch (error: any) { // Usamos 'any' para el error genérico, o un tipo específico si se conoce
    console.error(`Error enviando notificación a ${token}:`, error);

    // --- Mejoras en el Manejo de Errores ---
    // Es común que los tokens FCM expiren o sean inválidos.
    // Si Firebase devuelve un código de error específico para token inválido,
    // podrías querer eliminar ese token del usuario en tu base de datos.
    // Ejemplo (esto depende de la estructura exacta del error de Firebase):
    // if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
    //   console.warn(`Token inválido (${token}) para el usuario. Considera eliminarlo.`);
    //   // Aquí iría la lógica para actualizar tu modelo User y eliminar el fcm_token
    //   // await updateUserFcmToken(userId, null); // Necesitarías pasar el userId aquí
    // }
  }
};

// --- Exportación ---
// Si tu tsconfig.json está configurado para ES Modules (`"module": "ESNext"` o similar),
// usa `export` en lugar de `module.exports`.

export { sendPushNotification };

// Si tu tsconfig.json usa CommonJS, usa esto:
// module.exports = { sendPushNotification };