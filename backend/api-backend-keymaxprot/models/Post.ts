
// models/Post.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Post ---
// Esta interfaz representa los datos de una publicación.
// No extiende `Document` directamente.
export interface IPost { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  title: string;
  content: string;
  user: mongoose.Types.ObjectId; // Referencia al usuario que creó el post
  tags: string[];
  views: number;
  likes: mongoose.Types.ObjectId[]; // Array de referencias a usuarios que dieron "like"
  createdAt: Date; // Si usas timestamps: true, Mongoose lo maneja
  updatedAt: Date; // Si usas timestamps: true, Mongoose lo maneja
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IPost
const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: [true, 'El título es requerido.'],
    trim: true,
    maxlength: [150, 'El título no puede tener más de 150 caracteres.'] // Añadido límite de longitud
  },
  content: {
    type: String,
    required: [true, 'El contenido no puede estar vacío.']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea correcto
    required: true
  },
  tags: [{
    type: String,
    trim: true, // Añadido trim a los tags
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Referencia al usuario que dio like
  }],
  // createdAt y updatedAt se manejan si usas timestamps: true
}, {
  timestamps: true // Habilita createdAt y updatedAt automáticamente
});

// --- Métodos Adicionales (si los hubiera) ---
// Si defines métodos en `postSchema.methods`, asegúrate de que la interfaz `IPost` los incluya.

// --- Define el Tipo del Modelo Mongoose ---
export type PostModel = Model<IPost>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IPost y el tipo del modelo PostModel.
const Post = mongoose.model<IPost, PostModel>('Post', postSchema);

export default Post; // Exportación por defecto del modelo

