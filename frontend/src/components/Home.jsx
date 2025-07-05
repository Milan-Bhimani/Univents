import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import Twinkling from '../assets/Twinkling';
import LocationPermission from './LocationPermission';
import NearbyEvents from './NearbyEvents';
import RecommendedEvents from './RecommendedEvents';
import InterestSelector from './InterestSelector';
import MapComponent from './MapComponent';
import { getEventImage } from '../utils/eventImages';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showInterestSelector, setShowInterestSelector] = useState(false);
  const [userInterests, setUserInterests] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [onlineEvents, setOnlineEvents] = useState([]);

  useEffect(() => {
    checkUserSetup();
    fetchEvents();
    fetchOnlineEvents();
  }, []);

  const checkUserSetup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success && data.data) {
        const user = data.data;
        
        // Check if user has set interests
        if (!user.interests || user.interests.length === 0) {
          setShowInterestSelector(true);
        } else {
          setUserInterests(user.interests);
        }

        // Check if user has location
        if (!user.location || !user.location.coordinates || 
            user.location.coordinates[0] === 0 || user.location.coordinates[1] === 0) {
          setShowLocationPrompt(true);
        } else {
          setUserLocation({
            latitude: user.location.coordinates[1],
            longitude: user.location.coordinates[0]
          });
        }
      }
    } catch (error) {
      console.error('Error checking user setup:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAllEvents(data.events || []);
        setFilteredEvents(data.events || []);
      } else {
        throw new Error(data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events?onlineOnly=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOnlineEvents(data.data || []);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleLocationUpdate = (location) => {
    setUserLocation(location);
    setShowLocationPrompt(false);
  };

  const handleInterestsSave = async (interests) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recommendations/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ interests })
      });

      const data = await response.json();
      if (data.success) {
        setUserInterests(interests);
        setShowInterestSelector(false);
      }
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  const handleSearch = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    if (!query) {
      setFilteredEvents(allEvents);
      return;
    }
    const filtered = allEvents.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.location.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredEvents(filtered);
  }, [allEvents]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section with Twinkling Effect */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Twinkling className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-gray-900/50 z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Discover Amazing <span className="text-yellow-400">Events</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Find personalized events happening near you
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => {
                document.querySelector('.events-section').scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105"
            >
              Discover Events
            </button>
            <Link
              to="/create-event/edit"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all transform hover:scale-105"
            >
              Create Event
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Setup Prompts */}
      <div className="px-6 py-8 space-y-6">
        {showInterestSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <InterestSelector
              selectedInterests={userInterests}
              onInterestsChange={setUserInterests}
              onSave={handleInterestsSave}
              onSkip={() => setShowInterestSelector(false)}
            />
          </motion.div>
        )}

        {showLocationPrompt && !showInterestSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <LocationPermission
              onLocationUpdate={handleLocationUpdate}
              onSkip={() => setShowLocationPrompt(false)}
            />
          </motion.div>
        )}
      </div>

      {/* Search Bar */}
      <motion.div
        className="flex justify-center px-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-center bg-gray-800 px-6 py-3 rounded-full shadow-lg w-full max-w-lg border border-yellow-400">
          <FaSearch className="text-yellow-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search events by name, location, or description..."
            className="bg-transparent outline-none text-white placeholder-gray-300 px-4 w-full"
          />
        </div>
      </motion.div>

      {/* Map Toggle */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowMap(!showMap)}
          className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-yellow-500 transition-colors"
        >
          {showMap ? 'Hide Map' : 'Show Map View'}
        </button>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 mt-8"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-yellow-400">
                Search Results for "{searchQuery}"
              </h3>
              <span className="text-gray-400">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <motion.div
                    key={event._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    <img src={getEventImage(event.category)} alt={event.title} className="w-full h-40 object-cover rounded mb-4" />
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-2 line-clamp-2">{event.description}</p>
                    <div className="text-gray-400 text-sm mb-2">{new Date(event.date).toLocaleString()}</div>
                    <div className="text-gray-400 text-sm mb-2">📍 {event.location}</div>
                    <Link to={`/events/${event._id}`} className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">View Details →</Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="text-gray-400 text-xl mb-2">No events found for "{searchQuery}"</div>
                <p className="text-gray-500">Try different keywords or browse all events</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Map View */}
      {showMap && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="px-6 mt-24 relative z-0"
        >
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Events Map</h3>
            <MapComponent
              events={filteredEvents}
              userLocation={userLocation}
              height="500px"
              onEventSelect={(event) => navigate(`/events/${event._id}`)}
            />
          </div>
        </motion.div>
      )}

      {/* Personalized Sections */}
      <section className="py-16 px-6 events-section">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Online Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-yellow-400">🌐 Online Events</h2>
              <Link to="/events/online" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">
                View All Online Events →
              </Link>
            </div>
            
            {onlineEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onlineEvents.slice(0, 6).map(event => (
                  <motion.div
                    key={event._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    <img src={getEventImage(event.category)} alt={event.title} className="w-full h-40 object-cover rounded mb-4" />
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-2 line-clamp-2">{event.description}</p>
                    <div className="text-gray-400 text-sm mb-2">{new Date(event.date).toLocaleString()}</div>
                    <div className="text-gray-400 text-sm mb-2">📍 {event.location}</div>
                    <Link to={`/events/${event._id}`} className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors">View Details →</Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="text-gray-400 text-xl mb-2">No online events available at the moment</div>
                <p className="text-gray-500">Check back later for virtual events!</p>
              </div>
            )}
          </motion.div>

          {/* Recommended Events */}
          {userInterests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <RecommendedEvents />
            </motion.div>
          )}

          {/* Nearby Events */}
          {userLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <NearbyEvents userLocation={userLocation} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 text-gray-400 mt-16">
        <div className="flex items-center justify-center space-x-2">
          <img src="/logo.png" alt="UniVents Logo" className="h-6 w-auto" />
          <span>© 2025 UniVents. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}