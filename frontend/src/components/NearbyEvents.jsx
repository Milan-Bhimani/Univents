import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiClock, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NearbyEvents = ({ userLocation, maxDistance = 25000 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userLocation) {
      fetchNearbyEvents();
    }
  }, [userLocation, maxDistance]);

  const fetchNearbyEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { latitude, longitude } = userLocation;
      
      const response = await fetch(
        `http://localhost:5000/api/location/nearby-events?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch nearby events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-yellow-400 flex items-center">
          <FiMapPin className="mr-2" />
          Nearby Events
        </h3>
        <span className="text-sm text-gray-400">
          {events.length} events within {maxDistance / 1000}km
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <FiMapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No events found in your area</p>
          <p className="text-sm text-gray-500 mt-2">
            Try increasing your search radius in settings
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-1" />
                      {event.registeredParticipants?.length || 0} registered
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-yellow-400">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {event.distance ? `${event.distance}km away` : event.location}
                      </span>
                    </div>
                    
                    <Link
                      to={`/events/${event._id}`}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

                {event.category && (
                  <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium ml-4">
                    {event.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            to="/events/nearby"
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            View All Nearby Events →
          </Link>
        </div>
      )}
    </div>
  );
};

export default NearbyEvents;