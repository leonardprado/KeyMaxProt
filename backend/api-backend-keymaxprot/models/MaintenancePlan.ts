// models/MaintenancePlan.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para los Datos del Documento ---
// Asegúrate de que la interfaz tenga `export` para que sea visible
export interface IMaintenancePlan { // <-- La interfaz ya está exportada aquí
  _id?: mongoose.Types.ObjectId;
  brand: string;
  model: string;
  year_range: string;
  mileage_interval: number;
  recommended_services: mongoose.Types.ObjectId[];
  common_issues: string[];
}

// --- Define el Schema de Mongoose ---
const maintenancePlanSchema = new mongoose.Schema<IMaintenancePlan>({
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
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

// --- Define el Tipo del Modelo Mongoose ---
export type MaintenancePlanModel = Model<IMaintenancePlan>;

// --- Crea y Exporta el Modelo ---
const MaintenancePlan = mongoose.model<IMaintenancePlan, MaintenancePlanModel>('MaintenancePlan', maintenancePlanSchema);

export default MaintenancePlan;

