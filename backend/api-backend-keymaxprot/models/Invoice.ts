// models/Invoice.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Invoice ---
// Esta interfaz representa los datos de una factura. No extiende `Document` directamente.
export interface IInvoice { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  orderId: mongoose.Types.ObjectId; // Referencia al pedido
  invoiceNumber: string; // Número de factura único
  userId: string; // ID del usuario (posiblemente string si no es ObjectId referenciado)
  items: Array<{ // Array de ítems facturados
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number; // Subtotal de la factura
  tax: number; // Impuestos aplicados
  total: number; // Monto total
  paymentMethod: string; // Método de pago utilizado
  paymentStatus: 'pending' | 'completed' | 'failed'; // Estado del pago
  issueDate: Date; // Fecha de emisión de la factura
  customerInfo?: { // Información del cliente (opcional)
    name?: string;
    email?: string;
    address?: string;
  };
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IInvoice
const invoiceSchema = new mongoose.Schema<IInvoice>({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Asegúrate que el ref sea correcto
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true, // El número de factura debe ser único
    trim: true,   // Añadido trim
  },
  userId: {
    type: String, // Si userId es solo un string del ID del usuario, dejarlo así.
                  // Si es una referencia a ObjectId, debería ser mongoose.Schema.Types.ObjectId
                  // y necesitarías un `ref: 'User'`. Por ahora, lo dejo como está en tu código.
    required: true,
  },
  items: [{
    name: { type: String, trim: true }, // Añadido trim
    quantity: { type: Number, required: true, min: [1, 'La cantidad debe ser al menos 1'] },
    price: { type: Number, required: true, min: [0, 'El precio no puede ser negativo'] },
    subtotal: { type: Number, required: true, min: [0, 'El subtotal no puede ser negativo'] },
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'El subtotal no puede ser negativo'],
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Los impuestos no pueden ser negativos'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo'],
  },
  paymentMethod: {
    type: String,
    required: true,
    trim: true, // Añadido trim
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  customerInfo: {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true }, // Añadido trim y lowercase
    address: { type: String, trim: true }, // Añadido trim
  },
}, {
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
  // Si no, necesitas definir `updatedAt` en la interfaz y schema, y usar un hook `pre('save')`.
  // Dado que tu código original tiene `createdAt` y `updatedAt` definidos con `default`,
  // no es estrictamente necesario `timestamps: true`, pero es más limpio si quieres ambos.
  // Mantenemos la lógica de `pre('save')` si no se usa `timestamps`.
});

// --- Hook `pre('save')` para `updatedAt` ---
// Si `timestamps: true` no está en las opciones del schema, este hook es necesario.
// Si `timestamps: true` sí está, este hook es redundante pero inofensivo.
// Lo mantenemos para seguir la estructura de tu código original.
// Tipamos `next` para TypeScript.
invoiceSchema.pre('save', function(next: mongoose.HookNextFunction) {
  // Asegurarse de que `this` sea del tipo correcto para acceder a `updatedAt`.
  // Si el hook se ejecuta, `this` debería ser un documento de Mongoose.
  if (this.isModified('updatedAt') || this.isNew) { // Actualizar si se modifica o es un documento nuevo
      this.updatedAt = new Date();
  }
  next();
});

// --- Define el Tipo del Modelo Mongoose ---
export type InvoiceModel = Model<IInvoice>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IInvoice y el tipo del modelo InvoiceModel.
const Invoice = mongoose.model<IInvoice, InvoiceModel>('Invoice', invoiceSchema);

export default Invoice; // Exportación por defecto del modelo
