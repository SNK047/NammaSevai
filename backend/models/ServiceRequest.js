const supabase = require('../config/supabase');

const ServiceRequest = {
  table: 'service_requests',

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  },

  async create(requestData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([{
        user_id: requestData.user,
        worker_id: requestData.worker,
        service_type: requestData.serviceType,
        description: requestData.description,
        status: requestData.status || 'pending',
        scheduled_date: requestData.scheduledDate || null,
        address: requestData.address,
        estimated_cost: requestData.estimatedCost || 0,
        final_cost: requestData.finalCost || null,
        notes: requestData.notes || null,
        completed_at: requestData.completedAt || null
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, requestData) {
    const updateData = {};
    if (requestData.status) updateData.status = requestData.status;
    if (requestData.scheduledDate) updateData.scheduled_date = requestData.scheduledDate;
    if (requestData.estimatedCost !== undefined) updateData.estimated_cost = requestData.estimatedCost;
    if (requestData.finalCost !== undefined) updateData.final_cost = requestData.finalCost;
    if (requestData.notes) updateData.notes = requestData.notes;
    if (requestData.completedAt) updateData.completed_at = requestData.completedAt;

    const { data, error } = await supabase
      .from(this.table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getByUser(userId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getByWorker(workerId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getAll(filters = {}) {
    let query = supabase.from(this.table).select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

module.exports = ServiceRequest;
