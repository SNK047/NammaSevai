const Worker = require('../models/Worker');
const User = require('../models/User');
const Review = require('../models/Review');
const supabase = require('../config/supabase');

exports.getWorkers = async (req, res) => {
  try {
    const { skill, city, availability, minRating, page = 1, limit = 12 } = req.query;

    let workers = await Worker.getAll({ isApproved: true, availability, skill });

    if (minRating) {
      workers = workers.filter(w => w.rating_average >= parseFloat(minRating));
    }

    if (city) {
      const cityLower = city.toLowerCase();
      workers = workers.filter(w => w.service_city?.toLowerCase().includes(cityLower));
    }

    workers.sort((a, b) => b.rating_average - a.rating_average);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedWorkers = workers.slice(skip, skip + parseInt(limit));

    const workersWithUser = await Promise.all(
      paginatedWorkers.map(async (worker) => {
        const { data: user } = await supabase
          .from('users')
          .select('name, avatar, phone, city, address')
          .eq('id', worker.user_id)
          .single();
        return { ...worker, user };
      })
    );

    res.json({
      success: true,
      workers: workersWithUser,
      pagination: {
        total: workers.length,
        page: parseInt(page),
        pages: Math.ceil(workers.length / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker not found.' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('name, avatar, phone, email, city, address')
      .eq('id', worker.user_id)
      .single();

    const reviews = await Review.getByWorker(worker.id);

    const reviewsWithUser = await Promise.all(
      reviews.slice(0, 10).map(async (review) => {
        const { data: reviewUser } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', review.user_id)
          .single();
        return { ...review, user: reviewUser };
      })
    );

    res.json({ success: true, worker: { ...worker, user }, reviews: reviewsWithUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findByUserId(req.user.id);

    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker profile not found.' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('name, avatar, phone, email, city, address')
      .eq('id', worker.user_id)
      .single();

    res.json({ success: true, worker: { ...worker, user } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateWorkerProfile = async (req, res) => {
  try {
    const { skills, description, experience, hourlyRate, availability, serviceArea } = req.body;

    const worker = await Worker.findByUserId(req.user.id);

    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker profile not found.' });
    }

    const updated = await Worker.update(worker.id, {
      skills,
      description,
      experience,
      hourlyRate,
      availability,
      serviceArea
    });

    const { data: user } = await supabase
      .from('users')
      .select('name, avatar, phone, email, city, address')
      .eq('id', worker.user_id)
      .single();

    res.json({ success: true, message: 'Profile updated', worker: { ...updated, user } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const worker = await Worker.findByUserId(req.user.id);

    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker profile not found.' });
    }

    const updated = await Worker.update(worker.id, { availability });
    res.json({ success: true, message: 'Availability updated', availability: updated.availability });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
