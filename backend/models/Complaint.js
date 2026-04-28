const supabase = require('../config/supabase');

const Complaint = {
  table: 'complaints',

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  },

  async create(complaintData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([{
        user_id: complaintData.user,
        title: complaintData.title,
        category: complaintData.category,
        description: complaintData.description,
        image_url: complaintData.imageURL || null,
        address: complaintData.location?.address || null,
        city: complaintData.location?.city || null,
        lat: complaintData.location?.coordinates?.lat || null,
        lng: complaintData.location?.coordinates?.lng || null,
        status: complaintData.status || 'pending',
        priority: complaintData.priority || 'medium',
        admin_notes: complaintData.adminNotes || null,
        resolved_at: complaintData.resolvedAt || null,
        is_public: complaintData.isPublic !== false,
        upvotes: []
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, complaintData) {
    const updateData = {};
    if (complaintData.status) updateData.status = complaintData.status;
    if (complaintData.priority) updateData.priority = complaintData.priority;
    if (complaintData.adminNotes !== undefined) updateData.admin_notes = complaintData.adminNotes;
    if (complaintData.resolvedAt) updateData.resolved_at = complaintData.resolvedAt;

    const { data, error } = await supabase
      .from(this.table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(filters = {}) {
    let query = supabase.from(this.table).select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.isPublic) {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async upvote(complaintId, userId) {
    const complaint = await this.findById(complaintId);
    if (!complaint) return null;

    const upvotes = complaint.upvotes || [];
    if (!upvotes.includes(userId)) {
      upvotes.push(userId);
      const { data, error } = await supabase
        .from(this.table)
        .update({ upvotes })
        .eq('id', complaintId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    return complaint;
  }
};

module.exports = Complaint;
