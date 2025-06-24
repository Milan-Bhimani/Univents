const express = require('express');
const locationController = require('../controllers/locationController');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get nearby events
router.get('/nearby-events', locationController.getNearbyEvents);

// Get recommended events based on location and preferences
router.get('/recommended-events', locationController.getRecommendedEvents);

// Update user location
router.put('/update-location', locationController.updateUserLocation);

// Get events by city/area
router.get('/events-by-area', locationController.getEventsByArea);

module.exports = router;