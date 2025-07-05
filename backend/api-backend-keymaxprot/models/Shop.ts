// models/Shop.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Shop ---
// Debe reflejar todos los campos del schema. No extiende Document directamente.
export interface IShop { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  offeredServices: mongoose.Types.ObjectId[]; // Array de referencias a ServiceCatalog
  technician_ids: mongoose.Types.ObjectId[]; // Array de referencias a Technician
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  openingHours?: string;
  rating?: number;
  reviews: mongoose.Types.ObjectId[]; // Array de referencias a Review
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  // Si usas timestamps: true, createdAt se maneja automáticamente. Si no, debe estar en el schema.
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IShop
const shopSchema = new mongoose.Schema<IShop>({
  name: { type: String, required: true, trim: true }, // Añadido trim
  address: { type: String, required: true, trim: true }, // Añadido trim
  phone: { type: String, trim: true },               // Añadido trim
  email: { type: String, trim: true, lowercase: true }, // Añadido trim y lowercase
  offeredServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCatalog', // Asegúrate que el ref sea correcto
  }],
  technician_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician' // Asegúrate que el ref sea correcto
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'], // Solo se permite el tipo 'Point' para geoespacial
      required: true
    },
    coordinates: {
      type: [Number], // Array de números para [longitude, latitude]
      required: true
    }
  },
  openingHours: { type: String, trim: true }, // Añadido trim
  rating: { type: Number, min: 1, max: 5 },
  reviews: [{
    type: mongoose.Types.ObjectId, // Usar Types.ObjectId si es necesario, o mongoose.Schema.Types.ObjectId
    ref: 'Review' // Asegúrate que el ref sea correcto
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
  // Si no, deben estar definidos así o con un hook `pre('save')`.
});

// --- Índice Geográfico ---
// Asegura que tu base de datos esté configurada para índices 2dsphere si usas geoespacial.
shopSchema.index({ location: '2dsphere' });

// --- Define el Tipo del Modelo Mongoose ---
export type ShopModel = Model<IShop>;

// --- Crea y Exporta el Modelo ---
const Shop = mongoose.model<IShop, ShopModel>('Shop', shopSchema);

export default Shop; // Exportación por defecto del modelo
