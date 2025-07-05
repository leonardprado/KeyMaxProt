// models/Product.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Producto ---
// Debe reflejar todos los campos del schema. No extiende `Document` directamente.
// La interfaz ya está exportada aquí.
export interface IProduct {
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  sku: string; // SKU debe ser único
  brand?: string;
  weight?: number;
  dimensions?: string;
  averageRating: number; // Promedio de calificaciones
  reviewCount: number;   // Conteo de reseñas
  createdAt: Date;       // Fecha de creación (si no usas timestamps: true)
  updatedAt?: Date;      // Fecha de última actualización (si no usas timestamps: true)
  // Si necesitas campos adicionales como `images`, `isBestSeller`, `onSale`, `tags`
  // asegúrate de que estén definidos aquí y en el schema.
  // Ejemplo:
  // images?: string[];
  // isBestSeller?: boolean;
  // onSale?: boolean;
  // tags?: string[];
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IProduct
const productSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: [0, 'El precio no puede ser negativo'] },
  category: { type: String, trim: true },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, required: true, unique: true, trim: true },
  brand: { type: String, trim: true },
  weight: { type: Number, min: [0, 'El peso no puede ser negativo'] },
  dimensions: { type: String, trim: true },
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
  // Si usas `timestamps: true`, estas líneas son redundantes y Mongoose las maneja.
  // Si no usas `timestamps: true`, entonces `createdAt` y `updatedAt` deben estar aquí
  // y `updatedAt` podría necesitar un hook `pre('save')`.
  // Asumiendo que `timestamps: true` es la mejor práctica si no hay razón para lo contrario.
  // Si no usas timestamps, descomenta estas líneas y considera el hook pre('save') para updatedAt.
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true // Habilita createdAt y updatedAt automáticamente
});

// --- Hook `pre('save')` para `updatedAt` (Opcional si usas timestamps: true) ---
// Si `timestamps: true` está en las opciones del schema, Mongoose maneja `updatedAt`.
// Si no, este hook es necesario. Lo mantengo comentado por si acaso.
/*
productSchema.pre('save', function(next: mongoose.HookNextFunction) {
  if (this.isModified('updatedAt') || this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});
*/

// --- Define el Tipo del Modelo Mongoose ---
export type ProductModel = Model<IProduct>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IProduct y el tipo del modelo ProductModel.
const Product = mongoose.model<IProduct, ProductModel>('Product', productSchema);

export default Product; // Exportación por defecto del modelo
