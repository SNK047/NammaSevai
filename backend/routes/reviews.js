const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Review = require('../models/Review');

router.post('/', protect, authorize('user'), async (req, res) => {
  try {
    const { workerId, rating, comment, serviceRequestId } = req.body;

    const userHasReviewed = await Review.hasReviewed(req.user.id, workerId);
    if (userHasReviewed) {
      return res.status(409).json({ success: false, error: 'You have already reviewed this worker.' });
    }

    const review = await Review.create({
      user: req.user.id,
      worker: workerId,
      rating,
      comment,
      serviceRequest: serviceRequestId,
    });

    res.status(201).json({ success: true, message: 'Review submitted!', review: { ...review } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.getByWorker(req.params.workerId);
    res.json({ success: true, reviews: reviews || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;