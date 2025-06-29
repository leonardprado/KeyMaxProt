const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, añade un título a tu pregunta.'],
    trim: true,
    maxlength: [150, 'El título no puede tener más de 150 caracteres.']
  },
  content: {
    type: String,
    required: [true, 'Por favor, describe tu problema o pregunta.']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  // Opcional pero muy útil: asociar la pregunta a un vehículo específico del usuario
  vehicle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle'
  },
  tags: [String], // Ej: ['frenos', 'ruido', 'vw-golf']
  isClosed: { // Para marcar un tema como resuelto
    type: Boolean,
    default: false
  },
  // Contadores para un acceso rápido
  postCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Thread', ThreadSchema);