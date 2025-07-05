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

// Purchase tickets for an event
router.post('/:eventId/purchase', async (req, res) => {
  try {
    const { ticketId, quantity } = req.body;
    const eventId = req.params.eventId;

    if (!ticketId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a valid ticket type and quantity'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Block organizer from buying tickets
    if (event.organizer.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Organizers cannot buy tickets for their own events.'
      });
    }

    if (!event.isTicketed) {
      return res.status(400).json({
        success: false,
        message: 'This event does not have tickets available'
      });
    }

    const ticket = event.tickets.id(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket type not found'
      });
    }

    if (ticket.availableQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough tickets available'
      });
    }

    // Update ticket quantity
    ticket.availableQuantity -= quantity;
    await event.save();

    // Add tickets to user's purchases
    const user = await User.findById(req.user._id);
    if (!user.tickets) {
      user.tickets = [];
    }

    user.tickets.push({
      eventId: event._id,
      ticketId: ticket._id,
      ticketName: ticket.name,
      quantity,
      purchaseDate: new Date(),
      totalAmount: quantity * ticket.price
    });

    await user.save();

    // Add user to registeredParticipants if not already present
    const isAlreadyRegistered = event.registeredParticipants.some(
      participant => participant.user.toString() === req.user._id.toString()
    );
    if (!isAlreadyRegistered) {
      event.registeredParticipants.push({
        user: req.user._id,
        registeredAt: new Date(),
        status: 'registered'
      });
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Tickets purchased successfully',
      data: {
        tickets: user.tickets[user.tickets.length - 1]
      }
    });
  } catch (error) {
    console.error('Error purchasing tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing ticket purchase'
    });
  }
});

module.exports = router;