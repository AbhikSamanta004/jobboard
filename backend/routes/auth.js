const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123456', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create associated empty profile
    const profile = await Profile.create({
      userId: user._id,
      role: user.role,
    });

    const token = generateToken(user._id);

    // Don't send password back
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Get user profile
    const profile = await Profile.findOne({ userId: user._id });

    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    
    res.status(200).json({
      success: true,
      user: req.user,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
