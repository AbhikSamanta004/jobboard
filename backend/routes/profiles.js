const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get current user profile
// @route   GET /api/profiles
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile & base User fields (like name)
// @route   PUT /api/profiles
// @access  Private
router.put('/', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    // Optional: Update name on User schema if provided
    if (req.body.name) {
      await User.findByIdAndUpdate(userId, { name: req.body.name });
    }

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // Fallback: create profile if for some reason it doesn't exist
      profile = new Profile({ userId, role });
    }

    if (role === 'candidate') {
      // Update candidate specific fields
      if (req.body.skills !== undefined) profile.skills = req.body.skills;
      if (req.body.experience !== undefined) profile.experience = req.body.experience;
      if (req.body.education !== undefined) profile.education = req.body.education;
      if (req.body.resume !== undefined) profile.resume = req.body.resume;
      if (req.body.resumeName !== undefined) profile.resumeName = req.body.resumeName;
      if (req.body.avatar !== undefined) profile.avatar = req.body.avatar;
    } else if (role === 'recruiter') {
      // Update recruiter specific fields
      if (req.body.companyName !== undefined) profile.companyName = req.body.companyName;
      if (req.body.companyLogo !== undefined) profile.companyLogo = req.body.companyLogo;
      if (req.body.website !== undefined) profile.website = req.body.website;
      if (req.body.industry !== undefined) profile.industry = req.body.industry;
      if (req.body.companySize !== undefined) profile.companySize = req.body.companySize;
      if (req.body.description !== undefined) profile.description = req.body.description;
    }

    await profile.save();

    // Fetch updated user to return latest state
    const updatedUser = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
