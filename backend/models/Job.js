const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    index: true,
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    index: true,
  },
  companyLogo: {
    type: String, // Base64 encoded logo image
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  requirements: {
    type: [String],
    default: [],
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    required: [true, 'Please add a job location'],
    trim: true,
    index: true,
  },
  salaryRange: {
    min: {
      type: Number,
      required: [true, 'Please add a minimum salary'],
    },
    max: {
      type: Number,
      required: [true, 'Please add a maximum salary'],
    },
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
  },
  workplaceType: {
    type: String,
    required: true,
    enum: ['Onsite', 'Remote', 'Hybrid'],
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('Job', JobSchema);
