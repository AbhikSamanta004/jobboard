const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: [
      'Applied',
      'Reviewing',
      'Shortlisted',
      'Interview Scheduled',
      'Rejected',
      'Selected',
    ],
    default: 'Applied',
    index: true,
  },
  resume: {
    type: String, // Base64 encoded resume PDF (from candidate profile or snapshot)
    required: true,
  },
  resumeName: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a candidate can apply only once per job
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
