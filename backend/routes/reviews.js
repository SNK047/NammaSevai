const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Review = require('../models/Review');

// POST /api/reviews
router.post('/', protect, authorize('user'), async (req, res) => {
  try {
    const { workerId, rating, comment, serviceRequestId } = req.body;
    const review = await Review.create({
      user: req.user.id,
      worker: workerId,
      rating,
      comment,
      serviceRequest: serviceRequestId,
    });
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, message: 'Review submitted!', review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'You have already reviewed this worker.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reviews/worker/:workerId
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
