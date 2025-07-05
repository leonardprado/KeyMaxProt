import mongoose, { Schema, Model, Document } from 'mongoose';

// Interfaz de datos (sin _id explícito)
export interface IComment {
  content: string;
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz que extiende Document, con _id y métodos de mongoose
export interface ICommentDocument extends IComment, Document {}

// Schema tipado con ICommentDocument
const commentSchema = new Schema<ICommentDocument>({
  content: {
    type: String,
    required: [true, 'El comentario no puede estar vacío.'],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, {
  timestamps: true,
});

// Modelo tipado
const Comment: Model<ICommentDocument> = mongoose.model<ICommentDocument>('Comment', commentSchema);

export default Comment;
