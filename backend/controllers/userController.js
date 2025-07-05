const User = require('../models/User');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, college, interests, location } = req.body;
    
    // If location is provided, update address using reverse geocoding
    let updatedAddress = address;
    if (location && location.coordinates) {
      try {
        const [lng, lat] = location.coordinates;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();
        if (data.display_name) {
          updatedAddress = data.display_name;
        }
      } catch (error) {
        console.error('Error in reverse geocoding:', error);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name, 
        email, 
        phone, 
        address: updatedAddress, 
        college, 
        interests,
        location 
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Get user tickets
exports.getTickets = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      tickets: user.tickets || []
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets'
    });
  }
};

// Update ticket reminder
exports.updateTicketReminder = async (req, res) => {
  try {
    const { ticketIndex, reminder } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user.tickets[ticketIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    user.tickets[ticketIndex].reminder = reminder;
    await user.save();

    res.json({
      success: true,
      message: 'Reminder updated successfully'
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reminder'
    });
  }
};

// Clean up orphaned tickets (for deleted events)
exports.cleanupOrphanedTickets = async (req, res) => {
  try {
    const users = await User.find({ 'tickets.0': { $exists: true } });
    let totalOrphanedTickets = 0;
    
    for (const user of users) {
      const originalTicketCount = user.tickets.length;
      
      // Filter out tickets where the event no longer exists
      const validTickets = [];
      for (const ticket of user.tickets) {
        const eventExists = await Event.findById(ticket.eventId);
        if (eventExists) {
          validTickets.push(ticket);
        } else {
          totalOrphanedTickets++;
        }
      }
      
      // Update user with only valid tickets
      if (validTickets.length !== originalTicketCount) {
        await User.findByIdAndUpdate(user._id, { tickets: validTickets });
      }
    }
    
    res.json({
      success: true,
      message: `Cleanup complete! Removed ${totalOrphanedTickets} orphaned tickets`
    });
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({
      success: false,
      message: 'Error during cleanup'
    });
  }
}; 