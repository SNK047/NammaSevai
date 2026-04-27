const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Street Light', 'Others'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  imageURL: {
    type: String,
    default: '',
  },
  location: {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  resolvedAt: {
    type: Date,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
