const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  serviceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: [300, 'Review cannot exceed 300 characters'],
  },
}, { timestamps: true });

// One review per user per worker
reviewSchema.index({ user: 1, worker: 1 }, { unique: true });

// After save, update worker's average rating
reviewSchema.post('save', async function () {
  const Worker = require('./Worker');
  const reviews = await this.constructor.find({ worker: this.worker });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Worker.findByIdAndUpdate(this.worker, {
    'rating.average': Math.round(avgRating * 10) / 10,
    'rating.count': reviews.length,
  });
});

module.exports = mongoose.model('Review', reviewSchema);
