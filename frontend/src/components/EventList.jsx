import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BackButton from './BackButton';

const EventList = ({ eventType }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventType}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch events');
        }
        
        setEvents(data.events);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [eventType]);

  if (isLoading || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center">
        <div className={`text-xl ${error ? 'text-red-500' : 'text-yellow-400'}`}>
          {error || 'Loading events...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 relative">
      <BackButton />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center capitalize">{eventType}</h1>

        {events.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl mb-4">No {eventType} found</p>
            <Link
              to="/create-event/edit"
              className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all"
            >
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-lg border border-gray-700/30 hover:border-yellow-400/30 transition-all group"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-2">{event.description}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/events/${event._id}`}
                    className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;