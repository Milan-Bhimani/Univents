const Event = require('../models/Event');
const User = require('../models/User');

// Machine Learning-based recommendation system
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('eventsRegistered.event');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's event history for collaborative filtering
    const userEventHistory = user.eventsRegistered.map(reg => reg.event);
    
    // Get all events for content-based filtering
    const allEvents = await Event.find({
      date: { $gte: new Date() },
      published: true
    }).populate('organizer', 'name email college');

    // Apply multiple recommendation algorithms
    const recommendations = await Promise.all([
      getContentBasedRecommendations(user, allEvents),
      getCollaborativeRecommendations(user, userEventHistory),
      getPopularityBasedRecommendations(allEvents),
      getLocationBasedRecommendations(user, allEvents)
    ]);

    // Combine and weight different recommendation sources
    const combinedRecommendations = combineRecommendations(recommendations, {
      contentBased: 0.4,
      collaborative: 0.3,
      popularity: 0.2,
      location: 0.1
    });

    // Remove duplicates and sort by score
    const uniqueRecommendations = removeDuplicates(combinedRecommendations);
    uniqueRecommendations.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      count: uniqueRecommendations.length,
      data: uniqueRecommendations.slice(0, 20) // Return top 20 recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations'
    });
  }
};

// Content-based filtering
async function getContentBasedRecommendations(user, events) {
  const recommendations = [];
  
  for (const event of events) {
    let score = 0;
    let reasons = [];
    // Interest matching (40% weight)
    if (user.interests && event.interests) {
      const matchingInterests = event.interests.filter(interest => 
        user.interests.includes(interest)
      );
      if (matchingInterests.length > 0) {
        reasons.push('Matched your interests');
      }
      const interestScore = (matchingInterests.length / Math.max(event.interests.length, 1)) * 40;
      const interestPercent = (matchingInterests.length / Math.max(event.interests.length, 1)) * 100;

      score += interestScore;
      // Optionally, attach interestPercent to the event for frontend display
      event._doc.interestPercent = interestPercent;
    }
    // Tag matching (30% weight)
    if (user.tags && event.tags && user.tags.length > 0 && event.tags.length > 0) {
      const matchingTags = event.tags.filter(tag => user.tags.includes(tag));
      if (matchingTags.length > 0) {
        reasons.push('Matched your tags');
      }
      score += (matchingTags.length / Math.max(event.tags.length, 1)) * 30;
    }
    // Category preference (20% weight)
    if (user.preferences.eventTypes && user.preferences.eventTypes.includes(event.category)) {
      reasons.push('Preferred event type');
      score += 20;
    }
    // Difficulty match (10% weight)
    if (user.preferences.difficulty && user.preferences.difficulty.includes(event.difficulty)) {
      reasons.push('Preferred difficulty');
      score += 10;
    }
    if (score > 0) {
      recommendations.push({
        event: event,
        score: score,
        reason: reasons.join(', ') || 'Based on your interests and preferences'
      });
    }
  }
  
  return recommendations;
}

// Collaborative filtering
async function getCollaborativeRecommendations(user, userEventHistory) {
  const recommendations = [];
  
  if (userEventHistory.length === 0) {
    return recommendations;
  }

  // Find users with similar event preferences
  const similarUsers = await User.find({
    _id: { $ne: user._id },
    'eventsRegistered.event': { $in: userEventHistory.map(e => e._id) }
  }).populate('eventsRegistered.event');

  // Get events attended by similar users
  const similarUserEvents = new Map();
  
  for (const similarUser of similarUsers) {
    for (const registration of similarUser.eventsRegistered) {
      const eventId = registration.event._id.toString();
      const userEventIds = userEventHistory.map(e => e._id.toString());
      
      // Skip events the current user has already registered for
      if (!userEventIds.includes(eventId)) {
        if (!similarUserEvents.has(eventId)) {
          similarUserEvents.set(eventId, {
            event: registration.event,
            count: 0
          });
        }
        similarUserEvents.get(eventId).count++;
      }
    }
  }

  // Convert to recommendations with scores
  for (const [eventId, data] of similarUserEvents) {
    if (data.event.date >= new Date() && data.event.published) {
      recommendations.push({
        event: data.event,
        score: data.count * 10, // Weight by number of similar users
        reason: 'People with similar interests also registered for this'
      });
    }
  }
  
  return recommendations;
}

// Popularity-based recommendations
async function getPopularityBasedRecommendations(events) {
  const recommendations = [];
  
  for (const event of events) {
    const registrationCount = event.registeredParticipants.length;
    const viewCount = event.views || 0;
    const likeCount = event.likes ? event.likes.length : 0;
    
    // Calculate popularity score
    const popularityScore = (registrationCount * 3) + (viewCount * 0.1) + (likeCount * 2);
    
    if (popularityScore > 0) {
      recommendations.push({
        event: event,
        score: Math.min(popularityScore, 100), // Cap at 100
        reason: 'Popular event in your area'
      });
    }
  }
  
  return recommendations;
}

// Location-based recommendations
async function getLocationBasedRecommendations(user, events) {
  const recommendations = [];
  
  if (!user.location || !user.location.coordinates || 
      user.location.coordinates[0] === 0 || user.location.coordinates[1] === 0) {
    return recommendations;
  }

  const userLng = user.location.coordinates[0];
  const userLat = user.location.coordinates[1];
  const maxDistance = user.preferences.maxDistance || 25000;

  for (const event of events) {
    if (event.coordinates && event.coordinates.coordinates) {
      const distance = calculateDistance(
        userLat, userLng,
        event.coordinates.coordinates[1],
        event.coordinates.coordinates[0]
      );
      
      if (distance <= maxDistance / 1000) { // Convert meters to km
        const proximityScore = Math.max(0, 100 - (distance / (maxDistance / 1000)) * 100);
        
        recommendations.push({
          event: event,
          score: proximityScore,
          reason: `Only ${distance.toFixed(1)}km away from you`
        });
      }
    }
  }
  
  return recommendations;
}

// Combine recommendations from different sources
function combineRecommendations(recommendationSources, weights) {
  const combined = new Map();
  
  recommendationSources.forEach((source, index) => {
    const weight = Object.values(weights)[index];
    
    source.forEach(rec => {
      const eventId = rec.event._id.toString();
      
      if (!combined.has(eventId)) {
        combined.set(eventId, {
          event: rec.event,
          score: 0,
          reasons: []
        });
      }
      
      const existing = combined.get(eventId);
      existing.score += rec.score * weight;
      existing.reasons.push(rec.reason);
    });
  });
  
  return Array.from(combined.values());
}

// Remove duplicate recommendations
function removeDuplicates(recommendations) {
  const seen = new Set();
  return recommendations.filter(rec => {
    const eventId = rec.event._id.toString();
    if (seen.has(eventId)) {
      return false;
    }
    seen.add(eventId);
    return true;
  });
}

// Helper function to calculate distance
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

// Update user preferences for better recommendations
exports.updateUserPreferences = async (req, res) => {
  try {
    const { interests, maxDistance, eventTypes, difficulty, notifications } = req.body;
    
    const updateData = {};
    
    if (interests) updateData.interests = interests;
    if (maxDistance) updateData['preferences.maxDistance'] = maxDistance;
    if (eventTypes) updateData['preferences.eventTypes'] = eventTypes;
    if (difficulty) updateData['preferences.difficulty'] = difficulty;
    if (notifications) updateData['preferences.notifications'] = notifications;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        interests: user.interests,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
};