import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import BackButton from './BackButton';

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
      <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24">
      <BackButton />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">Event History</h1>

        {events.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event._id} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
                <div className="flex items-start gap-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center text-yellow-400">
                        <FaCalendarAlt className="mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <FaClock className="mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}