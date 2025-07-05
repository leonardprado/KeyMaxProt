import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Interfaz del Documento Producto ---
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  sku: string;
  brand?: string;
  weight?: number;
  dimensions?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  // Otros campos opcionales si los usas
  // images?: string[];
  // isBestSeller?: boolean;
  // onSale?: boolean;
  // tags?: string[];
}

// --- Schema de Mongoose ---
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: [0, 'El precio no puede ser negativo'] },
    category: { type: String, trim: true },
    stock: { type: Number, default: 0, min: [0, 'El stock no puede ser negativo'] },
    sku: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, trim: true },
    weight: { type: Number, min: [0, 'El peso no puede ser negativo'] },
    dimensions: { type: String, trim: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true, // createdAt y updatedAt automáticos
  }
);

// --- Modelo ---
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
