import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShop {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  offeredServices: mongoose.Types.ObjectId[];
  technician_ids: mongoose.Types.ObjectId[];
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  openingHours?: string;
  rating?: number;
  reviews: mongoose.Types.ObjectId[];
  averageRating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShopDocument extends IShop, Document {}

const shopSchema = new Schema<IShopDocument>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    offeredServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCatalog',
      },
    ],
    technician_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician',
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    openingHours: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
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
  },
  {
    timestamps: true,
  }
);

shopSchema.index({ location: '2dsphere' });

const Shop: Model<IShopDocument> = mongoose.model<IShopDocument>('Shop', shopSchema);

export default Shop;
