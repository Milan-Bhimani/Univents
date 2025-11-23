import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle, FaArrowRight, FaLocationArrow, FaGlobe } from 'react-icons/fa';
import EventCard from './EventCard';

const NearbyEvents = ({ userLocation, maxDistance = 25000 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Store last fetched coordinates to prevent repeated fetches
  const lastCoords = useRef({ lat: null, lng: null });

  useEffect(() => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      setLoading(false);
      setError('Location not set. Please enable location to see nearby events.');
      return;
    }
    // Only fetch if coordinates actually changed
    if (
      lastCoords.current.lat !== userLocation.latitude ||
      lastCoords.current.lng !== userLocation.longitude
    ) {
      lastCoords.current = {
        lat: userLocation.latitude,
        lng: userLocation.longitude
      };
      fetchNearbyEvents(userLocation.latitude, userLocation.longitude);
    }
    // eslint-disable-next-line
  }, [userLocation, maxDistance]);

  const fetchNearbyEvents = async (latitude, longitude) => {
    if (!latitude || !longitude) return;
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://univents-764n.onrender.com/api/location/nearby-events?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`,
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

  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 text-center">
        <div className="text-3xl text-yellow-400 mb-4">📍</div>
        <div className="text-2xl font-bold text-yellow-400 mb-2">Location Not Set</div>
        <div className="text-gray-300 text-lg mb-4">Enable location to discover events happening near you!</div>
        <div className="text-gray-500 text-sm">You can set your location in your profile or allow location access when prompted.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30">
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <FaSpinner className="text-4xl text-yellow-400" />
          </motion.div>
          <div className="text-gray-300 text-xl font-semibold mb-2">Finding Nearby Events</div>
          <div className="text-gray-500 text-sm">Searching within {maxDistance / 1000}km of your location</div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30"
            >
              <div className="animate-pulse">
                <div className="h-48 bg-gray-600/50 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-600/50 rounded mb-3"></div>
                <div className="h-4 bg-gray-600/50 rounded mb-2"></div>
                <div className="h-4 bg-gray-600/50 rounded mb-4"></div>
                <div className="h-10 bg-gray-600/50 rounded-xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 text-center">
        <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
        <div className="text-red-400 text-xl font-semibold mb-2">{error}</div>
        <button
          onClick={() => fetchNearbyEvents(userLocation.latitude, userLocation.longitude)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold mt-4 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full mb-6 border border-yellow-400/30"
        >
          <FaMapMarkerAlt className="text-3xl text-yellow-400" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-yellow-400 mb-4 drop-shadow-lg tracking-wide">
          Nearby Events
        </h1>
        <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto mb-4">
          Discover amazing events happening close to your current location
        </p>
        
        {/* Location Info */}
        <div className="bg-gray-700/30 backdrop-blur-lg rounded-2xl p-4 border border-gray-600/30 inline-block">
          <div className="flex items-center gap-3 text-gray-300">
            <FaLocationArrow className="text-yellow-400" />
            <span className="font-medium">
              {events.length} events within {maxDistance / 1000}km radius
            </span>
          </div>
        </div>
      </motion.div>

      {/* Events Section */}
      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="bg-gray-700/30 backdrop-blur-lg rounded-3xl p-12 border border-gray-600/30 max-w-2xl mx-auto">
            <FaGlobe className="text-6xl text-gray-500 mx-auto mb-6" />
            <div className="text-gray-300 text-2xl font-semibold mb-4">
              No events found nearby
            </div>
            <div className="text-gray-500 text-lg mb-8">
              Don't worry! Try increasing your search radius or explore events in other areas
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/events"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FaGlobe className="text-xl" />
                Explore All Events
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                <EventCard event={event} index={index} />
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/events/nearby"
                className="inline-flex items-center gap-3 bg-gray-700/50 hover:bg-gray-700/70 text-yellow-400 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 border border-gray-600/30 hover:border-yellow-400/50"
              >
                <span>View All Nearby Events</span>
                <FaArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NearbyEvents;