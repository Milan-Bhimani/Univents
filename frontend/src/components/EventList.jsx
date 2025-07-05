import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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

  if (isLoading || error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className={`text-xl ${error ? 'text-red-500' : 'text-yellow-400'}`}>{error || 'Loading events...'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* No heading here; handled by parent page */}
      {events.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-xl mb-4">No {category} found</div>
          {!hideCreateButton && (
            <Link
              to="/create-event/edit"
              className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all"
            >
              Create an Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;