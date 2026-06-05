const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all jobs (public) with search/filters
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let query = { isActive: true };

    // Search by title, company name, or requirements (skills)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { requirements: searchRegex },
      ];
    }

    // Filter by location
    if (req.query.location) {
      query.location = new RegExp(req.query.location, 'i');
    }

    // Filter by job type
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    // Filter by workplace type (Remote/Onsite/Hybrid)
    if (req.query.workplaceType) {
      query.workplaceType = req.query.workplaceType;
    }

    // Filter by experience level
    if (req.query.experienceLevel) {
      query.experienceLevel = req.query.experienceLevel;
    }

    // Filter by minimum salary
    if (req.query.minSalary) {
      const minSal = Number(req.query.minSalary);
      if (!isNaN(minSal)) {
        query['salaryRange.min'] = { $gte: minSal };
      }
    }

    // Sort by most recent
    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get jobs posted by the logged in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter only)
router.get('/my-jobs', protect, authorize('recruiter'), async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views count
    job.views = (job.views || 0) + 1;
    await job.save();

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create a job listing
// @route   POST /api/jobs
// @access  Private (Recruiter only)
router.post('/', protect, authorize('recruiter'), async (req, res, next) => {
  try {
    const recruiterProfile = await Profile.findOne({ userId: req.user._id });
    
    // Auto-fill company details from recruiter profile if available
    const jobData = {
      ...req.body,
      recruiterId: req.user._id,
      companyName: req.body.companyName || (recruiterProfile ? recruiterProfile.companyName : 'Company'),
      companyLogo: req.body.companyLogo || (recruiterProfile ? recruiterProfile.companyLogo : ''),
    };

    const job = await Job.create(jobData);

    // Create notifications for candidates with matching skills
    try {
      const requirements = job.requirements || [];
      if (requirements.length > 0) {
        // Query profiles containing matching skills
        const matchingProfiles = await Profile.find({
          role: 'candidate',
          skills: { $in: requirements.map(r => new RegExp(r, 'i')) } // Case-insensitive matching
        });

        for (const p of matchingProfiles) {
          await Notification.create({
            userId: p.userId,
            message: `New job matching your skills: "${job.title}" at ${job.companyName}`
          });
        }
      }
    } catch (notifyError) {
      console.error('Failed to dispatch job notifications:', notifyError.message);
    }

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
router.put('/:id', protect, authorize('recruiter'), async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Make sure user is the job owner
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job listing',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete/Archive a job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
router.delete('/:id', protect, authorize('recruiter'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Make sure user is the job owner
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job listing',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job listing removed successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
