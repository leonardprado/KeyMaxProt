const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: { type: String, required: true },
    specialty: { type: String },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true }
    },
    shops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }],
    availability: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Technician', technicianSchema);