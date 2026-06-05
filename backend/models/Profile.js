const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    required: true,
  },
  // Candidate profile fields
  skills: {
    type: [String],
    default: [],
  },
  experience: [
    {
      title: String,
      company: String,
      duration: String, // e.g., "Jan 2021 - Present"
      description: String,
    },
  ],
  education: [
    {
      school: String,
      degree: String,
      field: String,
      year: String,
    },
  ],
  resume: {
    type: String, // Base64 encoded PDF string
  },
  resumeName: {
    type: String, // Original resume file name
  },
  avatar: {
    type: String, // Base64 encoded Profile image
  },
  // Recruiter profile fields
  companyName: {
    type: String,
    trim: true,
  },
  companyLogo: {
    type: String, // Base64 encoded Logo image
  },
  website: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  companySize: {
    type: String, // e.g., "1-10", "11-50", "51-200", "201-500", "500+"
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', ProfileSchema);
