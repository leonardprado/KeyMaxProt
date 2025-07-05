import mongoose, { Schema, Document, Model } from 'mongoose';

// Interfaz base (sin Document)
export interface IInvoice {
  orderId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  userId: mongoose.Types.ObjectId; // Mejor usar ObjectId y ref User
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  issueDate: Date;
  customerInfo?: {
    name?: string;
    email?: string;
    address?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz que extiende Document
export interface IInvoiceDocument extends IInvoice, Document {}

// Schema
const invoiceSchema = new Schema<IInvoiceDocument>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    name: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  }],
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true, trim: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  issueDate: { type: Date, default: Date.now },
  customerInfo: {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
  },
}, {
  timestamps: true, // Maneja createdAt y updatedAt automáticamente
});

// Si usas timestamps: true, este hook no es necesario
/*
invoiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});
*/

export type InvoiceModel = Model<IInvoiceDocument>;

const Invoice = mongoose.model<IInvoiceDocument, InvoiceModel>('Invoice', invoiceSchema);

export default Invoice;
