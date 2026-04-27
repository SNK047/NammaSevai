const Worker = require('../models/Worker');
const User = require('../models/User');
const Review = require('../models/Review');

// @route   GET /api/workers
// @desc    Get all approved workers with filters
exports.getWorkers = async (req, res) => {
  try {
    const { skill, city, availability, minRating, page = 1, limit = 12 } = req.query;

    // Build filter query
    const workerFilter = { isApproved: true };
    if (skill) workerFilter.skills = { $in: [skill] };
    if (availability) workerFilter.availability = availability;
    if (minRating) workerFilter['rating.average'] = { $gte: parseFloat(minRating) };
    if (city) workerFilter['serviceArea.city'] = new RegExp(city, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const workers = await Worker.find(workerFilter)
      .populate('user', 'name avatar location phone')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Worker.countDocuments(workerFilter);

    res.json({
      success: true,
      workers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/workers/:id
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('user', 'name avatar location phone email');

    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker not found.' });
    }

    const reviews = await Review.find({ worker: worker._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, worker, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/workers/my-profile
exports.getMyWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id })
      .populate('user', 'name avatar location phone email');

    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker profile not found.' });
    }

    res.json({ success: true, worker });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/workers/my-profile
exports.updateWorkerProfile = async (req, res) => {
  try {
    const { skills, description, experience, hourlyRate, availability, serviceArea } = req.body;

    const worker = await Worker.findOneAndUpdate(
      { user: req.user.id },
      { skills, description, experience, hourlyRate, availability, serviceArea },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar location phone email');

    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker profile not found.' });
    }

    res.json({ success: true, message: 'Profile updated', worker });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/workers/availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const worker = await Worker.findOneAndUpdate(
      { user: req.user.id },
      { availability },
      { new: true }
    );
    res.json({ success: true, message: 'Availability updated', availability: worker.availability });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
