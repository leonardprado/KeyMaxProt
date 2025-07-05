// models/User.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken'; 

// --- Definición de Interfaces ---
export interface IUserProfile {
  name?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  avatar?: string;
}

// --- Define la Interfaz para el Documento de Usuario ---
// Esta interfaz representa los datos de un usuario. No extiende `Document` directamente.
export interface IUser extends Document { // Extiende `Document` para acceder a métodos de Mongoose
  username: string;
  email: string;
  password?: string; // Opcional porque se usa `select: false`
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  status: 'pending_verification' | 'active' | 'suspended' | 'banned' | 'deleted';
  role: 'user' | 'admin' | 'tecnico' | 'shop_owner' | 'superadmin';
  createdAt: Date;
  fcm_token?: string;
  profile: IUserProfile;
  // Arrays de ObjectIds que referencian otros modelos
  vehicles: mongoose.Types.ObjectId[];
  serviceHistory: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  payments: mongoose.Types.ObjectId[];
  
  // Métodos definidos en el esquema
  getSignedJwtToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IUser
const userSchema: Schema<IUser> = new mongoose.Schema({
   username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // `select: false` es importante para no exponer la contraseña por defecto en las consultas
    password: { type: String, required: true, select: false }, 
    
    // --- TOKENS PARA PROCESOS ESPECÍFICOS ---
    verificationToken: String,       
    verificationTokenExpires: Date,
    resetPasswordToken: String,          
    resetPasswordExpire: Date,
    
    // --- Estado y Rol ---
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
    
    // --- Timestamps y otros campos ---
    createdAt: { type: Date, default: Date.now },
    fcm_token: { type: String, default: null }, // Para notificaciones push
    
    // --- Perfil de Usuario ---
    profile: {
        name: { type: String, default: 'sin nombre', trim: true }, // Añadido trim
        lastName: { type: String, trim: true }, // Añadido trim
        address: { type: String, trim: true }, // Añadido trim
        phone: { type: String, trim: true }, // Añadido trim
        avatar: { type: String }
    },
    
    // --- Relaciones con otros modelos ---
    vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle' // Asegúrate que el ref sea correcto
    }],
    serviceHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRecord' // Asegúrate que el ref sea correcto
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' // Asegúrate que el ref sea correcto
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment' // Asegúrate que el ref sea correcto
    }]
});

// --- Hooks de Mongoose ---

// Hook para `deleteOne` (pre-remove)
// Se ejecuta antes de eliminar un documento. Útil para limpieza.
userSchema.pre('deleteOne', { document: true, query: false }, async function(next: CallbackWithoutResultAndOptionalError) {
  // 'this' se refiere al documento que se está eliminando.
  const userId = this._id; // Obtener el ID del usuario
  
  // Eliminar reseñas asociadas a este usuario (si el campo en Review es 'user')
  await this.model('Review').deleteMany({ user: userId }); 
  
  // Podrías añadir más lógica de limpieza aquí (ej. eliminar vehículos, posts, etc.)
  // ¡CUIDADO! Estas operaciones son destructivas.
  
  next(); // Continuar con la operación de eliminación
});

// Hook para `save` (pre-save)
userSchema.pre('save', async function(next: CallbackWithoutResultAndOptionalError) {
    // Hashear la contraseña si ha sido modificada
    if (!this.isModified('password')) {
        return next(); // Si la contraseña no cambió, salir
    }
    // Asegurarse de que `this.password` exista antes de hashear
    if (this.password) { 
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    // Generar avatar automáticamente si el nombre ha cambiado y el avatar no está explícitamente establecido
    // Esto puede ser mejor en un hook `pre('save')` separado para no mezclar lógicas.
    // Si se implementa, asegurarse de que los nombres sean strings y escapar caracteres especiales.
    // Ejemplo (comentado):
    // if (this.isModified('profile.name') || this.isModified('profile.lastName')) {
    //   const firstName = this.profile.name || '';
    //   const lastName = this.profile.lastName || '';
    //   if (firstName || lastName) {
    //     const avatarName = `${firstName}+${lastName}`.replace(/\s+/g, '+').trim();
    //     if (avatarName) { 
    //       this.profile.avatar = `https://avatar.iran.liara.run/username?username=${avatarName}`;
    //     }
    //   }
    // }
    
    next(); // Continuar con el guardado
});

// --- Métodos de Instancia ---

// Generar Token JWT
userSchema.methods.getSignedJwtToken = function(): string {
    const jwtSecret: Secret = process.env.JWT_SECRET as Secret; 
    const jwtExpiresIn: string | undefined = process.env.JWT_EXPIRE; 

    // Validaciones críticas para las variables de entorno del JWT
    if (!jwtSecret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
        throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
    }
    if (!jwtExpiresIn) {
        console.error("FATAL ERROR: JWT_EXPIRE is not defined in environment variables.");
        throw new Error('JWT_EXPIRE is not defined. Please set it in your environment variables.');
    }

    // Crear el payload para el token JWT
    const payload = { id: this._id.toString() }; // `this._id` es un ObjectId, se convierte a string

    // Definir las opciones de firma con el tipo correcto para `expiresIn`
    const signOptions: SignOptions = { 
      expiresIn: jwtExpiresIn as SignOptions['expiresIn']
    };

    // Firmar el token JWT
    const token = jwt.sign(payload, jwtSecret, signOptions);

    return token;
};

// Comparar contraseñas usando bcrypt
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  // Asegurarse de que `this.password` exista antes de comparar
  if (!this.password) {
      console.warn("Password field is missing in the user document.");
      return false; 
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Exportar el Modelo ---
// Tipamos el modelo con la interfaz IUser y el tipo del modelo UserModel
const User = mongoose.model<IUser>('User', userSchema);

export default User; // Exportación por defecto del modelo

