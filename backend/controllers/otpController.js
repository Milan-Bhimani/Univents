const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mailer');

exports.generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate OTP with crypto for better randomness
    const crypto = require('crypto');
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    user.otpAttempts = 0;
    await user.save();

    // Send email
    try {
      await mailer.sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      throw new Error('Failed to send OTP email');
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    console.error('OTP generation/sending error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input format'
      });
    }

    const user = await User.findOne({ email })
      .select('+otp +otpExpires +otpAttempts');  // Explicitly select OTP fields

    if (!user) {
  
      return res.status(401).json({
        success: false,
        message: 'Invalid email'
      });
    }



    // Check for too many attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please request a new OTP.'
      });
    }

    // Increment attempt counter
    user.otpAttempts += 1;
    await user.save();

    if (user.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (user.otpExpires < Date.now()) {
  
      return res.status(401).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );



    // Remove sensitive data
    user.password = undefined;
    user.otp = undefined;
    user.otpExpires = undefined;

    res.status(200).json({
      success: true,
      data: {
        token,
        user
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'OTP verification failed'
    });
  }
};