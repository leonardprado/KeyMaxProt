import mongoose, { Schema, Document, Model } from 'mongoose';

// Interfaz con solo los datos (sin extender Document)
export interface IPost {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
  tags: string[];
  views: number;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz que extiende Document para uso con Mongoose
export interface IPostDocument extends IPost, Document {}

// Schema tipado con IPostDocument
const postSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido.'],
      trim: true,
      maxlength: [150, 'El título no puede tener más de 150 caracteres.'],
    },
    content: {
      type: String,
      required: [true, 'El contenido no puede estar vacío.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export type PostModel = Model<IPostDocument>;

const Post = mongoose.model<IPostDocument, PostModel>('Post', postSchema);

export default Post;
