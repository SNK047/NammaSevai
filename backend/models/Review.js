const supabase = require('../config/supabase');
const Worker = require('./Worker');

const Review = {
  table: 'reviews',

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  },

  async create(reviewData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([{
        user_id: reviewData.user,
        worker_id: reviewData.worker,
        service_request_id: reviewData.serviceRequest || null,
        rating: reviewData.rating,
        comment: reviewData.comment || null
      }])
      .select()
      .single();
    if (error) throw error;

    await Worker.updateRating(reviewData.worker);
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

  async getByUser(userId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async hasReviewed(userId, workerId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('id')
      .eq('user_id', userId)
      .eq('worker_id', workerId)
      .maybeSingle();
    return !!data;
  }
};

module.exports = Review;
