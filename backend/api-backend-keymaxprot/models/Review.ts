const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  // Polymorphic reference to the item being reviewed
  item: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'item.type',
    },
    type: {
      type: String,
      required: true,
      enum: ['Product', 'Shop', 'ServiceRecord', 'Tutorial'], // Added Tutorial
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` field on save
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Review = mongoose.model('Review', reviewSchema);

reviewSchema.statics.calculateAverageRating = async function(itemId, itemType) {
  const stats = await this.aggregate([
    { $match: { 'item.id': itemId } },
    { $group: {
        _id: '$item.id',
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$rating' }
    }}
  ]);

  const Model = mongoose.model(itemType); // Modelo dinámico
  if (stats.length > 0) {
    await Model.findByIdAndUpdate(itemId, {
      reviewCount: stats[0].reviewCount,
      averageRating: stats[0].averageRating.toFixed(2)
    });
  } else {
    await Model.findByIdAndUpdate(itemId, { reviewCount: 0, averageRating: 0 });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.item.id, this.item.type);
});

reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.item.id, this.item.type);
});

module.exports = Review;