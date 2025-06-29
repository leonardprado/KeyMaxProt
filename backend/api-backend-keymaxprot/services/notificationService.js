const admin = require('../config/firebaseAdmin'); // Importa la instancia ya inicializada

/**
 * Envía una notificación push a un dispositivo específico.
 * @param {string} token - El FCM token del dispositivo del usuario.
 * @param {string} title - El título de la notificación.
 * @param {string} body - El cuerpo del mensaje de la notificación.
 * @param {object} data - Datos adicionales para la notificación (opcional).
 */
const sendPushNotification = async (token, title, body, data = {}) => {
  if (!token) {
    console.log('No se encontró FCM token para este usuario. Saltando notificación.');
    return;
  }
  
  const message = {
    notification: {
      title,
      body,
    },
    data,
    token: token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada exitosamente:', response);
  } catch (error) {
    console.error('Error enviando la notificación:', error);
  }
};

module.exports = { sendPushNotification };