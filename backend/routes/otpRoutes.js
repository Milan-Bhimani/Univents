const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many OTP verification attempts, please try again later'
});

// Single set of OTP routes
router.post('/generate', otpController.generateOTP);
router.post('/verify', otpLimiter, otpController.verifyOTP);

module.exports = router;