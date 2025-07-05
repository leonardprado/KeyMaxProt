// models/Message.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Message ---
// Esta interfaz representa los datos de un mensaje. No extiende `Document` directamente.
export interface IMessage { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  conversation: mongoose.Types.ObjectId; // Referencia a la conversación
  sender: mongoose.Types.ObjectId; // Referencia al remitente
  text?: string; // Mensaje de texto opcional
  mediaUrl?: string; // URL a un medio adjunto (imagen, video, etc.) opcional
  readBy: Array<{ // Array de usuarios que han leído el mensaje
    // _id: false, // Si no necesitas un _id para cada entrada en el array, puedes dejarlo
    user: mongoose.Types.ObjectId; // Referencia al usuario que leyó
    readAt: Date; // Momento en que leyó el mensaje
  }>;
  createdAt: Date; // Fecha de creación del mensaje
  // Si usas timestamps: true, createdAt se maneja automáticamente.
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IMessage
const messageSchema = new mongoose.Schema<IMessage>({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation', // Asegúrate que el ref sea correcto
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea correcto
    required: true,
  },
  text: { type: String }, // Mensaje de texto opcional
  mediaUrl: { type: String, trim: true }, // URL de medio opcional, con trim
  readBy: [{
    // _id: false, // Si no necesitas un _id para cada entrada de readBy
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Asegúrate que el ref sea correcto
    },
    readAt: {
      type: Date,
      default: Date.now, // Marca la fecha de lectura
    },
  }],
  createdAt: { type: Date, default: Date.now },
  // Si usas timestamps: true en las opciones del schema, `createdAt` y `updatedAt`
  // se manejan automáticamente. Si solo tienes `createdAt` aquí, está bien,
  // pero considera usar `timestamps: true` para `updatedAt` si es necesario.
  // Si no usas timestamps, y `updatedAt` está en la interfaz, debe estar aquí o en un hook.
});

// --- Define el Tipo del Modelo Mongoose ---
export type MessageModel = Model<IMessage>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IMessage y el tipo del modelo MessageModel.
const Message = mongoose.model<IMessage, MessageModel>('Message', messageSchema);

export default Message; // Exportación por defecto del modelo

