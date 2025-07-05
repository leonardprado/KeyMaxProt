// models/ServiceRecord.ts

// --- Importaciones ---
// Importa los tipos necesarios de Mongoose
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de ServiceRecord ---
// Esta interfaz representa los datos de un registro de servicio.
export interface IServiceRecord { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  vehicle: mongoose.Types.ObjectId; // Referencia al vehículo
  date: Date; // La fecha del servicio
  service: mongoose.Types.ObjectId; // Referencia al servicio del catálogo
  description?: string; // Descripción opcional
  cost?: number; // Costo opcional
  technician?: mongoose.Types.ObjectId; // Referencia opcional al técnico
  shop?: mongoose.Types.ObjectId; // Referencia opcional al taller
  productsUsed: Array<{ // Array de productos usados en el servicio
    product: mongoose.Types.ObjectId; // Referencia al producto
    quantity: number;
  }>;
  notes?: string; // Notas opcionales
  createdAt: Date; // Fecha de creación (si no usas timestamps: true)
  // Si usas timestamps: true en el schema, `createdAt` y `updatedAt` se manejan automáticamente.
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IServiceRecord
const serviceRecordSchema = new mongoose.Schema<IServiceRecord>({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle', // Asegúrate que el ref sea correcto
    required: true,
  },
  date: { type: Date, default: Date.now }, // Usamos default para la fecha del servicio
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCatalog', // Asegúrate que el ref sea correcto
    required: true,
  },
  description: { type: String, trim: true }, // Añadido trim
  cost: { type: Number },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician' // Asegúrate que el ref sea correcto
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop' // Asegúrate que el ref sea correcto
  },
  productsUsed: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product' // Asegúrate que el ref sea correcto
    },
    quantity: { type: Number, default: 1 }
  }],
  notes: { type: String, trim: true }, // Añadido trim
  createdAt: { type: Date, default: Date.now },
  // Si usas timestamps: true aquí, createdAt se maneja automáticamente.
  // Si no, y necesitas updatedAt, deberías añadirlo o usar un hook `pre('save')`.
  // Manteniendo createdAt como está en tu código original.
});

// --- Define el Tipo del Modelo Mongoose ---
// Exporta un tipo para el modelo, tipado con la interfaz `IServiceRecord`.
export type ServiceRecordModel = Model<IServiceRecord>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IServiceRecord y el tipo del modelo ServiceRecordModel.
const ServiceRecord = mongoose.model<IServiceRecord, ServiceRecordModel>('ServiceRecord', serviceRecordSchema);

export default ServiceRecord; // Exportación por defecto del modelo

