import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMaintenancePlan {
  brand: string;
  vehicleModel: string;
  year_range: string;
  mileage_interval: number;
  recommended_services: mongoose.Types.ObjectId[];
  common_issues: string[];
}

// Interfaz que extiende Document, útil para el modelo con Mongoose
export interface IMaintenancePlanDocument extends IMaintenancePlan, Document {}

const maintenancePlanSchema = new mongoose.Schema<IMaintenancePlanDocument>({
  brand: { type: String, required: true, trim: true },
  vehicleModel: { type: String, required: true, trim: true },
  year_range: { type: String, required: true, trim: true },
  mileage_interval: { type: Number, required: true },
  recommended_services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCatalog',
  }],
  common_issues: [{
    type: String,
    trim: true,
  }],
});
 {
  timestamps: true // Opcional, para manejar createdAt y updatedAt
};

export type MaintenancePlanModel = Model<IMaintenancePlanDocument>;


const MaintenancePlan = mongoose.model<IMaintenancePlanDocument, MaintenancePlanModel>('MaintenancePlan', maintenancePlanSchema);


export default MaintenancePlan;
