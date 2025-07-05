// models/User.ts

import mongoose, {
  Schema,
  Document,
  Model,
  CallbackWithoutResultAndOptionalError,
  Types,
} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export interface IUserProfile {
  name?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  avatar?: string;
}

export interface IUser {
  username: string;
  email: string;
  password?: string;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  status: 'pending_verification' | 'active' | 'suspended' | 'banned' | 'deleted';
  role?: 'user' | 'admin' | 'tecnico' | 'shop_owner' | 'superadmin';
  fcm_token?: string;
  profile: IUserProfile;
  vehicles: mongoose.Types.ObjectId[];
  serviceHistory: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  payments: mongoose.Types.ObjectId[];
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  getSignedJwtToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    status: {
      type: String,
      enum: ['pending_verification', 'active', 'suspended', 'banned', 'deleted'],
      default: 'pending_verification',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'tecnico', 'shop_owner', 'superadmin'],
      default: 'user',
    },
    fcm_token: { type: String, default: null },
    profile: {
      name: { type: String, default: 'sin nombre', trim: true },
      lastName: { type: String, trim: true },
      address: { type: String, trim: true },
      phone: { type: String, trim: true },
      avatar: { type: String },
    },
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
    serviceHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRecord' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  },
  {
    timestamps: true,
  }
);

// --- Middleware ---

userSchema.pre('deleteOne', { document: true, query: false }, async function (next: CallbackWithoutResultAndOptionalError) {
  const userId = this._id;
  await this.model('Review').deleteMany({ user: userId });
  next();
});

userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Métodos personalizados ---

userSchema.methods.getSignedJwtToken = function (): string {
  const jwtSecret: Secret = process.env.JWT_SECRET as Secret;
  const jwtExpiresIn: string | undefined = process.env.JWT_EXPIRE;
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
  if (!jwtExpiresIn) throw new Error('JWT_EXPIRE is not defined');
  const payload = { id: this._id.toString() };
  const signOptions: SignOptions = { expiresIn: jwtExpiresIn as any };
  return jwt.sign(payload, jwtSecret, signOptions);
};

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Modelo ---

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;

