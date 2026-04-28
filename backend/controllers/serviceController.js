const ServiceRequest = require('../models/ServiceRequest');
const Worker = require('../models/Worker');
const supabase = require('../config/supabase');

exports.createRequest = async (req, res) => {
  try {
    const { workerId, serviceType, description, scheduledDate, address } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker || !worker.is_approved) {
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

    const { data: userData } = await supabase
      .from('users')
      .select('name, phone')
      .eq('id', req.user.id)
      .single();

    const { data: workerUser } = await supabase
      .from('users')
      .select('name, phone')
      .eq('id', worker.user_id)
      .single();

    res.status(201).json({
      success: true,
      message: 'Service request sent!',
      request: { ...request, user: userData, worker: { ...worker, user: workerUser } }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.getByUser(req.user.id);

    const requestsWithPopulate = await Promise.all(
      requests.map(async (request) => {
        const worker = await Worker.findById(request.worker_id);
        const { data: workerUser } = await supabase
          .from('users')
          .select('name, avatar, phone')
          .eq('id', worker?.user_id)
          .single();
        return { ...request, worker: { ...worker, user: workerUser } };
      })
    );

    res.json({ success: true, requests: requestsWithPopulate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWorkerRequests = async (req, res) => {
  try {
    const worker = await Worker.findByUserId(req.user.id);
    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker profile not found.' });
    }

    const requests = await ServiceRequest.getByWorker(worker.id);

    const requestsWithUser = await Promise.all(
      requests.map(async (request) => {
        const { data: userData } = await supabase
          .from('users')
          .select('name, avatar, phone, city, address')
          .eq('id', request.user_id)
          .single();
        return { ...request, user: userData };
      })
    );

    res.json({ success: true, requests: requestsWithUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, notes, finalCost } = req.body;
    const validStatuses = ['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status.' });
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found.' });
    }

    const worker = await Worker.findById(request.worker_id);
    const isWorkerOwner = worker?.user_id === req.user.id;
    const isUserCancelling = request.user_id === req.user.id && status === 'cancelled';

    if (!isWorkerOwner && !isUserCancelling && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }

    const updateData = { status, notes, finalCost };
    if (status === 'completed') {
      updateData.completedAt = new Date().toISOString();
      await Worker.incrementJobs(worker.id);
    }

    const updated = await ServiceRequest.update(req.params.id, updateData);
    res.json({ success: true, message: 'Status updated', request: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
