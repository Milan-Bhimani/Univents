const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/univents', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function cleanupOrphanedTickets() {
  try {
  
    
    // Get all users with tickets
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
    
  
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the cleanup
cleanupOrphanedTickets(); 