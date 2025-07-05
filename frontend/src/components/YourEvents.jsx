import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const YourEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/events/user/created', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          setError(data.message || 'Failed to fetch events');
        }
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">Your Created Events</h1>
      {loading && <div className="text-gray-400">Loading events...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {!loading && !error && events.length === 0 && (
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/30 text-gray-300">
          <p>You haven't created any events yet.</p>
        </div>
      )}
      {!loading && !error && events.length > 0 && (
        <div className="space-y-4">
          {events.map(event => (
            <Link
              to={`/your-events/${event._id}`}
              key={event._id}
              className="block bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 hover:border-yellow-400/70 transition-all duration-200 text-gray-200 hover:text-yellow-400"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold mb-1">{event.title}</h2>
                  <p className="text-gray-400 text-sm">{new Date(event.date).toLocaleString()}</p>
                </div>
                <span className="text-yellow-400 font-semibold">View Analysis →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourEvents; 