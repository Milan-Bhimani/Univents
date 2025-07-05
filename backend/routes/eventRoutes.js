const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const eventController = require('../controllers/eventController');
const protect = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.get('/category/:category', eventController.getEventsByCategory);

// Protected routes (authentication required)
router.use(protect);

// Create a new event
router.post('/create', eventController.createEvent);

// Register for an event
router.post('/:id/register', eventController.registerForEvent);

// Update event
router.put('/:id', eventController.updateEvent);

// Publish event
router.patch('/:id/publish', eventController.publishEvent);

// Delete event
router.delete('/:id', eventController.deleteEvent);

// Get user's registered events
router.get('/user/registered', eventController.getUserRegisteredEvents);

// Debug endpoint to check all events
router.get('/debug/all', eventController.debugEvents);

// Get all events created by the current user
router.get('/user/created', eventController.getUserCreatedEvents);

// Get analysis for a specific event
router.get('/:id/analysis', eventController.getEventAnalysis);

// Purchase tickets for an event
router.post('/:eventId/purchase', eventController.purchaseTickets);

module.exports = router;