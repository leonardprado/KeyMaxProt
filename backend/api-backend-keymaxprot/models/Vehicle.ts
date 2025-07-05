import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicle {
  user?: mongoose.Types.ObjectId;
  make: string;
  brand: string;
  vehicleModel: string;
  year: number;
  mileage: number;
  vin: string;
  licensePlate: string;
  color?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  serviceHistory: mongoose.Types.ObjectId[];
  ownership: Array<{
    user_id: mongoose.Types.ObjectId;
    role: 'owner' | 'driver';
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVehicleDocument extends IVehicle, Document {}

const vehicleSchema = new Schema<IVehicleDocument>(
  {
    make: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    vin: { type: String, required: true, unique: true, trim: true },
    licensePlate: { type: String, required: true, unique: true, trim: true },
    color: { type: String, trim: true },
    engine: { type: String, trim: true },
    transmission: { type: String, trim: true },
    fuelType: { type: String, trim: true },
    serviceHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRecord',
      },
    ],
    ownership: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'driver'],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

vehicleSchema.path('ownership').validate(function (
  value: IVehicleDocument['ownership']
) {
  const ownerCount = value.filter((own) => own.role === 'owner').length;
  return ownerCount <= 1;
}, 'Un vehículo solo puede tener un propietario (owner).');

const Vehicle: Model<IVehicleDocument> = mongoose.model<IVehicleDocument>('Vehicle', vehicleSchema);

export default Vehicle;
