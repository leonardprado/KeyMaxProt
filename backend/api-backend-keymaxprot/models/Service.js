const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    enum: [
      'cardetailing',
      'pulido_opticas',
      'polarizado',
      'plotter',
      'pintura_llantas',
      'alarmas',
      'cierre_centralizado',
      'luces_led',
      'audio',
      'tableros_electronicos',
      'electricidad_electronica',
      'auxilio_mecanico',
      'hogar_comercio'
    ],
    required: true
  },
  subcategoria: {
    type: String,
    enum: [
      'camiones',
      'buses',
      'autos',
      'motos',
      'casas',
      'comercios'
    ],
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    base: {
      type: Number,
      required: true
    },
    variables: [{
      nombre: String,
      costo: Number,
      descripcion: String
    }]
  },
  duracionEstimada: {
    type: Number, // en minutos
    required: true
  },
  disponibilidad: {
    dias: [{
      type: String,
      enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    }],
    horarios: [{
      inicio: String, // formato HH:mm
      fin: String     // formato HH:mm
    }]
  },
  requisitos: [{
    descripcion: String,
    obligatorio: Boolean
  }],
  incluye: [String],
  noIncluye: [String],
  garantia: {
    duracion: Number, // en días
    descripcion: String,
    condiciones: [String]
  },
  imagenes: [{
    url: String,
    descripcion: String
  }],
  videos: [{
    url: String,
    descripcion: String
  }],
  calificaciones: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    puntuacion: {
      type: Number,
      min: 1,
      max: 5
    },
    comentario: String,
    fecha: {
      type: Date,
      default: Date.now
    }
  }],
  tecnicos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  activo: {
    type: Boolean,
    default: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  programacionesDisponibles: {
    type: Number,
    default: 0 // 0 significa sin límite
  }
}, {
  timestamps: true
});

// Calcular calificación promedio
ServiceSchema.virtual('calificacionPromedio').get(function() {
  if (this.calificaciones.length === 0) return 0;
  
  const suma = this.calificaciones.reduce((acc, cal) => acc + cal.puntuacion, 0);
  return (suma / this.calificaciones.length).toFixed(1);
});

// Verificar disponibilidad
ServiceSchema.methods.verificarDisponibilidad = function(fecha, hora) {
  const diaConsulta = new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long' });
  
  // Verificar si el servicio está disponible ese día
  if (!this.disponibilidad.dias.includes(diaConsulta)) {
    return false;
  }
  
  // Verificar si el horario está dentro de los rangos disponibles
  const horaConsulta = hora.split(':').map(Number);
  return this.disponibilidad.horarios.some(horario => {
    const inicio = horario.inicio.split(':').map(Number);
    const fin = horario.fin.split(':').map(Number);
    
    const horaEnMinutos = horaConsulta[0] * 60 + horaConsulta[1];
    const inicioEnMinutos = inicio[0] * 60 + inicio[1];
    const finEnMinutos = fin[0] * 60 + fin[1];
    
    return horaEnMinutos >= inicioEnMinutos && horaEnMinutos <= finEnMinutos;
  });
};

module.exports = mongoose.model('Service', ServiceSchema);