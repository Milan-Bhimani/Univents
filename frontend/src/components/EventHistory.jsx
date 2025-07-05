import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaExclamationTriangle, FaHistory, FaCheckCircle, FaUser } from 'react-icons/fa';
import BackButton from './BackButton';
import { getEventImage } from '../utils/eventImages';

// Constants
const API_URL = 'http://localhost:5000/api/events/registered';

export default function EventHistory() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch events');
        }

        setEvents(data.events);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading your event history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
              <FaExclamationTriangle className="text-3xl text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Events</h2>
            <p className="text-gray-400 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-6xl mx-auto">
        <BackButton />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full mb-4">
            <FaHistory className="text-3xl text-yellow-400" />
          </div>
          <h1 className="text-4xl font-black text-yellow-400 mb-4 drop-shadow-lg tracking-wide">
            Event History
          </h1>
          <p className="text-gray-400 text-lg">
            Track all the events you've registered for
          </p>
        </div>

        {/* Summary Stats */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{events.length}</div>
              <div className="text-gray-400 text-sm">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {events.filter(e => new Date(e.date) > new Date()).length}
              </div>
              <div className="text-gray-400 text-sm">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {events.filter(e => new Date(e.date) <= new Date()).length}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {new Set(events.map(e => e.category)).size}
              </div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const isUpcoming = new Date(event.date) > new Date();
            const isToday = new Date(event.date).toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={event._id} 
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Event Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={getEventImage(event.category)}
                        alt={event.title}
                        className="w-32 h-32 object-cover rounded-2xl border border-gray-600/50"
                      />
                      {isToday && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          TODAY
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-6">
                    {/* Event Title and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                        <p className="text-gray-400 text-base line-clamp-2">{event.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          isUpcoming 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {isUpcoming ? <FaCheckCircle /> : <FaHistory />}
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </div>
                        <div className="inline-block bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                          {event.category}
                        </div>
                      </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl">
                        <FaCalendarAlt className="text-yellow-400 text-lg" />
                        <div>
                          <div className="text-white font-semibold">
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-400 text-sm">Event Date</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl">
                        <FaClock className="text-yellow-400 text-lg" />
                        <div>
                          <div className="text-white font-semibold">
                            {event.time || 'TBD'}
                          </div>
                          <div className="text-gray-400 text-sm">Time</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl">
                        <FaMapMarkerAlt className="text-yellow-400 text-lg" />
                        <div>
                          <div className="text-white font-semibold">
                            {event.location || 'Location TBD'}
                          </div>
                          <div className="text-gray-400 text-sm">Venue</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      {event.organizer && (
                        <span className="bg-gray-700/50 px-3 py-1 rounded-full flex items-center gap-2">
                          <FaUser className="text-yellow-400" />
                          Organized by {event.organizer.name}
                        </span>
                      )}
                      {event.registrationStatus && (
                        <span className="bg-gray-700/50 px-3 py-1 rounded-full">
                          Status: {event.registrationStatus}
                        </span>
                      )}
                      {event.registeredAt && (
                        <span className="bg-gray-700/50 px-3 py-1 rounded-full">
                          Registered: {new Date(event.registeredAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}