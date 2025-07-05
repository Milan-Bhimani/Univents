import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEventImage } from '../utils/eventImages';

const EventCard = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index ? index * 0.1 : 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300"
    >
      <img
        src={getEventImage(event.category)}
        alt={event.title}
        className="w-full h-48 object-cover rounded mb-4"
      />

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-yellow-400 mb-2">{event.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-3">{event.description}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-400 text-sm">
          <span className="mr-2">📅</span>
          {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
        </div>
        {event.time && (
          <div className="flex items-center text-gray-400 text-sm">
            <span className="mr-2">🕒</span>
            {event.time}
          </div>
        )}
        <div className="flex items-center text-gray-400 text-sm">
          <span className="mr-2">📍</span>
          {event.location || 'N/A'}
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <span className="mr-2">👤</span>
          {event.organizer?.name || 'Unknown Organizer'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium">
          {event.category}
        </span>
        <Link
          to={`/events/${event._id}`}
          className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard; 