// models/ServiceCatalog.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de ServiceCatalog ---
// Esta interfaz representa los datos de un servicio en el catálogo.
// No extiende `Document` directamente.
export interface IServiceCatalog { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  name: string;
  category: string;
  default_price?: number; // Opcional, pero definido en schema
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IServiceCatalog
const serviceCatalogSchema = new mongoose.Schema<IServiceCatalog>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  default_price: {
    type: Number,
    min: 0, // Asegura que el precio no sea negativo
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
},
// Si `timestamps: true` se añade aquí, Mongoose gestionará createdAt y updatedAt.
// Si no, el hook `pre('save')` es necesario para `updatedAt`.
// Dado que lo tienes en tu código, lo mantenemos.
);

// --- Hook `pre('save')` para `updatedAt` ---
// Si `timestamps: true` no está en las opciones del schema, este hook es necesario.
// Si `timestamps: true` SÍ está, este hook es redundante pero inofensivo.
// Para que sea seguro con TypeScript, tipamos `next`.
serviceCatalogSchema.pre('save', function(next: mongoose.HookNextFunction) {
  this.updatedAt = new Date(); // Actualiza `updatedAt` a la fecha actual
  next();
});

// --- Define el Tipo del Modelo Mongoose ---
export type ServiceCatalogModel = Model<IServiceCatalog>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IServiceCatalog y el tipo del modelo ServiceCatalogModel.
const ServiceCatalog = mongoose.model<IServiceCatalog, ServiceCatalogModel>('ServiceCatalog', serviceCatalogSchema);

export default ServiceCatalog; // Exportación por defecto del modelo

