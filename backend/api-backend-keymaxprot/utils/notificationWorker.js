const cron = require('node-cron');
const { sendPushNotification } = require('../services/notificationService');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const MaintenancePlan = require('../models/MaintenancePlan');



// Tarea programada para verificar mantenimientos y enviar notificaciones
const startNotificationWorker = () => {
    // Se ejecuta una vez al día a la 1:00 AM
    cron.schedule('0 1 * * *', async () => {
        console.log('Ejecutando worker de notificaciones...');
        const users = await User.find({ fcm_token: { $ne: null } }).populate('vehicles');

        for (const user of users) {
            for (const vehicle of user.vehicles) {
                // Lógica para determinar si un mantenimiento está próximo o vencido
                // Esto es un ejemplo, la lógica real dependerá de cómo manejes las fechas y el kilometraje
                const maintenancePlans = await MaintenancePlan.find({
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year
                });

                for (const plan of maintenancePlans) {
                    // Ejemplo: Notificar si el próximo mantenimiento es en 1000 km o 1 mes
                    // Aquí deberías comparar el kilometraje actual del vehículo con los intervalos del plan
                    // Y la fecha actual con la fecha del último mantenimiento + el intervalo de tiempo

                    // Lógica de ejemplo: si el vehículo tiene un kilometraje cercano a un intervalo de mantenimiento
                    const currentMileage = vehicle.mileage;
                    const nextMaintenanceMileage = plan.mileage_intervals.find(interval => interval > currentMileage);

                    if (nextMaintenanceMileage && (nextMaintenanceMileage - currentMileage <= 1000)) {
                        const title = `Mantenimiento Próximo para tu ${vehicle.brand} ${vehicle.model}`;
                        const body = `Tu vehículo está cerca de necesitar el mantenimiento de los ${nextMaintenanceMileage} km.`;
                        sendPushNotification(user.fcm_token, title, body, { vehicleId: vehicle._id.toString(), type: 'mileage_alert' });
                    }

                    // Lógica de ejemplo: si hay problemas comunes asociados al kilometraje actual
                    plan.common_issues.forEach(issue => {
                        if (currentMileage >= issue.mileage_start && currentMileage <= issue.mileage_end) {
                            const title = `Posible Problema en tu ${vehicle.brand} ${vehicle.model}`;
                            const body = `A los ${currentMileage} km, tu vehículo podría presentar: ${issue.description}.`;
                            sendPushNotification(user.fcm_token, title, body, { vehicleId: vehicle._id.toString(), type: 'issue_alert' });
                        }
                    });
                }
            }
        }
    }, {
        scheduled: true,
        timezone: "America/Argentina/Buenos_Aires" // Ajusta a tu zona horaria
    });
};

module.exports = startNotificationWorker;