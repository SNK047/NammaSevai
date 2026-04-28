const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

const User = {
  table: 'users',

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    if (error) return null;
    return data;
  },

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const { data, error } = await supabase
      .from(this.table)
      .insert([{
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        phone: userData.phone || null,
        role: userData.role || 'user',
        avatar: userData.avatar || null,
        address: userData.location?.address || null,
        city: userData.location?.city || null,
        state: userData.location?.state || null,
        pincode: userData.location?.pincode || null,
        lat: userData.location?.coordinates?.lat || null,
        lng: userData.location?.coordinates?.lng || null,
        is_active: true,
        is_verified: false
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, userData) {
    const updateData = {};
    if (userData.name) updateData.name = userData.name;
    if (userData.phone) updateData.phone = userData.phone;
    if (userData.avatar) updateData.avatar = userData.avatar;
    if (userData.location) {
      if (userData.location.address) updateData.address = userData.location.address;
      if (userData.location.city) updateData.city = userData.location.city;
      if (userData.location.state) updateData.state = userData.location.state;
      if (userData.location.pincode) updateData.pincode = userData.location.pincode;
      if (userData.location.coordinates) {
        updateData.lat = userData.location.coordinates.lat;
        updateData.lng = userData.location.coordinates.lng;
      }
    }
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(this.table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async comparePassword(user, candidatePassword) {
    return await bcrypt.compare(candidatePassword, user.password);
  },

  async getAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

module.exports = User;
