import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaGlobe, FaTimes, FaSpinner, FaExclamationTriangle, FaPlus, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import BackButton from './BackButton';
import EventCard from './EventCard';

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Events', icon: <FaGlobe />, color: 'from-gray-500 to-gray-600' },
    { id: 'hackathon', name: 'Hackathons', icon: <FaCalendarAlt />, color: 'from-purple-500 to-pink-500' },
    { id: 'seminar', name: 'Seminars', icon: <FaCalendarAlt />, color: 'from-blue-500 to-cyan-500' },
    { id: 'workshop', name: 'Workshops', icon: <FaCalendarAlt />, color: 'from-green-500 to-emerald-500' },
    { id: 'competition', name: 'Competitions', icon: <FaCalendarAlt />, color: 'from-yellow-500 to-orange-500' },
    { id: 'conference', name: 'Conferences', icon: <FaCalendarAlt />, color: 'from-red-500 to-orange-500' },
    { id: 'networking', name: 'Networking', icon: <FaUsers />, color: 'from-indigo-500 to-purple-500' }
  ];

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedCategory]);

  const fetchAllEvents = async () => {
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
        setEvents(data.data || []);
        setFilteredEvents(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 pt-20">
        <BackButton />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <FaSpinner className="text-5xl text-yellow-400" />
            </motion.div>
            <div className="text-gray-300 text-2xl font-semibold mb-2">Loading Events</div>
            <div className="text-gray-500 text-lg">Discovering amazing events for you...</div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 pt-20">
        <BackButton />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="bg-red-500/20 backdrop-blur-lg rounded-3xl p-8 border border-red-500/30">
              <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-6" />
              <div className="text-red-400 text-2xl font-bold mb-3">Oops! Something went wrong</div>
              <div className="text-gray-400 text-lg mb-8">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 pt-20">
      <BackButton />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400/20 rounded-full mb-6 border border-yellow-400/30"
            >
              <FaGlobe className="text-4xl text-yellow-400" />
            </motion.div>
            
            <h1 className="text-5xl font-black text-yellow-400 mb-4 drop-shadow-lg tracking-wide">
              All Events
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
              Discover all available events across all categories and find your next amazing experience
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mt-8 pt-8 border-t border-gray-700/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{events.length}</div>
                <div className="text-gray-400 text-sm">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{categories.length - 1}</div>
                <div className="text-gray-400 text-sm">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">24/7</div>
                <div className="text-gray-400 text-sm">Available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 mb-6">
            <div className="flex items-center bg-gray-700/50 rounded-xl px-6 py-4 border border-gray-600/30 focus-within:border-yellow-400/50 transition-all">
              <FaSearch className="text-yellow-400 mr-4 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search events by title, description, location, or category..."
                className="bg-transparent outline-none text-white placeholder-gray-400 flex-1 text-lg"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaFilter className="text-xl" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Filter by Category</h3>
                <p className="text-gray-400">Select a category to narrow down your search</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map(category => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`p-4 rounded-xl font-semibold transition-all duration-200 border-2 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                        : 'bg-gray-700/50 text-gray-300 border-gray-600/30 hover:border-yellow-400/50 hover:bg-gray-700/70'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-gray-300 text-lg">
              Showing <span className="text-yellow-400 font-bold">{filteredEvents.length}</span> of <span className="text-yellow-400 font-bold">{events.length}</span> events
              {searchQuery && (
                <span className="text-gray-400"> for "<span className="text-yellow-400">{searchQuery}</span>"</span>
              )}
              {selectedCategory !== 'all' && (
                <span className="text-gray-400"> in <span className="text-yellow-400">{selectedCategory}</span></span>
              )}
            </div>
            <div className="text-gray-400 text-lg">
              <span className="text-yellow-400 font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/30 max-w-2xl mx-auto">
              <FaCalendarAlt className="text-6xl text-gray-500 mx-auto mb-6" />
              <div className="text-gray-300 text-2xl font-semibold mb-4">
                No events found
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </div>
              <div className="text-gray-500 text-lg mb-8">
                Try adjusting your search or filters to find more events
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/create-event/edit"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FaPlus className="text-xl" />
                  Create Your First Event
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                >
                  <EventCard event={event} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllEventsPage; 