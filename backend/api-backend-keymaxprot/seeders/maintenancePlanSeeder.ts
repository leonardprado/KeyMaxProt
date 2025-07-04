const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MaintenancePlan = require('../models/MaintenancePlan');

dotenv.config({ path: __dirname + '/../.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedMaintenancePlans = async () => {
  await connectDB();

  try {
    await MaintenancePlan.deleteMany(); // Clear existing data

    const maintenancePlans = [
      {
        brand: 'Volkswagen',
        model: 'Gol',
        year_range: '2010-2020',
        mileage_interval: 10000,
        recommended_services: [], // Placeholder for service_catalog_id
        common_issues: ['Fallas en bobinas de encendido', 'Problemas con el sensor de oxígeno'],
      },
      {
        brand: 'Volkswagen',
        model: 'Gol',
        year_range: '2010-2020',
        mileage_interval: 20000,
        recommended_services: [],
        common_issues: ['Desgaste prematuro de neumáticos', 'Ruido en la suspensión delantera'],
      },
      {
        brand: 'Toyota',
        model: 'Hilux',
        year_range: '2015-2023',
        mileage_interval: 10000,
        recommended_services: [],
        common_issues: ['Problemas con el sistema de inyección', 'Fallas en el embrague'],
      },
      {
        brand: 'Toyota',
        model: 'Hilux',
        year_range: '2015-2023',
        mileage_interval: 30000,
        recommended_services: [],
        common_issues: ['Desgaste de frenos', 'Problemas con la dirección asistida'],
      },
      {
        brand: 'Fiat',
        model: 'Cronos',
        year_range: '2018-2023',
        mileage_interval: 10000,
        recommended_services: [],
        common_issues: ['Fallas en el sistema eléctrico', 'Problemas con la caja de cambios'],
      },
      {
        brand: 'Fiat',
        model: 'Cronos',
        year_range: '2018-2023',
        mileage_interval: 20000,
        recommended_services: [],
        common_issues: ['Consumo excesivo de aceite', 'Ruidos en el motor'],
      },
    ];

    await MaintenancePlan.insertMany(maintenancePlans);
    console.log('Maintenance plans seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding maintenance plans:', error);
    process.exit(1);
  }
};

seedMaintenancePlans();