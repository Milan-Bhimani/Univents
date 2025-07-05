import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaGlobe, FaWifi, FaVideo, FaUsers, FaCalendarAlt, FaArrowRight, FaLaptopCode, FaChalkboardTeacher, FaTools, FaMicrophone, FaHandshake, FaTrophy } from 'react-icons/fa';
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
  const [categoryStats, setCategoryStats] = useState({});

  const categories = [
    { id: 'hackathon', name: 'Hackathons', icon: <FaLaptopCode />, color: 'from-purple-500 to-pink-500', description: 'Innovation challenges' },
    { id: 'seminar', name: 'Seminars', icon: <FaChalkboardTeacher />, color: 'from-blue-500 to-cyan-500', description: 'Expert-led sessions' },
    { id: 'workshop', name: 'Workshops', icon: <FaTools />, color: 'from-green-500 to-emerald-500', description: 'Hands-on learning' },
    { id: 'conference', name: 'Conferences', icon: <FaMicrophone />, color: 'from-red-500 to-orange-500', description: 'Industry insights' },
    { id: 'networking', name: 'Networking', icon: <FaHandshake />, color: 'from-indigo-500 to-purple-500', description: 'Professional connections' },
    { id: 'competition', name: 'Competitions', icon: <FaTrophy />, color: 'from-yellow-500 to-orange-500', description: 'Win amazing prizes' }
  ];

  useEffect(() => {
    checkUserSetup();
    fetchEvents();
    fetchOnlineEvents();
    fetchCategoryCounts();
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

  const fetchCategoryCounts = async () => {
    const stats = {};
    await Promise.all(categories.map(async (category) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/events/category/${category.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        stats[category.id] = data.count || 0;
      } catch {
        stats[category.id] = 0;
      }
    }));
    setCategoryStats(stats);
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
          className="relative z-20 text-center px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-lg tracking-wide">
            Discover Amazing <span className="text-yellow-400">Events</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Find personalized events happening near you and around the world
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => {
                document.querySelector('.events-section').scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-4 text-lg font-bold bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
            >
              Discover Events
            </button>
            <Link
              to="/create-event/edit"
              className="w-full sm:w-auto px-10 py-4 text-lg font-bold bg-gray-800/80 text-white rounded-xl hover:bg-gray-700/80 transition-all transform hover:scale-105 shadow-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Create Event
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Setup Prompts */}
      <div className="px-6 py-12 space-y-8">
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

      {/* Personalized Sections */}
      <section className="py-20 px-6 events-section">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Category Showcase Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-yellow-400 mb-6 drop-shadow-lg tracking-wide">
                Explore Categories
              </h2>
              <p className="text-gray-300 text-xl leading-relaxed max-w-3xl mx-auto">
                Discover events across different categories and find what interests you most
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Link to={`/category/${category.id}`}>
                    <div className={`bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300 shadow-lg hover:shadow-2xl text-center h-full`}>
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.color} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white text-2xl">
                          {category.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {category.description}
                      </p>
                      <div className="text-2xl font-bold text-yellow-400">
                        {categoryStats[category.id] || 0}
                      </div>
                      <div className="text-gray-500 text-xs">
                        Events
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Online Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full border border-yellow-400/30"
                  >
                    <FaGlobe className="text-3xl text-yellow-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-black text-yellow-400 mb-2 drop-shadow-lg tracking-wide">
                      Online Events
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Join virtual events from anywhere in the world
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/events/online" 
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span>View All</span>
                    <FaArrowRight className="text-xl" />
                  </Link>
                </motion.div>
              </div>

              {/* Online Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <FaWifi className="text-2xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Global Access</div>
                </div>
                <div className="text-center">
                  <FaVideo className="text-2xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Virtual Experience</div>
                </div>
                <div className="text-center">
                  <FaUsers className="text-2xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Worldwide Community</div>
                </div>
                <div className="text-center">
                  <FaCalendarAlt className="text-2xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Flexible Schedule</div>
                </div>
              </div>
              
              {onlineEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {onlineEvents.slice(0, 8).map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group bg-gray-700/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-600/30 hover:border-yellow-400/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      <div className="relative">
                        <img 
                          src={getEventImage(event.category)} 
                          alt={event.title} 
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                        <div className="absolute top-3 left-3">
                          <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                            {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Event'}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gray-300">
                            <FaGlobe className="inline mr-1" />
                            Online
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-yellow-400 mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed text-sm">
                          {event.description}
                        </p>
                        <div className="text-gray-400 text-sm mb-2 font-medium">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400 text-sm mb-4 font-medium line-clamp-1">
                          📍 {event.location}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link 
                            to={`/events/${event._id}`} 
                            className="w-full inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 text-center"
                          >
                            View Details
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center py-16 bg-gray-700/30 backdrop-blur-lg rounded-2xl border border-gray-600/30"
                >
                  <FaGlobe className="text-6xl text-gray-500 mx-auto mb-6" />
                  <div className="text-gray-300 text-2xl font-semibold mb-4">
                    No online events available
                  </div>
                  <p className="text-gray-500 text-lg mb-8">
                    Check back later for exciting virtual events!
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FaGlobe className="text-xl" />
                      Refresh Events
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Recommended Events */}
          {userInterests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RecommendedEvents />
            </motion.div>
          )}

          {/* Nearby Events */}
          {userLocation ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <NearbyEvents userLocation={userLocation} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 text-center mt-8"
            >
              <div className="text-3xl text-yellow-400 mb-4">📍</div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">Location Not Set</div>
              <div className="text-gray-300 text-lg mb-4">Enable location to discover events happening near you!</div>
              <div className="text-gray-500 text-sm">You can set your location in your profile or allow location access when prompted.</div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 bg-gray-800/80 backdrop-blur-sm text-gray-400 mt-20 border-t border-gray-700/30">
        <div className="flex items-center justify-center space-x-3">
          <div className="text-2xl text-yellow-400">📅</div>
          <span className="text-lg font-semibold">© 2025 UniVents. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}