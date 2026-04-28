const User = require('../models/User');
const Worker = require('../models/Worker');
const Complaint = require('../models/Complaint');
const ServiceRequest = require('../models/ServiceRequest');
const Review = require('../models/Review');
const supabase = require('../config/supabase');

exports.getDashboard = async (req, res) => {
  try {
    const { data: users } = await supabase.from('users').select('id, role');
    const { data: workers } = await supabase.from('workers').select('id, is_approved');
    const { data: complaints } = await supabase.from('complaints').select('id, status, category');
    const { data: services } = await supabase.from('service_requests').select('id, status');

    const totalUsers = users?.filter(u => u.role === 'user').length || 0;
    const totalWorkers = workers?.filter(w => w.is_approved).length || 0;
    const pendingWorkers = workers?.filter(w => !w.is_approved).length || 0;
    const totalComplaints = complaints?.length || 0;
    const pendingComplaints = complaints?.filter(c => c.status === 'pending').length || 0;
    const resolvedComplaints = complaints?.filter(c => c.status === 'resolved').length || 0;
    const totalServices = services?.length || 0;
    const completedServices = services?.filter(s => s.status === 'completed').length || 0;

    const complaintsByCategory = (complaints || []).reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {});

    const { data: recentComplaints } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentWorkerApprovals } = await supabase
      .from('workers')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentComplaintsWithUser = await Promise.all(
      (recentComplaints || []).map(async (c) => {
        const { data: user } = await supabase.from('users').select('name').eq('id', c.user_id).single();
        return { ...c, user };
      })
    );

    const recentWorkersWithUser = await Promise.all(
      (recentWorkerApprovals || []).map(async (w) => {
        const { data: user } = await supabase.from('users').select('name, email').eq('id', w.user_id).single();
        return { ...w, user };
      })
    );

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
      complaintsByCategory: Object.entries(complaintsByCategory).map(([category, count]) => ({ _id: category, count })),
      recentComplaints: recentComplaintsWithUser,
      recentWorkerApprovals: recentWorkersWithUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    
    let query = supabase.from('users').select('*').order('created_at', { ascending: false });
    if (role) query = query.eq('role', role);

    const { data: users, count } = await query.range(
      (parseInt(page) - 1) * parseInt(limit),
      parseInt(page) * parseInt(limit) - 1
    );

    res.json({ success: true, users: users || [], pagination: { total: count || 0, page: parseInt(page) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveWorker = async (req, res) => {
  try {
    const { data: worker, error } = await supabase
      .from('workers')
      .update({ is_approved: req.body.approve })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !worker) return res.status(404).json({ success: false, error: 'Worker not found.' });

    const { data: user } = await supabase.from('users').select('name, email').eq('id', worker.user_id).single();

    const msg = req.body.approve ? 'Worker approved' : 'Worker rejected';
    res.json({ success: true, message: msg, worker: { ...worker, user } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;

    let query = supabase.from('workers').select('*').order('created_at', { ascending: false });
    if (approved !== undefined) query = query.eq('is_approved', approved === 'true');

    const { data: workers, count } = await query.range(
      (parseInt(page) - 1) * parseInt(limit),
      parseInt(page) * parseInt(limit) - 1
    );

    const workersWithUser = await Promise.all(
      (workers || []).map(async (w) => {
        const { data: user } = await supabase.from('users').select('name, email, phone, avatar').eq('id', w.user_id).single();
        return { ...w, user };
      })
    );

    res.json({ success: true, workers: workersWithUser, pagination: { total: count || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleUserActive = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('is_active')
      .eq('id', req.params.id)
      .single();

    if (error || !user) return res.status(404).json({ success: false, error: 'User not found.' });

    const newStatus = !user.is_active;
    await supabase.from('users').update({ is_active: newStatus }).eq('id', req.params.id);

    res.json({ success: true, message: `User ${newStatus ? 'activated' : 'deactivated'}`, user: { ...user, is_active: newStatus } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
