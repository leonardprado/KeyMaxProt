const cron = require('node-cron');
const Vehicle = require('../models/Vehicle');
const MaintenancePlan = require('../models/MaintenancePlan');
const User = require('../models/User');
const { sendPushNotification } = require('../services/notificationService');

const checkAndNotify = async () => {
  console.log('Ejecutando worker de notificaciones de mantenimiento...');
  
  try {
    const vehicles = await Vehicle.find().populate('ownership.user_id');

    for (const vehicle of vehicles) {
      // Reutilizamos la lógica de búsqueda de recomendaciones 
      const plans = await MaintenancePlan.find({
        brand: vehicle.brand,
        model: vehicle.model,
        // Aquí podrías añadir una lógica para el rango de años si lo tienes 
      });

      if (plans.length === 0) continue; 
      
      const ownerInfo = vehicle.ownership.find(o => o.role === 'owner');
      if (!ownerInfo || !ownerInfo.user_id) continue; 
      
      const user = ownerInfo.user_id; 

      for (const plan of plans) {
        // Lógica para determinar si una notificación es necesaria 
        // Ejemplo: notificar si está dentro de los 1000 km del próximo intervalo 
        const mileageDifference = plan.mileage_intervals[0] - vehicle.mileage; // Asumiendo que el primer intervalo es el relevante

        if (mileageDifference > 0 && mileageDifference <= 1000) { 
          const title = `¡Mantenimiento a la vista para tu ${vehicle.brand} ${vehicle.model}!`; 
          const body = `Hola ${user.profile.name}, te estás acercando al servicio de los ${plan.mileage_intervals[0]} km. ¡No te olvides de agendar un turno!`; 
          
          // Enviar la notificación 
          await sendPushNotification(user.fcm_token, title, body);
        } 
      } 
    } 
  } catch (error) { 
    console.error('Error en el worker de notificaciones:', error); 
  } 
};

// Programar la tarea para que se ejecute todos los días a las 9:00 AM 
const startMaintenanceNotifier = () => {
  cron.schedule('0 9 * * *', checkAndNotify, {
    scheduled: true, 
    timezone: "America/Argentina/Buenos_Aires" // Ajusta a tu zona horaria 
  }); 

  console.log('-> Notificador de mantenimiento programado para ejecutarse todos los días a las 9:00 AM.'); 
}; 

module.exports = startMaintenanceNotifier;