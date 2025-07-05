// models/Technician.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Técnico ---
// Debe reflejar todos los campos del schema. No extiende Document directamente.
export interface ITechnician { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  user_id: mongoose.Types.ObjectId; // Referencia al usuario
  name: string;
  specialty?: string; // Opcional
  contact: {
    phone: string;
    email: string;
  };
  shops: mongoose.Types.ObjectId[]; // Array de referencias a Shops
  availability?: string; // Opcional
  rating?: number; // Opcional
  reviews: mongoose.Types.ObjectId[]; // Array de referencias a Reviews
  createdAt: Date;
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz ITechnician
const technicianSchema = new mongoose.Schema<ITechnician>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea el nombre correcto del modelo User
    required: true,
    unique: true
  },
  name: { type: String, required: true, trim: true }, // Añadido trim
  specialty: { type: String, trim: true },           // Añadido trim
  contact: {
    phone: { type: String, required: true, trim: true }, // Añadido trim
    email: { type: String, required: true, unique: true, lowercase: true, trim: true } // Añadido lowercase y trim
  },
  shops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop' // Asegúrate que el ref sea correcto
  }],
  availability: { type: String, trim: true }, // Añadido trim
  rating: { type: Number, min: 1, max: 5 },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review' // Asegúrate que el ref sea correcto
  }],
  createdAt: { type: Date, default: Date.now },
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
  // Si no, los campos existen en la interfaz pero no en el schema, lo cual es inconsistente.
  // Manteniendo createdAt como está, asumiendo que no usas timestamps: true en este schema.
});

// --- Define el Tipo del Modelo Mongoose ---
export type TechnicianModel = Model<ITechnician>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz ITechnician y el tipo del modelo TechnicianModel.
const Technician = mongoose.model<ITechnician, TechnicianModel>('Technician', technicianSchema);

export default Technician; // Exportación por defecto del modelo

