const Event = require('../models/Event');
const User = require('../models/User');

// Get events near user's location
exports.getNearbyEvents = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 25000 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude'
      });
    }

    const events = await Event.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      date: { $gte: new Date() }, // Only future events
      published: true
    }).populate('organizer', 'name email college');

    // Add distance calculation to each event
    const eventsWithDistance = events.map(event => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        event.coordinates.coordinates[1],
        event.coordinates.coordinates[0]
      );
      
      return {
        ...event.toObject(),
        distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
      };
    });

    res.status(200).json({
      success: true,
      count: eventsWithDistance.length,
      data: eventsWithDistance
    });
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby events'
    });
  }
};

// Get personalized event recommendations
exports.getRecommendedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { longitude, latitude } = req.query;
    const userLng = longitude || user.location.coordinates[0];
    const userLat = latitude || user.location.coordinates[1];
    const maxDistance = user.preferences.maxDistance || 25000;

    // Build query based on user preferences
    let query = {
      date: { $gte: new Date() },
      published: true
    };

    // Add location filter if coordinates are available
    if (userLng && userLat && userLng !== 0 && userLat !== 0) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(userLng), parseFloat(userLat)]
          },
          $maxDistance: maxDistance
        }
      };
    }

    // Add interest-based filtering
    if (user.interests && user.interests.length > 0) {
      query.interests = { $in: user.interests };
    }

    // Add event type preferences
    if (user.preferences.eventTypes && user.preferences.eventTypes.length > 0) {
      query.category = { $in: user.preferences.eventTypes };
    }

    // Add difficulty preferences
    if (user.preferences.difficulty && user.preferences.difficulty.length > 0) {
      query.difficulty = { $in: user.preferences.difficulty };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email college')
      .sort({ date: 1 })
      .limit(20);

    // Calculate recommendation score for each event
    const recommendedEvents = events.map(event => {
      let score = 0;
      
      // Interest match score (40% weight)
      if (user.interests && event.interests) {
        const matchingInterests = event.interests.filter(interest => 
          user.interests.includes(interest)
        );
        score += (matchingInterests.length / Math.max(event.interests.length, 1)) * 40;
      }

      // Event type preference score (30% weight)
      if (user.preferences.eventTypes && user.preferences.eventTypes.includes(event.category)) {
        score += 30;
      }

      // Difficulty match score (20% weight)
      if (user.preferences.difficulty && user.preferences.difficulty.includes(event.difficulty)) {
        score += 20;
      }

      // Proximity score (10% weight)
      if (userLng && userLat && userLng !== 0 && userLat !== 0) {
        const distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          event.coordinates.coordinates[1],
          event.coordinates.coordinates[0]
        );
        const proximityScore = Math.max(0, 10 - (distance / maxDistance) * 10);
        score += proximityScore;
      }

      return {
        ...event.toObject(),
        recommendationScore: Math.round(score * 100) / 100
      };
    });

    // Sort by recommendation score
    recommendedEvents.sort((a, b) => b.recommendationScore - a.recommendationScore);

    res.status(200).json({
      success: true,
      count: recommendedEvents.length,
      data: recommendedEvents
    });
  } catch (error) {
    console.error('Error fetching recommended events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended events'
    });
  }
};

// Update user location
exports.updateUserLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: user.location
      }
    });
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating location'
    });
  }
};

// Get events by city/area
exports.getEventsByArea = async (req, res) => {
  try {
    const { city, state, radius = 10000 } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name'
      });
    }

    // In a real application, you would use a geocoding service like Google Maps API
    // For now, we'll search by address fields
    let query = {
      date: { $gte: new Date() },
      published: true,
      $or: [
        { 'address.city': new RegExp(city, 'i') },
        { location: new RegExp(city, 'i') }
      ]
    };

    if (state) {
      query['address.state'] = new RegExp(state, 'i');
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email college')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events by area:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events by area'
    });
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}