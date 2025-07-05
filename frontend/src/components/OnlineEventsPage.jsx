import React, { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading online events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <BackButton />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">🌐 Online Events</h1>
          <p className="text-gray-400 text-lg">
            Discover amazing virtual events you can attend from anywhere
          </p>
        </div>

        {onlineEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">No online events available at the moment</div>
            <p className="text-gray-500">Check back later for new virtual events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {onlineEvents.map((event, index) => (
              <EventCard key={event._id} event={event} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineEventsPage; 