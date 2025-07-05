// models/Vehicle.ts

import mongoose, { Schema, Document, Model, Types } from 'mongoose'; // Importa Document, Model, y Types

// --- Define la Interfaz para el Documento de Vehículo ---
// Esta interfaz debe reflejar todos los campos de tu schema Mongoose.
// No necesita extender `Document` directamente aquí, ya que Mongoose se encarga de ello.
export interface IVehicle {
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  user?: mongoose.Types.ObjectId; // El usuario que crea el vehículo (si es requerido a nivel de modelo)
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  color?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  serviceHistory: mongoose.Types.ObjectId[];
  createdAt: Date;
  // Define la estructura del array de ownership
  ownership: Array<{
    _id: false; // Opcional si no necesitas un _id para cada entrada de ownership
    user_id: mongoose.Types.ObjectId; // Referencia al usuario
    role: 'owner' | 'driver';       // Roles posibles
  }>;
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IVehicle
const vehicleSchema = new mongoose.Schema<IVehicle>({
  // El campo `user` podría ser redundante si ya está en `ownership`, pero si es una referencia principal, mantenlo.
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  vin: { type: String, required: true, unique: true, trim: true }, // Añadido trim
  licensePlate: { type: String, required: true, unique: true, trim: true }, // Añadido trim
  color: { type: String, trim: true },
  engine: { type: String, trim: true },
  transmission: { type: String, trim: true },
  fuelType: { type: String, trim: true },
  serviceHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRecord'
  }],
  createdAt: { type: Date, default: Date.now },
  
  // --- Ownership ---
  ownership: [{
    // _id: false, // Si no quieres un _id para cada entrada en el array, mantenlo
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Asegúrate que el ref sea el nombre correcto del modelo User
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'driver'],
      required: true
    }
  }]
});

// --- Validador Personalizado para Ownership ---
// Este validador se ejecuta antes de guardar el documento.
// `value` aquí se refiere al array `ownership`.
vehicleSchema.path('ownership').validate(function(value: Array<{ user_id: mongoose.Types.ObjectId; role: string }>) {
  // Cuenta cuántos roles son 'owner'
  const ownerCount = value.filter(own => own.role === 'owner').length;
  // Devuelve true si el número de 'owner' es 0 o 1, false en caso contrario.
  return ownerCount <= 1; 
}, 'Un vehículo solo puede tener un propietario (owner).'); // Mensaje de error si la validación falla


// --- Define el Tipo del Modelo Mongoose ---
// Exporta un tipo para el modelo, tipado con `IMaintenancePlan` (en este caso `IVehicle`).
export type VehicleModel = Model<IVehicle>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IVehicle y el tipo del modelo VehicleModel.
const Vehicle = mongoose.model<IVehicle, VehicleModel>('Vehicle', vehicleSchema);

export default Vehicle; // Exportación por defecto del modelo
