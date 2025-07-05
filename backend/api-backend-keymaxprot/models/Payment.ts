// models/Payment.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Payment ---
// Esta interfaz representa los datos de un pago. No extiende `Document` directamente.
export interface IPayment { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  order: mongoose.Types.ObjectId; // Referencia al pedido
  paymentMethod: string; // Método de pago (ej. 'credit_card', 'paypal')
  amount: number; // Monto del pago
  status: 'pending' | 'completed' | 'failed'; // Estado del pago
  transactionId?: string; // ID de la transacción (único)
  paymentDate: Date; // Fecha en que se procesó el pago
  createdAt: Date; // Fecha de creación del registro de pago
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IPayment
const paymentSchema = new mongoose.Schema<IPayment>({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Asegúrate que el ref sea el nombre correcto del modelo Order
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true, // Añadido trim
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'El monto no puede ser negativo'], // Validación para monto
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    unique: true, // El ID de transacción debe ser único
    trim: true,   // Añadido trim
  },
  paymentDate: { type: Date, default: Date.now }, // Fecha del pago
  createdAt: { type: Date, default: Date.now },
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
  // Si no, asegúrate que `updatedAt` también se defina y se actualice (quizás con un hook `pre('save')`).
});

// --- Define el Tipo del Modelo Mongoose ---
export type PaymentModel = Model<IPayment>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IPayment y el tipo del modelo PaymentModel.
const Payment = mongoose.model<IPayment, PaymentModel>('Payment', paymentSchema);

export default Payment; // Exportación por defecto del modelo

