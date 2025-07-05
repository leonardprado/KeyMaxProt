// models/Appointment.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Appointment ---
// Esta interfaz representa los datos de una cita. No extiende `Document` directamente.
export interface IAppointment { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // Referencia al usuario
  technician?: mongoose.Types.ObjectId | null; // Referencia opcional al técnico
  shop?: mongoose.Types.ObjectId | null;       // Referencia opcional al taller
  vehicle: mongoose.Types.ObjectId;           // Referencia al vehículo
  serviceType: string;                       // Tipo de servicio (ej. "Mantenimiento", "Reparación")
  dateTime: Date;                            // Fecha y hora de la cita
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; // Estado de la cita
  notes?: string;                            // Notas opcionales
  createdAt: Date;                           // Fecha de creación (si no usas timestamps: true)
  updatedAt: Date;                           // Fecha de última actualización (si no usas timestamps: true)
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IAppointment
const appointmentSchema = new mongoose.Schema<IAppointment>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea correcto
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician', // Asegúrate que el ref sea correcto
    required: false, // Permitimos que sea null
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop', // Asegúrate que el ref sea correcto
    required: false, // Permitimos que sea null
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle', // Asegúrate que el ref sea correcto
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
    trim: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
  // Si no, el schema y la interfaz deben definirlos, y podrías necesitar un hook `pre('save')` para `updatedAt`.
  // Como tus campos `createdAt` y `updatedAt` ya están definidos con `default`,
  // el `timestamps: true` es opcional aquí, pero más limpio si se quiere automatizar `updatedAt`.
  // Si prefieres que el hook `pre('save')` se encargue de `updatedAt`, mantenlo y asegúrate de que el hook esté tipado.
});

// --- Hook `pre('save')` para `updatedAt` ---
// Necesario si `timestamps: true` no está habilitado en las opciones del schema.
// Tipamos `next` para TypeScript.
appointmentSchema.pre('save', function(next: mongoose.HookNextFunction) {
  // Actualiza `updatedAt` solo si el documento es nuevo o si este campo se modificó explícitamente.
  // Es más seguro actualizarlo siempre en el `save` si no usas `timestamps: true`.
  this.updatedAt = new Date(); 
  next();
});

// --- Define el Tipo del Modelo Mongoose ---
export type AppointmentModel = Model<IAppointment>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IAppointment y el tipo del modelo AppointmentModel.
const Appointment = mongoose.model<IAppointment, AppointmentModel>('Appointment', appointmentSchema);

export default Appointment; // Exportación por defecto del modelo

