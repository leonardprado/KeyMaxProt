const cron = require('node-cron');
const User = require('../models/User');
const MaintenancePlan = require('../models/MaintenancePlan');
const { sendPushNotification } = require('../services/notificationService');

const checkAndNotifyMaintenance = async () => {
  console.log('Ejecutando worker de notificaciones de mantenimiento...');
  
  try {
    // 1. Encontrar todos los usuarios que tienen un token de notificación y vehículos asociados.
    const users = await User.find({ 
      fcm_token: { $ne: null },
      'vehicles.0': { $exists: true } // Optimización: solo usuarios con al menos un vehículo
    }).populate('vehicles');

    for (const user of users) {
      for (const vehicle of user.vehicles) {
        // 2. Buscar planes de mantenimiento para el vehículo específico.
        const maintenancePlans = await MaintenancePlan.find({
          brand: vehicle.brand,
          model: vehicle.model,
          // year: vehicle.year // Podrías agregar lógica de rango de años si es necesario
        });

        if (maintenancePlans.length === 0) continue;

        const currentMileage = vehicle.mileage;

        for (const plan of maintenancePlans) {
          // 3. Lógica de notificación por proximidad de kilometraje
          const nextMaintenanceMileage = plan.mileage_intervals
            .sort((a: number, b: number) => a - b) // Asegurar que los intervalos estén ordenados
            .find((interval: number) => interval > currentMileage);

          if (nextMaintenanceMileage && (nextMaintenanceMileage - currentMileage <= 1000)) {
            const title = `Mantenimiento Próximo para tu ${vehicle.brand} ${vehicle.model}`;
            const body = `Hola ${user.profile.name}, tu vehículo está cerca del servicio de los ${nextMaintenanceMileage} km.`;
            await sendPushNotification(user.fcm_token, title, body, { vehicleId: vehicle._id.toString(), type: 'mileage_alert' });
          }

          // 4. Lógica de notificación por problemas comunes basados en el kilometraje
          plan.common_issues.forEach(async (issue: any) => {
            if (currentMileage >= issue.mileage_start && currentMileage <= issue.mileage_end) {
              const title = `Alerta de Posible Problema en tu ${vehicle.brand} ${vehicle.model}`;
              const body = `Al kilometraje actual (${currentMileage} km), tu vehículo podría presentar: ${issue.description}. Te recomendamos una revisión.`;
              await sendPushNotification(user.fcm_token, title, body, { vehicleId: vehicle._id.toString(), type: 'issue_alert' });
            }
          });
        }
      }
    }
  } catch (error) { 
    console.error('Error en el worker de notificaciones de mantenimiento:', error); 
  } 
};

// Programar la tarea para que se ejecute todos los días a las 9:00 AM 
const startMaintenanceNotifier = () => {
  cron.schedule('0 9 * * *', checkAndNotifyMaintenance, {
    scheduled: true, 
    timezone: "America/Argentina/Buenos_Aires" // Ajusta a tu zona horaria 
  }); 
}; 

export default startMaintenanceNotifier;