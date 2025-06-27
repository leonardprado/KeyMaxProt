const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  contentUrl: {
    type: String,
    required: false, // Optional if contentBody is provided
    trim: true,
  },
  contentBody: {
    type: String,
    required: false, // Optional if contentUrl is provided
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
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
tutorialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

module.exports = Tutorial;