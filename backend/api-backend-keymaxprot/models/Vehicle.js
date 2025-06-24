const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipo: {
    type: String,
    enum: ['camion', 'bus', 'auto', 'moto', 'otro'],
    required: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  año: {
    type: Number,
    required: true
  },
  placa: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  kilometraje: {
    type: Number,
    default: 0
  },
  historialMantenimiento: [{
    tipo: String, // preventivo, correctivo, etc.
    descripcion: String,
    fecha: Date,
    kilometraje: Number,
    costo: Number,
    proveedor: String,
    documentos: [String], // URLs de documentos o facturas
    notas: String
  }],
  proximosServicios: [{
    tipo: String,
    descripcion: String,
    fechaProgramada: Date,
    kilometrajeProgramado: Number,
    estado: {
      type: String,
      enum: ['pendiente', 'programado', 'completado', 'cancelado'],
      default: 'pendiente'
    }
  }],
  caracteristicas: {
    motor: String,
    transmision: String,
    combustible: String,
    cilindrada: String,
    color: String,
    vin: String, // Número de chasis
    extras: [String]
  },
  documentos: {
    seguro: {
      numero: String,
      compañia: String,
      fechaVencimiento: Date,
      tipo: String
    },
    tecnicomecanica: {
      fechaVencimiento: Date,
      centro: String,
      resultado: String
    },
    soat: {
      numero: String,
      fechaVencimiento: Date,
      compañia: String
    }
  },
  alertas: [{
    tipo: String,
    mensaje: String,
    fecha: Date,
    estado: {
      type: String,
      enum: ['activa', 'resuelta', 'ignorada'],
      default: 'activa'
    }
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware para actualizar kilometraje automáticamente
VehicleSchema.pre('save', function(next) {
  if (this.isModified('historialMantenimiento')) {
    const ultimoMantenimiento = this.historialMantenimiento
      .sort((a, b) => b.kilometraje - a.kilometraje)[0];
    
    if (ultimoMantenimiento && ultimoMantenimiento.kilometraje > this.kilometraje) {
      this.kilometraje = ultimoMantenimiento.kilometraje;
    }
  }
  next();
});

// Método para verificar si necesita mantenimiento
VehicleSchema.methods.necesitaMantenimiento = function() {
  const alertas = [];
  
  // Verificar documentos vencidos
  const hoy = new Date();
  if (this.documentos.seguro.fechaVencimiento < hoy) {
    alertas.push('Seguro vencido');
  }
  if (this.documentos.tecnicomecanica.fechaVencimiento < hoy) {
    alertas.push('Tecnicomecanica vencida');
  }
  if (this.documentos.soat.fechaVencimiento < hoy) {
    alertas.push('SOAT vencido');
  }
  
  // Verificar servicios programados
  this.proximosServicios.forEach(servicio => {
    if (servicio.estado === 'pendiente') {
      if (servicio.fechaProgramada < hoy || 
          (servicio.kilometrajeProgramado && this.kilometraje >= servicio.kilometrajeProgramado)) {
        alertas.push(`Servicio pendiente: ${servicio.tipo}`);
      }
    }
  });
  
  return alertas;
};

module.exports = mongoose.model('Vehicle', VehicleSchema);