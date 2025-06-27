const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    date: { type: Date, default: Date.now },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCatalog',
        required: true,
    },
    description: { type: String },
    cost: { type: Number },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    productsUsed: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }],
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);