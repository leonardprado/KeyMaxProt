const mongoose = require('mongoose');

const MaintenancePlanSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  year_range: {
    type: String, // e.g., "2018-2022"
    required: true,
    trim: true,
  },
  mileage_interval: {
    type: Number, // e.g., 10000, 20000
    required: true,
  },
  recommended_services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCatalog', // Assuming a ServiceCatalog model exists
    },
  ],
  common_issues: [
    {
      type: String,
      trim: true,
    },
  ],
});

module.exports = mongoose.model('MaintenancePlan', MaintenancePlanSchema);