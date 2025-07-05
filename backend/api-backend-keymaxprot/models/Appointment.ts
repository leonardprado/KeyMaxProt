import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment {
  user: mongoose.Types.ObjectId;
  technician?: mongoose.Types.ObjectId | null;
  shop?: mongoose.Types.ObjectId | null;
  vehicle: mongoose.Types.ObjectId;
  serviceType: string;
  dateTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAppointmentDocument extends IAppointment, Document {}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technician',
      required: false,
      default: null,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: false,
      default: null,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Maneja createdAt y updatedAt automáticamente
  }
);

const Appointment: Model<IAppointmentDocument> = mongoose.model<IAppointmentDocument>(
  'Appointment',
  appointmentSchema
);

export default Appointment;
