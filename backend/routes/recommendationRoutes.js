const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get personalized recommendations
router.get('/personalized', recommendationController.getPersonalizedRecommendations);

// Update user preferences
router.put('/preferences', recommendationController.updateUserPreferences);

module.exports = router;