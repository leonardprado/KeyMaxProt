// models/User.ts

import mongoose, { Document, Schema, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Interfaces (parecen correctas) ---
export interface IUserProfile {
  name?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  avatar?: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; 
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  status: 'pending_verification' | 'active' | 'suspended' | 'banned' | 'deleted';
  role: 'user' | 'admin' | 'tecnico' | 'shop_owner' | 'superadmin';
  createdAt: Date;
  fcm_token?: string;
  profile: IUserProfile;
  vehicles: mongoose.Types.ObjectId[];
  serviceHistory: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  payments: mongoose.Types.ObjectId[];
  
  // Métodos del esquema
  getSignedJwtToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
   username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // select: false significa que no se incluirá por defecto en las consultas
    
    // --- TOKENS PARA PROCESOS ESPECÍFICOS ---
    verificationToken: String,       
    verificationTokenExpires: Date,
    resetPasswordToken: String,          
    resetPasswordExpire: Date,
    status: {
      type: String,
      enum: ['pending_verification', 'active', 'suspended', 'banned', 'deleted'],
      default: 'pending_verification'
    },
   
     role: { 
      type: String, 
      enum: ['user', 'admin', 'tecnico', 'shop_owner', 'superadmin'], 
      default: 'user' 
    },
    createdAt: { type: Date, default: Date.now },
    fcm_token: {
        type: String,
        default: null
    },
    profile: {
        name: { type: String,
            default: 'sin nombre'
         },
        lastName: { type: String },
        address: { type: String },
        phone: { type: String },
        avatar: { type: String }
    },
    // Arrays de ObjectIds referenciando otros modelos
    vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }],
    serviceHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRecord'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }]
});

// --- Hooks de Mongoose ---

// Hook para `deleteOne` (pre-remove)
userSchema.pre('deleteOne', { document: true, query: false }, async function(next: CallbackWithoutResultAndOptionalError) {
  // 'this' se refiere al documento que está siendo eliminado.
  // Ejemplo: Eliminar reseñas asociadas al usuario que se elimina.
  // CUIDADO: Esto es destructivo. Asegúrate de que es lo que quieres hacer.
  // Si usas `author` en `Review` para referenciar al usuario, esto funcionará.
  // Si usas `user` en `Review` (como en tu controller de review), ajústalo.
  const userId = this._id; // Obtener el ID del usuario que se está eliminando
  await this.model('Review').deleteMany({ user: userId }); // Asumiendo que el campo en Review es 'user'
  // Aquí podrías añadir más lógica de limpieza si es necesaria (ej. eliminar vehículos del usuario).
  next();
});

// Hook para `save` (pre-save)
userSchema.pre('save', async function(next: CallbackWithoutResultAndOptionalError) {
    // Hash de la contraseña si ha sido modificada
    if (!this.isModified('password')) {
        return next();
    }
    // Solo hashear si la contraseña existe y es modificada.
    if (this.password) { 
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Generar avatar si los nombres han cambiado y el avatar no está explícitamente establecido
    // Nota: Esto se maneja mejor en un hook 'pre' separado para no mezclar lógica.
    // Si quieres que esto funcione, considera moverlo a su propio hook `pre('save')`.
    // Por ahora, lo dejamos comentado para enfocarnos en el JWT.

    // --- Lógica para generar avatar (si no está en otro hook) ---
    // if (this.isModified('profile.name') || this.isModified('profile.lastName')) {
    //   const firstName = this.profile.name || '';
    //   const lastName = this.profile.lastName || '';
    //   if (firstName || lastName) {
    //       // Asegurarse de que '+' en el nombre no cause problemas, o escapar correctamente
    //       const avatarName = `${firstName}+${lastName}`.replace(/\s+/g, '+').trim();
    //       if (avatarName) { // Solo asignar si hay algún nombre
    //         this.profile.avatar = `https://avatar.iran.liara.run/username?username=${avatarName}`;
    //       }
    //   }
    // }
    
    next(); // Continúa con el guardado
});

// --- Métodos de Instancia ---

// Generar Token JWT
userSchema.methods.getSignedJwtToken = function(): string {
    // Obtener las variables de entorno de forma segura
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRE; 

    // Validar que las variables de entorno existan
    if (!secret) {
        // Es vital lanzar un error aquí si la configuración no está completa
        console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
    }
    if (!expiresIn) {
        console.error("FATAL ERROR: JWT_EXPIRE is not defined in environment variables.");
        throw new Error('JWT_EXPIRE is not defined. Please set it in your environment variables.');
    }

    // Llamar a jwt.sign con los valores validados
     const token = jwt.sign({ id: this._id }, secret, {
        expiresIn: expiresIn
    });
    return token;
};

// Comparar contraseñas
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  // Asegúrate de que this.password exista y sea una string antes de comparar
  if (!this.password) {
      return false; // O lanzar un error si la contraseña no está presente
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Exportar el modelo ---
export default mongoose.model<IUser>('User', userSchema);