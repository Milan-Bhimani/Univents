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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-yellow-400 mb-10 drop-shadow-lg tracking-wide text-center">Your Created Events</h1>
        {loading && <div className="text-center text-yellow-400 py-8 animate-pulse">Loading your events...</div>}
        {error && <div className="text-center text-red-400 py-8">{error}</div>}
        {!loading && !error && events.length === 0 && (
          <div className="bg-gray-800/60 rounded-2xl p-10 border border-gray-700/30 text-gray-300 shadow-xl text-center">
            <p className="text-lg">You haven't created any events yet.</p>
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <div className="grid gap-6">
            {events.map(event => (
              <Link
                to={`/your-events/${event._id}`}
                key={event._id}
                className="block bg-gray-900/80 rounded-2xl p-8 border border-gray-700/40 shadow-xl hover:border-yellow-400/80 hover:shadow-2xl transition-all duration-300 text-gray-200 hover:text-yellow-400 group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors duration-200">{event.title}</h2>
                    <p className="text-gray-400 text-base mb-1">{new Date(event.date).toLocaleString()}</p>
                    <span className="inline-block bg-yellow-400/10 text-yellow-400 font-semibold text-xs px-3 py-1 rounded-full mt-1">{event.category}</span>
                  </div>
                  <span className="mt-4 md:mt-0 text-lg font-bold text-yellow-400 bg-gray-800/60 px-6 py-2 rounded-xl shadow hover:bg-yellow-400 hover:text-gray-900 transition-all duration-200 border border-yellow-400/30">View Analysis →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourEvents; 