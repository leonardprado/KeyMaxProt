import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Interfaz para Documento Review ---
export interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;

  item: {
    id: mongoose.Types.ObjectId;
    type: 'Product' | 'Shop' | 'ServiceRecord' | 'Tutorial';
  };

  createdAt?: Date;
  updatedAt?: Date;
}

// Documento de Mongoose que extiende Document y contiene IReview (sin redeclarar _id)
export interface IReviewDocument extends Document {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  item: {
    id: mongoose.Types.ObjectId;
    type: 'Product' | 'Shop' | 'ServiceRecord' | 'Tutorial';
  };
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const reviewSchema = new Schema<IReviewDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'La calificación debe ser al menos 1'],
      max: [5, 'La calificación no puede exceder 5'],
    },
    comment: {
      type: String,
      trim: true,
    },
    item: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'item.type',
      },
      type: {
        type: String,
        required: true,
        enum: ['Product', 'Shop', 'ServiceRecord', 'Tutorial'],
      },
    },
  },
  { timestamps: true } // createdAt y updatedAt automáticos
);

// --- Método estático para recalcular promedio ---
reviewSchema.statics.calculateAverageRating = async function (
  itemId: mongoose.Types.ObjectId | string,
  itemType: IReview['item']['type']
): Promise<void> {
  try {
    const stats = await this.aggregate([
      { $match: { 'item.id': new mongoose.Types.ObjectId(itemId) } },
      {
        $group: {
          _id: '$item.id',
          reviewCount: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    const Model = mongoose.model(itemType);

    if (stats.length > 0 && stats[0]._id) {
      await Model.findByIdAndUpdate(stats[0]._id, {
        reviewCount: stats[0].reviewCount,
        averageRating: parseFloat(stats[0].averageRating.toFixed(2)),
      });
    } else {
      await Model.findByIdAndUpdate(itemId, { reviewCount: 0, averageRating: 0 });
    }
  } catch (error) {
    console.error(`Error calculating average rating for ${itemType} ID ${itemId}:`, error);
  }
};

// --- Hooks post save y remove para recalcular promedio ---
reviewSchema.post('save', async function (doc: IReviewDocument) {
  await (doc.constructor as any).calculateAverageRating(doc.item.id, doc.item.type);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await (this.constructor as any).calculateAverageRating(this.item.id, this.item.type);
});

// --- Tipo de modelo ---
export type ReviewModel = Model<IReviewDocument>;

// --- Modelo ---
const Review = mongoose.model<IReviewDocument, ReviewModel>('Review', reviewSchema);

export default Review;
