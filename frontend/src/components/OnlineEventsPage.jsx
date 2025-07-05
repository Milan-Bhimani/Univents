import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaSpinner, FaExclamationTriangle, FaWifi, FaVideo, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import BackButton from './BackButton';
import EventCard from './EventCard';

const OnlineEventsPage = () => {
  const [onlineEvents, setOnlineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOnlineEvents();
  }, []);

  const fetchOnlineEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events?onlineOnly=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setOnlineEvents(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch online events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-5xl mx-auto">
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
              <div className="text-gray-300 text-2xl font-semibold mb-2">Loading Online Events</div>
              <div className="text-gray-500 text-lg">Connecting to virtual events worldwide...</div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-5xl mx-auto">
          <BackButton />
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="bg-red-500/20 backdrop-blur-lg rounded-3xl p-8 border border-red-500/30">
                <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-6" />
                <div className="text-red-400 text-2xl font-bold mb-3">Connection Error</div>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-5xl mx-auto">
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
                Online Events
              </h1>
              <p className="text-gray-300 text-xl leading-relaxed max-w-3xl mx-auto mb-6">
                Discover amazing virtual events you can attend from anywhere in the world. 
                Connect with people globally without leaving your home!
              </p>
              
              {/* Online Features */}
              <div className="flex justify-center items-center gap-8 mt-8 pt-8 border-t border-gray-700/30">
                <div className="text-center">
                  <FaWifi className="text-3xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Global Access</div>
                </div>
                <div className="text-center">
                  <FaVideo className="text-3xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Virtual Experience</div>
                </div>
                <div className="text-center">
                  <FaUsers className="text-3xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Worldwide Community</div>
                </div>
                <div className="text-center">
                  <FaCalendarAlt className="text-3xl text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Flexible Schedule</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Events Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
            {onlineEvents.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No online events found.</div>
            ) : (
              <div className="text-center text-gray-300 text-lg">
                Found <span className="text-yellow-400 font-bold">{onlineEvents.length}</span> online event{onlineEvents.length !== 1 ? 's' : ''} ready to join from anywhere!
              </div>
            )}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {onlineEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <EventCard event={event} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineEventsPage; 