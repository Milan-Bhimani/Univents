const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const passport = require('passport');

// Simplify token generation
const signToken = (id) => {
  try {
    const token = jwt.sign(
      { id: id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Trigger OTP generation and sending
    req.user = user;
    res.status(200).json({
      success: true,
      message: 'Credentials verified, proceed with OTP verification'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // Set by protect middleware
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token received'
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // 4) Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token or authorization error'
    });
  }
};

// Forgot Password: Send OTP to email if user exists
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.status(200).json({ success: true, message: 'If this email is registered, you will receive an OTP.' });
    }
    // Generate OTP
    const crypto = require('crypto');
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    user.otpAttempts = 0;
    await user.save();
    // Send OTP email
    const mailer = require('../utils/mailer');
    await mailer.sendPasswordResetEmail(email, otp);
    return res.status(200).json({ success: true, message: 'If this email is registered, you will receive an OTP.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Verify OTP for password reset
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ email }).select('+otp +otpExpires +otpAttempts');
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    if (user.otpAttempts >= 5) {
      return res.status(429).json({ success: false, message: 'Too many attempts. Please request a new OTP.' });
    }
    user.otpAttempts += 1;
    await user.save();
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    // Mark OTP as verified (clear it)
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

// Reset password after OTP verification
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    // Set new password
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};