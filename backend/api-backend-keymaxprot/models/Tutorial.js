const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    enum: [
      'mantenimiento_preventivo',
      'reparacion',
      'mejoras',
      'consejos',
      'seguridad',
      'ahorro_combustible',
      'cuidado_vehicular',
      'emergencias',
      'tecnologia',
      'hogar_comercio'
    ],
    required: true
  },
  nivel: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzado'],
    required: true
  },
  contenido: {
    video: {
      url: String,
      duracion: Number, // en minutos
      plataforma: String // YouTube, Vimeo, etc.
    },
    pasos: [{
      titulo: String,
      descripcion: String,
      imagen: String,
      tiempo: Number, // en minutos
      herramientasNecesarias: [String],
      advertencias: [String]
    }],
    documentosAdjuntos: [{
      nombre: String,
      url: String,
      tipo: String // PDF, DOC, etc.
    }]
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  etiquetas: [String],
  tiempoEstimado: {
    type: Number, // en minutos
    required: true
  },
  dificultad: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  requisitosRecomendados: [{
    descripcion: String,
    obligatorio: Boolean
  }],
  aplicableA: [{
    tipo: String, // tipo de vehículo o propiedad
    marca: String,
    modelo: String,
    año: {
      desde: Number,
      hasta: Number
    }
  }],
  estadisticas: {
    vistas: {
      type: Number,
      default: 0
    },
    completados: {
      type: Number,
      default: 0
    },
    tiempoPromedioFinalizacion: {
      type: Number,
      default: 0
    },
    calificacionPromedio: {
      type: Number,
      default: 0
    }
  },
  comentarios: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    texto: String,
    calificacion: {
      type: Number,
      min: 1,
      max: 5
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    utilidad: {
      votosPositivos: {
        type: Number,
        default: 0
      },
      votosNegativos: {
        type: Number,
        default: 0
      }
    }
  }],
  relacionados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutorial'
  }],
  activo: {
    type: Boolean,
    default: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now
  },
  ultimaActualizacion: Date
}, {
  timestamps: true
});

// Middleware para actualizar estadísticas
TutorialSchema.pre('save', function(next) {
  if (this.isModified('comentarios')) {
    const comentarios = this.comentarios;
    const totalCalificaciones = comentarios.length;
    
    if (totalCalificaciones > 0) {
      const sumaCalificaciones = comentarios.reduce((acc, com) => acc + com.calificacion, 0);
      this.estadisticas.calificacionPromedio = (sumaCalificaciones / totalCalificaciones).toFixed(1);
    }
  }
  
  this.ultimaActualizacion = new Date();
  next();
});

// Método para incrementar vistas
TutorialSchema.methods.incrementarVistas = async function() {
  this.estadisticas.vistas += 1;
  await this.save();
};

// Método para marcar como completado
TutorialSchema.methods.marcarCompletado = async function(tiempoCompletado) {
  this.estadisticas.completados += 1;
  
  // Actualizar tiempo promedio de finalización
  const tiempoActual = this.estadisticas.tiempoPromedioFinalizacion;
  const totalCompletados = this.estadisticas.completados;
  
  this.estadisticas.tiempoPromedioFinalizacion = 
    ((tiempoActual * (totalCompletados - 1)) + tiempoCompletado) / totalCompletados;
  
  await this.save();
};

module.exports = mongoose.model('Tutorial', TutorialSchema);