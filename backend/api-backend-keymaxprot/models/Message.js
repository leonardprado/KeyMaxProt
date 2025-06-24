const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  emisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receptor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  asunto: {
    type: String,
    required: true,
    trim: true
  },
  contenido: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['consulta', 'presupuesto', 'soporte', 'general'],
    default: 'general'
  },
  adjuntos: [{
    nombre: String,
    url: String,
    tipo: String, // imagen, documento, etc.
    tamaño: Number // en bytes
  }],
  estado: {
    leido: {
      type: Boolean,
      default: false
    },
    fechaLectura: Date,
    archivado: {
      type: Boolean,
      default: false
    },
    destacado: {
      type: Boolean,
      default: false
    }
  },
  relacionadoCon: {
    tipo: {
      type: String,
      enum: ['vehiculo', 'servicio', 'tutorial', 'orden'],
      required: false
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relacionadoCon.tipo',
      required: false
    }
  },
  respuestaA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  conversacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  metadata: {
    ip: String,
    dispositivo: String,
    ubicacion: String
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
MessageSchema.index({ emisor: 1, receptor: 1 });
MessageSchema.index({ conversacion: 1 });
MessageSchema.index({ 'estado.leido': 1 });
MessageSchema.index({ createdAt: -1 });

// Middleware para manejar la lectura de mensajes
MessageSchema.methods.marcarComoLeido = async function() {
  if (!this.estado.leido) {
    this.estado.leido = true;
    this.estado.fechaLectura = new Date();
    await this.save();
  }
};

// Método para archivar mensaje
MessageSchema.methods.archivar = async function() {
  this.estado.archivado = true;
  await this.save();
};

// Método para destacar mensaje
MessageSchema.methods.destacar = async function() {
  this.estado.destacado = !this.estado.destacado;
  await this.save();
};

// Método para obtener la cadena de respuestas
MessageSchema.methods.obtenerCadenaRespuestas = async function() {
  let cadena = [this];
  let mensajeActual = this;

  while (mensajeActual.respuestaA) {
    mensajeActual = await this.model('Message').findById(mensajeActual.respuestaA);
    if (mensajeActual) {
      cadena.unshift(mensajeActual);
    } else {
      break;
    }
  }

  return cadena;
};

module.exports = mongoose.model('Message', MessageSchema);