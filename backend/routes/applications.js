const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @desc    Apply for a job (Candidate only)
// @route   POST /api/applications/apply/:jobId
// @access  Private (Candidate only)
router.post('/apply/:jobId', protect, authorize('candidate'), async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const candidateId = req.user._id;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }
    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job listing is no longer active',
      });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({ jobId, candidateId });
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    // Get candidate's profile to extract resume
    const profile = await Profile.findOne({ userId: candidateId });
    const resume = req.body.resume || (profile ? profile.resume : null);
    const resumeName = req.body.resumeName || (profile ? profile.resumeName : 'Resume.pdf');

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume in your profile or upload it with your application.',
      });
    }

    const application = await Application.create({
      jobId,
      candidateId,
      resume,
      resumeName,
      coverLetter: req.body.coverLetter || '',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get candidate's applied jobs (Candidate only)
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
router.get('/my-applications', protect, authorize('candidate'), async (req, res, next) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title companyName location salaryRange jobType workplaceType isActive',
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Withdraw application (Candidate only)
// @route   DELETE /api/applications/withdraw/:id
// @access  Private (Candidate only)
router.delete('/withdraw/:id', protect, authorize('candidate'), async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership
    if (application.candidateId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application',
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get metrics and analytics for Recruiter Dashboard
// @route   GET /api/applications/stats/recruiter
// @access  Private (Recruiter only)
router.get('/stats/recruiter', protect, authorize('recruiter'), async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.isActive).length;
    const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

    const applications = await Application.find({ jobId: { $in: jobIds } });
    const totalApplications = applications.length;

    // Calculate conversion rate: (applications / views) * 100
    const conversionRate = totalViews > 0 ? Number(((totalApplications / totalViews) * 100).toFixed(1)) : 0;

    // Status breakdown
    const statusBreakdown = {
      Applied: 0,
      Reviewing: 0,
      Shortlisted: 0,
      'Interview Scheduled': 0,
      Rejected: 0,
      Selected: 0,
    };

    applications.forEach(app => {
      if (statusBreakdown[app.status] !== undefined) {
        statusBreakdown[app.status]++;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalViews,
        totalApplications,
        conversionRate,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all applications for a specific job (Recruiter only)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
router.get('/job/:jobId', protect, authorize('recruiter'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job',
      });
    }

    // Fetch applications and populate candidate User model
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate({
        path: 'candidateId',
        select: 'name email',
      })
      .sort({ appliedAt: -1 });

    // For each applicant, fetch their Profile to show skills, education, and experience
    const populatedApplications = await Promise.all(
      applications.map(async (app) => {
        const candidateProfile = await Profile.findOne({ userId: app.candidateId._id });
        return {
          _id: app._id,
          jobId: app.jobId,
          candidate: {
            _id: app.candidateId._id,
            name: app.candidateId.name,
            email: app.candidateId.email,
            profile: candidateProfile ? {
              skills: candidateProfile.skills,
              experience: candidateProfile.experience,
              education: candidateProfile.education,
              avatar: candidateProfile.avatar,
            } : null,
          },
          status: app.status,
          resume: app.resume,
          resumeName: app.resumeName,
          coverLetter: app.coverLetter,
          appliedAt: app.appliedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: populatedApplications.length,
      applications: populatedApplications,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update application status (Recruiter only)
// @route   PUT /api/applications/status/:id
// @access  Private (Recruiter only)
router.put('/status/:id', protect, authorize('recruiter'), async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an application status',
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Verify job belongs to this recruiter
    const job = await Job.findById(application.jobId);
    if (!job || job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify applicants for this job',
      });
    }

    application.status = status;
    await application.save();

    // Create notification for candidate
    try {
      await Notification.create({
        userId: application.candidateId,
        message: `Your application status for "${job.title}" has been updated to "${status}".`
      });
    } catch (notifyError) {
      console.error('Failed to create status notification:', notifyError.message);
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
