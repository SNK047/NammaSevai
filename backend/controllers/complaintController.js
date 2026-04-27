const Complaint = require('../models/Complaint');

// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    const { title, category, description, location, imageURL } = req.body;

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      category,
      description,
      location,
      imageURL: imageURL || '',
    });

    await complaint.populate('user', 'name avatar');
    res.status(201).json({ success: true, message: 'Complaint submitted!', complaint });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/complaints
exports.getComplaints = async (req, res) => {
  try {
    const { category, status, city, page = 1, limit = 10 } = req.query;
    const filter = { isPublic: true };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (city) filter['location.city'] = new RegExp(city, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      complaints,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/complaints/my-complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name avatar');

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/complaints/:id/upvote
exports.upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, error: 'Not found.' });

    const idx = complaint.upvotes.indexOf(req.user.id);
    if (idx > -1) {
      complaint.upvotes.splice(idx, 1); // Remove upvote
    } else {
      complaint.upvotes.push(req.user.id); // Add upvote
    }

    await complaint.save();
    res.json({ success: true, upvotes: complaint.upvotes.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/complaints/:id/status (Admin only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        priority,
        ...(status === 'resolved' && { resolvedAt: new Date() }),
      },
      { new: true }
    ).populate('user', 'name avatar');

    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found.' });

    res.json({ success: true, message: 'Status updated', complaint });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
