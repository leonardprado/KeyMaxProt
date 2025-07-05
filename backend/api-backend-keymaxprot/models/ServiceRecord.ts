import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceRecord {
  vehicle: mongoose.Types.ObjectId;
  date: Date;
  service: mongoose.Types.ObjectId;
  description?: string;
  cost?: number;
  technician?: mongoose.Types.ObjectId;
  shop?: mongoose.Types.ObjectId;
  productsUsed: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IServiceRecordDocument extends IServiceRecord, Document {}

const serviceRecordSchema = new Schema<IServiceRecordDocument>(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCatalog',
      required: true,
    },
    description: { type: String, trim: true },
    cost: { type: Number },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    productsUsed: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const ServiceRecord: Model<IServiceRecordDocument> = mongoose.model<IServiceRecordDocument>(
  'ServiceRecord',
  serviceRecordSchema
);

export default ServiceRecord;
