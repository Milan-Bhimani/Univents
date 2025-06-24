const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please specify event type'],
    enum: ['academic', 'cultural', 'sports', 'technical', 'other'],
    default: 'other'
  },
  category: {
    type: String,
    required: [true, 'Please specify event category'],
    enum: ['hackathon', 'seminar', 'workshop', 'competition', 'conference', 'networking', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    required: [true, 'Please specify event date']
  },
  time: {
    type: String,
    required: [true, 'Please specify event time']
  },
  endDate: {
    type: Date
  },
  endTime: {
    type: String
  },
  location: {
    type: String,
    required: [true, 'Please specify event location'],
    trim: true
  },
  // Geolocation fields for hyperlocal functionality
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      default: [0, 0]
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  venue: {
    name: String,
    capacity: Number,
    amenities: [String]
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Event must belong to an organizer']
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  bannerImage: {
    type: String
  },
  capacity: {
    type: Number,
    default: 0
  },
  registeredParticipants: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  // Ticketing system
  isTicketed: {
    type: Boolean,
    default: false
  },
  tickets: [{
    name: String,
    description: String,
    price: {
      type: Number,
      default: 0
    },
    quantity: Number,
    availableQuantity: Number,
    saleStartDate: Date,
    saleEndDate: Date
  }],
  // Event status and visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  published: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Social and engagement features
  tags: [String],
  interests: [{
    type: String,
    enum: ['technology', 'business', 'design', 'marketing', 'science', 'arts', 'sports', 'health', 'education', 'networking']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  prerequisites: [String],
  // Analytics and metrics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  shares: {
    type: Number,
    default: 0
  },
  // External integrations
  externalLinks: {
    website: String,
    registration: String,
    social: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String
    }
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location-based queries
eventSchema.index({ coordinates: '2dsphere' });

// Create text index for search functionality
eventSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  'venue.name': 'text'
});

// Create compound indexes for efficient queries
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ published: 1, date: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });

// Validate event date and update timestamp
eventSchema.pre('save', function(next) {
  // Update timestamp
  this.updatedAt = Date.now();

  // Validate event date is from tomorrow onwards (only for new events)
  if (this.isNew) {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.date < tomorrow) {
      next(new Error('Event date must be from tomorrow onwards'));
      return;
    }
  }

  // Set available quantity equal to quantity for new tickets
  if (this.isTicketed && this.tickets) {
    this.tickets.forEach(ticket => {
      if (ticket.availableQuantity === undefined) {
        ticket.availableQuantity = ticket.quantity;
      }
    });
  }

  next();
});

// Only return published events for public queries
eventSchema.pre(/^find/, function(next) {
  // Only apply this filter if it's not an admin query
  if (!this.getOptions().includeUnpublished) {
    this.where({ published: true });
  }
  next();
});

// Populate organizer details when querying
eventSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'organizer',
    select: 'name email profilePicture college'
  });
  next();
});

// Instance method to check if user is registered
eventSchema.methods.isUserRegistered = function(userId) {
  return this.registeredParticipants.some(
    participant => participant.user.toString() === userId.toString()
  );
};

// Instance method to get available tickets
eventSchema.methods.getAvailableTickets = function() {
  if (!this.isTicketed) return [];
  
  const now = new Date();
  return this.tickets.filter(ticket => 
    ticket.availableQuantity > 0 &&
    (!ticket.saleStartDate || ticket.saleStartDate <= now) &&
    (!ticket.saleEndDate || ticket.saleEndDate >= now)
  );
};

// Static method to find events near a location
eventSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

// Static method to get events by interests
eventSchema.statics.findByInterests = function(interests) {
  return this.find({
    interests: { $in: interests }
  });
};

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;