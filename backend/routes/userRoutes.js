const express = require('express');
const multer = require('multer');
const path = require('path');
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');
const protect = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.use(protect);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user  // Send the user object in the data field
    });
  } catch (error) {
    console.error('Profile route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, phone, address, college, tags } = req.body;
    const user = await User.findById(req.user._id);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    user.name = name;
    user.phone = phone;
    user.address = address;
    user.college = college;
    if (tags !== undefined) user.tags = tags;

    const updatedUser = await user.save();

    // Send back the updated user data without sensitive information
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        college: updatedUser.college,
        tags: updatedUser.tags
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
      error: error.name
    });
  }
});

// Change Email
router.put('/change-email', async (req, res) => {
  try {
    const { currentEmail, newEmail, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current email
    if (user.email !== currentEmail) {
      return res.status(400).json({
        success: false,
        message: 'Current email is incorrect'
      });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Update email
    user.email = newEmail;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Change Password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Debug route - add before module.exports


module.exports = router;