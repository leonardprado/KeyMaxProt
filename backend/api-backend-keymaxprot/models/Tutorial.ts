import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITutorial {
  title: string;
  description: string;
  contentUrl?: string;
  content: string;
  contentBody?: string;
  category: string;
  user: mongoose.Types.ObjectId;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  averageRating: number;
  reviews: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITutorialDocument extends ITutorial, Document {}

const TutorialSchema: Schema<ITutorialDocument> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    contentUrl: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    contentBody: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticos
  }
);

// Importante: corregí el nombre de la constante en model (TutorialSchema, no tutorialSchema)
const Tutorial: Model<ITutorialDocument> = mongoose.models.Tutorial || mongoose.model<ITutorialDocument>('Tutorial', TutorialSchema);

export default Tutorial;
