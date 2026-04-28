const supabase = require('../config/supabase');

const SKILL_CATEGORIES = {
  SkilledTrades: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Welder', 'Mason', 'Painter', 'Blacksmith', 'HVAC Technician', 'Roofer', 'Tailor', 'Driver', 'Machine Operator'],
  Education: ['Tutor', 'Teacher', 'Professor', 'Trainer', 'Librarian', 'Research Assistant'],
  Healthcare: ['Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Physiotherapist', 'Paramedic', 'Caregiver', 'Dentist'],
  FoodHospitality: ['Chef', 'Waiter', 'Bartender', 'Hotel Receptionist', 'Housekeeping', 'Catering Worker', 'Baker'],
  Construction: ['Civil Engineer', 'Surveyor', 'Site Supervisor', 'Heavy Equipment Operator', 'Road Worker', 'Architect'],
  RetailServices: ['Shopkeeper', 'Cashier', 'Salesperson', 'Delivery Worker', 'Beautician', 'Security Guard', 'Cleaner'],
  Agriculture: ['Farmer', 'Gardener', 'Fisherman', 'Agricultural Technician', 'Forestry Worker'],
  Technology: ['IT Technician', 'Software Developer', 'Data Entry Operator', 'Graphic Designer', 'Accountant', 'Clerk'],
  CreativeMedia: ['Artist', 'Photographer', 'Videographer', 'Musician', 'Actor', 'Writer']
};

const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

const Worker = {
  table: 'workers',
  SKILL_CATEGORIES,
  ALL_SKILLS,

  async findById(id) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) return null;
    return data;
  },

  async create(workerData) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([{
        user_id: workerData.user,
        skills: workerData.skills || [],
        category: workerData.category || 'SkilledTrades',
        description: workerData.description || null,
        experience: workerData.experience || 0,
        hourly_rate: workerData.hourlyRate || 0,
        availability: workerData.availability || 'available',
        rating_average: 0,
        rating_count: 0,
        total_jobs: 0,
        is_approved: true,
        documents: workerData.documents || [],
        service_city: workerData.serviceArea?.city || null,
        service_radius: workerData.serviceArea?.radius || 10
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, workerData) {
    const updateData = {};
    if (workerData.skills) updateData.skills = workerData.skills;
    if (workerData.category) updateData.category = workerData.category;
    if (workerData.description !== undefined) updateData.description = workerData.description;
    if (workerData.experience !== undefined) updateData.experience = workerData.experience;
    if (workerData.hourlyRate !== undefined) updateData.hourly_rate = workerData.hourlyRate;
    if (workerData.availability) updateData.availability = workerData.availability;
    if (workerData.documents) updateData.documents = workerData.documents;
    if (workerData.serviceArea) {
      if (workerData.serviceArea.city) updateData.service_city = workerData.serviceArea.city;
      if (workerData.serviceArea.radius) updateData.service_radius = workerData.serviceArea.radius;
    }
    if (workerData.isApproved !== undefined) updateData.is_approved = workerData.isApproved;

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

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.availability) {
      query = query.eq('availability', filters.availability);
    }
    if (filters.isApproved) {
      query = query.eq('is_approved', filters.isApproved);
    }
    if (filters.skill) {
      query = query.contains('skills', [filters.skill]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async search(query, city) {
    let supabaseQuery = supabase
      .from(this.table)
      .select('*')
      .eq('is_approved', true)
      .eq('availability', 'available');

    if (city) {
      supabaseQuery = supabaseQuery.ilike('service_city', `%${city}%`);
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;

    if (query) {
      const q = query.toLowerCase();
      return data.filter(w => 
        w.skills?.some(s => s.toLowerCase().includes(q)) ||
        w.description?.toLowerCase().includes(q) ||
        w.category?.toLowerCase().includes(q)
      );
    }
    return data;
  },

  async updateRating(workerId) {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('worker_id', workerId);

    if (error || !reviews.length) return;

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase
      .from(this.table)
      .update({
        rating_average: Math.round(avgRating * 10) / 10,
        rating_count: reviews.length
      })
      .eq('id', workerId);
  },

  async incrementJobs(workerId) {
    const worker = await this.findById(workerId);
    if (worker) {
      await supabase
        .from(this.table)
        .update({ total_jobs: (worker.total_jobs || 0) + 1 })
        .eq('id', workerId);
    }
  }
};

module.exports = Worker;
