import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Interfaz con los datos puros ---
export interface IMessage {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text?: string;
  mediaUrl?: string;
  readBy: Array<{
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }>;
  createdAt: Date;
}

// --- Interfaz que extiende Document ---
export interface IMessageDocument extends IMessage, Document {}

// --- Schema ---
const messageSchema = new Schema<IMessageDocument>({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: { type: String },
  mediaUrl: { type: String, trim: true },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});


// --- Tipo del Modelo ---
export type MessageModel = Model<IMessageDocument>;

// --- Modelo ---
const Message = mongoose.model<IMessageDocument, MessageModel>('Message', messageSchema);

export default Message;
