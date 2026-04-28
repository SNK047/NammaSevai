const Complaint = require('../models/Complaint');
const supabase = require('../config/supabase');

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

    const { data: user } = await supabase
      .from('users')
      .select('name, avatar')
      .eq('id', req.user.id)
      .single();

    res.status(201).json({ success: true, message: 'Complaint submitted!', complaint: { ...complaint, user } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { category, status, city, page = 1, limit = 10 } = req.query;

    let complaints = await Complaint.getAll({ isPublic: true, category, status });

    if (city) {
      const cityLower = city.toLowerCase();
      complaints = complaints.filter(c => c.city?.toLowerCase().includes(cityLower));
    }

    complaints.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginated = complaints.slice(skip, skip + parseInt(limit));

    const complaintsWithUser = await Promise.all(
      paginated.map(async (complaint) => {
        const { data: user } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', complaint.user_id)
          .single();
        return { ...complaint, user };
      })
    );

    res.json({
      success: true,
      complaints: complaintsWithUser,
      pagination: { total: complaints.length, page: parseInt(page), pages: Math.ceil(complaints.length / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const allComplaints = await Complaint.getAll();
    const complaints = allComplaints.filter(c => c.user_id === req.user.id);

    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found.' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('name, avatar')
      .eq('id', complaint.user_id)
      .single();

    res.json({ success: true, complaint: { ...complaint, user } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, error: 'Not found.' });

    const updated = await Complaint.upvote(complaint.id, req.user.id);
    res.json({ success: true, upvotes: updated?.upvotes?.length || 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body;

    const updateData = { status, adminNotes, priority };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date().toISOString();
    }

    const complaint = await Complaint.update(req.params.id, updateData);

    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found.' });

    const { data: user } = await supabase
      .from('users')
      .select('name, avatar')
      .eq('id', complaint.user_id)
      .single();

    res.json({ success: true, message: 'Status updated', complaint: { ...complaint, user } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
