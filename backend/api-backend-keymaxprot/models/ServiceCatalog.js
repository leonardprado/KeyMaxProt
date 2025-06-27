const mongoose = require('mongoose');

const serviceCatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  default_price: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` field on save
serviceCatalogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ServiceCatalog = mongoose.model('ServiceCatalog', serviceCatalogSchema);

module.exports = ServiceCatalog;