// models/Tutorial.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Tutorial ---
// Debe reflejar todos los campos del schema. No extiende Document directamente.
export interface ITutorial {
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  title: string;
  description: string;
  contentUrl?: string; // Opcional si contentBody está presente
  contentBody?: string; // Opcional si contentUrl está presente
  category: string;
  user: mongoose.Types.ObjectId; // Referencia al usuario
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  averageRating: number;
  reviews: mongoose.Types.ObjectId[]; // Referencia a las reseñas
  createdAt: Date;
  updatedAt: Date;
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz ITutorial
const tutorialSchema = new mongoose.Schema<ITutorial>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  contentUrl: { type: String, trim: true }, // Opcional
  contentBody: { type: String, trim: true }, // Opcional
  category: { type: String, required: true, trim: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea correcto
    required: true,
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review', // Asegúrate que el ref sea correcto
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// --- Hook pre-save ---
// El hook `pre('save')` para `updatedAt` es válido, pero Mongoose puede
// manejarlo automáticamente si usas `timestamps: true` en las opciones del Schema.
// Si no usas `timestamps`, este hook es necesario. Si lo usas, puedes eliminarlo.
// Para mantenerlo como está y asegurar que funcione:
tutorialSchema.pre('save', function(next: mongoose.HookNextFunction) { // Usar HookNextFunction para `next`
  this.updatedAt = new Date(); // Usa `new Date()` para obtener la fecha actual
  next();
});

// --- Define el Tipo del Modelo Mongoose ---
export type TutorialModel = Model<ITutorial>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz ITutorial y el tipo del modelo TutorialModel.
const Tutorial = mongoose.model<ITutorial, TutorialModel>('Tutorial', tutorialSchema);

export default Tutorial; // Exportación por defecto del modelo


