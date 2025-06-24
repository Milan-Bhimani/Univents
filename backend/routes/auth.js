const express = require('express');
const { signup, login, googleCallback, forgotPassword, verifyResetOTP, resetPassword } = require('../controllers/authController');
const passport = require('passport');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Removed Google OAuth routes

module.exports = router;