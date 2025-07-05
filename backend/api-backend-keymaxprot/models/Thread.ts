// models/Thread.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Thread ---
// La interfaz se define y se exporta directamente.
export interface IThread extends Document<any, {}, { [key: string]: any }> { // Extendemos Document para Mongoose
  _id?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  user: mongoose.Types.ObjectId; // Referencia al usuario
  vehicle?: mongoose.Types.ObjectId; // Referencia opcional al vehículo
  tags: string[];
  isClosed: boolean;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IThread
const ThreadSchema = new mongoose.Schema<IThread>({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea correcto
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle' // Asegúrate que el ref sea correcto
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isClosed: {
    type: Boolean,
    default: false
  },
  postCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Esto automáticamente manejará createdAt y updatedAt
});

// --- Hook pre-save (Opcional si usas timestamps: true) ---
// Si `timestamps: true` está en las opciones del schema, Mongoose
// maneja `createdAt` y `updatedAt` automáticamente.
// Si no, este hook es necesario para `updatedAt`.
// tutorialSchema.pre('save', function(next: mongoose.HookNextFunction) { // Para `pre('save')`
//   this.updatedAt = new Date();
//   next();
// });

// --- Define el Tipo del Modelo Mongoose ---
export type ThreadModel = Model<IThread>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IThread y el tipo del modelo ThreadModel.
const Thread = mongoose.model<IThread, ThreadModel>('Thread', ThreadSchema);

export default Thread; // Exportación por defecto del modelo

