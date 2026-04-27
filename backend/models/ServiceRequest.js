const mongoose = require('mongoose');

const ALL_SKILLS = [
  // Skilled Trades
  'Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Welder', 'Mason', 'Painter', 'Blacksmith', 
  'HVAC Technician', 'Roofer', 'Tailor', 'Driver', 'Machine Operator',
  // Education
  'Tutor', 'Teacher', 'Professor', 'Trainer', 'Librarian', 'Research Assistant',
  // Healthcare
  'Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Physiotherapist', 'Paramedic', 'Caregiver', 'Dentist',
  // Food & Hospitality
  'Chef', 'Waiter', 'Bartender', 'Hotel Receptionist', 'Housekeeping', 'Catering Worker', 'Baker',
  // Construction
  'Civil Engineer', 'Surveyor', 'Site Supervisor', 'Heavy Equipment Operator', 'Road Worker', 'Architect',
  // Retail & Services
  'Shopkeeper', 'Cashier', 'Salesperson', 'Delivery Worker', 'Beautician', 'Security Guard', 'Cleaner',
  // Agriculture
  'Farmer', 'Gardener', 'Fisherman', 'Agricultural Technician', 'Forestry Worker',
  // Technology
  'IT Technician', 'Software Developer', 'Data Entry Operator', 'Graphic Designer', 'Accountant', 'Clerk',
  // Creative & Media
  'Artist', 'Photographer', 'Videographer', 'Musician', 'Actor', 'Writer'
];

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ALL_SKILLS,
  },
  description: {
    type: String,
    required: [true, 'Please describe the work needed'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  scheduledDate: {
    type: Date,
  },
  address: {
    type: String,
    required: true,
  },
  estimatedCost: {
    type: Number,
    default: 0,
  },
  finalCost: {
    type: Number,
  },
  notes: {
    type: String,
  },
  completedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
