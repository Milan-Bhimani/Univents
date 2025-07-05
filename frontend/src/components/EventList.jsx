import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaCalendarAlt, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import EventCard from './EventCard';

const EventList = ({ eventType, hideHeading, hideCreateButton }) => {
  const params = useParams();
  const category = eventType || params.category;
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/events/category/${category}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch events');
        }
        setEvents(data.events || data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [category]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="min-h-[400px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <FaSpinner className="text-4xl text-yellow-400" />
              </motion.div>
              <div className="text-gray-300 text-xl font-medium">Loading {category} events...</div>
              <div className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest events</div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="min-h-[400px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30">
                <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
                <div className="text-red-400 text-xl font-semibold mb-2">Oops! Something went wrong</div>
                <div className="text-gray-400 text-sm mb-6">{error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 mt-8 drop-shadow-lg tracking-tight">Section Title</h2>
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/30 max-w-2xl mx-auto">
              <FaCalendarAlt className="text-6xl text-gray-500 mx-auto mb-6" />
              <div className="text-gray-300 text-2xl font-semibold mb-4">
                No {category} events found
              </div>
              <div className="text-gray-500 text-lg mb-8">
                Be the first to create an amazing {category} event and bring people together!
              </div>
              {!hideCreateButton && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/create-event/edit"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <FaPlus className="text-xl" />
                    Create Your First {category.charAt(0).toUpperCase() + category.slice(1)} Event
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
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

export default EventList;