import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IThread {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
  vehicle?: mongoose.Types.ObjectId;
  tags: string[];
  isClosed: boolean;
  postCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IThreadDocument extends IThread, Document {}

const threadSchema = new Schema<IThreadDocument>(
  {
    title: {
      type: String,
      required: [true, 'Por favor, añade un título a tu pregunta.'],
      trim: true,
      maxlength: [150, 'El título no puede tener más de 150 caracteres.'],
    },
    content: {
      type: String,
      required: [true, 'Por favor, describe tu problema o pregunta.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isClosed: {
      type: Boolean,
      default: false,
    },
    postCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Thread: Model<IThreadDocument> = mongoose.model<IThreadDocument>('Thread', threadSchema);

export default Thread;
