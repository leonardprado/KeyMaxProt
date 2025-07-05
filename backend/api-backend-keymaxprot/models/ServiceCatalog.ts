import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceCatalog {
  name: string;
  category: string;
  default_price?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IServiceCatalogDocument extends IServiceCatalog, Document {}

const serviceCatalogSchema = new Schema<IServiceCatalogDocument>(
  {
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
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceCatalog: Model<IServiceCatalogDocument> = mongoose.model<IServiceCatalogDocument>(
  'ServiceCatalog',
  serviceCatalogSchema
);

export default ServiceCatalog;
