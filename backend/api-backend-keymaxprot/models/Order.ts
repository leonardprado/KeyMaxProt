// models/Order.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Order ---
// Esta interfaz representa los datos de una orden.
// No extiende `Document` directamente.
export interface IOrder { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  user: mongoose.Types.ObjectId; // Referencia al usuario que realizó la orden
  products: Array<{ // Array de productos en la orden
    product: mongoose.Types.ObjectId; // Referencia al producto
    quantity: number;
  }>;
  totalPrice: number; // Precio total de la orden
  status: 'pending' | 'completed' | 'cancelled'; // Estado de la orden
  shippingAddress?: string; // Dirección de envío opcional
  payment?: mongoose.Types.ObjectId; // Referencia opcional al pago asociado
  createdAt: Date; // Fecha de creación (si no usas timestamps: true)
  updatedAt: Date; // Fecha de última actualización (si no usas timestamps: true)
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IOrder
const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea el nombre correcto del modelo User
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Asegúrate que el ref sea correcto
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1'], // Validación para cantidad
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'El precio total no puede ser negativo'], // Validación para precio total
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    type: String,
    trim: true, // Añadido trim
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment' // Asegúrate que el ref sea correcto
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// --- Hook `pre('save')` para `updatedAt` ---
// Necesario si `timestamps: true` no está habilitado en las opciones del schema.
// Si `timestamps: true` está, este hook es redundante pero seguro.
// Lo mantenemos si no usas `timestamps`.
// Si usas `timestamps: true`, puedes eliminar este hook y la necesidad de `updatedAt` en la interfaz y schema.
// Para que sea seguro con TypeScript, tipamos `next`.
serviceCatalogSchema.pre('save', function(next: mongoose.HookNextFunction) { // Usar HookNextFunction
  this.updatedAt = new Date();
  next();
});

// --- Define el Tipo del Modelo Mongoose ---
export type OrderModel = Model<IOrder>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IOrder y el tipo del modelo OrderModel.
const Order = mongoose.model<IOrder, OrderModel>('Order', orderSchema);

export default Order; // Exportación por defecto del modelo
