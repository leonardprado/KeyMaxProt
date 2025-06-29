const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'La respuesta no puede estar vacía.']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  thread: {
    type: mongoose.Schema.ObjectId,
    ref: 'Thread',
    required: true
  },
  // Para la fase 2: sistema de votos
  upvotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hook para actualizar el contador de posts en el Thread
PostSchema.post('save', async function() {
  await this.model('Thread').findByIdAndUpdate(this.thread, {
    $inc: { postCount: 1 }
  });
});

PostSchema.post('remove', async function() {
  await this.model('Thread').findByIdAndUpdate(this.thread, {
    $inc: { postCount: -1 }
  });
});


module.exports = mongoose.model('Post', PostSchema);