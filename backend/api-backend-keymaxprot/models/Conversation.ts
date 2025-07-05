// models/Conversation.ts

// --- Importaciones ---
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// --- Define la Interfaz para el Documento de Conversation ---
// Esta interfaz representa los datos de una conversación. No extiende `Document` directamente.
export interface IConversation { // <-- La interfaz se exporta aquí
  _id?: mongoose.Types.ObjectId; // Mongoose añade _id
  participants: mongoose.Types.ObjectId[]; // Array de ObjectId referenciando a Usuarios
  messages: mongoose.Types.ObjectId[];     // Array de ObjectId referenciando a Mensajes
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última actualización (si no usas timestamps: true)
});

// --- Define el Schema de Mongoose ---
// Tipamos el Schema con la interfaz IConversation
const conversationSchema = new mongoose.Schema<IConversation>({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate que el ref sea el nombre correcto del modelo User
    required: true,
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message', // Asegúrate que el ref sea el nombre correcto del modelo Message
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  // Si usas timestamps: true, createdAt y updatedAt se manejan automáticamente.
  // Si no, el schema y la interfaz deben definirlos, y puedes usar un hook `pre('save')` para `updatedAt` si es necesario.
  // En tu código original, los tienes definidos explícitamente, lo cual está bien si no usas `timestamps: true`.
});

// --- Hook `pre('save')` para `updatedAt` (si no usas timestamps: true) ---
// Si `timestamps: true` no está en las opciones del schema, este hook es necesario.
// Lo mantenemos para seguir tu estructura original.
// Tipamos `next` para TypeScript.
conversationSchema.pre('save', function(next: mongoose.HookNextFunction) {
  this.updatedAt = new Date(); // Actualiza `updatedAt` a la fecha actual
  next();
});

// --- Define el Tipo del Modelo Mongoose ---
export type ConversationModel = Model<IConversation>;

// --- Crea y Exporta el Modelo ---
// Tipamos el modelo con la interfaz IConversation y el tipo del modelo ConversationModel.
const Conversation = mongoose.model<IConversation, ConversationModel>('Conversation', conversationSchema);

export default Conversation; // Exportación por defecto del modelo
