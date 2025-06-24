const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  college: {
    type: String,
    trim: true
  },
  // User location for hyperlocal features
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  // User preferences and interests
  interests: [{
    type: String,
    enum: ['technology', 'business', 'design', 'marketing', 'science', 'arts', 'sports', 'health', 'education', 'networking']
  }],
  preferences: {
    maxDistance: {
      type: Number,
      default: 25000 // 25km in meters
    },
    eventTypes: [{
      type: String,
      enum: ['hackathon', 'seminar', 'workshop', 'competition', 'conference', 'networking']
    }],
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    difficulty: [{
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }]
  },
  // Academic information
  academicInfo: {
    year: {
      type: String,
      enum: ['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'postgraduate']
    },
    major: String,
    gpa: Number,
    skills: [String],
    resume: String // URL to resume file
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  profilePicture: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user'
  },
  // Event-related data
  eventsCreated: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  }],
  eventsRegistered: [{
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event'
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
  eventsAttended: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  }],
  // Social features
  following: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  // Gamification
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    icon: String
  }],
  // Analytics
  profileViews: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  otp: {
    type: String,
    select: false
  },
  otpExpires: {
    type: Date,
    select: false
  },
  otpAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// Create geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update lastActive timestamp
userSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastActive = Date.now();
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addPoints = function(points) {
  this.points += points;
  return this.save();
};

userSchema.methods.addBadge = function(badge) {
  this.badges.push(badge);
  return this.save();
};

userSchema.methods.isFollowing = function(userId) {
  return this.following.includes(userId);
};

// Static methods
userSchema.statics.findNearby = function(longitude, latitude, maxDistance = 50000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;