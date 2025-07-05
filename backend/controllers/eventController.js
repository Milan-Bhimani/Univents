const Event = require('../models/Event');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const mailer = require('../utils/mailer');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { 
      title, 
      description, 
      date, 
      time, 
      endDate,
      endTime,
      location, 
      category, 
      isTicketed, 
      tickets,
      coordinates,
      address,
      venue,
      interests,
      difficulty,
      prerequisites,
      tags,
      type
    } = req.body;

    // Set default coordinates if not provided
    let eventCoordinates = coordinates;
    if (!eventCoordinates || !eventCoordinates.coordinates) {
      eventCoordinates = {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates, should be updated with actual location
      };
    }

    const event = new Event({
      title,
      description,
      date,
      time,
      endDate,
      endTime,
      location,
      coordinates: eventCoordinates,
      address,
      venue,
      organizer: req.user._id,
      category,
      isTicketed,
      tickets: isTicketed ? tickets : [],
      interests: interests || [],
      difficulty: difficulty || 'beginner',
      prerequisites: prerequisites || [],
      tags: tags || [],
      image: req.file ? req.file.filename : 'default-event.jpg',
      type: type || 'other',
      published: true,
      status: 'published'
    });

    let savedEvent;
    try {
      savedEvent = await event.save();
    } catch (saveError) {
      console.error('Event save error:', saveError);
      return res.status(400).json({
        success: false,
        message: 'Event validation failed',
        error: saveError.message
      });
    }

    // Use includeUnpublished: true to bypass the published filter
    const freshEvent = await Event.findById(savedEvent._id, null, { includeUnpublished: true })
      .populate('organizer', 'name email college');
    if (!freshEvent) {
      console.error('Event was not found after saving.');
      return res.status(500).json({
        success: false,
        message: 'Event was not saved to the database'
      });
    }


    // Notify matching users
    const users = await User.find({});
    let emailsSent = 0;
    let emailsFailed = 0;
    for (const user of users) {
      const percent = getInterestMatchPercent(user.interests, event.interests);
      let inRange = false;
      if (event.location === 'Online') {
        inRange = true;
      } else if (user.location && user.location.coordinates && event.coordinates && event.coordinates.coordinates) {
        const dist = getDistanceKm(user.location.coordinates, event.coordinates.coordinates);
        inRange = dist <= 25; // 25km
      }
      if (percent > 50 && inRange) {
        try {
          await sendEventEmail(user, event);
          emailsSent++;
        } catch (e) {
          emailsFailed++;
          console.error(`[MAIL] Failed to send event email to: ${user.email}`, e);
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: freshEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { category, interests, difficulty, search, onlineOnly } = req.query;
    const query = { published: true };
    
    if (category) {
      query.category = category;
    }

    if (interests) {
      const interestArray = interests.split(',');
      query.interests = { $in: interestArray };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (onlineOnly === 'true') {
      // Filter for online events using case-insensitive regex
      const onlineLocationFilter = { location: { $regex: /online|virtual|zoom|google meet|teams|webinar|web conference/i } };
      
      if (query.$or) {
        // If there's already a search query, combine them with AND logic
        query.$and = [
          { $or: query.$or },
          onlineLocationFilter
        ];
        delete query.$or; // Remove the original $or since it's now in $and
      } else {
        // If no search query, just use the online location filter
        query.location = onlineLocationFilter.location;
      }
  
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email college')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id, null, { includeUnpublished: true })
      .populate('organizer', 'name email college')
      .populate('registeredParticipants.user', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Increment view count
    event.views = (event.views || 0) + 1;
    await event.save();

    res.json({
      success: true,
      message: 'Operation successful',
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event'
    });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.registeredParticipants.some(
      participant => participant.user.toString() === req.user._id.toString()
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check capacity
    if (event.capacity && event.registeredParticipants.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is at full capacity'
      });
    }

    // Add user to registered participants
    event.registeredParticipants.push({
      user: req.user._id,
      registeredAt: new Date(),
      status: 'registered'
    });

    await event.save();

    // Update user's registered events
    const user = await User.findById(req.user._id);
    user.eventsRegistered.push({
      event,
      registeredAt: new Date(),
      status: 'registered'
    });
    await user.save();

    res.json({
      success: true,
      message: 'Successfully registered for the event',
      event
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event'
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('organizer', 'name email college');

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event'
    });
  }
};

// Publish event
exports.publishEvent = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }


    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this event'
      });
    }

    event.status = 'published';
    event.published = true;
    await event.save();

    res.json({
      success: true,
      message: 'Event published successfully',
      event
    });
  } catch (error) {
    console.error('Error publishing event:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing event'
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if ((event.organizer._id ? event.organizer._id.toString() : event.organizer.toString()) !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove tickets for this event from all users
    await User.updateMany(
      {},
      { $pull: { tickets: { eventId: event._id } } }
    );

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event'
    });
  }
};

// Get events by category
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Event.find({ 
      category: category,
      published: true,
      date: { $gte: new Date() }
    })
    .populate('organizer', 'name email college')
    .sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Error fetching events by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events by category'
    });
  }
};

// Get user's registered events
exports.getUserRegisteredEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'eventsRegistered.event',
        populate: {
          path: 'organizer',
          select: 'name email college'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const registeredEvents = user.eventsRegistered
      .filter(reg => reg.event) // Filter out any null events
      .map(reg => ({
        ...reg.event.toObject(),
        registrationStatus: reg.status,
        registeredAt: reg.registeredAt
      }));

    res.json({
      success: true,
      count: registeredEvents.length,
      events: registeredEvents
    });
  } catch (error) {
    console.error('Error fetching user registered events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registered events'
    });
  }
};

// Utility: Calculate interest match percent
function getInterestMatchPercent(userInterests, eventInterests) {
  if (!userInterests || !eventInterests || eventInterests.length === 0) return 0;
  const matches = eventInterests.filter(i => userInterests.includes(i));
  return (matches.length / eventInterests.length) * 100;
}

// Utility: Calculate distance (Haversine)
function getDistanceKm([lng1, lat1], [lng2, lat2]) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Utility: Send email
async function sendEventEmail(user, event) {
  await mailer.sendEventNotificationEmail(user, event);
}

// Debug endpoint to list all events with locations
exports.debugEvents = async (req, res) => {
  try {
    const events = await Event.find({ published: true })
      .select('title location category published')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events: events.map(e => ({
        id: e._id,
        title: e.title,
        location: e.location,
        category: e.category,
        published: e.published
      }))
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching debug info'
    });
  }
};

// Get all events created by the current user
exports.getUserCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching user-created events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your events'
    });
  }
};

// Get analysis for a specific event (tickets booked, registrants, details)
exports.getEventAnalysis = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('registeredParticipants.user', 'name email phone');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    // Debug logs for troubleshooting
    console.log('Event organizer:', event.organizer.toString());
    console.log('Current user:', req.user._id.toString());
    // Only allow organizer to view analysis
    if (event.organizer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const totalTickets = event.isTicketed
      ? event.tickets.reduce((sum, t) => sum + (t.quantity - t.availableQuantity), 0)
      : event.registeredParticipants.length;
    const registrants = event.registeredParticipants.map(r => ({
      name: r.user.name,
      email: r.user.email,
      phone: r.user.phone,
      registeredAt: r.registeredAt,
      status: r.status
    }));
    res.json({
      success: true,
      data: {
        eventId: event._id,
        eventTitle: event.title,
        totalTickets,
        totalRegistrants: registrants.length,
        registrants
      }
    });
  } catch (error) {
    console.error('Error fetching event analysis:', error);
    res.status(500).json({ success: false, message: 'Error fetching event analysis' });
  }
};

// Purchase tickets for an event
exports.purchaseTickets = async (req, res) => {
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
    if ((event.organizer._id ? event.organizer._id.toString() : event.organizer.toString()) === req.user._id.toString()) {
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
};