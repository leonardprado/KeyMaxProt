const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    
    // --- TOKENS PARA PROCESOS ESPECÍFICOS ---
    verificationToken: String,       
    // Para verificar el email
    verificationTokenExpires: Date,
    resetPasswordToken: String,          
    // Para resetear la contraseña
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

userSchema.pre('remove', async function(next) {
  // Ejemplo: Eliminar las reseñas del usuario.
  // CUIDADO: esto puede ser destructivo. A veces es mejor anonimizar.
  await this.model('Review').deleteMany({ author: this._id });
  // Aquí podrías añadir lógica para los vehículos, etc.
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});



// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

module.exports = mongoose.model('User', userSchema);