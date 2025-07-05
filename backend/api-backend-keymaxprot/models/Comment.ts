// models/Comment.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Comment ---
// Esta interfaz representa los datos de un comentario. No extiende `Document` directamente.
export interface IComment { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  content: string; // El contenido del comentario
  user: mongoose.Types.ObjectId; // Referencia al usuario que escribió el comentario
  post: mongoose.Types.ObjectId; // Referencia al post al que pertenece el comentario
  createdAt: Date; // Fecha de creación (manejada por timestamps: true)
  updatedAt: Date; // Fecha de última actualización (manejada por timestamps: true)
}

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IComment
const commentSchema = new mongoose.Schema<IComment>({
  content: {
    type: String,
    required: [true, 'El comentario no puede estar vacío.'],
    trim: true // Añadido trim
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea correcto
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Asegúrate que el ref sea correcto
    required: true,
  }
}, {
  timestamps: true // Habilita createdAt y updatedAt automáticamente
});

// --- Define el Tipo del Modelo Mongoose ---
export type CommentModel = Model<IComment>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IComment y el tipo del modelo CommentModel.
const Comment = mongoose.model<IComment, CommentModel>('Comment', commentSchema);

export default Comment; // Exportación por defecto del modelo
