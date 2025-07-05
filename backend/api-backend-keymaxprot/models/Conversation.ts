import mongoose, { Schema, Document, Model } from 'mongoose';

// Interfaz solo con campos puros, sin _id
export interface IConversation {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz del documento mongoose que extiende Document y tu interfaz
export interface IConversationDocument extends IConversation, Document {}

// Schema tipado con IConversationDocument para que mongoose sepa que es documento
const conversationSchema = new Schema<IConversationDocument>({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
}, {
  timestamps: true,
});

// Modelo con el tipo documento y modelo
const Conversation: Model<IConversationDocument> = mongoose.model<IConversationDocument>('Conversation', conversationSchema);

export default Conversation;
