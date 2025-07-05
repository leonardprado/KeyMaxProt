// models/Order.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder {
  user: mongoose.Types.ObjectId;
  products: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  totalPrice: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt?: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrderDocument>('Order', OrderSchema);
