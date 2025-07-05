import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaArrowRight, FaUsers, FaStar } from 'react-icons/fa';
import { getEventImage } from '../utils/eventImages';

const EventCard = ({ event, index }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const getCategoryColor = (category) => {
    const colors = {
      hackathon: 'from-purple-500 to-pink-500',
      seminar: 'from-blue-500 to-cyan-500',
      workshop: 'from-green-500 to-emerald-500',
      conference: 'from-red-500 to-orange-500',
      networking: 'from-indigo-500 to-purple-500',
      competition: 'from-yellow-500 to-orange-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index ? index * 0.1 : 0 }}
      whileHover={{ 
        scale: 1.03,
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-200 group"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getEventImage(event.category)}
          alt={`${event.title} event`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-lg`}>
            {event.category}
          </span>
        </div>

        {/* Organizer Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-300">
            <FaUser className="inline mr-1" />
            {event.organizer?.name || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-yellow-400 mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-300 text-sm">
            <FaCalendarAlt className="text-yellow-400 mr-3 w-4 h-4" />
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>
          
          {event.time && (
            <div className="flex items-center text-gray-300 text-sm">
              <FaClock className="text-yellow-400 mr-3 w-4 h-4" />
              <span className="font-medium">{formatTime(event.time)}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-300 text-sm">
            <FaMapMarkerAlt className="text-yellow-400 mr-3 w-4 h-4" />
            <span className="font-medium line-clamp-1">{event.location || 'Location TBD'}</span>
          </div>

          {/* Registrants Count */}
          {event.registrants && (
            <div className="flex items-center text-gray-300 text-sm">
              <FaUsers className="text-yellow-400 mr-3 w-4 h-4" />
              <span className="font-medium">{event.registrants.length} registered</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={`/events/${event._id}`}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            View Details
          </Link>
        </motion.div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-400/20 transition-all duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default EventCard; 