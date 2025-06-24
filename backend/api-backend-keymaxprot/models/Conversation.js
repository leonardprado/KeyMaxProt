const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  tipo: {
    type: String,
    enum: ['directa', 'grupo', 'soporte'],
    default: 'directa'
  },
  titulo: {
    type: String,
    trim: true
  },
  ultimoMensaje: {
    contenido: String,
    fecha: Date,
    emisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  metadata: {
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fechaCreacion: {
      type: Date,
      default: Date.now
    },
    activa: {
      type: Boolean,
      default: true
    }
  },
  estadisticas: {
    totalMensajes: {
      type: Number,
      default: 0
    },
    mensajesNoLeidos: {
      type: Map,
      of: Number,
      default: new Map()
    },
    ultimaActividad: Date
  },
  configuracion: {
    notificaciones: {
      type: Map,
      of: Boolean,
      default: new Map()
    },
    silenciada: {
      type: Map,
      of: Boolean,
      default: new Map()
    },
    destacada: {
      type: Map,
      of: Boolean,
      default: new Map()
    }
  },
  etiquetas: [String],
  archivada: {
    type: Map,
    of: Boolean,
    default: new Map()
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
ConversationSchema.index({ participantes: 1 });
ConversationSchema.index({ 'metadata.fechaCreacion': -1 });
ConversationSchema.index({ 'estadisticas.ultimaActividad': -1 });

// Middleware para actualizar estadísticas cuando se añade un mensaje
ConversationSchema.methods.actualizarEstadisticas = async function(mensaje) {
  this.estadisticas.totalMensajes += 1;
  this.estadisticas.ultimaActividad = new Date();
  
  // Actualizar último mensaje
  this.ultimoMensaje = {
    contenido: mensaje.contenido,
    fecha: mensaje.createdAt,
    emisor: mensaje.emisor
  };
  
  // Incrementar contador de mensajes no leídos para todos excepto el emisor
  this.participantes.forEach(participanteId => {
    if (!participanteId.equals(mensaje.emisor)) {
      const contadorActual = this.estadisticas.mensajesNoLeidos.get(participanteId.toString()) || 0;
      this.estadisticas.mensajesNoLeidos.set(participanteId.toString(), contadorActual + 1);
    }
  });
  
  await this.save();
};

// Método para marcar mensajes como leídos
ConversationSchema.methods.marcarComoLeido = async function(usuarioId) {
  this.estadisticas.mensajesNoLeidos.set(usuarioId.toString(), 0);
  await this.save();
};

// Método para gestionar configuración de usuario
ConversationSchema.methods.actualizarConfiguracionUsuario = async function(usuarioId, configuracion) {
  const userId = usuarioId.toString();
  
  if (configuracion.notificaciones !== undefined) {
    this.configuracion.notificaciones.set(userId, configuracion.notificaciones);
  }
  
  if (configuracion.silenciada !== undefined) {
    this.configuracion.silenciada.set(userId, configuracion.silenciada);
  }
  
  if (configuracion.destacada !== undefined) {
    this.configuracion.destacada.set(userId, configuracion.destacada);
  }
  
  if (configuracion.archivada !== undefined) {
    this.archivada.set(userId, configuracion.archivada);
  }
  
  await this.save();
};

// Método para añadir participante
ConversationSchema.methods.añadirParticipante = async function(usuarioId) {
  if (!this.participantes.includes(usuarioId)) {
    this.participantes.push(usuarioId);
    
    // Inicializar configuraciones para el nuevo participante
    const userId = usuarioId.toString();
    this.configuracion.notificaciones.set(userId, true);
    this.configuracion.silenciada.set(userId, false);
    this.configuracion.destacada.set(userId, false);
    this.archivada.set(userId, false);
    this.estadisticas.mensajesNoLeidos.set(userId, 0);
    
    await this.save();
    return true;
  }
  return false;
};

// Método para remover participante
ConversationSchema.methods.removerParticipante = async function(usuarioId) {
  const index = this.participantes.indexOf(usuarioId);
  if (index > -1) {
    this.participantes.splice(index, 1);
    
    // Limpiar configuraciones del participante
    const userId = usuarioId.toString();
    this.configuracion.notificaciones.delete(userId);
    this.configuracion.silenciada.delete(userId);
    this.configuracion.destacada.delete(userId);
    this.archivada.delete(userId);
    this.estadisticas.mensajesNoLeidos.delete(userId);
    
    await this.save();
    return true;
  }
  return false;
};

module.exports = mongoose.model('Conversation', ConversationSchema);