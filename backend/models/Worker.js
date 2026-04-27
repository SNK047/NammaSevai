const mongoose = require('mongoose');

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

const workerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  skills: [{
    type: String,
    enum: ALL_SKILLS,
  }],
  category: {
    type: String,
    enum: Object.keys(SKILL_CATEGORIES),
    default: 'SkilledTrades',
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  experience: {
    type: Number,
    default: 0,
    min: 0,
    max: 50,
  },
  hourlyRate: {
    type: Number,
    default: 0,
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available',
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  totalJobs: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  documents: [{
    type: String,
  }],
  serviceArea: {
    city: { type: String, default: '' },
    radius: { type: Number, default: 10 },
  },
}, { timestamps: true });

workerSchema.statics.SKILL_CATEGORIES = SKILL_CATEGORIES;
workerSchema.statics.ALL_SKILLS = ALL_SKILLS;

module.exports = mongoose.model('Worker', workerSchema);
