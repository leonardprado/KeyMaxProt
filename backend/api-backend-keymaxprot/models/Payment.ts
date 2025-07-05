// models/Payment.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment {
  order: mongoose.Types.ObjectId;
  paymentMethod: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentDate?: Date;
}

export interface IPaymentDocument extends IPayment, Document {
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'El monto no puede ser negativo'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      trim: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export type PaymentModel = Model<IPaymentDocument>;

const Payment = mongoose.model<IPaymentDocument, PaymentModel>('Payment', paymentSchema);

export default Payment;
