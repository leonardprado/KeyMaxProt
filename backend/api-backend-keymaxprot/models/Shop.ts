const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
  offeredServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCatalog',
  }],
    technician_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician'
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    openingHours: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now },
});

shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);