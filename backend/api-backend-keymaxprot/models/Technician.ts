import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITechnician {
  user_id: mongoose.Types.ObjectId;
  name: string;
  specialty?: string;
  contact: {
    phone: string;
    email: string;
  };
  shops: mongoose.Types.ObjectId[];
  availability?: string;
  rating?: number;
  reviews: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITechnicianDocument extends ITechnician, Document {}

const technicianSchema = new Schema<ITechnicianDocument>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    specialty: { type: String, trim: true },
    contact: {
      phone: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
    },
    shops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
      },
    ],
    availability: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Technician: Model<ITechnicianDocument> = mongoose.model<ITechnicianDocument>(
  'Technician',
  technicianSchema
);

export default Technician;
