const ServiceRequest = require('../models/ServiceRequest');
const Worker = require('../models/Worker');

// @route   POST /api/services/request
exports.createRequest = async (req, res) => {
  try {
    const { workerId, serviceType, description, scheduledDate, address } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker || !worker.isApproved) {
      return res.status(404).json({ success: false, error: 'Worker not found or not approved.' });
    }

    const request = await ServiceRequest.create({
      user: req.user.id,
      worker: workerId,
      serviceType,
      description,
      scheduledDate,
      address,
    });

    await request.populate([
      { path: 'user', select: 'name phone' },
      { path: 'worker', populate: { path: 'user', select: 'name phone' } },
    ]);

    res.status(201).json({ success: true, message: 'Service request sent!', request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/services/my-requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user.id })
      .populate({ path: 'worker', populate: { path: 'user', select: 'name avatar phone' } })
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   GET /api/services/worker-requests
exports.getWorkerRequests = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user.id });
    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker profile not found.' });
    }

    const requests = await ServiceRequest.find({ worker: worker._id })
      .populate('user', 'name avatar phone location')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @route   PUT /api/services/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes, finalCost } = req.body;
    const validStatuses = ['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }

    const request = await ServiceRequest.findById(req.params.id)
      .populate({ path: 'worker', select: 'user' });

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found.' });
    }

    // Only the assigned worker can update status
    const isWorkerOwner = request.worker.user.toString() === req.user.id;
    const isUserCancelling = request.user.toString() === req.user.id && status === 'cancelled';

    if (!isWorkerOwner && !isUserCancelling && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }

    request.status = status;
    if (notes) request.notes = notes;
    if (finalCost) request.finalCost = finalCost;
    if (status === 'completed') {
      request.completedAt = new Date();
      await Worker.findByIdAndUpdate(request.worker._id, { $inc: { totalJobs: 1 } });
    }

    await request.save();
    res.json({ success: true, message: 'Status updated', request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
