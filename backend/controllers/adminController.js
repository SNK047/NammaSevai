const User = require('../models/User');
const Worker = require('../models/Worker');
const Complaint = require('../models/Complaint');
const ServiceRequest = require('../models/ServiceRequest');
const Review = require('../models/Review');

// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalWorkers,
      pendingWorkers,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalServices,
      completedServices,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Worker.countDocuments({ isApproved: true }),
      Worker.countDocuments({ isApproved: false }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'resolved' }),
      ServiceRequest.countDocuments(),
      ServiceRequest.countDocuments({ status: 'completed' }),
    ]);

    // Complaints by category
    const complaintsByCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Recent activity
    const recentComplaints = await Complaint.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentWorkerApprovals = await Worker.find({ isApproved: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalWorkers,
        pendingWorkers,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalServices,
        completedServices,
      },
      complaintsByCategory,
      recentComplaints,
      recentWorkerApprovals,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);
    res.json({ success: true, users, pagination: { total, page: parseInt(page) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/admin/workers/:id/approve
exports.approveWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.approve },
      { new: true }
    ).populate('user', 'name email');

    if (!worker) return res.status(404).json({ success: false, error: 'Worker not found.' });

    const msg = req.body.approve ? 'Worker approved' : 'Worker rejected';
    res.json({ success: true, message: msg, worker });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/admin/workers
exports.getAllWorkers = async (req, res) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (approved !== undefined) filter.isApproved = approved === 'true';

    const workers = await Worker.find(filter)
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Worker.countDocuments(filter);
    res.json({ success: true, workers, pagination: { total } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/admin/users/:id/toggle-active
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
