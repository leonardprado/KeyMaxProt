const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String, required: true, unique: true },
    licensePlate: { type: String, required: true, unique: true },
    color: { type: String },
    engine: { type: String },
    transmission: { type: String },
    fuelType: { type: String },
    serviceHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRecord'
    }],
    createdAt: { type: Date, default: Date.now },
    ownership: [{
        _id: false,
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'driver'],
            required: true
        }
    }]
});

vehicleSchema.path('ownership').validate(function(value) {
  const ownerCount = value.filter(own => own.role === 'owner').length;
  return ownerCount <= 1; // Solo permite 0 o 1 'owner'
}, 'Un vehículo solo puede tener un propietario (owner).');

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;